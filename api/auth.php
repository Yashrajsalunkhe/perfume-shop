<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

class AuthAPI {
    private $db;
    
    public function __construct() {
        $this->db = new DatabaseConfig();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        switch ($method) {
            case 'POST':
                if (isset($pathParts[2])) {
                    switch ($pathParts[2]) {
                        case 'login':
                            $this->login();
                            break;
                        case 'register':
                            $this->register();
                            break;
                        case 'logout':
                            $this->logout();
                            break;
                        default:
                            http_response_code(404);
                            echo json_encode(['error' => 'Endpoint not found']);
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint not found']);
                }
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
    }
    
    private function login() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['username']) || !isset($input['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Username and password required']);
                return;
            }
            
            $username = trim($input['username']);
            $password = $input['password'];
            
            // Find user
            $users = $this->db->find('users', ['username' => $username]);
            
            if (empty($users)) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                return;
            }
            
            $user = $users[0];
            
            // Verify password
            if (!password_verify($password, $user->password_hash)) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                return;
            }
            
            // Generate session token
            $token = $this->generateToken();
            
            // Update last login
            $this->db->update('users', 
                ['username' => $username],
                ['$set' => [
                    'last_login' => time(),
                    'session_token' => $token
                ]]
            );
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => (string)$user->_id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'full_name' => $user->full_name
                ],
                'token' => $token
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Login failed']);
        }
    }
    
    private function register() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$this->validateRegistrationData($input)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid registration data']);
                return;
            }
            
            // Check if username exists
            $existingUsers = $this->db->find('users', ['username' => $input['username']]);
            if (!empty($existingUsers)) {
                http_response_code(409);
                echo json_encode(['error' => 'Username already exists']);
                return;
            }
            
            // Check if email exists
            $existingEmails = $this->db->find('users', ['email' => $input['email']]);
            if (!empty($existingEmails)) {
                http_response_code(409);
                echo json_encode(['error' => 'Email already exists']);
                return;
            }
            
            $user = [
                'username' => $input['username'],
                'email' => $input['email'],
                'full_name' => $input['full_name'],
                'password_hash' => password_hash($input['password'], PASSWORD_DEFAULT),
                'created_at' => time(),
                'last_login' => null,
                'is_active' => true
            ];
            
            $result = $this->db->insert('users', $user);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Registration successful'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Registration failed']);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
        }
    }
    
    private function logout() {
        try {
            $headers = getallheaders();
            $token = $headers['Authorization'] ?? '';
            
            if (empty($token)) {
                http_response_code(400);
                echo json_encode(['error' => 'Token required']);
                return;
            }
            
            // Remove token from user
            $this->db->update('users',
                ['session_token' => $token],
                ['$unset' => ['session_token' => '']]
            );
            
            echo json_encode([
                'success' => true,
                'message' => 'Logout successful'
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Logout failed']);
        }
    }
    
    private function validateRegistrationData($data) {
        return isset($data['username']) && 
               isset($data['email']) && 
               isset($data['full_name']) && 
               isset($data['password']) &&
               strlen($data['username']) >= 3 &&
               strlen($data['password']) >= 6 &&
               filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    }
    
    private function generateToken() {
        return bin2hex(random_bytes(32));
    }
}

// Handle the request
$api = new AuthAPI();
$api->handleRequest();
?>

<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

class ProductAPI {
    private $db;
    
    public function __construct() {
        $this->db = new DatabaseConfig();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        switch ($method) {
            case 'GET':
                if (isset($pathParts[2]) && $pathParts[2] === 'products') {
                    if (isset($pathParts[3])) {
                        $this->getProduct($pathParts[3]);
                    } else {
                        $this->getProducts();
                    }
                }
                break;
                
            case 'POST':
                if (isset($pathParts[2]) && $pathParts[2] === 'products') {
                    $this->createProduct();
                }
                break;
                
            case 'PUT':
                if (isset($pathParts[2]) && $pathParts[2] === 'products' && isset($pathParts[3])) {
                    $this->updateProduct($pathParts[3]);
                }
                break;
                
            case 'DELETE':
                if (isset($pathParts[2]) && $pathParts[2] === 'products' && isset($pathParts[3])) {
                    $this->deleteProduct($pathParts[3]);
                }
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
    }
    
    private function getProducts() {
        try {
            $category = $_GET['category'] ?? '';
            $search = $_GET['search'] ?? '';
            $limit = (int)($_GET['limit'] ?? 20);
            $skip = (int)($_GET['skip'] ?? 0);
            
            $filter = [];
            
            if (!empty($category)) {
                $filter['category'] = $category;
            }
            
            if (!empty($search)) {
                $filter['$or'] = [
                    ['name' => ['$regex' => $search, '$options' => 'i']],
                    ['description' => ['$regex' => $search, '$options' => 'i']],
                    ['brand' => ['$regex' => $search, '$options' => 'i']]
                ];
            }
            
            $options = [
                'limit' => $limit,
                'skip' => $skip,
                'sort' => ['created_at' => -1]
            ];
            
            $products = $this->db->find('products', $filter, $options);
            
            echo json_encode([
                'success' => true,
                'data' => $products,
                'count' => count($products)
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch products']);
        }
    }
    
    private function getProduct($id) {
        try {
            $product = $this->db->find('products', ['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if (empty($product)) {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
                return;
            }
            
            echo json_encode([
                'success' => true,
                'data' => $product[0]
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch product']);
        }
    }
    
    private function createProduct() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$this->validateProductData($input)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid product data']);
                return;
            }
            
            $product = [
                'name' => $input['name'],
                'description' => $input['description'],
                'brand' => $input['brand'],
                'category' => $input['category'],
                'price' => (float)$input['price'],
                'original_price' => (float)($input['original_price'] ?? $input['price']),
                'image_url' => $input['image_url'],
                'stock' => (int)($input['stock'] ?? 100),
                'is_active' => true,
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $this->db->insert('products', $product);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Product created successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create product']);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create product']);
        }
    }
    
    private function updateProduct($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $update = ['$set' => []];
            
            if (isset($input['name'])) $update['$set']['name'] = $input['name'];
            if (isset($input['description'])) $update['$set']['description'] = $input['description'];
            if (isset($input['brand'])) $update['$set']['brand'] = $input['brand'];
            if (isset($input['category'])) $update['$set']['category'] = $input['category'];
            if (isset($input['price'])) $update['$set']['price'] = (float)$input['price'];
            if (isset($input['original_price'])) $update['$set']['original_price'] = (float)$input['original_price'];
            if (isset($input['image_url'])) $update['$set']['image_url'] = $input['image_url'];
            if (isset($input['stock'])) $update['$set']['stock'] = (int)$input['stock'];
            if (isset($input['is_active'])) $update['$set']['is_active'] = (bool)$input['is_active'];
            
            $update['$set']['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->db->update('products', 
                ['_id' => new MongoDB\BSON\ObjectId($id)], 
                $update
            );
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Product updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found or not updated']);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update product']);
        }
    }
    
    private function deleteProduct($id) {
        try {
            $result = $this->db->delete('products', ['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete product']);
        }
    }
    
    private function validateProductData($data) {
        return isset($data['name']) && 
               isset($data['description']) && 
               isset($data['brand']) && 
               isset($data['category']) && 
               isset($data['price']) && 
               isset($data['image_url']);
    }
}

// Handle the request
$api = new ProductAPI();
$api->handleRequest();
?>

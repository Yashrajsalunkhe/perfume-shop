<?php
// Simple router for the perfume shop
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove the base path if running in a subdirectory
$base_path = '/perfume-shop';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Handle API routes
if (strpos($path, '/api/') === 0) {
    $api_file = __DIR__ . $path . '.php';
    if (file_exists($api_file)) {
        include $api_file;
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'API endpoint not found']);
        exit;
    }
}

// Serve static files directly
if ($path === '/' || $path === '/index.html' || $path === '') {
    include __DIR__ . '/index.html';
    exit;
}

// Handle page routes
$page_routes = [
    '/login' => '/pages/login.html',
    '/shop' => '/pages/shop.html',
    '/cart' => '/pages/cart.html',
    '/men' => '/pages/men.html',
    '/women' => '/pages/women.html',
    '/premium' => '/pages/premium.html'
];

if (isset($page_routes[$path])) {
    $file_path = __DIR__ . $page_routes[$path];
    if (file_exists($file_path)) {
        include $file_path;
        exit;
    }
}

// Try to serve the file directly
$file_path = __DIR__ . $path;
if (file_exists($file_path) && is_file($file_path)) {
    // Set appropriate content type
    $extension = pathinfo($file_path, PATHINFO_EXTENSION);
    $content_types = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'html' => 'text/html',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml'
    ];
    
    if (isset($content_types[$extension])) {
        header('Content-Type: ' . $content_types[$extension]);
    }
    
    readfile($file_path);
    exit;
}

// 404 for everything else
http_response_code(404);
echo '<h1>404 - Page Not Found</h1>';
echo '<p>The requested page could not be found.</p>';
echo '<a href="/perfume-shop/">Go back to homepage</a>';
?>

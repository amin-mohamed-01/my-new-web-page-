<?php
// server.php

$ip = '192.168.1.19'; // Local IP to bind to
$port = 5500;
$dataFile = 'file.json';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle OPTIONS (CORS preflight)
if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Route: Serve index.html
if ($requestMethod === 'GET' && $requestUri === '/') {
    echo file_get_contents(__DIR__ . '/index.html');
    exit();
}

// Route: Handle signup POST
if ($requestMethod === 'POST' && $requestUri === '/signup') {
    $rawInput = file_get_contents("php://input");
    $newUser = json_decode($rawInput, true);

    if (!file_exists($dataFile)) {
        file_put_contents($dataFile, json_encode([]));
    }

    $data = file_get_contents($dataFile);
    $users = json_decode($data, true);

    if (!is_array($users)) {
        http_response_code(500);
        echo json_encode(['message' => 'Error in saved data']);
        exit();
    }

    $users[] = $newUser;

    $saved = file_put_contents($dataFile, json_encode($users, JSON_PRETTY_PRINT));

    if ($saved === false) {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to save data']);
    } else {
        echo json_encode(['message' => 'User saved successfully']);
    }
    exit();
}

// If no route matched
http_response_code(404);
echo json_encode(['message' => 'Not found']);

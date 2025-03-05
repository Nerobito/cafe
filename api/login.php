<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Check if username and password are set
if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Username and password are required']);
    exit;
}

$username = $_POST['username'];
$password = $_POST['password'];

// Prevent SQL injection
$username = $conn->real_escape_string($username);

$sql = "SELECT * FROM user WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Login failed']);
    exit;
}

$row = $result->fetch_assoc();

if (password_verify($password, $row['password'])) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'user' => [
            'userID' => $row['userID'],
            'username' => $row['username'],
            'profileImage' => $row['profileImage'],
            'role' => $row['role']
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Login failed']);
}

$conn->close();
?>
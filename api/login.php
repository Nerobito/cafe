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
    // Start the session
    session_start();

    // Set session variables
    $_SESSION['user_id'] = $row['id'];
    $_SESSION['username'] = $row['username'];
    $_SESSION['role'] = $row['role']; // Add role to session

    // Set a session cookie
    $session_name = session_name();
    $session_id = session_id();
    setcookie($session_name, $session_id, time() + 3600, '/', '', true, true);

    // Check if the user is admin
    if ($row['role'] === 'admin') {
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful - Admin access',
            'user' => [
                'id' => $row['id'],
                'username' => $row['username'],
                'role' => $row['role']
            ]
        ]);
        // Redirect to admin page (if necessary)
        // header('Location: admin_dashboard.php');
    } else {
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                'id' => $row['id'],
                'username' => $row['username'],
                'role' => $row['role']
            ]
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Login failed']);
}

$conn->close();
?>

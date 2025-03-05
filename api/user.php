<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        if (!$conn) {
            throw new Exception("Database connection failed: " . mysqli_connect_error());
        }

        $sql = "SELECT userID, username, profileImage, role FROM user";
        $result = $conn->query($sql);

        if ($result === false) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $users = array();
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $users]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}

if ($conn) {
    $conn->close();
}
?>

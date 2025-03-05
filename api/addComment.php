<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  

    $userID = $_POST['userID'];
    $cafeID = $_POST['cafeID'];
    $details = $_POST['details'];


    $sql = "INSERT INTO comments (userID, cafeID, details) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iis", $userID, $cafeID, $details);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Comment added successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add comment: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['cafeID'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing cafeID']);
        exit;
    }

    $cafeID = $_GET['cafeID'];

    $sql = "SELECT c.*, u.username FROM comments c JOIN user u ON c.userID = u.userID WHERE c.cafeID = ? ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $cafeID);
    $stmt->execute();
    $result = $stmt->get_result();

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    echo json_encode(['status' => 'success', 'comments' => $comments]);

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
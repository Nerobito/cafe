<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['cafeID'], $_GET['userID'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
        exit;
    }

    $cafeID = intval($_GET['cafeID']);
    $userID = intval($_GET['userID']);

    $sql = "SELECT * FROM favorites WHERE cafeID = ? AND userID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $cafeID, $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    $isFavorite = $result->num_rows > 0;

    echo json_encode(['status' => 'success', 'isFavorite' => $isFavorite]);

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
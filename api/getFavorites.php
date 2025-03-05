<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['userID'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing userID parameter']);
        exit;
    }
    
    $userID = intval($_GET['userID']);

    $sql = "SELECT c.cafeID, c.cafeName, c.img, c.openingHours, co.countyName, c.likes, f.favoriteID 
            FROM favorites f
            JOIN cafes c ON f.cafeID = c.cafeID
            JOIN county co ON c.countyID = co.countyID
            WHERE f.userID = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement']);
        exit;
    }

    $stmt->bind_param("i", $userID);
    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to execute statement']);
        exit;
    }

    $result = $stmt->get_result();
    $favorites = [];
    while ($row = $result->fetch_assoc()) {
        $favorites[] = $row;
    }

    echo json_encode(['status' => 'success', 'favorites' => $favorites]);

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
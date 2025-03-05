<?php
header('Content-Type: application/json');
include 'config.php';

$userID = $_GET['userID'] ?? '';

if (empty($userID)) {
    echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
    exit;
}

$stmt = $conn->prepare("SELECT c.cafeID, c.cafeName, co.countyName, c.openingHours, c.img FROM cafes c JOIN county co ON c.countyID = co.countyID WHERE c.userID = ?");
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
$cafes = [];
while ($row = $result->fetch_assoc()) {
    $cafes[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $cafes]);

$stmt->close();
$conn->close();
?>
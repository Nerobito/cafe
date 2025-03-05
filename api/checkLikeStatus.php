<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $cafeID = $_GET['cafeID'];
    $userID = $_GET['userID'];

    $sql = "SELECT * FROM likes WHERE cafeID = ? AND userID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $cafeID, $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'success', 'isLiked' => true]);
    } else {
        echo json_encode(['status' => 'success', 'isLiked' => false]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>

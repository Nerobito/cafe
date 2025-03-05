<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['cafeID'], $_POST['userID'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    $cafeID = intval($_POST['cafeID']);
    $userID = intval($_POST['userID']);

    // Validate input
    if ($cafeID <= 0 || $userID <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid cafeID or userID']);
        exit;
    }

    // Check if the favorite already exists
    $checkSql = "SELECT * FROM favorites WHERE cafeID = ? AND userID = ?";
    $checkStmt = $conn->prepare($checkSql);
    
    if ($checkStmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare check statement: ' . $conn->error]);
        exit;
    }
    
    $checkStmt->bind_param("ii", $cafeID, $userID);
    if (!$checkStmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to execute check statement: ' . $checkStmt->error]);
        $checkStmt->close();
        exit;
    }
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        // Favorite exists, so remove it
        $deleteSql = "DELETE FROM favorites WHERE cafeID = ? AND userID = ?";
        $deleteStmt = $conn->prepare($deleteSql);
        
        if ($deleteStmt === false) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare delete statement: ' . $conn->error]);
            $checkStmt->close();
            exit;
        }
        
        $deleteStmt->bind_param("ii", $cafeID, $userID);
        $success = $deleteStmt->execute();
        $isFavorite = false;
        if (!$success) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to execute delete statement: ' . $deleteStmt->error]);
            $checkStmt->close();
            $deleteStmt->close();
            exit;
        }
        $deleteStmt->close();
    } else {
        // Favorite doesn't exist, so add it
        $insertSql = "INSERT INTO favorites (cafeID, userID) VALUES (?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        
        if ($insertStmt === false) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare insert statement: ' . $conn->error]);
            $checkStmt->close();
            exit;
        }
        
        $insertStmt->bind_param("ii", $cafeID, $userID);
        $success = $insertStmt->execute();
        $isFavorite = true;
        if (!$success) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to execute insert statement: ' . $insertStmt->error]);
            $checkStmt->close();
            $insertStmt->close();
            exit;
        }
        $insertStmt->close();
    }

    echo json_encode(['status' => 'success', 'isFavorite' => $isFavorite]);
    $checkStmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
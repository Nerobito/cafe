<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'DELETE') {
    // Parse the input
    parse_str(file_get_contents("php://input"), $_DELETE);
    $userID = $_DELETE['userID'] ?? null;

    if ($userID) {
        // SQL query to delete cafe
        $sql = "DELETE FROM user WHERE userID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userID);
        
        if ($stmt->execute()) {
            echo json_encode(array("message" => "User deleted successfully."));
        } else {
            echo json_encode(array("message" => "Error: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("message" => "User ID is required for deletion."));
    }
} else {
    echo json_encode(array("message" => "Invalid request method."));
}

$conn->close();
?>
<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // รับข้อมูลจาก form-data
    $cafeID = $_POST['cafeID'];
    $userID = $_POST['userID'];

    // ตรวจสอบว่ามีการกดไลค์แล้วหรือยัง
    $checkSql = "SELECT * FROM likes WHERE cafeID = ? AND userID = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("ii", $cafeID, $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // ถ้ามีการกดไลค์แล้ว ให้ลบไลค์ออก
        $deleteSql = "DELETE FROM likes WHERE cafeID = ? AND userID = ?";
        $stmt = $conn->prepare($deleteSql);
        $stmt->bind_param("ii", $cafeID, $userID);
        
        if ($stmt->execute()) {
            // ลดจำนวน like ในตาราง cafes
            $updateCafeSql = "UPDATE cafes SET likes = likes - 1 WHERE cafeID = ?";
            $stmt = $conn->prepare($updateCafeSql);
            $stmt->bind_param("i", $cafeID);
            $stmt->execute();

            // Get total likes for this cafe
            $totalLikesSql = "SELECT likes FROM cafes WHERE cafeID = ?";
            $stmt = $conn->prepare($totalLikesSql);
            $stmt->bind_param("i", $cafeID);
            $stmt->execute();
            $totalLikesResult = $stmt->get_result();
            $totalLikes = $totalLikesResult->fetch_assoc()['likes'];

            echo json_encode(array("status" => "success", "message" => "Like removed successfully.", "likes" => $totalLikes, "isLiked" => false));
        } else {
            echo json_encode(array("status" => "error", "message" => "Error removing like: " . $conn->error));
        }
    } else {
        // ถ้ายังไม่มีการกดไลค์ ให้เพิ่มไลค์
        $insertSql = "INSERT INTO likes (cafeID, userID) VALUES (?, ?)";
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("ii", $cafeID, $userID);
        
        if ($stmt->execute()) {
            // เพิ่มจำนวน like ในตาราง cafes
            $updateCafeSql = "UPDATE cafes SET likes = likes + 1 WHERE cafeID = ?";
            $stmt = $conn->prepare($updateCafeSql);
            $stmt->bind_param("i", $cafeID);
            $stmt->execute();

            // Get total likes for this cafe
            $totalLikesSql = "SELECT likes FROM cafes WHERE cafeID = ?";
            $stmt = $conn->prepare($totalLikesSql);
            $stmt->bind_param("i", $cafeID);
            $stmt->execute();
            $totalLikesResult = $stmt->get_result();
            $totalLikes = $totalLikesResult->fetch_assoc()['likes'];

            echo json_encode(array("status" => "success", "message" => "Like added successfully.", "likes" => $totalLikes, "isLiked" => true));
        } else {
            echo json_encode(array("status" => "error", "message" => "Error adding like: " . $conn->error));
        }
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request method. Only POST is allowed."));
}

$conn->close();
?>
<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // รับข้อมูลจาก form-data
    $cafeID = $_POST['cafeID'];
    $userID = $_POST['userID'];

    // ตรวจสอบว่ามีการกดไลค์แล้วหรือยัง
    $checkSql = "SELECT * FROM likes WHERE cafeID = '$cafeID' AND userID = '$userID'";
    $result = $conn->query($checkSql);

    if ($result->num_rows > 0) {
        // ถ้ามีการกดไลค์แล้ว ให้ลบไลค์ออก
        $deleteSql = "DELETE FROM likes WHERE cafeID = '$cafeID' AND userID = '$userID'";
        
        if ($conn->query($deleteSql)) {
            // ลดจำนวน like ในตาราง cafes
            $updateCafeSql = "UPDATE cafes SET likes = likes - 1 WHERE cafeID = '$cafeID'";
            $conn->query($updateCafeSql);

            // Get total likes for this cafe
            $totalLikesSql = "SELECT likes FROM cafes WHERE cafeID = '$cafeID'";
            $totalLikesResult = $conn->query($totalLikesSql);
            $totalLikes = $totalLikesResult->fetch_assoc()['likes'];

            echo json_encode(array("status" => "success", "message" => "Like removed successfully.", "likes" => $totalLikes));
        } else {
            echo json_encode(array("status" => "error", "message" => "Error removing like: " . $conn->error));
        }
    } else {
        // ถ้ายังไม่มีการกดไลค์ ให้เพิ่มไลค์
        $insertSql = "INSERT INTO likes (cafeID, userID) VALUES ('$cafeID', '$userID')";
        
        if ($conn->query($insertSql)) {
            // เพิ่มจำนวน like ในตาราง cafes
            $updateCafeSql = "UPDATE cafes SET likes = likes + 1 WHERE cafeID = '$cafeID'";
            $conn->query($updateCafeSql);

            // Get total likes for this cafe
            $totalLikesSql = "SELECT likes FROM cafes WHERE cafeID = '$cafeID'";
            $totalLikesResult = $conn->query($totalLikesSql);
            $totalLikes = $totalLikesResult->fetch_assoc()['likes'];

            echo json_encode(array("status" => "success", "message" => "Like added successfully.", "likes" => $totalLikes));
        } else {
            echo json_encode(array("status" => "error", "message" => "Error adding like: " . $conn->error));
        }
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request method. Only POST is allowed."));
}

$conn->close();
?>
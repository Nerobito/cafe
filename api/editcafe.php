<?php
include 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// เพิ่มการ log ข้อมูล
error_log(print_r($_POST, true));
error_log(print_r($_FILES, true));

// ตรวจสอบว่าได้รับข้อมูลครบถ้วน
if (!isset($_POST['cafeID'], $_POST['cafeName'], $_POST['detailsCafe'], $_POST['openingHours'], $_POST['countyID'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cafeID = $_POST['cafeID'];
    $cafeName = $_POST['cafeName'];
    $detailsCafe = $_POST['detailsCafe'];
    $openingHours = $_POST['openingHours'];
    $countyID = $_POST['countyID'];

    // ตรวจสอบว่ามีการอัปโหลดรูปภาพใหม่หรือไม่
    if (isset($_FILES['img']) && $_FILES['img']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../public/img/';
        $fileExtension = pathinfo($_FILES['img']['name'], PATHINFO_EXTENSION);
        $newFileName = uniqid();
        $counter = 0;
        
        do {
            $fullFileName = $newFileName . ($counter > 0 ? "_$counter" : "") . '.' . $fileExtension;
            $uploadFile = $uploadDir . $fullFileName;
            $counter++;
        } while (file_exists($uploadFile));

        if (move_uploaded_file($_FILES['img']['tmp_name'], $uploadFile)) {
            $imgPath = 'img/' . $fullFileName;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
            exit;
        }
    } elseif (isset($_POST['existingImage'])) {
        // ใช้รูปภาพเดิมถ้าไม่มีการอัปโหลดรูปใหม่
        $imgPath = $_POST['existingImage'];
    } else {
        $imgPath = ''; // ไม่มีรูปภาพ
    }

    $sql = "UPDATE cafes SET cafeName = ?, detailsCafe = ?, openingHours = ?, countyID = ?, img = ? WHERE cafeID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $cafeName, $detailsCafe, $openingHours, $countyID, $imgPath, $cafeID);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Cafe updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update cafe: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
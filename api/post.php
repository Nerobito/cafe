<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ
error_log('Received request method: ' . $method);
error_log('Received GET data: ' . print_r($_GET, true));
error_log('Received POST data: ' . print_r($_POST, true));
error_log('Received FILES data: ' . print_r($_FILES, true));

// เพิ่มบรรทัดนี้ที่ด้านบนของไฟล์
error_log("API called: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

switch ($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] == 'getCounties') {
            // ดึงข้อมูลเขต
            $sql = "SELECT * FROM county";
            $result = $conn->query($sql);
            
            $counties = array();
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $counties[] = $row;
                }
            }
            echo json_encode(["status" => "success", "data" => $counties]);
        } elseif (isset($_GET['action']) && $_GET['action'] == 'getCafes') {
            $sql = "SELECT c.cafeID, c.cafeName, c.detailsCafe, c.openingHours, c.img, c.likes, 
                           co.countyID, co.countyName, 
                           u.userID, u.username as postedBy 
                    FROM cafes c
                    JOIN county co ON c.countyID = co.countyID
                    JOIN user u ON c.userID = u.userID";
            $result = $conn->query($sql);
                
            $cafes = array();
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $row['img'] = $row['img'] ? $row['img'] : 'default.jpg';
                    $cafes[] = $row;
                }
            }
            error_log("Cafes data: " . json_encode($cafes));
            echo json_encode(["status" => "success", "data" => $cafes]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid action."]);
        }
        break;

    case 'POST':
        if (isset($_POST['action']) && $_POST['action'] == 'addCafe') {
            // เพิ่มข้อมูลร้านกาแฟ
            $cafeName = $_POST['cafeName'];
            $detailsCafe = $_POST['detailsCafe'];
            $openingHours = $_POST['openingHours'];
            $countyID = $_POST['countyID'];
            $userID = $_POST['userID']; // รับ userID จาก frontend

            // Log received data
            error_log("Received data for addCafe: " . json_encode($_POST));

            // กำหนดค่าเริ่มต้นสำหรับ likes
            $likes = 0;
            
            // จัดการกับการอัปโหลดรูปภาพ
            $imgPath = '';
            if (isset($_FILES['img'])) {
                $targetDir = "../public/img/";
                $originalFileName = basename($_FILES["img"]["name"]);
                $fileType = pathinfo($originalFileName, PATHINFO_EXTENSION);
                $uniqueFileName = uniqid() . '.' . $fileType;
                $fileName = "img/" . $uniqueFileName;
                $targetFilePath = $targetDir . $uniqueFileName;

                if (!is_dir($targetDir)) {
                    mkdir($targetDir, 0777, true);
                }

                if (move_uploaded_file($_FILES["img"]["tmp_name"], $targetFilePath)) {
                    $imgPath = $fileName;
                } else {
                    $error = error_get_last();
                    error_log("Failed to upload image: " . $error['message']);
                    echo json_encode(['status' => 'error', 'message' => 'Failed to upload image: ' . $error['message']]);
                    exit;
                }
            }
            
            $sql = "INSERT INTO cafes (cafeName, detailsCafe, openingHours, img, likes, countyID, userID) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssiis", $cafeName, $detailsCafe, $openingHours, $imgPath, $likes, $countyID, $userID);
            
            if ($stmt->execute()) {
                $cafeID = $stmt->insert_id;
                $sql = "SELECT c.*, co.countyName, u.username as postedBy 
                        FROM cafes c
                        JOIN county co ON c.countyID = co.countyID
                        JOIN user u ON c.userID = u.userID
                        WHERE c.cafeID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $cafeID);
                $stmt->execute();
                $result = $stmt->get_result();
                $cafeData = $result->fetch_assoc();

                error_log("Cafe added successfully. Cafe data: " . json_encode($cafeData));
                echo json_encode([
                    "status" => "success", 
                    "message" => "Cafe added successfully.",
                    "cafeData" => $cafeData
                ]);
            } else {
                error_log('SQL error: ' . $stmt->error);
                echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            error_log("Invalid action for POST request");
            echo json_encode(["status" => "error", "message" => "Invalid action."]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method."]);
        break;
}

$conn->close();
?>
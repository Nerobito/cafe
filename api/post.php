<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // ดึงข้อมูล
        $sql = "SELECT * FROM cafes";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $cafes = array();
            while($row = $result->fetch_assoc()) {
                $cafes[] = $row;
            }
            echo json_encode($cafes);
        } else {
            echo json_encode(array("message" => "No cafes found."));
        }
        break;

    case 'POST':
        // เพิ่มข้อมูล
        $openingHours = $_POST['openingHours'];
        $cafeName = $_POST['cafeName'];
        $detailsCafe = $_POST['detailsCafe'];
        $img = $_POST['img'];
        $ratings = $_POST['ratings'];
        $countyID = $_POST['countyID'];
        $userID = $_POST['userID'];
        
        $sql = "INSERT INTO cafes (openingHours, cafeName, detailsCafe, img, ratings, countyID, userID) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiii", $openingHours, $cafeName, $detailsCafe, $img, $ratings, $countyID, $userID);
        
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Cafe added successfully."));
        } else {
            echo json_encode(array("message" => "Error: " . $stmt->error));
        }
        break;

    default:
        echo json_encode(array("message" => "Invalid request method."));
        break;
}

$conn->close();
?>
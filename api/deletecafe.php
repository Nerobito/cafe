<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'DELETE') {
    // Parse the input
    parse_str(file_get_contents("php://input"), $_DELETE);
    $cafeID = $_DELETE['cafeID'] ?? null;

    if ($cafeID) {
        // SQL query to delete cafe
        $sql = "DELETE FROM cafes WHERE cafeID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $cafeID);
        
        if ($stmt->execute()) {
            $response = array("status" => "success", "message" => "ลบร้านกาแฟเรียบร้อยแล้ว");
        } else {
            $response = array("status" => "error", "message" => "เกิดข้อผิดพลาด: " . $stmt->error);
        }
        $stmt->close();
    } else {
        $response = array("status" => "error", "message" => "กรุณาระบุรหัสร้านกาแฟที่ต้องการลบ");
    }
} else {
    $response = array("status" => "error", "message" => "วิธีการร้องขอไม่ถูกต้อง");
}

echo json_encode($response);

$conn->close();
?>

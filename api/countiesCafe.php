<?php
include 'config.php';

// เปลี่ยน SQL query เพื่อดึงทั้ง ID และชื่อเขต
$sql = "SELECT countyID, countyName FROM county ORDER BY countyName ASC";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $county = array();
    while($row = $result->fetch_assoc()) {
        $county[] = $row;
    }
    echo json_encode($county);
} else {
    echo json_encode(array());
}

$conn->close();
?>
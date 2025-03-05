<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=utf-8');

// ปรับการเชื่อมต่อฐานข้อมูลให้เข้ากับ MAMP
define('DB_HOST', 'localhost');  // หรือ '127.0.0.1' ถ้า 'localhost' ไม่ทำงาน
define('DB_NAME', 'my_app_db');
define('DB_USER', 'root');  // ค่าเริ่มต้นของ MAMP
define('DB_PASS', 'root');  // ค่าเริ่มต้นของ MAMP
define('DB_PORT', 8889);  // MAMP มักใช้พอร์ต 8889 สำหรับ MySQL

// ส่วนอื่นๆ ของไฟล์ config ให้คงเดิม
$servername = "localhost";
$username = "root";
$password = "root"; // เปลี่ยนรหัสผ่านเป็น "root" สำหรับ MAMP
$database = "651463012";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}


?>
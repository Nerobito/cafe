<?php

include 'config.php';

// var_dump($_POST);
if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['role'])) {
    $username = mysqli_real_escape_string($conn,$_POST['username']);
    $password = $_POST['password'];
    $role = $_POST['role'];
    // Check if username already exists
    $check_sql = "SELECT * FROM user WHERE username = '$username'";
    $check_result = $conn->query($check_sql);

    if ($check_result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username already exists']);
    } else {
        $passwordhash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO user (username, password,role) VALUES ('$username', '$passwordhash','$role')";
        $result = $conn->query($sql);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Registration failed', 'error' => $conn->error]);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data provided']);
}

$conn->close();
?>
<?php
header('Content-Type: application/json');
include 'config.php';

// Get the POST data from form-data
$userID = $_POST['userID'] ?? '';
$username = $_POST['username'] ?? '';
$profileImage = $_FILES['profileImage'] ?? null;

// Validate input
if (empty($userID)) {
    echo json_encode(['status' => 'error', 'message' => 'UserID is required']);
    exit;
}

$updateUsername = !empty($username);
$updateProfileImage = !empty($profileImage);

if ($updateUsername || $updateProfileImage) {
    $updateFields = [];
    $types = '';
    $params = [];

    if ($updateUsername) {
        $updateFields[] = "username = ?";
        $types .= 's';
        $params[] = $username;
    }

    if ($updateProfileImage) {
        $uploadDir = '../public/imgUser/';
        $fileExtension = pathinfo($profileImage['name'], PATHINFO_EXTENSION);
        $baseName = 'imgUser/' . $userID;
        $fileName = $baseName . '.' . $fileExtension;
        $uploadFile = $uploadDir . basename($fileName);

        // Handle duplicate image names
        $counter = 1;
        while (file_exists($uploadFile)) {
            $fileName = $baseName . '_' . $counter . '.' . $fileExtension;
            $uploadFile = $uploadDir . basename($fileName);
            $counter++;
        }

        if (move_uploaded_file($profileImage['tmp_name'], $uploadFile)) {
            $updateFields[] = "profileImage = ?";
            $types .= 's';
            $params[] = $fileName;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
            exit;
        }
    }

    $types .= 'i';
    $params[] = $userID;

    $sql = "UPDATE user SET " . implode(', ', $updateFields) . " WHERE userID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update profile in database']);
    }

    $stmt->close();
} else {
    
    echo json_encode(['status' => 'error', 'message' => 'No updates provided','userID' => $userID, 'username' => $username, 'profileImage' => $profileImage]);
}

$conn->close();
?>
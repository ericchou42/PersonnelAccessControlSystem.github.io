<?php
$servername = "localhost";
$username = "benson";
$password = "benson25";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);
if($conn->connect_error){
    die("連線失敗: ".$conn->connect_error);
}
$conn->set_charset("utf8mb4");

$data = json_decode(file_get_contents("php://input"), true);
$nameList = $data['NameList'];
date_default_timezone_set('Asia/Taipei');
$now = date('Y-m-d H:i:s');

foreach ($nameList as $name) {
    $stmt = $conn->prepare("UPDATE user SET Leave_time=? WHERE name=?");
    $stmt->bind_param('ss', $now, $name);
    $stmt->execute();
}

echo json_encode(['success' => true]);
?>

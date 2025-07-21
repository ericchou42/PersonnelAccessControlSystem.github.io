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

$CheckedNameList = $data['CheckedNameList'] ?? [];
$UncheckedNameList = $data['UncheckedNameList'] ?? [];
$NameList = $data['NameList'] ?? [];
$Commit = intval($data['Commit']);

date_default_timezone_set('Asia/Taipei');
$now = date('Y-m-d H:i:s');

if(!empty($NameList)){
    foreach ($NameList as $name) {
        $stmt = $conn->prepare("UPDATE user SET Leave_time=?,`Commit`=? WHERE name=?");
        $stmt->bind_param('sis', $now,$Commit,$name);
        $stmt->execute();
    }
}

if(!empty($CheckedNameList)){
    foreach ($CheckedNameList as $name) {
        $stmt = $conn->prepare("UPDATE user SET Leave_time=?,`Commit`=? WHERE name=?");
        $stmt->bind_param('sis', $now,$Commit,$name);
        $stmt->execute();
    }
}
if(!empty($UncheckedNameList)){
    foreach ($UncheckedNameList as $name) {
        $stmt = $conn->prepare("UPDATE user SET Leave_time=NULL,`Commit`=? WHERE name=?");
        $stmt->bind_param('is', $Commit,$name);
        $stmt->execute();
    }
}
echo json_encode(['success' => true]);
?>

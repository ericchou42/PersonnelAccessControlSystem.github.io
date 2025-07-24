<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();


$servername = $_ENV['DB_HOST'];
$username   = $_ENV['DB_USER'];
$password   = $_ENV['DB_PASS'];
$dbname     = $_ENV['DB_NAME'];


$conn = new mysqli($servername, $username, $password, $dbname);
if($conn->connect_error){
    die("連線失敗: ".$conn->connect_error);
}
$conn->set_charset("utf8mb4");

$data = json_decode(file_get_contents("php://input"), true);

$CheckedNameList = $data['CheckedNameList'] ?? [];
$UncheckedNameList = $data['UncheckedNameList'] ?? [];
$NameList = $data['NameList'] ?? [];
$LeaveTimeList = $data['LeaveTimeList'] ?? [];
$Commit = intval($data['Commit']);

date_default_timezone_set('Asia/Taipei');
$now = date('Y-m-d H:i:s');

if(!empty($NameList)){
    foreach ($NameList as $name) {
        $stmt = $conn->prepare("UPDATE user SET Leave_time=?,`Commit`=? WHERE name=?");
        $stmt->bind_param('sis', $now, $Commit, $name);
        $stmt->execute();
    }
}

if(!empty($CheckedNameList) && !empty($LeaveTimeList)){
    foreach ($CheckedNameList as $i => $name) {
        $leave_time = $LeaveTimeList[$i] ?? null;
        if ($leave_time) {
            $stmt = $conn->prepare("UPDATE user SET Leave_time=?, `Commit`=? WHERE name=?");
            $stmt->bind_param('sis', $leave_time, $Commit, $name);
            $stmt->execute();
        }
    }
}

if(!empty($UncheckedNameList)){
    foreach ($UncheckedNameList as $name) {
        $stmt = $conn->prepare("UPDATE user SET Leave_time=NULL, `Commit`=? WHERE name=?");
        $stmt->bind_param('is', $Commit, $name);
        $stmt->execute();
    }
}

echo json_encode(['success' => true]);
?>

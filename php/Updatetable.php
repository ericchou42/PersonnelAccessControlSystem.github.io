<?php

$servername = "localhost";
$username = "acs";
$password = "Acs@0721";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);
if($conn->connect_error){
    die("連線失敗: ".$conn->connect_error);
}
$conn->set_charset("utf8mb4");

$data = json_decode(file_get_contents("php://input"), true);

$CheckedNameList = $data['CheckedNameList'] ?? [];
$UncheckedNameList = $data['UncheckedNameList'] ?? [];
$LeaveTimeList = $data['LeaveTimeList'] ?? [];
$Commit = intval($data['Commit']);

date_default_timezone_set('Asia/Taipei');
$now = date('Y-m-d H:i:s');

$Checked_EnterTimeList = $data['Checked_EnterTimeList'] ?? [];
$Unchecked_EnterTimeList = $data['Unchecked_EnterTimeList'] ?? [];
if(!empty($CheckedNameList) && !empty($LeaveTimeList)){
    foreach ($CheckedNameList as $i => $name) {
        $leave_time = $LeaveTimeList[$i] ?? null;
        if ($leave_time) {
            $stmt = $conn->prepare("UPDATE user SET Leave_time=?, `Commit`=? WHERE Name=? AND Enter_time=?");
            $stmt->bind_param("siss", $leave_time, $Commit, $name, $Checked_EnterTimeList[$i]);
            $stmt->execute();
        }
    }
}

if(!empty($UncheckedNameList)){
    foreach ($UncheckedNameList as $i => $name) {
        $stmt = $conn->prepare("UPDATE user SET Leave_time=NULL, `Commit`=? WHERE name=? AND Enter_time=?");
        $stmt->bind_param('iss', $Commit, $name,$Unchecked_EnterTimeList[$i]);
        $stmt->execute();
    }
}

echo json_encode(['success' => true]);
?>

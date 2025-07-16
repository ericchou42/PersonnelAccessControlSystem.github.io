<?php
// 設定錯誤回報（開發階段建議開啟）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 資料庫連線設定
$servername = "localhost";
$username = "benson";   // 請填你新建的帳號
$password = "benson25"; // 改成你自己的密碼
$dbname = "mydb";

// 建立連線
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("連線失敗: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4"); // 支援中文

// 接收前端傳來的欄位
$type = isset($_POST['Type']) ? $_POST['Type'] : '';
$name = isset($_POST['Name']) ? $_POST['Name'] : '';
$unit = isset($_POST['Unit']) ? $_POST['Unit'] : '';
$employee_id = isset($_POST['Employee_id']) ? $_POST['Employee_id'] : '';
$department_id = isset($_POST['Department_id']) ? $_POST['Department_id'] : '';
$interviewee = isset($_POST['Interviewee']) ? $_POST['Interviewee'] : '';
$certificate_num = isset($_POST['Certificate_num']) ? $_POST['Certificate_num'] : '';
$reason = isset($_POST['Reason']) ? $_POST['Reason'] : '';
$enter_time = isset($_POST['Enter_time']) ? $_POST['Enter_time'] : '';
$leave_time = isset($_POST['Leave_time']) ? $_POST['Leave_time'] : '';
$remark = isset($_POST['Remark']) ? $_POST['Remark'] : '';
$npeople = isset($_POST['Npeople']) ? $_POST['Npeople'] : '';

// 判斷訪客(0)或員工(1)來決定欄位
if($type == "1") { // 員工
    $stmt = $conn->prepare("INSERT INTO user (Type, Name, Employee_id, Unit, Remark, Enter_time) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("prepare fail: " . $conn->error);    // 馬上加這行
    }
    $stmt->bind_param("isssss", $type, $name, $employee_id, $unit, $remark, $enter_time);
} else { // 訪客
    $stmt = $conn->prepare("INSERT INTO user (Type, Name, Unit, Interviewee, Certificate_num, Remark, Npeople, Reason, Enter_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("prepare fail: " . $conn->error);    // 馬上加這行
    }
    $stmt->bind_param("issssssss", $type, $name, $unit, $interviewee, $certificate_num, $remark, $npeople, $reason, $enter_time);
}

// 執行
if($stmt->execute()) {
    echo "success";
} else {
    echo "寫入失敗: " . $conn->error;
}

$stmt->close();
$conn->close();
?>

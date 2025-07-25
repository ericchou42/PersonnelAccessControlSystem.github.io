<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// $servername = "localhost";
// $username = "acs";
// $password = "Acs@0721";
// $dbname = "mydb";
$servername = "localhost";
$username = "benson";
$password = "benson25";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("連線失敗: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

// 接收欄位
$type = $_POST['Type'] ?? '';
$name = $_POST['Name'] ?? '';
$unit = $_POST['Unit'] ?? '';
$employee_id = $_POST['Employee_id'] ?? '';
$department_id = $_POST['Department_id'] ?? '';
$interviewee = $_POST['Interviewee'] ?? '';
$certificate_num = $_POST['Certificate_num'] ?? '';
$reason = $_POST['Reason'] ?? '';
$enter_time = $_POST['Enter_time'] ?? '';
$leave_time = $_POST['Leave_time'] ?? '';
$remark = $_POST['Remark'] ?? '';
$npeople = $_POST['Npeople'] ?? '';
$image = $_POST['Image'] ?? '';

$signature_dir = $_ENV['SIGNATURE_PATH'] ?? '/var/www/html/signatures';

$del = $conn->prepare("DELETE FROM user WHERE Name = ?");
$del->bind_param("s", $name);
$del->execute();
$del->close();

if ($type == "1") { // 員工
    $stmt = $conn->prepare("INSERT INTO user (Type, Name, Employee_id, Department_id, Remark, Enter_time)
                            VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("prepare fail: " . $conn->error);
    }
    $stmt->bind_param("isssss", $type, $name, $employee_id, $department_id, $remark, $enter_time);
} else { // 訪客
    $stmt = $conn->prepare("INSERT INTO user (Type, Name, Unit, Interviewee, Certificate_num, Remark, Npeople, Reason, Enter_time)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("prepare fail: " . $conn->error);
    }
    $stmt->bind_param("issssssss", $type, $name, $unit, $interviewee, $certificate_num, $remark, $npeople, $reason, $enter_time);
}

// 執行新增
if ($stmt->execute()) {
    echo "success";
} else {
    echo "寫入失敗: " . $conn->error;
    exit();
}

$user_id = $conn->insert_id;
$stmt->close();

// 如果有圖片就儲存
if ($image) {
    if (preg_match('/^data:image\/(\w+);base64,/', $image, $typeimg)) {
        $ext = strtolower($typeimg[1]);
        $data = base64_decode(substr($image, strpos($image, ',') + 1));

        if ($data === false) die("圖片解碼失敗");

        date_default_timezone_set('Asia/Taipei');
        $date_str = date('Ymd_His');
        $filename = "{$user_id}_{$date_str}.{$ext}";
        $save_path = rtrim($signature_dir, '/') . '/' . $filename;

        if (!file_put_contents($save_path, $data)) {
            die("圖片儲存失敗");
        }
    } else {
        die("圖片格式錯誤");
    }
}

$conn->close();
?>

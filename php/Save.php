<?php


// 錯誤回報（開發階段建議開啟）
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

// 建立連線
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("連線失敗: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4"); // 支援中文

// 接收欄位
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
$image = isset($_POST['Image']) ? $_POST['Image'] : '';

$signature_dir = $_ENV['SIGNATURE_PATH'] ?? '/var/www/html/signatures'; // 簽名圖片儲存路徑

// 判斷訪客(0)或員工(1)來決定欄位
if ($type == "1") { // 員工
    $stmt = $conn->prepare("INSERT INTO user (Type, Name, Employee_id, Department_id, Remark, Enter_time) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("prepare fail: " . $conn->error);
    }
    $stmt->bind_param("isssss", $type, $name, $employee_id, $department_id, $remark, $enter_time);
} else { // 訪客
    $stmt = $conn->prepare("INSERT INTO user (Type, Name, Unit, Interviewee, Certificate_num, Remark, Npeople, Reason, Enter_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        die("prepare fail: " . $conn->error);
    }
    $stmt->bind_param("issssssss", $type, $name, $unit, $interviewee, $certificate_num, $remark, $npeople, $reason, $enter_time);
}

// 執行
if ($stmt->execute()) {
    echo "success";
} else {
    echo "寫入失敗: " . $conn->error . " 參數: " . json_encode([$type, $name, $unit, $interviewee, $certificate_num, $remark, $npeople, $reason, $enter_time, $signature_path]);
    exit();
}
$user_id = $conn->insert_id;
// 如果有收到圖片才進行存檔
$signature_path = '';
if ($image) {
    if (preg_match('/^data:image\/(\w+);base64,/', $image, $typeimg)) {
        $ext = strtolower($typeimg[1]); // 例如 png/jpg
        $data = substr($image, strpos($image, ',') + 1);
        $data = base64_decode($data);

        if ($data === false) die("圖片解碼失敗");
        date_default_timezone_set('Asia/Taipei');
        $date_str = date('Ymd_His'); // 20250724_173233
        $filename = "{$user_id}_{$date_str}.{$ext}";
        $save_path = rtrim($signature_dir, '/') . '/' . $filename;

        if (!file_put_contents($save_path, $data)) {
            die("圖片儲存失敗");
        }
    }
    else {
        die("圖片格式錯誤");
    }
}
$stmt->close();
$conn->close();
?>

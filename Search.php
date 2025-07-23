<?php
header('Content-Type: application/json; charset=utf-8');

// 連線資料庫
$conn = new mysqli($servername, $username, $password, $dbname);

// 連線錯誤處理
if($conn->connect_error){
    // 直接顯示錯誤訊息，建議實際應用可寫入 log 或回傳 JSON 格式錯誤
    die("連線失敗: " . $conn->connect_error);
} else {
    $conn->set_charset("utf8mb4");
}

// 函式：依類型與日期取得資料
function GetData($Num, $Time, &$error = null) {
    global $conn;

    $Num = intval($Num);
    $Time = $conn->real_escape_string($Time);
    $sql = ""; // 先宣告，方便後續錯誤處理

    if($Num == 0){
        $sql = "SELECT * FROM user WHERE Type = 0 AND DATE(Enter_time) = '$Time'";
    }
    else if($Num == 1){
        $sql = "SELECT * FROM user WHERE Type = 1 AND DATE(Enter_time) = '$Time'";
    } else {
        // 如果傳入的 $Num 不是 0 或 1，也可自訂錯誤代碼與訊息
        $error = "錯誤：無效的資料類型參數";
        return false;
    }

    $result = $conn->query($sql);

    // 查詢錯誤處理
    if (!$result) {
        $error = "資料庫查詢失敗: " . $conn->error . " (SQL: " . $sql . ")";
        return false;
    }

    $data = [];
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }

    return $data;
}

// 取得傳入參數
$type = isset($_GET['type']) ? intval($_GET['type']) : 0;
$time = isset($_GET['time']) ? $_GET['time'] : date('Y-m-d');

// 呼叫函式並處理錯誤
$error = null;
$data = GetData($type, $time, $error);

// 如果有錯誤，回傳錯誤資訊
if ($error) {
    echo json_encode([
        'status' => 'error',
        'message' => $error
    ]);
} else {
    echo json_encode($data);
}

// 關閉連線
$conn->close();
?>

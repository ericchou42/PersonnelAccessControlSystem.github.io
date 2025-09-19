<?php
header('Content-Type: application/json');

// 連資料庫
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "acs";
$password = "Acs@0721";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success'=>false, 'msg'=>'資料庫連線失敗']);
    exit;
}
$conn->set_charset("utf8mb4");

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;

if (!$id) {
    echo json_encode(['success'=>false, 'msg'=>'缺少id']);
    exit;
}

// 用 ID 去找檔案
$signature_dir = '../signatures/';
$files = glob($signature_dir . intval($id) . '_*.*');

if (!$files || count($files) == 0) {
    echo json_encode(['success'=>false, 'msg'=>'找不到簽名檔案 for ID: '. $id]);
    exit;
}

// 通常只會有一個（或取最新的）
usort($files, function($a, $b){ return filemtime($b) - filemtime($a); });
$file = $files[0];
$file_url = substr($file, 3); // 視你的網站結構，可能要改成正確相對路徑

echo json_encode(['success'=>true, 'file'=>$file_url]);
?>
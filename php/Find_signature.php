<?php
header('Content-Type: application/json');

// 連資料庫
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
if ($conn->connect_error) {
    echo json_encode(['success'=>false, 'msg'=>'資料庫連線失敗']);
    exit;
}
$conn->set_charset("utf8mb4");

$input = json_decode(file_get_contents("php://input"), true);
$name = $input['name'] ?? null;

if (!$name) {
    echo json_encode(['success'=>false, 'msg'=>'缺少name']);
    exit;
}

// 1. 用 Name 查 ID（只取第一個）
$sql = "SELECT Id FROM user WHERE Name = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $name);
$stmt->execute();
$stmt->bind_result($id);
if(!$stmt->fetch()){
    echo json_encode(['success'=>false, 'msg'=>'找不到該用戶']);
    exit;
}
$stmt->close();

// 2. 用 ID 去找檔案
$signature_dir = '../signatures/';
$files = glob($signature_dir . $id . '_*.*');

if (!$files || count($files) == 0) {
    echo json_encode(['success'=>false, 'msg'=>'找不到簽名檔案'+ $name]);
    exit;
}

// 通常只會有一個（或取最新的）
usort($files, function($a, $b){ return filemtime($b) - filemtime($a); });
$file = $files[0];
$file_url = substr($file, 3); // 視你的網站結構，可能要改成正確相對路徑

echo json_encode(['success'=>true, 'file'=>$file_url]);

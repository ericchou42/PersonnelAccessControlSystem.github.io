<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['Id'] ?? null; // 直接用 Id

if (!$id) {
    echo json_encode(['success'=>false, 'msg'=>'缺少 Id']);
    exit;
}

// 直接找簽名檔
$signature_dir = '../signatures/';
$files = glob($signature_dir . $id . '_*.*');

if (!$files || count($files) == 0) {
    echo json_encode(['success'=>false, 'msg'=>'找不到簽名檔案']);
    exit;
}

// 多檔案時，取最新
usort($files, function($a, $b){ return filemtime($b) - filemtime($a); });
$file = $files[0];
// 這裡根據你的網站結構修改相對路徑
$file_url = substr($file, 3);

echo json_encode(['success'=>true, 'file'=>$file_url]);

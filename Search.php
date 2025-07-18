<?php
$servername = "localhost";
$username = "name";
$password = "benson25";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error){
    die("連線失敗: ".$conn->connect_error);
}

function GetData($Num,$Time) {
    global $conn;
    $Num = intval($Num);
    $Time = $conn->real_escape_string($Time);
    if($Num == 0){
        $sql = "SELECT * FROM user WHERE Type = 0 AND DATE(Enter_time) = '$Time'";
    }
    else if($Num == 1){
        $sql = "SELECT * FROM user WHERE Type = 1 AND DATE(Enter_time) = '$Time'";
    }
    $result = $conn->query($sql);
    $data = [];
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }
    return $data;
}

$type = isset($_GET['type']) ? intval($_GET['type']) : 0;
$time = isset($_GET['time']) ? $_GET['time'] : date('Y-m-d');
$data = GetData($type,$time);
echo json_encode($data);

$conn->close();
?>

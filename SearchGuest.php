<?php
// 連接資料庫
$conn = new mysqli("localhost","benson","benson25","mydb");
$conn->set_charset("utf8mb4");
$sql = "SELECT * FROM user";
$result = $conn->query($sql);

echo"<table border = '1'>";
echo "<tr><th>Id<t/h>"
?>

-- 1. 建立名為 'mydb' 的資料庫 (如果它還不存在的話)
--    我們指定 utf8mb4 字元集以支援包含中文和表情符號在內的廣泛字元。
CREATE DATABASE IF NOT EXISTS `mydb` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. 建立一個名為 'acs' 的使用者，允許他從本機(localhost)連線，並設定密碼為 'Acs@0721'
--    如果您確定使用者已存在，可以跳過此行，或執行下面的權限指令即可。
CREATE USER IF NOT EXISTS 'acs'@'localhost' IDENTIFIED BY 'Acs@0721';

-- 3. 賦予 'acs' 使用者對 'mydb' 資料庫中所有資料表的完整權限
GRANT ALL PRIVILEGES ON `mydb`.* TO 'acs'@'localhost';

-- 4. 重新整理權限，讓設定立即生效
FLUSH PRIVILEGES;

-- 5. 切換到 'mydb' 資料庫，後續操作將在此資料庫中進行
USE `mydb`;

-- 6. 在 'mydb' 資料庫中建立名為 'user' 的資料表
CREATE TABLE `user` (
    `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '流水號',
    `Type` tinyint(4) NOT NULL COMMENT '0: 訪客，1: 員工' CHECK (`Type` in (0,1)),
    `Factory` tinyint(4) DEFAULT NULL COMMENT '0:紅樹林、1:上達、2:立德、3:菲律賓',
    `From_factory` tinyint(4) DEFAULT NULL COMMENT '0:紅樹林、1:上達、2:立德、3:菲律賓',
    `Name` varchar(30) NOT NULL COMMENT '名稱',
    `Unit` varchar(30) DEFAULT NULL COMMENT '單位',
    `Employee_id` varchar(6) DEFAULT NULL COMMENT '工號',
    `Department_id` varchar(20) DEFAULT NULL COMMENT '部門代號',
    `Interviewee` varchar(30) DEFAULT NULL COMMENT '受訪者',
    `Certificate_num` int(11) DEFAULT NULL COMMENT '證號',
    `Reason` varchar(50) DEFAULT NULL COMMENT '事由',
    `Enter_time` datetime DEFAULT NULL COMMENT '入場時間',
    `Leave_time` datetime DEFAULT NULL COMMENT '離場時間',
    `Remark` varchar(100) DEFAULT NULL COMMENT '備註',
    `Npeople` int(11) DEFAULT NULL COMMENT '人數',
    `Commit` tinyint(4) DEFAULT NULL COMMENT '填寫對象：1:本人 2:警衛',
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


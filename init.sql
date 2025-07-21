CREATE TABLE `user` (
    `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '流水號',
    `Type` tinyint(4) NOT NULL COMMENT '0: 訪客，1: 員工' CHECK (`Type` in (0,1)),
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
    `Commit` tinyint(4) NOT NULL COMMENT '填寫對象：1:本人 2:警衛',
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

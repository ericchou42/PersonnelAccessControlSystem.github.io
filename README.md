# 系統名稱  
## 人員出入管控系統 (Personnel Access Control System)

## 專案簡介  
本系統為電子登記系統，支援進出場人員登記，目的是方便管控人員、加快登記速度並延長資料保存期限。

## 使用流程  

### 入場  
- 選擇訪客或員工身份  
- 填寫必要資料（訪客需閱讀須知並簽名）  

### 離場  
- 找到自己的名字，勾選離場並送出  

### 警衛  
*詳細流程尚未設計完成*

## 功能列表  
- 訪客與員工電子入場與離場登記  
- 須知中英文雙語介面支援  
- 電子簽名板功能  
- 補登離場時間功能並記錄異常  
- 查詢當天登記記錄  
- 支援手寫與打字輸入資料  

## 系統架構  
/
├── signatures/ (裝圖片的資料夾)
├── Employee.html
├── Guest.html
├── index.html
├── Leave.html
├── main.js
├── pdf-lib.js
├── READ.MD
├── Save.php
├── SearchEmployee.php
├── SearchGuest.php
└── signature_pad.js
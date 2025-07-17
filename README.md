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
<pre>
/
├── signatures/ (簽名圖片)
├── Employee.html (員工頁面)
├── Guest.html (訪客頁面)
├── index.html (首頁)
├── Leave.html (離場)
├── main.js (處理html回傳資料、按鈕跳轉)
├── pdf-lib.js (圖片印在PDF套件) 
├── READ.MD 
├── Save.php (後端儲存處理)
├── SearchEmployee.php (離場用:查詢員工)
├── SearchGuest.php (離場用:查詢訪客)
└── signature_pad.js (簽名套件)
</pre>
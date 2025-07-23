# 系統名稱  
## 人員出入管控系統 (Personnel Access Control System)

## 專案簡介  
本系統為電子登記系統，支援進出場人員登記，目的是方便管控人員、加快登記速度並延長資料保存期限。

## 使用流程  
### 專案啟動流程
1. 複製 `.env.example` 為 `.env`，填入自己的參數
2. 在專案根目錄執行 `composer install`
3. 執行 PHP 程式
### 人員使用流程
#### 入場  
- 選擇訪客或員工身份  
- 填寫必要資料（訪客需閱讀須知並簽名）  

#### 離場  
- 找到自己的名字，勾選離場並送出  

#### 警衛  
-選擇誰要離開或取消離場紀錄

## 功能列表  
- 選擇入場身分或離場（index.html）
- 訪客與員工電子入場與離場登記（Guest.html、Employee.html、Leave.html、Save.php、Updatetable.php）
- 須知中英文雙語介面支援（Guest.html）
- 電子簽名板功能（signature_pad.js、main.js、Guest.html）
- 補登離場時間功能並記錄異常（LeaveDataUpdate.html、Updatetable.php、loadtable_withdate.js）
- 查詢當天登記記錄（Leave.html、Search.php、loadtable_basic.js）

## 環境變數檔案
- **DB_HOST**：資料庫主機位置（例如：localhost）
- **DB_USER**：資料庫的使用者名稱（例如：benson）
- **DB_PASS**：資料庫的密碼（例如：benson25）
- **DB_NAME**：資料庫名稱（例如：mydb）
- **SIGNATURE_PATH**：簽名檔案存放路徑（例如：/var/www/html/signatures）
## 系統架構  
<pre>
/
├── signatures/ (簽名圖片保存資料夾)
├── Employee.html (員工頁面)
├── Guest.html (訪客頁面)
├── index.html (首頁)
├── Leave.html (離場)
├── LeaveDataUpdate.html (警衛:修改離場狀態)
├── READ.MD 
├── Save.php (後端儲存處理)
├── Search.php (離場用:查詢指定日期當天進出場人員記錄)
├── Updatetable.php (離場用:改變資料庫離場時間資料)
├── main.js (處理html回傳資料、按鈕跳轉)
├── loadtable_basic.js (處理html回傳資料、按鈕跳轉)
├── loadtable_withdate.js (根據選擇日期顯示當天離場紀錄)
├── pdf-lib.js (圖片印在PDF套件)
└── signature_pad.js (簽名套件)

## 隱藏資料夾 .gitignore

## 環境變數檔案.env

## PHP套件
$sudo yum install php-json
</pre>
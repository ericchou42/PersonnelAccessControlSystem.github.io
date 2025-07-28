function getTimeStr() {
    let now = new Date();
    return now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0');
}

// 載入名單並動態產生表格內容
function load_list(num, time) {
    let url = (num == 0) ? 'php/Search.php?type=0&' + time : 'php/Search.php?type=1&' + time;
    let table = (num == 0) ? document.getElementById("Guest_Table") : document.getElementById("Employee_Table");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 清除舊資料（只留表頭）
            while (table.rows.length > 1) table.deleteRow(1);
            data.forEach(row => {
                let tr = document.createElement('tr');
                let maskName = "";
                tr.style.fontSize = "20px";
                tr.style.textAlign = "center";
                // 名字遮罩處理
                if (row.Name.length == 2) {
                    maskName = row.Name[0] + "O";
                }
                else if (row.Name.length > 2) {
                    maskName = row.Name[0] + "O".repeat(row.Name.length - 2) + row.Name[row.Name.length - 1];
                }
                else{
                    maskName = row.Name;
                }
                // 判斷離場狀態，決定 time input 是否顯示
                let timeInputDisplay = (row.Leave_time != null) ? '' : 'none';
                let timeInputValue = "";
                if (row.Leave_time) {
                    let parts = row.Leave_time.split(' ');
                    if (parts.length === 2) {
                        timeInputValue = parts[1].slice(0,5); // "09:32"
                    }
                }
                tr.innerHTML = (num === 0)
                    ? `
                        <td class="Name" data-realname="${row.Name}">${maskName}</td>
                        <td>${row.Unit}</td>
                        <td>${row.Reason}</td>
                        <td>${row.Interviewee}</td>
                        <td>${row.Certificate_num}</td>
                        <td>${row.Remark}</td>
                        <td class = "EnterTime">${row.Enter_time}</td>
                        <td>
                        <input type="time" class="t_Time" 
                            style="display:${timeInputDisplay}" 
                            value="${timeInputValue}">
                        </td>
                        <td>
                        <input type="checkbox"
                            style="width:25px;height:25px"
                            class="LeaveBT"
                            ${row.Leave_time != null ? 'checked' : ''}>
                        </td>
                    `
                    : `
                        <td class="Name" data-realname="${row.Name}">${maskName}</td>
                        <td>${row.Department_id}</td>
                        <td>${row.Remark}</td>
                        <td class = "EnterTime">${row.Enter_time}</td>
                        <td>
                        <input type="time" class="t_Time" 
                            style="display:${timeInputDisplay}" 
                            value="${timeInputValue}">
                    </td>
                    <td>
                        <input type="checkbox"
                            style="width:25px;height:25px"
                            class="LeaveBT"
                            ${row.Leave_time != null ? 'checked' : ''}>
                    </td>
                    `;
                 if(num == 0){
                    tr.innerHTML += `
                        <td onclick="Download('${row.Name}')">下載</td>
                    `
                    }
                table.appendChild(tr);
            });
        });
}
async function Download(name){
    // 1. 取得簽名圖檔案路徑
    const sigRes = await fetch("php/Find_signature.php", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name: name})
    });
    const sigData = await sigRes.json();

    if (!sigData.success) {
        alert(sigData.msg);
        return;
    }

    // 2. 取得 PDF 範本（假設用固定範本檔案，可根據需求更換）
    const pdfBytes = await fetch('/N-4-C-HR-47B (240723) 入廠安全衛生須知.pdf').then(res => res.arrayBuffer());

    // 3. 取得簽名圖片 (imgBytes)
    const imgBytes = await fetch(sigData.file).then(res => res.arrayBuffer());

    // 4. 用 pdf-lib 組合 PDF+簽名圖
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const page = pages[0]; // 貼在第一頁（可依需求調整）

    // 載入圖片
    let img;
    if (sigData.file.toLowerCase().endsWith('.png')) {
        img = await pdfDoc.embedPng(imgBytes);
    } else {
        img = await pdfDoc.embedJpg(imgBytes);
    }
    const imgDims = img.scale(0.4); // 你可調整大小

    // 貼上去（x, y 以左下角為原點，可依需求自訂座標）
    page.drawImage(img, {
        x: 375,   // 水平位置
        y: 30,    // 垂直位置
        width: imgDims.width,
        height: imgDims.height,
    });

    // 5. 產生新 PDF blob
    const newPdfBytes = await pdfDoc.save();
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // 6. 自動下載
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '_signed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}



function jump(filname) {
    window.location.href = filname + ".html";
}

function send() {
    let CheckBox = document.getElementsByClassName("LeaveBT");
    let Name = document.getElementsByClassName("Name");
    let t_Time = document.getElementsByClassName("t_Time");
    let t_EnterTime = document.getElementsByClassName("EnterTime");
    let CheckedNameList = [];  
    let UncheckedNameList = [];   
    let LeaveTimeList = [];
    let Checked_EnterTimeList = [];
    let Unchecked_EnterTimeList = [];
    let LeaveName = "【請再次確認資料】\n\n離場:\n";
    let UnLeaveName = "\n未離場:\n";

    // 取使用者選擇的日期
    let selectedDate = document.getElementById('Time').value; // ex: "2025-07-22"
    if (!selectedDate) {
        alert("請先選擇日期！");
        return;
    }

    for (let boxind = 0; boxind < CheckBox.length; boxind++) {
        let realName = Name[boxind].getAttribute('data-realname');
        if (CheckBox[boxind].checked) {
            CheckedNameList.push(realName);
            LeaveName += Name[boxind].innerText + " : ";
            if (t_Time[boxind].value == "") {
                alert("【請填寫離場時間】");
                return;
            } else {
                LeaveName += "離場時間:" + t_Time[boxind].value + "\n";
                // 用選擇的日期來組成完整 DATETIME
                let leaveTimeVal = t_Time[boxind].value; // "09:32"
                if (leaveTimeVal.length === 5) {
                    leaveTimeVal = selectedDate + ' ' + leaveTimeVal + ':00'; // "2025-07-22 09:32:00"
                }
                LeaveTimeList.push(leaveTimeVal);
                Checked_EnterTimeList.push(t_EnterTime[boxind].innerText);
            }
        } else {
            UncheckedNameList.push(realName);
            Unchecked_EnterTimeList.push(t_EnterTime[boxind].innerText);
            UnLeaveName += Name[boxind].innerText + " ";
        }
    }
    if (!confirm(LeaveName + UnLeaveName + "\n\n目前時間:" + getTimeStr())) {
        return;
    }
    fetch("php/Updatetable.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            CheckedNameList: CheckedNameList,    
            UncheckedNameList: UncheckedNameList,
            Unchecked_EnterTimeList: Unchecked_EnterTimeList, 
            LeaveTimeList: LeaveTimeList,
            Checked_EnterTimeList: Checked_EnterTimeList,
            Commit: 2,
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('更新成功！');
            location.reload();
        }
        else alert('更新失敗');
    })
}

window.onload = function () {
    let today = new Date().toISOString().slice(0, 10);
    document.getElementById('Time').value = today;
    load_list(1, 'time=' + today);
    load_list(0, 'time=' + today);
};

document.getElementById('Time').addEventListener('change', function () {
    let newDate = this.value;
    load_list(1, 'time=' + newDate);
    load_list(0, 'time=' + newDate);
});

document.addEventListener('change', function (e) {
    if (e.target.classList.contains('LeaveBT') && e.target.type === 'checkbox') {
        let tr = e.target.closest('tr');
        let timeInput = tr.querySelector('.t_Time');
        if (e.target.checked) {
            timeInput.style.display = '';
        } else {
            timeInput.style.display = 'none';
        }
    }
});

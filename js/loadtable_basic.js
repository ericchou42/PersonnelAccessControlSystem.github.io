function getTimeStr(timeStr) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${timeStr}:00`;
}

function load_list(num) {
    let url = (num === 0) ? 'php/Search.php?type=0' : 'php/Search.php?type=1';
    let table = (num === 0) ? document.getElementById("Guest_Table") : document.getElementById("Employee_Table");

    fetch(url)
        .then(response => response.json())
        .then(data => {
            while (table.rows.length > 1) table.deleteRow(1);

            data.forEach((row, index) => {
                let tr = document.createElement('tr');
                tr.style.fontSize = "20px";
                tr.style.textAlign = "center";

                const now = new Date();
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                let maskName = row.Name.length === 2
                    ? row.Name[0] + "O"
                    : row.Name.length > 2
                    ? row.Name[0] + "O".repeat(row.Name.length - 2) + row.Name[row.Name.length - 1]
                    : row.Name;

                const checkboxId = `leaveCheck_${num}_${index}`;
                const timeInputId = `leaveTime_${num}_${index}`;

                tr.innerHTML = (num === 0)
                    ? `
                        <td class="Name" data-realname="${row.Name}">${maskName}</td>
                        <td>${row.Unit}</td>
                        <td>${row.Reason}</td>
                        <td>${row.Interviewee}</td>
                        <td>${row.Certificate_num}</td>
                        <td>${row.Remark}</td>
                        <td class = "EnterTime">${row.Enter_time}</td>
                        <td><input type="time" id="${timeInputId}" class="t_Time" value="${currentTime}" style="display:none;"></td>
                        <td><input type="checkbox" id="${checkboxId}" class="LeaveBT" style="width:25px;height:25px;"></td>
                    `
                    : `
                        <td class="Name" data-realname="${row.Name}">${maskName}</td>
                        <td>${row.Department_id}</td>
                        <td>${row.Remark}</td>
                        <td class = "EnterTime">${row.Enter_time}</td>
                        <td><input type="time" id="${timeInputId}" class="t_Time" value="${currentTime}" style="display:none;"></td>
                        <td><input type="checkbox" id="${checkboxId}" class="LeaveBT" style="width:25px;height:25px;"></td>
                    `;

                table.appendChild(tr);

                const checkbox = document.getElementById(checkboxId);
                const timeInput = document.getElementById(timeInputId);
                checkbox.addEventListener('change', () => {
                    timeInput.style.display = checkbox.checked ? 'inline-block' : 'none';
                });
            });
        });
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
    let LeaveName = "【請再次確認資料】\n\n離場:\n";
    let UnLeaveName = "\n未離場:\n";

    for (let i = 0; i < CheckBox.length; i++) {
        let realName = Name[i].getAttribute('data-realname');
        if (CheckBox[i].checked) {
            CheckedNameList.push(realName);
            let timeStr = t_Time[i].value;
            if (timeStr === "") {
                alert("【請填寫離場時間】");
                return;
            }
            let fullTime = getTimeStr(timeStr);
            LeaveTimeList.push(fullTime);
            Checked_EnterTimeList.push(t_EnterTime[i].innerText);
            LeaveName += `${Name[i].innerText}：離場時間 ${timeStr}\n`;

        } else {
            UncheckedNameList.push(realName);
            UnLeaveName += Name[i].innerText + " ";
        }
    }

    if (!confirm(LeaveName + UnLeaveName + "\n\n目前時間：" + new Date().toTimeString().slice(0, 9))) {
        return;
    }

    fetch("php/Updatetable.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            CheckedNameList: CheckedNameList,
            LeaveTimeList: LeaveTimeList,
            Checked_EnterTimeList:Checked_EnterTimeList,
            Commit: 1
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('更新成功！');
            location.reload();
        } else {
            alert('更新失敗');
        }
    });
}

window.onload = function () {
    load_list(1); // 內部
    load_list(0); // 外部
};

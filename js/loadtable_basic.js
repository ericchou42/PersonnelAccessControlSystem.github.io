function getTimeStr(timeStr) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${timeStr}:00`;
}

function load_list(num) {
    Factory = document.getElementById("factory").value;
    let url = 'php/Search.php?type=' + num.toString();
    url += "&factory=" + Factory.toString();
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
                let EnterTime = row.Enter_time.split(" ")[1];
                let maskName = row.Name.length === 2
                    ? row.Name[0] + "O"
                    : row.Name.length > 2
                    ? row.Name[0] + "O".repeat(row.Name.length - 2) + row.Name[row.Name.length - 1]
                    : row.Name;

                tr.innerHTML = (num === 0)
                    ? `
                        <td class="Name" data-realname="${row.Name}">${maskName}</td>
                        <td>${row.Unit}</td>
                        <td>${row.Reason}</td>
                        <td>${row.Interviewee}</td>
                        <td>${row.Certificate_num}</td>
                        <td>${row.Remark}</td>
                        <td>${row.EnterTime}</td>
                    `
                    : `
                        <td class="Name" data-realname="${row.Name}">${maskName}</td>
                        <td>${row.Department_id}</td>
                        <td>${row.Remark}</td>
                        <td>${row.EnterTime}</td>
                    `;
                if(row.Leave_time == null){
                    tr.innerHTML += `
                    <td><input type = "time" class = "t_Time" value = "${currentTime}" style = "display:none;"></td>
                    <td><input type = "checkbox" class = "LeaveBT" style = "width:25px;height:25px;"></td>
                    `;
                }
                else{
                    let leaveTimeValue = row.Leave_time ? row.Leave_time.split(' ')[1].substring(0,5) : '';
                    tr.innerHTML +=`
                    <td><input type = "time" class = "t_Time" value = "${leaveTimeValue}" readonly></td>
                    <td><input type = "checkbox" class = "LeaveBT" style = "width:25px;height:25px;"disabled checked></td>
                    `
                }
                table.appendChild(tr);
                const checkbox = tr.querySelector('.LeaveBT');
                const timeInput = tr.querySelector('.t_Time');
                checkbox.addEventListener('change', function() {
                    timeInput.style.display = this.checked ? 'inline-block' : 'none';
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

    let CheckedNameList = [];
    let UncheckedNameList = [];
    let LeaveTimeList = [];
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
        document.getElementById('factory').addEventListener('change', function () {
        load_list(1);
        load_list(0);
    });
};

function getTimeStr() {
    let now = new Date();
    return now.getHours().toString().padStart(2, '0') + ":" +
           now.getMinutes().toString().padStart(2, '0') + ":" +
           now.getSeconds().toString().padStart(2, '0');
}
function load_list(num, time) {
    let url = (num == 0) ? 'Search.php?type=0&' + time : 'Search.php?type=1&' + time;
    let table = (num == 0) ? document.getElementById("Guest_Table") : document.getElementById("Employee_Table");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            while (table.rows.length > 1) table.deleteRow(1);
            data.forEach(row => {
                let tr = document.createElement('tr');
                let maskName = "";
                tr.style.fontSize = "20px";
                tr.style.textAlign = "center";
                if(row.Name.length == 2) {
                    maskname = row.Name[0] + "O";
                }
                else if(row.Name.length > 2){
                    maskName = row.Name[0] + "O".repeat(row.Name.length - 2) + row.Name[row.Name.length - 1];
                }
                tr.innerHTML = `
                    <td class="Name" data-realname="${row.Name}">${maskName}</td>
                    <td>${row.Enter_time}</td>
                    <td>
                        <input type="checkbox"
                            style="width:25px;height:25px"
                            class="LeaveBT"
                            ${row.Leave_time != null ? 'checked' : ''}>
                    </td>
                `;
                table.appendChild(tr);
            });
        });
}
function jump(filname){
    window.location.href = filname + ".html";
}
function send(){
    let CheckBox = document.getElementsByClassName("LeaveBT");
    let Name = document.getElementsByClassName("Name");
    let CheckedNameList = [];     // 已勾選（已離場）
    let UncheckedNameList = [];   // 未勾選（未離場）
    let LeaveName = "【請再次確認資料】\n\n離場:\n";
    let UnLeaveName = "\n\n未離場:\n";
    for (let boxind = 0 ; boxind < CheckBox.length; boxind++){
        let realName = Name[boxind].getAttribute('data-realname');
        if(CheckBox[boxind].checked){
            CheckedNameList.push(realName);
            LeaveName += Name[boxind].innerText + " ";
        } else {
            UncheckedNameList.push(realName);
            UnLeaveName += Name[boxind].innerText + " ";
        }
    }
    if(!confirm(LeaveName + UnLeaveName + "\n\n目前時間:" + getTimeStr())){
        return;
    }
    fetch("Updatetable.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            CheckedNameList: CheckedNameList,      // 已勾選名單
            UncheckedNameList: UncheckedNameList,  // 未勾選名單
            Commit : 2,
            LeaveTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success) {
            alert('更新成功！');
            jump("index");
        }
        else alert('更新失敗');
    })
}

window.onload = function() {
    let today = new Date().toISOString().slice(0, 10);
    load_list(1, 'time=' + today);
    load_list(0, 'time=' + today);
};
document.getElementById('Time').addEventListener('change', function() {
    let newDate = this.value;
    load_list(1, 'time=' + newDate);
    load_list(0, 'time=' + newDate);
});
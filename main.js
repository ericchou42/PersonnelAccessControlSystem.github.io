function jump(filname){
    window.location.href = filname + ".html";
}
function getNowDatetime() {
    let now = new Date();
    let yyyy = now.getFullYear();
    let mm = String(now.getMonth() + 1).padStart(2, '0');
    let dd = String(now.getDate()).padStart(2, '0');
    let hh = String(now.getHours()).padStart(2, '0');
    let min = String(now.getMinutes()).padStart(2, '0');
    let ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}


function send_data(type){
    //type = 0(訪客)，type = 1(員工)
    if(type == 0){
        let Agree = document.getElementById("checkbutton").checked;
        let Gname = document.getElementById("name");
        let Reason = document.getElementsByClassName("reason");
        let Unit = document.getElementById("unit");
        let Visited = document.getElementById("visited");
        let Identity = document.getElementById("identity");
        let Remark = document.getElementById("remark");
        let Npeople = document.getElementById("npeople"); //人數

        let Reason_string = ""
        let Reason_dic = ["廠商領料", "廠商退貨", "轉發、調撥", "出貨"];
        //閱讀同意
        if(!Agree){
            alert("請閱讀須知並勾選同意");
            return;
        }
        //事由
        for(let index = 0;index < Reason.length - 1;index++){
            if(Reason[index].checked){
                Reason_string = Reason_dic[index];
                break;
            }
        }
        if(Reason[Reason.length - 1].checked){
            let other = document.getElementById("other").value;
                if(other == ""){
                    alert("請填寫完整資料");
                    return;
                }
                Reason_string = "其他:" + other;
        }
        if(Reason_string == ""){
            alert("請填寫完整資料");
            return;
        }
        //其餘填寫
        if(Gname.value == "" || Unit.value == "" || Visited.value == "" || Identity.value == "" || Npeople.value == ""){
            alert("請填寫完整資料");
            return;
        }
        fetch("Save.php",{
            method: "POST",
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: "Type=0" +
                "&Name=" + encodeURIComponent(Gname.value) +
                "&Unit=" + encodeURIComponent(Unit.value) +
                "&Interviewee=" + encodeURIComponent(Visited.value) +
                "&Certificate_num=" + encodeURIComponent(Identity.value) +
                "&Remark=" + encodeURIComponent(Remark.value) +
                "&Npeople=" + encodeURIComponent(Npeople.value) +
                "&Reason=" + encodeURIComponent(Reason_string) +
                "&Enter_time=" + encodeURIComponent(getNowDatetime())
        })
        .then(response => response.text())
        .then(msg => {
            if (msg.trim() === "success") {
                alert(msg);
                jump("index");
            }
        });
    }
    else if(type == 1){
        let Ename = document.getElementById("name");
        let Eid = document.getElementById("eid");
        let Department = document.getElementById("department");
        let Remark = document.getElementById("remark");
        if(Ename.value == "" || Eid.value == "" || Department.value == ""){
            alert("請填寫完整資料");
            return;
        }
        fetch("Save.php",{
            method:"POST",
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body: 'Type=' + "1" + '&' +
                'Name=' + encodeURIComponent(Ename.value) + '&' +
                'Employee_id=' + encodeURIComponent(Eid.value) + '&' +
                'Unit=' + encodeURIComponent(Department.value) + '&' +
                'Remark=' + encodeURIComponent(Remark.value) + '&' +
                "Enter_time=" + encodeURIComponent(getNowDatetime())
        })
        .then(response => response.text())     // 取回後端回應的純文字
        .then(msg => {
            if (msg.trim() === "success") {
                alert(msg);
                jump("index");
            }
        });
    }
}
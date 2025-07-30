let signbox = null;

function fitCanvas() {
    const canvas = document.getElementById('signbox');
    if (!canvas) return;
    const parent = canvas.parentElement;
    const width = parent.offsetWidth;
    const height = 180; // 跟 HTML 一樣
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("signbox");
    if (canvas) {
        fitCanvas(canvas); // 初始化fit
        signbox = new SignaturePad(
            canvas,
            { backgroundColor: "rgba(255,255,255,0)", penColor: "black" }
        );
        window.addEventListener("resize", function () {
            fitCanvas(canvas);
        });
    }
});

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
function Clear(){
    if(signbox) signbox.clear();
}

function send_data(type){
    let Alertstr = "請 ";
    if(type == 0){
        let Agree = document.getElementById("agreeCheck").checked;
        let Gname = document.getElementById("name");
        let Reason = document.getElementsByClassName("reason");
        let Factory = document.getElementById("factory");
        let Unit = document.getElementById("unit");
        let Visited = document.getElementById("visited");
        let Identity = document.getElementById("identity");
        let Remark = document.getElementById("remark");
        let Npeople = document.getElementById("npeople");

        let Reason_string = ""
        let Reason_dic = ["廠商領料", "廠商退貨", "轉廠、調撥", "出貨"];

        if(!Agree){
            Alertstr += "閱讀須知並勾選同意 ";
        }
        for(let index = 0;index < Reason.length - 1;index++){
            if(Reason[index].checked){
                Reason_string = Reason_dic[index];
                break;
            }
        }
        if(Reason[Reason.length - 1].checked){
            let other = document.getElementById("other").value;
                if(other == ""){
                    Alertstr += "填寫完整事由 ";
                }
                Reason_string = "其他:" + other;
        }
        if(Reason_string == ""){
            Alertstr += "勾選事由 ";
        }
        if(Gname.value == "" ){
            Alertstr += "填寫名稱 ";
        }
        if(Factory.value == ""){
            Alertstr += "填寫廠區"
        }
        if(Unit.value == ""){
            Alertstr += "填寫來訪公司 ";
        }
        if(Visited.value == ""){
            Alertstr += "填寫受訪者 ";
        }
        if(Identity.value == ""){
            Alertstr += "填寫證號 ";
        }
        if(Npeople.value == ""){
            Alertstr += "填寫人數 ";
        }
        if(signbox.isEmpty()){
            Alertstr += "簽名";
        }
        if(Alertstr != "請 "){
            alert(Alertstr);
            return;
        }
        let confirmMsg = 
            "【請再次確認資料】\n\n" +
            "姓名：" + Gname.value + "\n" +
            "事由：" + Unit.value + "\n" +
            "廠區：" + Factory.options[Factory.selectedIndex].text + "\n" +
            "受訪者：" + Visited.value + "\n" +
            "證號：" + Identity.value + "\n" +
            "備註：" + Remark.value + "\n" +
            "人數：" + Npeople.options[Npeople.selectedIndex].text + "\n" +
            "事由：" + Reason_string + "\n";
        if(!confirm(confirmMsg)){
            return;
        }

        fetch("php/Save.php",{
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
                "&Enter_time=" + encodeURIComponent(getNowDatetime()) +
                "&Image=" + encodeURIComponent(signbox.toDataURL()) +
                "&Factory=" + encodeURIComponent(Factory.value)
        })
        .then(response => response.text())
        .then(msg => {
            if (msg.trim() === "success") {
                alert("送出成功！");
                location.reload();
            }
            else{
                  alert("後端未回傳 success，回應內容：" + msg);
            }
        })
        .catch(err=>{
            alert("fetch 發生錯誤:" + err);
        });
    }

    else if(type == 1){
        let Ename = document.getElementById("name");
        let Eid = document.getElementById("eid");
        let Department = document.getElementById("department");
        let Remark = document.getElementById("remark");
        let Factory = document.getElementById("factory");
        if(Ename.value == ""){
            Alertstr += "填寫姓名 ";
        }
        if(Factory.value == ""){
            Alertstr += "填寫廠區 "
        }
        if(Eid.value == ""){
            Alertstr += "填寫工號 ";
        }
        if(Department.value == ""){
            Alertstr += "填寫部門編號 ";
        }
        if(Alertstr != "請 "){
            alert(Alertstr);
            return;
        }
        let confirmMsg = 
            "【請再次確認資料】\n\n" +
            "姓名：" + Ename.value + "\n" +
            "工廠：" + Factory.options[Factory.selectedIndex].text + "\n" +
            "工號：" + Eid.value + "\n" +
            "部門：" + Department.value + "\n" +
            "備註：" + Remark.value + "\n";
        if(!confirm(confirmMsg)){
            return;
        }

        fetch("php/Save.php",{
            method:"POST",
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body: 'Type=' + "1" + '&' +
                'Name=' + encodeURIComponent(Ename.value) + '&' +
                'Employee_id=' + encodeURIComponent(Eid.value) + '&' +
                'Department_id=' + encodeURIComponent(Department.value) + '&' +
                'Remark=' + encodeURIComponent(Remark.value) + '&' +
                "&Enter_time=" + encodeURIComponent(getNowDatetime()) + "&" +
                "Factory=" + encodeURIComponent(Factory.value)
        })
        .then(response => response.text())
        .then(msg => {
            if (msg.trim() === "success") {
                alert("送出成功！");
                location.reload();
            }
            else{
                alert("後端未回傳 success，回應內容：" + msg);
            }
        });
    }
}

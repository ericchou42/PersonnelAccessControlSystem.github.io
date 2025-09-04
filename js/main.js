let signbox = null;

function fitCanvas() {
    const canvas = document.getElementById('signbox');
    if (!canvas) return;

    // Save signature
    let data;
    if (signbox && !signbox.isEmpty()) {
        data = signbox.toData();
    }

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

    // Restore signature
    if (signbox && data) {
        signbox.fromData(data);
    }

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

    // Handle npeople radio buttons and input
    const npeopleRadios = document.querySelectorAll('input[name="npeople"]');
    const npeopleOtherInput = document.getElementById('npeople-other-input');

    npeopleRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            npeopleOtherInput.value = '';
        });
    });

    npeopleOtherInput.addEventListener('input', () => {
        npeopleRadios.forEach(radio => {
            radio.checked = false;
        });
    });
});

function jump(filname){
    window.location.href = filname + ".html?factory=" + document.getElementById('factorySite').value;
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
        let Unit = document.getElementById("unit");
        let Visited = document.getElementById("visited");
        let Remark = document.getElementById("remark");

        // Get Identity
        let Identity;
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") || "";

        if (factory === 'hongshulin') {
            Identity = "0";
        } else {
            let Identity_val = document.querySelector('input[name="identity"]:checked');
            Identity = Identity_val ? Identity_val.value : "";
        }

        console.log("Factory value:", factory);
        console.log("Identity value:", Identity);

        // Get Npeople
        let Npeople = "";
        const npeople_selected = document.querySelector('input[name="npeople"]:checked');
        const npeople_other = document.getElementById('npeople-other-input').value;

        if (npeople_selected) {
            Npeople = npeople_selected.value;
        } else if (npeople_other) {
            Npeople = npeople_other;
        }


        let Reason_string = ""
        let Reason_dic = ["拜訪", "廠商領料", "廠商退貨", "轉廠、調撥", "出貨"];

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
        if(Unit.value == ""){
            Alertstr += "填寫來訪公司";
        }
        if(Visited.value == ""){
            Alertstr += "填寫受訪者 ";
        }
        if(Identity == "" && factory !== 'hongshulin'){
            Alertstr += "填寫證號 ";
        }
        if(Npeople == ""){
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
            "來訪公司：" + Unit.value + "\n" +
            "事由：" + Reason_string + "\n" +
            "受訪者：" + Visited.value + "\n" +
            "證號：" + Identity + "\n" +
            "備註：" + Remark.value + "\n" +
            "人數：" + Npeople + "\n";
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
                "&Certificate_num=" + encodeURIComponent(Identity) +
                "&Remark=" + encodeURIComponent(Remark.value) +
                "&Npeople=" + encodeURIComponent(Npeople) +
                "&Reason=" + encodeURIComponent(Reason_string) +
                "&Enter_time=" + encodeURIComponent(getNowDatetime()) +
                "&Image=" + encodeURIComponent(signbox.toDataURL()) +
                "&Factory=" + document.getElementById('factorySite').value
        })
        .then(response => response.text())
        .then(msg => {
            if (msg.trim() === "success") {
                alert("送出成功！");
                window.location.href = 'index.html?factory=' + document.getElementById('factorySite').value;
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

        // Get Factory value from radio buttons
        let Factory_val_element = document.querySelector('input[name="factory"]:checked');
        let Factory_val = Factory_val_element ? Factory_val_element.value : "";
        let Factory_text = Factory_val_element ? Factory_val_element.nextElementSibling.textContent : ""; // Get text from label

        if(Ename.value == ""){
            Alertstr += "填寫姓名 ";
        }
        if(Factory_val == ""){
            Alertstr += "填寫來訪廠區(原廠區) "
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
            "來訪廠區(原廠區)：" + Factory_text + "\n" +
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
                "Enter_time=" + encodeURIComponent(getNowDatetime()) + "&" +
                "From_factory=" + encodeURIComponent(Factory_val) + "&" +
                "Factory=" + document.getElementById('factorySite').value
        })
        .then(response => response.text())
        .then(msg => {
            if (msg.trim() === "success") {
                alert("送出成功！");
                window.location.href = 'index.html?factory=' + document.getElementById('factorySite').value;
            }
            else{
                alert("後端未回傳 success，回應內容：" + msg);
            }
        });
    }
}
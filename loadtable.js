function load_list(num, time) {
    let url = (num == 0) ? 'Search.php?type=0&' + time : 'Search.php?type=1&' + time;
    let table = (num == 0) ? document.getElementById("Guest_Table") : document.getElementById("Employee_Table");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            while (table.rows.length > 1) table.deleteRow(1);

            data.forEach(row => {
                let tr = document.createElement('tr');
                tr.style.fontSize = "20px";
                tr.style.textAlign = "center";
                tr.innerHTML = `
                    <td>${row.Name}</td>
                    <td>${row.Enter_time}</td>
                    <td><input type = "checkbox" style = "width: 25px;height:25px;"></input></td>
                `;
                table.appendChild(tr);
            });
        });
}
function jump(filname){
    window.location.href = filname + ".html";
}
window.onload = function() {
    let today = new Date().toISOString().slice(0, 10);
    load_list(1, 'time=' + today);
    load_list(0, 'time=' + today);
};
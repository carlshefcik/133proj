$(document).ready(()=>{

    loadSales();

    function loadSales(){
        $.ajax({
            url: '/get_sales',
            type: 'GET',
            datatype: 'json',
            success: (data) =>{
                console.log("success");
                //console.log(data);
                document.getElementById("getsales").innerText = data;
            }
        })
    }
});
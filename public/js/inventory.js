$(document).ready(() => {

    loadAisle();

    function loadAisle() {
        console.log("here I am");
        $.ajax({
            url: '/get_inventory',
            type: 'GET',
            datatype: 'json',
            success: (data) => {
                console.log("success");
                console.log(data);
                document.getElementById("getitems").innerText = data;
            }
        })
    }
});
$(document).ready(() => {

    var uid;
    checkUserStatus()

    function checkUserStatus() {
        $.ajax({
            url: '/check_user_status_1',
            type: 'Get',
            datatype: 'json',
            success: (data) => {
                console.log("test for data here!!!!" + data);
                if (data != "Guest") {
                    uid = data;
                } else if (data == "Guest") {
                    window.location = "/404.html";
                }
            }
        })
    }

    $('#submit').click((e) => {
        e.preventDefault();
        console.log("Clicked");
        console.log("Testing for update_user_info")
        console.log(uid);
        let info = {
            uid: uid,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
        }

        $.ajax({
            url: '/update_user_info',
            type: 'POST',
            datatype: 'json',
            data: info,
            success: (data) => {
                console.log("Update Success!!!!")
            }
        })
    })
});
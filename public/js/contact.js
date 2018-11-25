$(document).ready(() => {
    passwordReset()
})

function passwordReset(){
  $('#sendResetLinkButton').click((e)=>{
    e.preventDefault();

    let emailReset = document.getElementById('resetEmail').value;
    console.log("Clicked");
    console.log(emailReset);

    $.ajax({
      url: '/send_reset_email',
      type: 'POST',
      datatype: 'json',
      data: {emailReset: emailReset},
      success: (data) =>{
        console.log("Sending Request!!!!")
      }
    })

  })
}

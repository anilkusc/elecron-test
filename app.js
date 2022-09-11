const {ipcRenderer} = require('electron')

document.querySelector('#submit').addEventListener('click', function() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    console.log(username+":"+password)
    alert(username)
   // alert(password)

    // send username to main.js 
    ipcRenderer.send('asynchronous-message', username )
    // receive message from main.js
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log(arg)         
    })     
});
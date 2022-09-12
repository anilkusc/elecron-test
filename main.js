const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios")

if (process.env.BASE_URL == null){
  axios.defaults.baseURL = "http://localhost:8080"
}else{
  axios.defaults.baseURL = process.env.BASE_URL
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      webSecurity: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });
  
  axios.get('problem_templates/pbx/list', { withCredentials: true }).then((response)=> {
    if (response.status === 200){
      win.loadFile(path.join(__dirname, "home.html"));
    }else{
      win.loadFile(path.join(__dirname, "index.html"));  
    }
  }).catch(error => {
    console.log(error)
    win.loadFile(path.join(__dirname, "index.html"));
  });

  win.openDevTools()
}

app.on("ready", createWindow);

ipcMain.on("user:login", (event, data) => {
  axios({method: "POST",data: data,url: '/user/login'}).then(response =>{
    if (response.status === 200){
      win.loadFile(path.join(__dirname, "home.html"));
    }else{
      event.reply("login-failed", "invalid-credentials");
    }
  }).catch(error => {
    console.log(error.message)
    event.reply("login-failed", "invalid credentials");
  });
});
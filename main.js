const { app, BrowserWindow, ipcMain,ipcRenderer } = require("electron");
const path = require("path");
const axios = require("axios")
const fs = require('fs');

if (process.env.BASE_URL == null){
  axios.defaults.baseURL = "http://localhost:8080"
}else{
  axios.defaults.baseURL = process.env.BASE_URL
}

try {
  const data = fs.readFileSync('cookies.txt', 'utf8');
  axios.defaults.headers.common['Cookie'] = data;
} catch (err) {
  console.error(err);
}
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
  
  axios({method: "POST", data: data , url: '/user/login' }).then(response =>{
    if (response.status === 200){
      fs.writeFileSync('cookies.txt', response.headers["set-cookie"].toString());
      const data = fs.readFileSync('cookies.txt', 'utf8');
      axios.defaults.headers.common['Cookie'] = data;
      win.loadFile(path.join(__dirname, "home.html"));
    }else{
      event.reply("login-failed", "invalid-credentials");
    }
  }).catch(error => {
    console.log(error.message)
    event.reply("login-failed", "invalid credentials");
  });
});

ipcMain.on("user:logout", (event) => {
  axios({method: "GET",url: '/user/logout',withCredentials: true}).then(response =>{
    fs.writeFileSync('cookies.txt', "");
    win.loadFile(path.join(__dirname, "index.html"));

  }).catch(error => {
    console.log(error.message)
    win.loadFile(path.join(__dirname, "index.html"));
  });
});

ipcMain.on("problem_template:list", (event) => {
  axios({method: "GET" , url: 'problem_templates/pbx/list' , withCredentials: true}).then(response =>{
    event.reply("template-list", response.data);
  }).catch(error => {
    console.log(error.message)
  });
});

ipcMain.on("personal:info", (event) => {

  var data = fs.readFileSync('creds.txt', 'utf8');
  if (data == null){
    data = '{"pbxAddress":"","pbxUser":"","pbxPass":""}'
  }
    event.reply("personal-info", JSON.parse(data));

});

ipcMain.on("personal:set", (event,data) => {
  fs.writeFileSync('creds.txt', JSON.stringify(data));
  event.reply("personal-info", data);
});

ipcMain.on("new:step", (event) => {
  event.reply("add-new-step");
});
const { app, BrowserWindow, ipcMain, Notification } = require("electron");

const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false,
        nodeIntegration: true
      },
    })
    ipcMain.handle('ping', () => 'pong')
    win.loadFile('index.html')
    win.openDevTools()
  }

app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log( arg );
    
    // send message to index.html
    //event.sender.send('asynchronous-reply', 'hello' );
    });
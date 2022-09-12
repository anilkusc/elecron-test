const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (data) => ipcRenderer.send("user:login", data),
});

ipcRenderer.on("login-failed", (event, message) => {
    document.getElementById("error-message").innerHTML = message;
  });
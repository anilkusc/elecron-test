const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (data) => ipcRenderer.send("user:login", data),
  listProblemTemplates: async () => {
    const problem_templates = await ipcRenderer.invoke("problem_template:list");
    return problem_templates;
  },
  logout: () => ipcRenderer.send("user:logout"),
});

ipcRenderer.on("login-failed", (event, message) => {
    document.getElementById("error-message").innerHTML = message;
  });
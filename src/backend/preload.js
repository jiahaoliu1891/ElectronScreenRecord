const { ipcRenderer, contextBridge } = require("electron");

// invoke get return 
// send get nothing

const API = {
    writeFile: () => ipcRenderer.send("writeFile", filePath, buffer, callback),
    getVideoSources: () => ipcRenderer.invoke('getVideoSources'),
    // cpuUsage: () => ipcRenderer.invoke("cpu/get")
}
console.log('preload!!!!!!!')
contextBridge.exposeInMainWorld("app", API);
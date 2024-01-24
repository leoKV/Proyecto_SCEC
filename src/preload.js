// preload.js
const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  hello: () => ipcRenderer.send('hello'),
});

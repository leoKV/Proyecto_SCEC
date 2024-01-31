// preload.js
const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  remote: remote,
  createExp: (expediente) => ipcRenderer.send('createExp', expediente),

  listenExpInsertedSuccessfully: (callback) => {
    ipcRenderer.on('expInsertedSuccessfully', callback);
  },
  listenExpInsertError: (callback) => {
    ipcRenderer.on('expInsertError', callback);
  },
  // Nueva función para obtener expedientes
  sendGetExpedientes: () => ipcRenderer.send('getExpedientes'),
  receiveExpedientes: (callback) => {
    ipcRenderer.on('receiveExpedientes', (event, expedientes) => callback(expedientes));
  }
  
});

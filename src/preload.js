// preload.js
const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  remote: remote,
  //Funciones de creación de expedientes.
  createExp: (expediente) => ipcRenderer.send('createExp', expediente),

  listenExpInsertedSuccessfully: (callback) => {
    ipcRenderer.on('expInsertedSuccessfully', callback);
  },
  listenExpInsertError: (callback) => {
    ipcRenderer.on('expInsertError', callback);
  },
  //Funciones para listar expedientes expedientes.
  sendGetExpedientes: () => ipcRenderer.send('getExpedientes'),
  receiveExpedientes: (callback) => {
    ipcRenderer.on('receiveExpedientes', (event, expedientes) => callback(expedientes));
  },
  //Funciones para eliminar expedientes.
  deleteExp: (idExpediente) => ipcRenderer.send('deleteExp', idExpediente),

  listenExpDeletedSuccessfully: (callback) => {
    ipcRenderer.on('expDeletedSuccessfully', callback);
  },
  listenExpDeleteError: (callback) => {
    ipcRenderer.on('expDeleteError', callback);
  }
});

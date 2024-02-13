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
  //Funciones para listar expedientes expedientes por depurar.
  sendGetExpedientesDepurar: () => ipcRenderer.send('getExpedientesDepurar'),
  receiveExpedientesDepurar: (callback) => {
      ipcRenderer.on('receiveExpedientesDepurar', (event, expedientes) => callback(expedientes));
  },
  //Funciones para actualizar
  sendGetExpedienteById: (idExpediente) => ipcRenderer.send('getExpedienteById', idExpediente),
  receiveExpedienteById: (callback) => {
      ipcRenderer.on('receiveExpedienteById', (event, expediente) => callback(expediente));
  },
  updateExp: (expediente) => ipcRenderer.send('updateExp', expediente),
  listenExpUpdatedSuccessfully: (callback) => {
    ipcRenderer.on('expUpdatedSuccessfully', callback);
  },
  listenExpUpdateError: (callback) => {
    ipcRenderer.on('expUpdateError', callback);
  },
  //Funciones para eliminar expedientes.
  deleteExp: (idExpedienteD) => ipcRenderer.send('deleteExp', idExpedienteD),

  listenExpDeletedSuccessfully: (callback) => {
    ipcRenderer.on('expDeletedSuccessfully', callback);
  },
  listenExpDeleteError: (callback) => {
    ipcRenderer.on('expDeleteError', callback);
  }
});

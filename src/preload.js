// preload.js
const { contextBridge, ipcRenderer, remote } = require('electron');
// Bandera para verificar si el listener ya está establecido
let expedientesListenerSet = false;

// Establecer el límite máximo de oyentes para el evento receiveExpedientes
contextBridge.exposeInMainWorld('electronAPI', {
  remote: remote,
  createExp: (expediente) => ipcRenderer.send('createExp', expediente),

  listenExpInsertedSuccessfully: (callback) => {
    ipcRenderer.on('expInsertedSuccessfully', callback);
  },
  listenExpInsertError: (callback) => {
    ipcRenderer.on('expInsertError', callback);
  },
  // Funciones para listar expedientes.
  sendGetExpedientes: (page, pageSize, filtroFolio, filtroAfiliacion) => {
  // Enviar la solicitud al proceso principal con los filtros correspondientes
    if (filtroFolio !== null && filtroAfiliacion !== null) {
      ipcRenderer.send('getExpedientes', page, pageSize, filtroFolio, filtroAfiliacion);
    } else if (filtroFolio !== null) {
      ipcRenderer.send('getExpedientes', page, pageSize, filtroFolio);
    } else if (filtroAfiliacion !== null) {
      ipcRenderer.send('getExpedientes', page, pageSize, filtroAfiliacion);
    } else {
      ipcRenderer.send('getExpedientes', page, pageSize);
    }
  },
  receiveExpedientes: (callback) => {
    // Si el listener ya está establecido, eliminamos el listener anterior
    if (expedientesListenerSet) {
      ipcRenderer.removeAllListeners('receiveExpedientes');
    }
    // Agregamos el listener con una función anónima para poder eliminarlo correctamente
    ipcRenderer.on('receiveExpedientes', (event, data) => {
      expedientesListenerSet = true; // Establecer la bandera
      callback(data);
    });
  },
  //Funciones para listar expedientes.
  /*
  sendGetExpedientes: () => ipcRenderer.send('getExpedientes'),
  receiveExpedientes: (callback) => {
    ipcRenderer.on('receiveExpedientes', (event, expedientes) => callback(expedientes));
  },
  */
  //Funciones para listar expedientes.

  /*
  sendGetExpedientes: (page, pageSize) => ipcRenderer.send('getExpedientes', page, pageSize),
  receiveExpedientes: (callback) => {
    ipcRenderer.on('receiveExpedientes', (event, data) => callback(data));
  },
  */
  //Funciones para listar folios disponibles.
  sendGetFolios: () => ipcRenderer.send('getFoliosDisponibles'),
  receiveFolios: (callback) => {
      ipcRenderer.on('receiveFolios', (event, folios) => callback(folios));
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

  deleteExpD: (idExpedienteD) => ipcRenderer.send('deleteExpD', idExpedienteD),

  listenExpDeletedSuccessfully: (callback) => {
    ipcRenderer.on('expDeletedSuccessfully', callback);
  },
  listenExpDeleteError: (callback) => {
    ipcRenderer.on('expDeleteError', callback);
  },

  listenExpDeletedSuccessfullyD: (callback) => {
    ipcRenderer.on('expDeletedSuccessfullyD', callback);
  },
  listenExpDeleteErrorD: (callback) => {
    ipcRenderer.on('expDeleteErrorD', callback);
  },
  //Funciones para eliminar expedientes.
  depurarExp: () => ipcRenderer.send('depurarExp'),

  listenExpDepuradoSuccessfully: (callback) => {
    ipcRenderer.on('expDepuradoSuccessfully', callback);
  },
  listenExpDepuradoError: (callback) => {
    ipcRenderer.on('expDepuradoError', callback);
  }
});

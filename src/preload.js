// preload.js
const { contextBridge, ipcRenderer, remote } = require('electron');
// Bandera para verificar si el listener ya está establecido
let expedientesListenerSet = false;
// Establecer el límite máximo de oyentes para el evento receiveExpedientes
contextBridge.exposeInMainWorld('electronAPI', {
  remote: remote,
  /////////////-------LISTAR TODOS LOS EXPEDIENTES-------/////////////
  // Funciones para listar expedientes.
  sendGetExpedientes: (page, pageSize, filtroFolio, filtroAfiliacion, filtroTarjeta,filtroReposicionT,filtroFechaIngresoY,filtroFechaIngresoM,filtroFechaIngresoD,filtroFechaNacimientoY,filtroFechaNacimientoM,filtroFechaNacimientoD) => {
    const filtros = [filtroFolio, filtroAfiliacion, filtroTarjeta, filtroReposicionT,filtroFechaIngresoY,filtroFechaIngresoM,filtroFechaIngresoD,filtroFechaNacimientoY,filtroFechaNacimientoM,filtroFechaNacimientoD];
    ipcRenderer.send('getExpedientes', page, pageSize, ...filtros);
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
 
  /////////////-------LISTAR HISTORIAL DE FOLIOS DISPONIBLES-------/////////////
  //Funciones para listar folios disponibles.
  sendGetFolios: (page, pageSize, filtroFolioD) => {
      // Enviar la solicitud al proceso principal con los filtros correspondientes
      if (filtroFolioD !== null) {
        ipcRenderer.send('getFoliosDisponibles', page, pageSize, filtroFolioD);
      }else {
        ipcRenderer.send('getFoliosDisponibles', page, pageSize);
      }
    },

  receiveFolios: (callback) => {
    // Si el listener ya está establecido, eliminamos el listener anterior
    if (expedientesListenerSet) {
      ipcRenderer.removeAllListeners('receiveFolios');
    }
    // Agregamos el listener con una función anónima para poder eliminarlo correctamente
    ipcRenderer.on('receiveFolios', (event, folios) => {
      expedientesListenerSet = true; // Establecer la bandera
      callback(folios);
    });
  },

  /////////////-------INSERCIÓN DE EXPEDIENTES-------/////////////
  createExp: (expediente) => ipcRenderer.send('createExp', expediente),

  listenExpInsertedSuccessfully: (callback) => {
    ipcRenderer.on('expInsertedSuccessfully', callback);
  },
  listenExpInsertError: (callback) => {
    ipcRenderer.on('expInsertError', callback);
  },
 
  /////////////-------ACTUALIZACIÓN DE EXPEDIENTES-------/////////////
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

  /////////////-------ELIMINACIÓN DE EXPEDIENTES-------/////////////
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

  /////////////-------DEPURACIÓN MASIVA DE EXPEDIENTES-------/////////////
  //Funciones para listar expedientes expedientes por depurar.
  sendGetExpedientesDepurar: (page, pageSize, filtroFolioDep, filtroAfiliacionDep, filtroTarjetaDep, filtroReposicionTDep,filtroFechaIngresoYDep,filtroFechaIngresoMDep,filtroFechaIngresoDDep,filtroFechaNacimientoYDep,filtroFechaNacimientoMDep,filtroFechaNacimientoDDep) => {
    const filtrosDep = [filtroFolioDep, filtroAfiliacionDep, filtroTarjetaDep, filtroReposicionTDep,filtroFechaIngresoYDep,filtroFechaIngresoMDep,filtroFechaIngresoDDep,filtroFechaNacimientoYDep,filtroFechaNacimientoMDep,filtroFechaNacimientoDDep];
    ipcRenderer.send('getExpedientesDepurar', page, pageSize, ...filtrosDep);
  },
  receiveExpedientesDepurar: (callback) => {
    if (expedientesListenerSet) {
      ipcRenderer.removeAllListeners('receiveExpedientesDepurar');
    }
    ipcRenderer.on('receiveExpedientesDepurar', (event,data) =>{
      expedientesListenerSet = true; // Establecer la bandera
      callback(data);
    });
  },
  depurarExp: () => ipcRenderer.send('depurarExp'),

  listenExpDepuradoSuccessfully: (callback) => {
    ipcRenderer.on('expDepuradoSuccessfully', callback);
  },
  listenExpDepuradoError: (callback) => {
    ipcRenderer.on('expDepuradoError', callback);
  },

  /////////////-------FILTROS DE BUSQUEDA-------/////////////
  // Función para enviar la solicitud de búsqueda de folios al backend
  sendSearchFolios: (busquedaFolioD, page, pageSize) => {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchFolios', busquedaFolioD, page, pageSize);
  },
  //Nombres.
  sendSearchNombres:(busquedaNombre, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchNombres', busquedaNombre, page, pageSize);
  },
  sendSearchNombresDep:(busquedaNombreD, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchNombresD', busquedaNombreD, page, pageSize);
  },
  //Edad.
  sendSearchEdad:(busquedaEdad, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchEdad', busquedaEdad, page, pageSize);
  },
  sendSearchEdadDep:(busquedaEdadD, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchEdadD', busquedaEdadD, page, pageSize);
  },

  //Dirección.
  sendSearchDireccion:(busquedaDireccion, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchDireccion', busquedaDireccion, page, pageSize);
  },
  sendSearchDireccionDep:(busquedaDireccionD, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchDireccionD', busquedaDireccionD, page, pageSize);
  },

  //Número de afiliación.
  sendSearchNumA:(busquedaNumA, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchNumA', busquedaNumA, page, pageSize);
  },
  sendSearchNumADep:(busquedaNumAD, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchNumAD', busquedaNumAD, page, pageSize);
  },

  //Curp.
  sendSearchCurp:(busquedaCurp, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchCurp', busquedaCurp, page, pageSize);
  },
  sendSearchCurpDep:(busquedaCurpD, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchCurpD', busquedaCurpD, page, pageSize);
  },

  //Ciudad.
  sendSearchCiudad:(busquedaCiudad, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchCiudad', busquedaCiudad, page, pageSize);
  },
  sendSearchCiudadDep:(busquedaCiudadD, page, pageSize)=> {
    // Enviar la solicitud al proceso principal con el término de búsqueda y los parámetros de paginación
    ipcRenderer.send('searchCiudadD', busquedaCiudadD, page, pageSize);
  },
});

// main.js
const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {getConnection} = require('./js/database');

let mainWindow = null;
  
function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    });
  
    mainWindow.loadFile('src/ui/index.html');
}


//Función para listar todos los expedintes
ipcMain.on('getExpedientes', async (event) => {
    try {
        const conn = await getConnection();
        const result = await conn.query('SELECT * FROM expediente ');
        event.reply('receiveExpedientes', result[0]);
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', []);
    }
});

//Función para listar todos los números de folio disponibles para insertar nuevos expedientes
ipcMain.on('getFoliosDisponibles', async (event) => {
    try {
        const conn = await getConnection();
        const result = await conn.query('SELECT * FROM folioDisponible');
        event.reply('receiveFolios', result[0]);
    } catch (error) {
        console.log(error);
        event.reply('receiveFolios', []);
    }
});

// Agrega una nueva función para obtener un expediente por su ID
ipcMain.on('getExpedienteById', async (event, idExpediente) => {
    try {
        const conn = await getConnection();
        const result = await conn.query('SELECT * FROM expediente WHERE id = ?', [idExpediente]);
        
        // Si el resultado tiene al menos un expediente, devuélvelo
        if (result[0].length > 0) {
            event.reply('receiveExpedienteById', result[0][0]);
        } else {
            // Si no se encuentra ningún expediente con ese ID
            event.reply('receiveExpedienteById', null);
        }
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedienteById', null);
    }
});

//Función para listar todos los expedintes que se deben depurar
ipcMain.on('getExpedientesDepurar', async (event) => {
    try {
        const conn = await getConnection();
        const result = await conn.query('SELECT * FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR) ');
        event.reply('receiveExpedientesDepurar', result[0]);
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', []);
    }
});




//Función para crear nuevos expedientes clínicos
async function createExp(expediente){
    try{
        const conn = await getConnection();
        // Validación de nulos
        Object.keys(expediente).forEach((key) => {
            if (expediente[key] === '') {
                expediente[key] = null;
            }else{
                expediente[key] = expediente[key].toUpperCase();

            }
        });

        if (expediente.fechaNacimiento !== null) {
            const fechaNacimiento = new Date(expediente.fechaNacimiento);
            expediente.fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];
        }
                
        const result = await conn.query('INSERT INTO expediente SET ? ',expediente)

        console.log(result)
        // Solo enviar el evento si la inserción es exitosa
        mainWindow.webContents.send('expInsertedSuccessfully');

    }catch(error){
        console.log(error)
        mainWindow.webContents.send('expInsertError');
    }

}

  
ipcMain.on('createExp', async (event, expediente) => {
    try {
        await createExp(expediente);
    } catch (error) {
        console.log(error);
    }
});
//Funciones de actualización de expedientes
async function updateExp(expediente) {
    try {
        const conn = await getConnection();
        // Validación de nulos
        Object.keys(expediente).forEach((key) => {
            if (expediente[key] === '') {
                expediente[key] = null;
            }else if (typeof expediente[key] === 'string') { // Verificar si es una cadena de texto
                expediente[key] = expediente[key].toUpperCase();
            }
        });

        if (expediente.fechaNacimiento !== null) {
            const fechaNacimiento = new Date(expediente.fechaNacimiento);
            expediente.fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];
        }

        // Realizar la actualización en la base de datos
        const result = await conn.query('UPDATE expediente SET ? WHERE id = ?', [expediente, expediente.id]);

        console.log(result);
        // Enviar el evento si la actualización es exitosa
        mainWindow.webContents.send('expUpdatedSuccessfully');
    } catch (error) {
        console.log(error);
        mainWindow.webContents.send('expUpdateError');
    }
}

ipcMain.on('updateExp', async (event, expediente) => {
    try {
        await updateExp(expediente);
    } catch (error) {
        console.log(error);
    }
});
//Funciones del eliminación de expedientes
async function deleteExp(idExpedienteD){
    try{
        const conn = await getConnection();
        const result = await conn.query('DELETE FROM expediente WHERE id = ? ', idExpedienteD)
        console.log(result)
        mainWindow.webContents.send('expDeletedSuccessfully');
    }catch(error){
        console.log(error)
        mainWindow.webContents.send('expDeleteError');
    }
}

ipcMain.on('deleteExp', async (event, idExpedienteD) => {
    try {
        await deleteExp(idExpedienteD)
    } catch (error) {
        console.log(error);
    }
});
//Funciones del eliminación de expedientes en el modal depuración
async function deleteExpD(idExpedienteD){
    try{
        const conn = await getConnection();
        const result = await conn.query('DELETE FROM expediente WHERE id = ? ', idExpedienteD)
        console.log(result)
        mainWindow.webContents.send('expDeletedSuccessfullyD');
    }catch(error){
        console.log(error)
        mainWindow.webContents.send('expDeleteErrorD');
    }
}

ipcMain.on('deleteExpD', async (event, idExpedienteD) => {
    try {
        await deleteExpD(idExpedienteD)
    } catch (error) {
        console.log(error);
    }
});
//Funciones del depuración de expedientes
async function depurarExp(){
    try{
        const conn = await getConnection();
        const result = await conn.query('DELETE FROM expediente WHERE id IN (SELECT id FROM (SELECT * FROM expediente)AS e WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)) ')
        console.log(result)
        mainWindow.webContents.send('expDepuradoSuccessfully');
    }catch(error){
        console.log(error)
        mainWindow.webContents.send('expDepuradoError');
    }
}

ipcMain.on('depurarExp', async (event) => {
    try {
        await depurarExp()
    } catch (error) {
        console.log(error);
    }
});

  
module.exports = {
    createWindow,
    createExp
};


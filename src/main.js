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


// Modifica la función para obtener expedientes
ipcMain.on('getExpedientes', async (event) => {
    try {
        const conn = await getConnection();
        const result = await conn.query('SELECT * FROM expediente');
        event.reply('receiveExpedientes', result[0]);
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', []);
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

//Funciones del eliminación de expedientes
async function deleteExp(idExpediente){
    try{
        const conn = await getConnection();
        const result = await conn.query('DELETE FROM expediente WHERE id = ? ', idExpediente)
        console.log(result)
        mainWindow.webContents.send('expDeletedSuccessfully');
    }catch(error){
        console.log(error)
        mainWindow.webContents.send('expDeleteError');
    }
}

ipcMain.on('deleteExp', async (event, idExpediente) => {
    try {
        await deleteExp(idExpediente)
    } catch (error) {
        console.log(error);
    }
});
  
module.exports = {
    createWindow,
    createExp
};


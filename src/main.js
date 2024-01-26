// main.js
const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {getConnection} = require('./js/database')

//Función para crear nuevos expedientes clínicos
async function createExp(expediente){
    try{
        const conn = await getConnection();
        // Validación de nulos
        Object.keys(expediente).forEach((key) => {
            if (expediente[key] === '') {
                expediente[key] = null;
            }
        });
        const fechaNacimiento = new Date(expediente.fechaNacimiento);
        expediente.fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];

        const result = await conn.query('INSERT INTO expediente SET ? ',expediente)

        console.log(result)

    }catch(error){
        console.log(error)
    }

}

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
  
/*
ipcMain.on('createExp', (event, expediente) => {
    createExp(expediente);
});
*/
ipcMain.on('createExp', async (event, expediente) => {
    try {
        await createExp(expediente);
        mainWindow.webContents.send('expInsertedSuccessfully');
    } catch (error) {
        console.log(error);
    }

});
  
module.exports = {
    createWindow,
    createExp
};


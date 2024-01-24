// main.js
const { app, BrowserWindow, ipcMain, remote } = require('electron');
const path = require('path');

function hello() {
    console.log('Hola amigos');
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
  

ipcMain.on('hello', hello);
  
module.exports = {
    createWindow,
    hello
};


/*
const {BrowserWindow} = require('electron')

function hello(){
    console.log('Hola amigos')
}

let window
function createWindow(){
    window = new BrowserWindow({
        width:1920,
        height:1080,
        webPreferences:{
            nodeIntegration:true
        }
    })

    window.loadFile('src/ui/index.html');
}

module.exports ={
    createWindow,
    hello
}
*/
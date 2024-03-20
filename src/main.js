// main.js
const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {getConnection} = require('./js/database');
const { off } = require('process');

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
/////////////-------LISTAR TODOS LOS EXPEDIENTES-------/////////////
//Función para listar todos los expedientes:
// ipcMain.on('getExpedientes', async (event, page, pageSize, filtroFolio, filtroAfiliacion) => {
//     try {
//         const conn = await getConnection();
//         const offset = (page - 1) * pageSize;
//         let query = 'SELECT * FROM expediente';
//         let queryParams = []; // Arreglo para almacenar los parámetros de la consulta

//         // Verificar si se proporciona una letra de folio para filtrar
//         if (filtroFolio && filtroAfiliacion) {
//             query += ' WHERE folio LIKE ? AND afiliacion = ?';
//             filtroFolio += '%'; // Añadir '%' para que busque todas las combinaciones de la letra
//             queryParams.push(filtroFolio, filtroAfiliacion); // Agregar los parámetros de filtro a la lista
//         } else if (filtroAfiliacion) {
//             query += ' WHERE afiliacion = ?';
//             queryParams.push(filtroAfiliacion); // Agregar el parámetro de filtro a la lista
//         } else if (filtroFolio) {
//             query += ' WHERE folio LIKE ?';
//             filtroFolio += '%'; // Añadir '%' para que busque todas las combinaciones de la letra
//             queryParams.push(filtroFolio); // Agregar el parámetro de filtro a la lista
//         }

//         query += ' LIMIT ? OFFSET ?';
//         queryParams.push(pageSize, offset); // Añadir el tamaño de página y el desplazamiento a los parámetros de la consulta

//         const result = await conn.query(query, queryParams);

//         // Obtener el número total de registros sin aplicar ningún filtro
//         let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';

//         if (filtroFolio && filtroAfiliacion) {
//             totalCountQuery += ' WHERE folio LIKE ? AND afiliacion = ?';
//         } else if (filtroAfiliacion) {
//             totalCountQuery += ' WHERE afiliacion = ?';
//         } else if (filtroFolio) {
//             totalCountQuery += ' WHERE folio LIKE ?';
//         }

//         const totalCount = await conn.query(totalCountQuery, queryParams);
//         const totalRecords = totalCount[0][0].total;

//         event.reply('receiveExpedientes', { 
//             totalRecords: totalRecords,
//             filteredRecords: totalRecords, // En este caso, no aplicamos filtros, por lo que el total y el filtrado son iguales
//             data: result[0] 
//         });
//     } catch (error) {
//         console.log(error);
//         event.reply('receiveExpedientes', { 
//             totalRecords: 0,
//             filteredRecords: 0,
//             data: []
//         });
//     }
// });


// ipcMain.on('getExpedientes', async (event, page, pageSize, filtroFolio, filtroAfiliacion,filtroTarjeta,filtroReposicionT) => {
//     try {
//         const conn = await getConnection();
//         const offset = (page - 1) * pageSize;
//         let query = 'SELECT * FROM expediente';
//         let queryParams = []; // Arreglo para almacenar los parámetros de la consulta

//         // Verificar si se proporciona una letra de folio para filtrar
//         if (filtroFolio && filtroAfiliacion) {
//             query += ' WHERE folio LIKE ? AND afiliacion = ?';
//             filtroFolio += '%'; // Añadir '%' para que busque todas las combinaciones de la letra
//             queryParams.push(filtroFolio, filtroAfiliacion); // Agregar los parámetros de filtro a la lista
//         } else if (filtroAfiliacion) {
//             query += ' WHERE afiliacion = ?';
//             queryParams.push(filtroAfiliacion); // Agregar el parámetro de filtro a la lista
//         } else if (filtroFolio) {
//             query += ' WHERE folio LIKE ?';
//             filtroFolio += '%'; // Añadir '%' para que busque todas las combinaciones de la letra
//             queryParams.push(filtroFolio); // Agregar el parámetro de filtro a la lista
//         }

//         query += ' LIMIT ? OFFSET ?';
//         queryParams.push(pageSize, offset); // Añadir el tamaño de página y el desplazamiento a los parámetros de la consulta

//         const result = await conn.query(query, queryParams);

//         // Obtener el número total de registros sin aplicar ningún filtro
//         let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';

//         if (filtroFolio && filtroAfiliacion) {
//             totalCountQuery += ' WHERE folio LIKE ? AND afiliacion = ?';
//         } else if (filtroAfiliacion) {
//             totalCountQuery += ' WHERE afiliacion = ?';
//         } else if (filtroFolio) {
//             totalCountQuery += ' WHERE folio LIKE ?';
//         }

//         const totalCount = await conn.query(totalCountQuery, queryParams);
//         const totalRecords = totalCount[0][0].total;

//         event.reply('receiveExpedientes', { 
//             totalRecords: totalRecords,
//             filteredRecords: totalRecords, // En este caso, no aplicamos filtros, por lo que el total y el filtrado son iguales
//             data: result[0] 
//         });
//     } catch (error) {
//         console.log(error);
//         event.reply('receiveExpedientes', { 
//             totalRecords: 0,
//             filteredRecords: 0,
//             data: []
//         });
//     }
// });

// ipcMain.on('getExpedientes', async (event, page, pageSize,...filtros) => {
//     try {
//         const conn = await getConnection();
//         const offset = (page - 1) * pageSize;
//         let query = 'SELECT * FROM expediente';
//         let queryParams = []; // Arreglo para almacenar los parámetros de la consulta

//         // Verificar si se proporciona una letra de folio para filtrar
//         if (filtros[0] && filtros[1] && filtros[2] && filtros[3]) {
//             query += ' WHERE folio LIKE ? AND afiliacion = ? AND tarjeta = ? AND reposicionTarjeta = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[1],filtros[2],filtros[3]);

//         } else if (filtros[0] && filtros[1] && filtros[2]) {
//             query += ' WHERE folio LIKE ? AND afiliacion = ? AND tarjeta = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[1],filtros[2]);

//         } else if (filtros[0] && filtros[1] && filtros[3]) {
//             query += ' WHERE folio LIKE ? AND afiliacion = ? AND reposicionTarjeta = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[1],filtros[3]);

//         } else if (filtros[0] && filtros[1]) {
//             query += ' WHERE folio LIKE ? AND afiliacion = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[1]);

//         } else if (filtros[0] && filtros[2] && filtros[3]) {
//             query += ' WHERE folio LIKE ? AND tarjeta = ? AND reposicionTarjeta = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[2],filtros[3]);

//         } else if (filtros[0] && filtros[2] ) {
//             query += ' WHERE folio LIKE ? AND tarjeta = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[2]);

//         } else if (filtros[0] && filtros[3]) {
//             query += ' WHERE folio LIKE ? AND reposicionTarjeta = ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0],filtros[3]);

//         } else if (filtros[0]) {
//             query += ' WHERE folio LIKE ?';
//             filtros[0] += '%';
//             queryParams.push(filtros[0]);

//         } else if (filtros[1] && filtros[2] && filtros[3]) {
//             query += ' WHERE afiliacion = ? AND tarjeta = ? AND reposicionTarjeta = ?';
//             queryParams.push(filtros[1],filtros[2],filtros[3]);

//         } else if (filtros[1] && filtros[2]) {
//             query += ' WHERE afiliacion = ? AND tarjeta = ?';
//             queryParams.push(filtros[1],filtros[2]);

//         } else if (filtros[1] && filtros[3]) {
//             query += ' WHERE afiliacion = ? AND reposicionTarjeta = ?';
//             queryParams.push(filtros[1],filtros[3]);

//         } else if (filtros[1]) {
//             query += ' WHERE afiliacion = ?';
//             queryParams.push(filtros[1]);

//         } else if (filtros[2] && filtros[3]) {
//             query += ' WHERE tarjeta = ? AND reposicionTarjeta = ?';
//             queryParams.push(filtros[2],filtros[3]);

//         } else if (filtros[2]) {
//             query += ' WHERE tarjeta = ?';
//             queryParams.push(filtros[2]);

//         } else if (filtros[3]) {
//             query += ' WHERE reposicionTarjeta = ?';
//             queryParams.push(filtros[3]);
//         }

//         query += ' LIMIT ? OFFSET ?';
//         queryParams.push(pageSize, offset); // Añadir el tamaño de página y el desplazamiento a los parámetros de la consulta

//         const result = await conn.query(query, queryParams);

//         // Obtener el número total de registros sin aplicar ningún filtro
//         let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';

//         if (filtros[0] && filtros[1] && filtros[2] && filtros[3]) {
//             totalCountQuery += ' WHERE folio LIKE ? AND afiliacion = ? AND tarjeta = ? AND reposicionTarjeta = ?';
//         } else if (filtros[0] && filtros[1] && filtros[2]) {
//             totalCountQuery += ' WHERE folio LIKE ? AND afiliacion = ? AND tarjeta = ?';
//         } else if (filtros[0] && filtros[1] && filtros[3]) {
//             totalCountQuery += ' WHERE folio LIKE ? AND afiliacion = ? AND reposicionTarjeta = ?';
//         } else if (filtros[0] && filtros[1]) {
//             totalCountQuery += ' WHERE folio LIKE ? AND afiliacion = ?';
//         } else if (filtros[0] && filtros[2] && filtros[3]) {
//             totalCountQuery += ' WHERE folio LIKE ? AND tarjeta = ? AND reposicionTarjeta = ?';
//         } else if (filtros[0] && filtros[2] ) {
//             totalCountQuery += ' WHERE folio LIKE ? AND tarjeta = ?';
//         } else if (filtros[0] && filtros[3]) {
//             totalCountQuery += ' WHERE folio LIKE ? AND reposicionTarjeta = ?';
//         } else if (filtros[0]) {
//             totalCountQuery += ' WHERE folio LIKE ?';
//         } else if (filtros[1] && filtros[2] && filtros[3]) {
//             totalCountQuery += ' WHERE afiliacion = ? AND tarjeta = ? AND reposicionTarjeta = ?';
//         } else if (filtros[1] && filtros[2]) {
//             totalCountQuery += ' WHERE afiliacion = ? AND tarjeta = ?';
//         } else if (filtros[1] && filtros[3]) {
//             totalCountQuery += ' WHERE afiliacion = ? AND reposicionTarjeta = ?';
//         } else if (filtros[1]) {
//             totalCountQuery += ' WHERE afiliacion = ?';
//         } else if (filtros[2] && filtros[3]) {
//             totalCountQuery += ' WHERE tarjeta = ? AND reposicionTarjeta = ?';
//         } else if (filtros[2]) {
//             totalCountQuery += ' WHERE tarjeta = ?';
//         } else if (filtros[3]) {
//             totalCountQuery += ' WHERE reposicionTarjeta = ?';
//         }

//         const totalCount = await conn.query(totalCountQuery, queryParams);
//         const totalRecords = totalCount[0][0].total;

//         event.reply('receiveExpedientes', { 
//             totalRecords: totalRecords,
//             filteredRecords: totalRecords, // En este caso, no aplicamos filtros, por lo que el total y el filtrado son iguales
//             data: result[0] 
//         });
//     } catch (error) {
//         console.log(error);
//         event.reply('receiveExpedientes', { 
//             totalRecords: 0,
//             filteredRecords: 0,
//             data: []
//         });
//     }
// });
ipcMain.on('getExpedientes', async (event, page, pageSize, ...filtros) => {
    try {
        const conn = await getConnection();
        const offset = (page - 1) * pageSize;
        let query = 'SELECT * FROM expediente';
        let queryParams = []; // Arreglo para almacenar los parámetros de la consulta

        const whereClauses = [];
        filtros.forEach((filtro, index) => {
            if (filtro !== null) {
                switch (index) {
                    case 0:
                        whereClauses.push('folio LIKE ?');
                        queryParams.push(`${filtro}%`);
                        break;
                    case 1:
                        whereClauses.push('afiliacion = ?');
                        queryParams.push(filtro);
                        break;
                    case 2:
                        whereClauses.push('tarjeta = ?');
                        queryParams.push(filtro);
                        break;
                    case 3:
                        whereClauses.push('reposicionTarjeta = ?');
                        queryParams.push(filtro);
                        break;
                    default:
                        break;
                }
            }
        });

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset); // Añadir el tamaño de página y el desplazamiento a los parámetros de la consulta

        const result = await conn.query(query, queryParams);

        // Obtener el número total de registros sin aplicar ningún filtro
        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';

        if (whereClauses.length > 0) {
            totalCountQuery += ' WHERE ' + whereClauses.join(' AND ');
        }

        const totalCount = await conn.query(totalCountQuery, queryParams);
        const totalRecords = totalCount[0][0].total;

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: totalRecords, // En este caso, no aplicamos filtros, por lo que el total y el filtrado son iguales
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});



/////////////-------LISTAR TODOS LOS FOLIOS DISPONIBLES------/////////////
ipcMain.on('getFoliosDisponibles', async (event, page, pageSize, filtroFolioD) => {
    try {
        const conn = await getConnection();
        const offset = (page - 1) * pageSize;
        let query = 'SELECT * FROM folioDisponible';
        // Verificar si se proporciona una letra de folio para filtrar
        if (filtroFolioD) {
            query += ' WHERE folioD LIKE ?';
            filtroFolioD += '%'; // Añadir '%' para que busque todas las combinaciones de la letra
        }

        query += ' LIMIT ? OFFSET ?';

        let queryParams = []; // Arreglo para almacenar los parámetros de la consulta

        // Si se proporciona una letra de folio, agregarla a los parámetros de la consulta
        if (filtroFolioD) {
            queryParams.push(filtroFolioD);
        }


        queryParams.push(pageSize, offset); // Añadir el tamaño de página y el desplazamiento a los parámetros de la consulta

        const result = await conn.query(query, queryParams);

        // Obtener el número total de registros sin aplicar ningún filtro
        let totalCountQuery = 'SELECT COUNT(*) AS total FROM folioDisponible';
        
        // Si se proporciona una letra de folio, ajustar la consulta para contar solo los registros que coinciden con esa letra
        if (filtroFolioD) {
            totalCountQuery += ' WHERE folioD LIKE ?';
        }

        const totalCount = await conn.query(totalCountQuery, queryParams);
        const totalRecords = totalCount[0][0].total;

        event.reply('receiveFolios', { 
            totalRecords: totalRecords,
            filteredRecords: totalRecords, // En este caso, no aplicamos filtros, por lo que el total y el filtrado son iguales
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveFolios', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

/////////////-------LISTAR UN EXPEDIENTE POR ID------/////////////
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

/////////////-------LISTAR TODOS LOS EXPEDIENTES A DEPURAR------/////////////
//Función para listar todos los expedintes que se deben depurar
///////////////
// ipcMain.on('getExpedientesDepurar', async (event, page, pageSize) => {
//     try {
//         const conn = await getConnection();
//         const offset = (page - 1) * pageSize;
//         const result = await conn.query('SELECT * FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR) LIMIT ? OFFSET ?', [pageSize, offset]);

//         // Obtener el número total de registros sin aplicar ningún filtro
//         const totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
//         const totalCount = await conn.query(totalCountQuery);
//         const totalRecords = totalCount[0][0].total;
        
//         event.reply('receiveExpedientesDepurar', { 
//             totalRecords: totalRecords,
//             filteredRecords: totalRecords, // No aplicamos filtros, por lo que el total y el filtrado son iguales
//             data: result[0]
//         });
//     } catch (error) {
//         console.log(error);
//         event.reply('receiveExpedientesDepurar', []);
//     }
// });




ipcMain.on('getExpedientesDepurar', async (event, page, pageSize,filtroFolioDep) => {
    try {
        const conn = await getConnection();
        const offset = (page - 1) * pageSize;
        //const result = await conn.query('SELECT * FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR) LIMIT ? OFFSET ?', [pageSize, offset]);
        let query = 'SELECT * FROM expediente';

        if(filtroFolioDep){
            query+=' WHERE folio LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            filtroFolioDep += '%';
        }else{
            query+=' WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        }

        query+=' LIMIT ? OFFSET ?';

        let queryParams = [];

        if(filtroFolioDep){
            queryParams.push(filtroFolioDep);
        }

        queryParams.push(pageSize,offset);

        const result = await conn.query(query, queryParams);

        // Obtener el número total de registros sin aplicar ningún filtro
        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        // Si se proporciona una letra de folio, ajustar la consulta para contar solo los registros que coinciden con esa letra
        if (filtroFolioDep) {
            totalCountQuery += ' WHERE folio LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        }else{
            totalCountQuery += ' WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        }

        
        const totalCount = await conn.query(totalCountQuery,queryParams);
        const totalRecords = totalCount[0][0].total;
        
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: totalRecords, // No aplicamos filtros, por lo que el total y el filtrado son iguales
            data: result[0]
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});


//fgdhgdhfghgfjghjghkjhjkhkhjkhjjklkljl
// ipcMain.on('getExpedientesDepurar', async (event,page,pageSize,filtroFolioD) => {
//     try {
//         const conn = await getConnection();
//         const offset = (page - 1) * pageSize;
//         let query = 'SELECT * FROM expediente';

//         if (filtroFolioD) {
//             query += ' WHERE folio LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
//             filtroFolioD += '%'; // Añadir '%' para que busque todas las combinaciones de la letra
//         } else {
//             query +=' WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
//         }

//         query += ' LIMIT ?, ?'; // Cambio en la cláusula LIMIT

//         let queryParams = [];

//         if (filtroFolioD) {
//             queryParams.push(filtroFolioD);
//         }

//         queryParams.push(offset, pageSize); // Cambio en los parámetros de la consulta

//         const result = await conn.query(query, queryParams);

//         // Obtener el número total de registros sin aplicar ningún filtro
//         let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';

//         // Si se proporciona una letra de folio, ajustar la consulta para contar solo los registros que coinciden con esa letra
//         if (filtroFolioD) {
//             totalCountQuery += ' WHERE folio LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
//         } else {
//             totalCountQuery += ' WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
//         }

//         const totalCount = await conn.query(totalCountQuery, queryParams);
//         const totalRecords = totalCount[0][0].total;

//         event.reply('receiveExpedientesDepurar', { 
//             totalRecords: totalRecords,
//             filteredRecords: totalRecords, // En este caso, no aplicamos filtros, por lo que el total y el filtrado son iguales
//             data: result[0] 
//         });
//     } catch (error) {
//         console.log(error);
//         event.reply('receiveExpedientesDepurar', { 
//             totalRecords: 0,
//             filteredRecords: 0,
//             data: []
//         });
//     }
// });


/////////////-------CREAR NUEVO EXPEDIENTE-------/////////////
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

/////////////-------ACTUALIZAR EXPEDIENTES-------/////////////
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

/////////////-------ELIMINAR EXPEDIENTEN TABLA PRINCIPAL-------/////////////
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

/////////////-------ELIMINAR EXPEDIENTE EN MODAL DE DEPURACIÓN-------/////////////
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

/////////////-------DEPURACIÓN MASIVA DE EXPEDIENTES-------/////////////
//Funciones para la depuración de expedientes
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

/////////////-------FUNCIONES DE FILTROS DE BUSQUEDA-------/////////////
// Función para realizar la búsqueda de folios
ipcMain.on('searchFolios', async (event, busquedaFolioD, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM folioDisponible';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaNombre) {
            query += ' WHERE UPPER(folioD) LIKE ?';
            busquedaFolioD += '%';
            queryParams.push(busquedaFolioD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM folioDisponible';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaFolioD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM folioDisponible WHERE UPPER(folioD) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveFolios', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveFolios', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

// Función para realizar la búsqueda de folios
ipcMain.on('searchNombres', async (event, busquedaNombre,page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaNombre) {
            query += ' WHERE UPPER(nombre) LIKE ?';
            busquedaNombre += '%';
            queryParams.push(busquedaNombre);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaNombre) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(nombre) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchNombresD', async (event, busquedaNombreD,page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaNombreD) {
            query += ' WHERE UPPER(nombre) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            busquedaNombreD += '%';
            queryParams.push(busquedaNombreD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaNombreD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(nombre) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchEdad', async (event, busquedaEdad, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaEdad) {
            query += ' WHERE UPPER(edad) LIKE ?';
            busquedaEdad += '%';
            queryParams.push(busquedaEdad);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaEdad) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(edad) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchEdadD', async (event, busquedaEdadD, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaEdadD) {
            query += ' WHERE UPPER(edad) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            busquedaEdadD += '%';
            queryParams.push(busquedaEdadD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaEdadD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(edad) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchDireccion', async (event, busquedaDireccion, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaDireccion) {
            query += ' WHERE UPPER(direccion) LIKE ?';
            busquedaDireccion += '%';
            queryParams.push(busquedaDireccion);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaDireccion) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(direccion) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchDireccionD', async (event, busquedaDireccionD, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaDireccionD) {
            query += ' WHERE UPPER(direccion) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            busquedaDireccionD += '%';
            queryParams.push(busquedaDireccionD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaDireccionD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(direccion) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchNumA', async (event, busquedaNumA, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaNumA) {
            query += ' WHERE UPPER(numAfiliacion) LIKE ?';
            busquedaNumA += '%';
            queryParams.push(busquedaNumA);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaNumA) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(numAfiliacion) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchNumAD', async (event, busquedaNumAD, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaNumAD) {
            query += ' WHERE UPPER(numAfiliacion) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            busquedaNumAD += '%';
            queryParams.push(busquedaNumAD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaNumAD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(numAfiliacion) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchCurp', async (event, busquedaCurp, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaCurp) {
            query += ' WHERE UPPER(curp) LIKE ?';
            busquedaCurp += '%';
            queryParams.push(busquedaCurp);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaCurp) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(curp) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchCurpD', async (event, busquedaCurpD, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaCurpD) {
            query += ' WHERE UPPER(curp) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            busquedaCurpD += '%';
            queryParams.push(busquedaCurpD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaCurpD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(curp) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchCiudad', async (event, busquedaCiudad, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaCiudad) {
            query += ' WHERE UPPER(ciudad) LIKE ?';
            busquedaCiudad += '%';
            queryParams.push(busquedaCiudad);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaCiudad) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(ciudad) LIKE ?';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientes', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientes', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

ipcMain.on('searchCiudadD', async (event, busquedaCiudadD, page, pageSize) => {
    try {
        const conn = await getConnection();
        let query = 'SELECT * FROM expediente';
        let queryParams = [];
        
        // Verificar si se proporciona un término de búsqueda
        if (busquedaCiudadD) {
            query += ' WHERE UPPER(ciudad) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            busquedaCiudadD += '%';
            queryParams.push(busquedaCiudadD);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageSize, offset);

        const result = await conn.query(query, queryParams);

        let totalCountQuery = 'SELECT COUNT(*) AS total FROM expediente WHERE fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        
        const totalCount = await conn.query(totalCountQuery);
        const totalRecords = totalCount[0][0].total;

        if (busquedaCiudadD) {
            let filteredCountQuery = 'SELECT COUNT(*) AS filtered FROM expediente WHERE UPPER(ciudad) LIKE ? AND fechaIngreso <= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
            const filteredCount = await conn.query(filteredCountQuery, queryParams);
            var filteredRecords = filteredCount[0][0].filtered;
        } else {
            var filteredRecords = totalRecords;
        }

        event.reply('receiveExpedientesDepurar', { 
            totalRecords: totalRecords,
            filteredRecords: filteredRecords,
            data: result[0] 
        });
    } catch (error) {
        console.log(error);
        event.reply('receiveExpedientesDepurar', { 
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        });
    }
});

module.exports = {
    createWindow,
    createExp
};


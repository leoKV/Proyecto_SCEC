//Expediente.js
//Configuración inicial de página
window.onload = function(){
    var menuInicio = document.getElementById('expediente-clinico');
    menuInicio.style.color='white';
    menuInicio.style.textDecoration = 'underline';
    menuInicio.style.borderRadius='7px';
    menuInicio.style.background = '#bc4e9c';
    menuInicio.style.background = '-webkit-linear-gradient(to right, #f80759, #bc4e9c)';
    menuInicio.style.background = 'linear-gradient(to right, #f80759, #bc4e9c)';
    menuInicio.style.border = '1px solid white';
}

const { remote } = window.electronAPI;

//Tabla principal de expedientes clínicos.
$(document).ready(function() {
    var table = $('#mydatatable').DataTable({
        "serverSide": true,
        "processing": true,
        "ajax": function (data, callback, settings) {
           
            // Calcular la página actual y el tamaño de página
            const page = settings._iDisplayStart / settings._iDisplayLength + 1;
            const pageSize = settings._iDisplayLength;
            let filtroFolio = $('#filtroFolio').val(); // Obtener el valor del filtro de folio
            let filtroAfiliacion = $('#filtroAfiliacion').val();
            let filtroTarjeta = $('#filtroTarjeta').val();
            let filtroReposicionT = $('#filtroReposicionT').val();
            // Verificar si se ha seleccionado una letra en el filtro
            if (!filtroFolio) filtroFolio = null;
            if (!filtroAfiliacion) filtroAfiliacion = null;
            if (!filtroTarjeta) filtroTarjeta = null;
            if (!filtroReposicionT) filtroReposicionT = null;
            // Enviar solicitud al backend para obtener los datos de la página actual
            window.electronAPI.sendGetExpedientes(page, pageSize,filtroFolio,filtroAfiliacion,filtroTarjeta,filtroReposicionT);
            // Actualizar la tabla con los datos recibidos del backend
            window.electronAPI.receiveExpedientes((expedientes) => {
                // Formatear las fechas y generar las opciones HTML
                expedientes.data.forEach(expediente => {
                    expediente.fechaIngreso = expediente.fechaIngreso ? moment(expediente.fechaIngreso).format('DD/MM/YYYY') : '';
                    expediente.fechaNacimiento = expediente.fechaNacimiento ? moment(expediente.fechaNacimiento).format('DD/MM/YYYY') : '';
                    expediente.opcionesHTML = `
                        <button type="button" class="btn btn-secondary btnActualizarExp" data-bs-toggle="modal" data-bs-target="#modalActualizar" data-id="${expediente.id}">
                            <i class="fa-solid fa-pen-to-square"></i> Actualizar
                        </button>
                        <button type="button" class="btn btn-danger btnEliminarExp" data-bs-toggle="modal" data-bs-target="#modalEliminar" data-id="${expediente.id}">
                            <i class="fa fa-trash"></i> Eliminar
                        </button>
                    `;
                });
                // Llamar a la función de callback con los datos formateados y las opciones HTML
                callback({
                    draw: data.draw,
                    recordsTotal: expedientes.totalRecords,
                    recordsFiltered: expedientes.filteredRecords,
                    data: expedientes.data
                });
            });
        },
        "columns": [
            { "data": "folio" },
            { "data": "nombre" },
            { "data": "edad" },
            { "data": "direccion" },
            { "data": "afiliacion" },
            { "data": "numAfiliacion" },
            { "data": "curp" },
            { "data": "fechaIngreso" },
            { "data": "tarjeta" },
            { "data": "reposicionTarjeta" },
            { "data": "fechaNacimiento" },
            { "data": "ciudad" },
            { "data": "opcionesHTML" }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
        },
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            { 
                "targets": 0, // Índice de la columna de folio
                "searchable": true,
                "orderable": true
            }
        ]
    });
    //Actualización
    const formActualizar = document.getElementById('formActualizarExp')
    $('#expedientes-tbody').on('click', '.btnActualizarExp', function () {
          idExpediente = $(this).data('id');
          console.log('ID del expediente a actualizar',idExpediente);
          // Llamar a la función para obtener los detalles del expediente por su ID
          window.electronAPI.sendGetExpedienteById(idExpediente);
    });
    // Agregar un listener para recibir los detalles del expediente por su ID
    window.electronAPI.receiveExpedienteById((expediente) => {
          console.log(expediente)
          if (expediente) {
              // Rellenar el formulario con los datos del expediente
              $('#folioU').val(expediente.folio); 
              $('#nombreU').val(expediente.nombre);
              $('#edadU').val(expediente.edad);
              $('#direccionU').val(expediente.direccion);
              $('#afiliacionU').val(expediente.afiliacion);
              $('#numAfiliacionU').val(expediente.numAfiliacion);
              $('#curpU').val(expediente.curp);
              $('#tarjetaU').val(expediente.tarjeta);
              $('#reposicionTarjetaU').val(expediente.reposicionTarjeta);
              // Formatear la fecha utilizando moment.js
              const fechaNacimientoFormateada = moment(expediente.fechaNacimiento).format('YYYY-MM-DD');
              $('#fechaNacimientoU').val(fechaNacimientoFormateada);
              $('#ciudadU').val(expediente.ciudad);

              formActualizar.addEventListener('submit', (e) =>{
                  e.preventDefault();
                  // Obtener los datos del formulario y crear un objeto expediente actualizado
                  const expedienteActualizado = {
                      id: idExpediente,
                      folio: $('#folioU').val(),
                      nombre: $('#nombreU').val(),
                      edad: $('#edadU').val(),
                      direccion: $('#direccionU').val(),
                      afiliacion:$('#afiliacionU').val(),
                      numAfiliacion:$('#numAfiliacionU').val(),
                      curp: $('#curpU').val(),
                      tarjeta: $('#tarjetaU').val(),
                      reposicionTarjeta: $('#reposicionTarjetaU').val(),
                      fechaNacimiento: $('#fechaNacimientoU').val(),
                      ciudad: $('#ciudadU').val()
                  };
                  window.electronAPI.updateExp(expedienteActualizado);
                  $('#modalActualizar').modal('hide');
              })
              
          } else {
              console.error('No se encontró un expediente con el ID proporcionado.');
          }
    });
    //Alertas de Actualización.
    window.electronAPI.listenExpUpdatedSuccessfully(() => {
          Swal.fire({
              position: "top-end",
              icon: "success",
              title: "¡Expediente actualizado correctamente!",
              showConfirmButton: false,
              timer: 3000
          }).then(() => {
            // Recargar la página después de cerrar la alerta
            location.reload();
          });
          
    });
    window.electronAPI.listenExpUpdateError(() => {
          Swal.fire({
              position: "top-end",
              icon: 'error',
              title: '¡Error al actualizar expediente!',
              text: `Verifica que el No.Folio no se repita al actualizar.`,
              showConfirmButton: false,
              timer: 4500
          });
    });


    //Eliminación
    $('#expedientes-tbody').on('click', '.btnEliminarExp', function () {
        idExpediente = $(this).data('id');
        console.log('Id al abrir modal eliminar: ', idExpediente);
        $('.btn-confirmar-eliminar').attr('data-id-eliminar', idExpediente);
    });
    $('.btn-confirmar-eliminar').on('click', function () {
        idExpedienteD = idExpediente
        console.log('Id al confirmar eliminar: ', idExpedienteD);
        window.electronAPI.deleteExp(idExpedienteD);
    });
    //Alertas de Eliminación.
    window.electronAPI.listenExpDeletedSuccessfully(() => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Expediente eliminado correctamente!",
            showConfirmButton: false,
            timer: 3000
        }).then(() => {
          // Recargar la página después de cerrar la alerta
          location.reload();
        });
        
    });
    window.electronAPI.listenExpDeleteError(() => {
        Swal.fire({
            position: "top-end",
            icon: 'error',
            title: '¡Error al eliminar expediente!',
            text: `Ocurrio un error, intentalo más tarde.`,
            showConfirmButton: false,
            timer: 4500
        });
    });
    ///////////////////SECCIÓN DE FILTROS DE LA TABLA////////////
    // Agregar un listener para el evento de cambio en el filtro de folio.
    $('#filtroFolio').on('change', function() {table.ajax.reload();});
    // Agregar un listener para el evento de cambio en el filtro de afiliación.
    $('#filtroAfiliacion').on('change', function() {table.ajax.reload();});
    // Agregar un listener para el evento de cambio en el filtro de tarjeta.
    $('#filtroTarjeta').on('change', function() {table.ajax.reload();});
    // Agregar un listener para el evento de cambio en el filtro de reposición de tarjeta.
    $('#filtroReposicionT').on('change', function() {table.ajax.reload();});

    $('#filtroNombreF').on('keyup', function() {
        let busquedaNombre = $(this).val().toUpperCase();
        let table = $('#mydatatable').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchNombres(busquedaNombre, page, pageSize);
    });

    $('#filtroEdadF').on('keyup', function() {
        let busquedaEdad = $(this).val().toUpperCase();
        let table = $('#mydatatable').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchEdad(busquedaEdad, page, pageSize);
    });

    $('#filtroDireccionF').on('keyup', function() {
        let busquedaDireccion = $(this).val().toUpperCase();
        let table = $('#mydatatable').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchDireccion(busquedaDireccion, page, pageSize);
    });

    $('#filtroNumAfiliacionF').on('keyup', function() {
        let busquedaNumA = $(this).val().toUpperCase();
        let table = $('#mydatatable').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchNumA(busquedaNumA, page, pageSize);
    });

    $('#filtroCURPF').on('keyup', function() {
        let busquedaCurp = $(this).val().toUpperCase();
        let table = $('#mydatatable').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchCurp(busquedaCurp, page, pageSize);
    });

    $('#filtroCiudadNacimientoF').on('keyup', function() {
        let busquedaCiudad = $(this).val().toUpperCase();
        let table = $('#mydatatable').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchCiudad(busquedaCiudad, page, pageSize);
    });
});

//Tabla de historial de folios disponibles
$(document).ready(function() {
    var tableFolios= $('#mydatatableFolios').DataTable({
        "serverSide": true,
        "processing": true,
        "ajax": function (data, callback, settings) {
            // Calcular la página actual y el tamaño de página
            const page = settings._iDisplayStart / settings._iDisplayLength + 1;
            const pageSize = settings._iDisplayLength;
            let filtroFolioD = $('#filtroFolioDisponible').val(); // Obtener el valor del filtro de folio
            // Verificar si se ha seleccionado una letra en el filtro
            if (!filtroFolioD) {
                // Si no se ha seleccionado ninguna letra, establecer filtroFolio como null
                filtroFolioD = null;
            }
            // Enviar solicitud al backend para obtener los datos de la página actual
            window.electronAPI.sendGetFolios(page, pageSize,filtroFolioD);
            // Actualizar la tabla con los datos recibidos del backend
            window.electronAPI.receiveFolios((folios) => {
                // Formatear las fechas y generar las opciones HTML
                folios.data.forEach(folios => {
                    folios.folioD
                });
                // Llamar a la función de callback con los datos formateados y las opciones HTML
                callback({
                    draw: data.draw,
                    recordsTotal: folios.totalRecords,
                    recordsFiltered: folios.filteredRecords,
                    data: folios.data
                });
            });
        },
        "columns": [
            { "data": "folioD" }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
        },
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            { 
                "targets": 0, // Índice de la columna de folio
                "searchable": true,
                "orderable": true
            }
        ]
    });
    // Agregar un listener para el evento de cambio en el filtro de folio
    $('#filtroFolioDisponible').on('change', function() {
        // Recargar la tabla con el filtro aplicado
        tableFolios.ajax.reload();
    });

    $('#folioFooterD').on('keyup', function() {
        let busquedaFolioD = $(this).val().toUpperCase();
        let tableFolios = $('#mydatatableFolios').DataTable();
        let pageInfo = tableFolios.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchFolios(busquedaFolioD, page, pageSize);
    });
});

//Tabla de depuración masiva de expedientes.
$(document).ready(function() {
    var tableDepurar = null;
    var idExpediente;
    var botonD= false;
    $('#modalDepurar').on('shown.bs.modal', function () {
        if (tableDepurar !== null) {
            tableDepurar.destroy();
            tableDepurar = null;
        }

        tableDepurar= $('#mydatatableDepurar').DataTable({
            "serverSide": true,
            "processing": true,
            "ajax": function (data, callback, settings) {
                // Calcular la página actual y el tamaño de página
                const page = settings._iDisplayStart / settings._iDisplayLength + 1;
                const pageSize = settings._iDisplayLength;
                let filtroFolioDep = $('#filtroFolioDep').val(); // Obtener el valor del filtro de folio
                // Verificar si se ha seleccionado una letra en el filtro
                if (!filtroFolioDep) {
                    // Si no se ha seleccionado ninguna letra, establecer filtroFolioDep como null
                    filtroFolioDep = null;
                }
             
                // Enviar solicitud al backend para obtener los datos de la página actual
                window.electronAPI.sendGetExpedientesDepurar(page, pageSize,filtroFolioDep);
                // Actualizar la tabla con los datos recibidos del backend
                window.electronAPI.receiveExpedientesDepurar((expedientes) => {
                    // Formatear las fechas y generar las opciones HTML
                    expedientes.data.forEach(expediente => {
                        expediente.fechaIngreso = expediente.fechaIngreso ? moment(expediente.fechaIngreso).format('DD/MM/YYYY') : '';
                        expediente.fechaNacimiento = expediente.fechaNacimiento ? moment(expediente.fechaNacimiento).format('DD/MM/YYYY') : '';
                        expediente.opcionesHTML = `
                        <button type="button" class="btn btn-danger btnEliminarExpD" data-bs-toggle="modal" data-bs-target="#modalEliminarD" data-id="${expediente.id}">
                            <i class="fa fa-trash"></i> Eliminar
                        </button>
                        `;
                    });
                    // Llamar a la función de callback con los datos formateados y las opciones HTML
                    callback({
                        draw: data.draw,
                        recordsTotal: expedientes.totalRecords,
                        recordsFiltered: expedientes.filteredRecords,
                        data: expedientes.data
                    });
                });
            },
            "columns": [
                { "data": "folio" },
                { "data": "nombre" },
                { "data": "edad" },
                { "data": "direccion" },
                { "data": "afiliacion" },
                { "data": "numAfiliacion" },
                { "data": "curp" },
                { "data": "fechaIngreso" },
                { "data": "tarjeta" },
                { "data": "reposicionTarjeta" },
                { "data": "fechaNacimiento" },
                { "data": "ciudad" },
                { "data": "opcionesHTML" }
            ],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
            },
            "order": [[ 0, "desc" ]],
            "columnDefs": [
                {
                    "targets": 7, // Índice de la columna fechaIngreso (empezando desde 0)
                    "render": function (data, type, row, meta) {
                        // Aplicar estilo personalizado a las celdas de la columna fechaIngreso
                        return '<div style="background-color:#d63031; color: white;">' + data + '</div>';
                    }
                }
            ],
            "initComplete": function () {
                // Verificar si la tabla contiene datos
                if (tableDepurar.rows().data().length > 0) {
                    // Mostrar el botón "Depurar Expedientes"
                    $('#btnDepurarExpedintes').show();
                } else {
                    // Ocultar el botón "Depurar Expedientes"
                    $('#btnDepurarExpedintes').hide();
                }
            }
        });
    });
    //Eliminación
    $('#expedientes-depuracion').on('click', '.btnEliminarExpD', function () {
        idExpediente = $(this).data('id');
        console.log('Id al abrir modal eliminar: ', idExpediente);
        $('.btn-confirmar-eliminar-d').attr('data-id-eliminar-d', idExpediente);
    });
    
    $('.btn-confirmar-eliminar-d').on('click',async function () {
        idExpedienteD = idExpediente
        console.log('Id al confirmar eliminar: ', idExpedienteD);
        window.electronAPI.deleteExpD(idExpedienteD);
    });
    
    window.electronAPI.listenExpDeletedSuccessfullyD(() => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Expediente eliminado correctamente!",
            showConfirmButton: false,
            timer: 3000
        }).then(() => {
            $('#modalDepurar').modal('show');
            // Controlador de eventos para el botón btnDepurarExpedientes
            $('#btnDepurarExpedintes').on('click', function() {
            // No recargar la página cuando el botón es presionado
                botonD = true;
            });
            // Controlador de eventos para detectar el cierre del modal
            $('#modalDepurar').on('hidden.bs.modal', function (e) {
                if(!botonD){
                    location.reload();
                } 
            });
        });
    });    
    window.electronAPI.listenExpDeleteErrorD(() => {
        Swal.fire({
            position: "top-end",
            icon: 'error',
            title: '¡Error al eliminar expediente!',
            text: `Ocurrio un error, intentalo más tarde.`,
            showConfirmButton: false,
            timer: 4500
        });
    });
       ///////////////////SECCIÓN DE FILTROS DE LA TABLA////////////
    // Agregar un listener para el evento de cambio en el filtro de folio
    $('#filtroFolioDep').on('change', function() {tableDepurar.ajax.reload();});
    // Agregar un listener para el evento de cambio en el filtro de afiliación.
    $('#filtroAfiliacionDep').on('change', function() {tableDepurar.ajax.reload();});
    // Agregar un listener para el evento de cambio en el filtro de tarjeta.
    $('#filtroTarjetaDep').on('change', function() {tableDepurar.ajax.reload();});
    // Agregar un listener para el evento de cambio en el filtro de reposición de tarjeta.
    $('#filtroReposicionTDep').on('change', function() {tableDepurar.ajax.reload();});
    //Filtros de busqueda
    $("#modalDepurar").on("shown.bs.modal", function() {
        $("#filtroNombreDep").val(""); // Limpiar el valor del buscador
    });
    $('#filtroNombreDep').on('keyup', function() {
        let busquedaNombreD = $(this).val().toUpperCase();
        let table = $('#mydatatableDepurar').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchNombresDep(busquedaNombreD, page, pageSize);
    });

    $('#filtroEdadDep').on('keyup', function() {
        let busquedaEdadD = $(this).val().toUpperCase();
        let table = $('#mydatatableDepurar').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchEdadDep(busquedaEdadD, page, pageSize);
    });

    $('#filtroDireccionDep').on('keyup', function() {
        let busquedaDireccionD = $(this).val().toUpperCase();
        let table = $('#mydatatableDepurar').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchDireccionDep(busquedaDireccionD, page, pageSize);
    });

    $('#filtroNumAfiliacionDep').on('keyup', function() {
        let busquedaNumAD = $(this).val().toUpperCase();
        let table = $('#mydatatableDepurar').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchNumADep(busquedaNumAD, page, pageSize);
    });

    $('#filtroCURPDep').on('keyup', function() {
        let busquedaCurpD = $(this).val().toUpperCase();
        let table = $('#mydatatableDepurar').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchCurpDep(busquedaCurpD, page, pageSize);
    });

    $('#filtroCiudadNacimientoDep').on('keyup', function() {
        let busquedaCiudadD = $(this).val().toUpperCase();
        let table = $('#mydatatableDepurar').DataTable();
        let pageInfo = table.page.info();
        let page = pageInfo.page + 1;
        let pageSize = pageInfo.length;
        window.electronAPI.sendSearchCiudadDep(busquedaCiudadD, page, pageSize);
    });
});

//Función de depuración de archivo.
$('.btn-confirmar-depurar').on('click', function () {
    window.electronAPI.depurarExp()
});

//Alerta de exito al depurar.
window.electronAPI.listenExpDepuradoSuccessfully(() => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "¡Expedientes depurados correctamente!",
        showConfirmButton: false,
        timer: 3000
    }).then(() => {
      // Recargar la página después de cerrar la alerta
      location.reload();
    });
    
});

//Alerta de error al depurar.
window.electronAPI.listenExpDepuradoError(() => {
    Swal.fire({
        position: "top-end",
        icon: 'error',
        title: '¡Error al depurar los expediente!',
        text: `Ocurrio un error, intentalo más tarde.`,
        showConfirmButton: false,
        timer: 4500
    });
});

//Capturando valores del formulario
const formAgregar = document.getElementById('formAgregarExp')
const expFolio = document.getElementById('folio');
const expNombre = document.getElementById('nombre');
const expEdad = document.getElementById('edad');
const expDireccion = document.getElementById('direccion');
const expAfiliacion = document.getElementById('afiliacion');
const expNumAfiliacion = document.getElementById('numAfiliacion');
const expCurp = document.getElementById('curp');
const expTarjeta = document.getElementById('tarjeta');
const expReposicion = document.getElementById('reposicionTarjeta');
const expFechaNacimiento = document.getElementById('fechaNacimiento');
const expCiudadNacimiento = document.getElementById('ciudadNacimiento');

//Manejo de datos del formulario para agregar un nuevo expediente.
formAgregar.addEventListener('submit', (e) =>{
    e.preventDefault();

    const nuevoExpediente ={
        folio: expFolio.value,
        nombre: expNombre.value,
        edad: expEdad.value,
        direccion: expDireccion.value,
        afiliacion: expAfiliacion.value,
        numAfiliacion: expNumAfiliacion.value,
        curp: expCurp.value,
        tarjeta: expTarjeta.value,
        reposicionTarjeta: expReposicion.value,
        fechaNacimiento: expFechaNacimiento.value,
        ciudad:expCiudadNacimiento.value
    }

    window.electronAPI.createExp(nuevoExpediente);

    limpiarCerrarModal();
})

//Alerta de exito de inserción
window.electronAPI.listenExpInsertedSuccessfully(() => {
  // Código para limpiar el formulario
  limpiarCerrarModal();
  Swal.fire({
      position: "top-end",
      icon: "success",
      title: "¡Expediente creado correctamente!",
      showConfirmButton: false,
      timer: 3000
  }).then(() => {
    // Recargar la página después de cerrar la alerta
    location.reload();
  });
  
});

//Alerta de error de inserción
window.electronAPI.listenExpInsertError(() => {
  // Código para limpiar el formulario
  limpiarCerrarModal();
  Swal.fire({
      position: "top-end",
      icon: 'error',
      title: '¡Error al crear expediente!',
      text: `Verifica que el No.Folio no se repita`,
      showConfirmButton: false,
      timer: 4500
  });
});

//Función para limpiar y cerrar el modal.
function limpiarCerrarModal(){
    document.getElementById('formAgregarExp').reset()
    $('#modalAgregar').modal('hide');
}

//Validaciones de campos en formularios.
document.getElementById("folio").addEventListener("input", function() {
    var input = this.value;
    var folioFeedback = document.getElementById("folio-feedback");

    // Verifica que el elemento con ID "folio-feedback" exista
    if (!folioFeedback) {
        console.error("Elemento con ID 'folio-feedback' no encontrado en el HTML.");
        return;
    }

    // Verifica la longitud del valor ingresado
    if (input.length === 6) {
        // Si es válido, elimina la clase is-invalid y agrega la clase is-valid
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
        folioFeedback.style.display = "none";
    } else {
        // Si no es válido, agrega la clase is-invalid y elimina la clase is-valid
        this.classList.remove("is-valid");
        this.classList.add("is-invalid");
        folioFeedback.style.display = "block";
    }
});

document.getElementById("curp").addEventListener("input", function() {
    var input = this.value;
    var curpFeedback = document.getElementById("curp-feedback");

    // Verifica que el elemento con ID "curp-feedback" exista
    if (!curpFeedback) {
        console.error("Elemento con ID 'curp-feedback' no encontrado en el HTML.");
        return;
    }

    // Verifica la longitud del valor ingresado
    if (input.length === 0 || (input.length >= 1 && input.length === 18)) {
        // Si es válido, elimina la clase is-invalid y agrega la clase is-valid
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
        curpFeedback.style.display = "none";
    } else {
        // Si no es válido, agrega la clase is-invalid y elimina la clase is-valid
        this.classList.remove("is-valid");
        this.classList.add("is-invalid");
        curpFeedback.style.display = "block";
    }
});

document.getElementById("modalActualizar").addEventListener("input", function(event) {
    var targetElement = event.target;
    var curpFeedback = document.getElementById("curp-feedback");
    var folioFeedback = document.getElementById("folio-feedback");

    if (targetElement.id === "folioU") {
        validateInputLength(targetElement, folioFeedback, 6);
    } else if (targetElement.id === "curpU") {
        validateInputLength(targetElement, curpFeedback, 18);
    }
});

function validateInputLength(inputElement, feedbackElement, expectedLength) {
    var input = inputElement.value;

    // Verifica la longitud del valor ingresado
    if (input.length === 0 || (input.length >= 1 && input.length === expectedLength)) {
        // Si es válido, elimina la clase is-invalid y agrega la clase is-valid
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
        feedbackElement.style.display = "none";
    } else {
        // Si no es válido, agrega la clase is-invalid y elimina la clase is-valid
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
        feedbackElement.style.display = "block";
    }
}

document.getElementById("formAgregarExp").addEventListener("submit", function() {
    var inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
    
    inputs.forEach(function(input) {
      input.value = input.value.toUpperCase();
    });
});



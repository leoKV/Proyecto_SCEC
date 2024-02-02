// expediente.js
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

$(document).ready(function() {
  var idExpediente;
  $('#mydatatable tfoot th').each( function () {
      var title = $(this).text();
      $(this).html( '<input type="text" placeholder="Filtrar.." />' );
  } );

  var table = $('#mydatatable').DataTable({
      "dom": 'B<"float-left"i><"float-right"f>t<"float-left"l><"float-right"p><"clearfix">',
      "responsive": false,
      "language": {
          "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
      },
      "order": [[ 0, "desc" ]],
      "initComplete": function () {
        // Solicitar expedientes al cargar la página
        electronAPI.sendGetExpedientes();

        electronAPI.receiveExpedientes((expedientes) => {
            table.clear();

            expedientes.forEach(expediente => {
                // Formatear las fechas antes de agregarlas a la tabla
                var fechaIngresoFormateada = moment(expediente.fechaIngreso).format('DD/MM/YYYY');
                if(expediente.fechaNacimiento !== null){
                    var fechaNacimientoFormateada = moment(expediente.fechaNacimiento).format('DD/MM/YYYY');
                }else{
                    var fechaNacimientoFormateada = expediente.fechaNacimiento;
                }
                var opcionesHTML = `
                <button type="button" class="btn btn-secondary btnActualizarExp" data-bs-toggle="modal" data-bs-target="#modalActualizar" data-id="${expediente.id}">
                    <i class="fa-solid fa-pen-to-square"></i> Actualizar
                </button>
                <button type="button" class="btn btn-danger btnEliminarExp" data-bs-toggle="modal" data-bs-target="#modalEliminar" data-id="${expediente.id}">
                    <i class="fa fa-trash"></i> Eliminar
                </button>
                `;
                table.row.add([
                    expediente.folio,
                    expediente.nombre,
                    expediente.edad,
                    expediente.direccion,
                    expediente.curp,
                    fechaIngresoFormateada,
                    expediente.tarjeta,
                    expediente.reposicionTarjeta,
                    fechaNacimientoFormateada,
                    expediente.ciudad,
                    opcionesHTML
                ]).draw();
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
                    $('#curpU').val(expediente.curp);
                    $('#tarjetaU').val(expediente.tarjeta);
                    $('#reposicionTarjetaU').val(expediente.reposicionTarjeta);
                    // Formatear la fecha utilizando moment.js
                    const fechaNacimientoFormateada = moment(expediente.fechaNacimiento).format('YYYY-MM-DD');
                    $('#fechaNacimientoU').val(fechaNacimientoFormateada);
                    $('#ciudadU').val(expediente.ciudad);

                    formActualizar.addEventListener('submit', (e) =>{
                        e.preventDefault();
                        window.electronAPI.updateExp(expediente);
                        $('#modalActualizar').modal('hide');
                    })
                    
                } else {
                    console.error('No se encontró un expediente con el ID proporcionado.');
                }
            });

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
                    text: `Ocurrio un error, intentalo más tarde.`,
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

            table.columns().every(function () {
                var that = this;

                $('input', this.footer()).on('focus', function () {
                    // Desactivar eventos de búsqueda
                    that.off('keyup change');
                }).on('blur', function () {
                    // Volver a activar eventos de búsqueda
                    that.on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw();
                        }
                    });
                });
            });
        });
    }
  });
});

//Capturando valores del formulario
const formAgregar = document.getElementById('formAgregarExp')

const expFolio = document.getElementById('folio');
const expNombre = document.getElementById('nombre');
const expEdad = document.getElementById('edad');
const expDireccion = document.getElementById('direccion');
const expCurp = document.getElementById('curp');
const expTarjeta = document.getElementById('tarjeta');
const expReposicion = document.getElementById('reposicionTarjeta');
const expFechaNacimiento = document.getElementById('fechaNacimiento');
const expCiudadNacimiento = document.getElementById('ciudadNacimiento');

formAgregar.addEventListener('submit', (e) =>{
    e.preventDefault();

    const nuevoExpediente ={
        folio: expFolio.value,
        nombre: expNombre.value,
        edad: expEdad.value,
        direccion: expDireccion.value,
        curp: expCurp.value,
        tarjeta: expTarjeta.value,
        reposicionTarjeta: expReposicion.value,
        fechaNacimiento: expFechaNacimiento.value,
        ciudad:expCiudadNacimiento.value
    }

    window.electronAPI.createExp(nuevoExpediente);

    limpiarCerrarModal();
})

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

function limpiarCerrarModal(){
    document.getElementById('formAgregarExp').reset()
    $('#modalAgregar').modal('hide');
}

//validaciones de la curp y folio

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



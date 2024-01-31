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

// expediente.js


const { remote } = window.electronAPI;

$(document).ready(function() {
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
          this.api().columns().every( function () {
              var that = this;

              $( 'input', this.footer() ).on( 'keyup change', function () {
                  if ( that.search() !== this.value ) {
                      that
                          .search( this.value )
                          .draw();
                      }
              });
          })
      },
      "columnDefs": [
        {
            "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Última columna (donde deseas agregar los botones)
            "render": function (data, type, full, meta) {
                // Verificar si es la última columna antes de renderizar
                if (meta.col !== 10) {
                    // Renderizar los datos normales para las primeras 10 columnas
                    return data;
                } else {
                    // Renderizar los botones solo en la última columna
                    return `
                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalActualizar"><i class="fa-solid fa-pen-to-square"></i> Actualizar</button>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalEliminar"><i class="fa fa-trash"></i> Eliminar</button>
                    `;
                }
            }
        }
      ]
  });

   // Llamar a la función para obtener expedientes al inicio
   window.electronAPI.getExp();
   window.electronAPI.listenGetExp((event, expedientes) => {
    console.log(expedientes);  // Agrega esta línea para imprimir los datos en la consola
    // Limpiar la tabla y agregar los nuevos datos
    table.clear().rows.add(expedientes).draw();
    });

window.electronAPI.listenExpInsertError((event, errorMessage) => {
    // Manejar el error como desees, por ejemplo, mostrar una alerta
    alert(`Error al obtener expedientes: ${errorMessage}`);
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
      timer: 4000
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

document.getElementById("folio").addEventListener("input", function() {
    var input = this.value;

    // Verifica la longitud del valor ingresado
    if (input.length === 6) {
      // Si es válido, elimina la clase is-invalid y agrega la clase is-valid
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
      document.getElementById("folio-feedback").style.display = "none";
    } else {
      // Si no es válido, agrega la clase is-invalid y elimina la clase is-valid
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
      document.getElementById("folio-feedback").style.display = "block";
    }
});

document.getElementById("curp").addEventListener("input", function() {
    var input = this.value;

    // Verifica la longitud del valor ingresado
    if (input.length === 0 || (input.length >= 1 && input.length === 18)) {
      // Si es válido, elimina la clase is-invalid y agrega la clase is-valid
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
      document.getElementById("curp-feedback").style.display = "none";
    } else {
      // Si no es válido, agrega la clase is-invalid y elimina la clase is-valid
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
      document.getElementById("curp-feedback").style.display = "block";
    }
});

document.getElementById("formAgregarExp").addEventListener("submit", function() {
    var inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
    
    inputs.forEach(function(input) {
      input.value = input.value.toUpperCase();
    });
});


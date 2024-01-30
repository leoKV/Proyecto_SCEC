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

$(document).ready( function () {
    $('#myTable').DataTable({
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


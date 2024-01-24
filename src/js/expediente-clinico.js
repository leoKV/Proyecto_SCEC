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
window.electronAPI.hello();

const { remote } = window.electronAPI;

$(document).ready( function () {
    $('#myTable').DataTable({
    });
});

//Capturando valores del formulario
const formAgregar = document.getElementById('formAgregarExp')

const expNumero = document.getElementById('numero');
const expNombre = document.getElementById('nombre');
const expEdad = document.getElementById('edad');
const expDireccion = document.getElementById('direccion');
const expCurp = document.getElementById('curp');
const expFechaIngreso = document.getElementById('fechaIngreso');
const expTarjeta = document.getElementById('tarjeta');
const expReposicion = document.getElementById('reposicionTarjeta');
const expFechaNacimiento = document.getElementById('fechaNacimiento');
const expCiudadNacimiento = document.getElementById('ciudadNacimiento');


formAgregar.addEventListener('submit', (e) =>{
    e.preventDefault();

    const nuevoExpediente ={
        numero: expNumero.value,
        nombre: expNombre.value,
        edad: expEdad.value,
        direccion: expDireccion.value,
        curp: expCurp.value,
        fechaIngreso: expFechaIngreso.value,
        tarjeta: expTarjeta.value,
        reposicion: expReposicion.value,
        fechaNacimiento: expFechaNacimiento.value,
        ciudadNacimiento:expCiudadNacimiento.value
    }
})
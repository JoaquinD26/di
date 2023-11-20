function insertar(campo1, campo2, campo3, campo4, campo5, campo6, campo7) {

    var tokenStorage = localStorage.getItem("token");

    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = {
        action: "insert",
        dni: campo1,
        nombre: campo2,
        depto: campo3,
        direccion: campo4,
        localidad: campo5,
        provincia: campo6,
        fecha_inicio: campo7,
        tokenStorage: tokenStorage
    };
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(function (res) {
            return res.json();
        })
        .then(function (response) {

            if (response.success) {
                if (response.data === true) {

                    Swal.fire({
                        title: response.msg,
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#4CAF50'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.replace("../views/tabla.html");
                        }
                    });

                } else if (response.data === false) {

                    Swal.fire({
                        title: 'La fecha tiene que ser una fecha pasada',
                        icon: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#e53935'
                    });

                } else {

                    Swal.fire({
                        title: response.data,
                        icon: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#e53935'
                    });
                }


            } else {

                var clean_message = 'response.data';
                var prefixes = [
                    "SQLSTATE[45000]: <<Unknown error>>: 1644 ",
                    "SQLSTATE[23000]: Integrity constraint violation: 1062 "
                ];

                for (var prefix of prefixes) {
                    if (response.msg.includes(prefix)) {
                        clean_message = response.msg.replace(prefix, '');
                    }
                }

                Swal.fire({
                    title: clean_message,
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#e53935'
                });
            }

        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function obtenerInputValue1() {
    return document.getElementById('dni').value;
}

function obtenerInputValue2() {
    return document.getElementById('nombre').value;
}

function obtenerInputValue3() {
    return document.getElementById('codigo_departamento').value;
}

function obtenerInputValue4() {
    return document.getElementById('direccion').value;
}

function obtenerInputValue5() {
    return document.getElementById('localidad').value;
}

function obtenerInputValue6() {
    return document.getElementById('provincia').value;
}

function obtenerInputValue7() {
    return document.getElementById('fecha_inicio').value;
}

$(document).ready(function () {
    flatpickr("#fecha_inicio", {
        dateFormat: "Y-m-d", // Formato "yyyy-mm-dd"
        altInput: true,
        altFormat: "F j, Y",
        locale: {
            firstDayOfWeek: 1, // Lunes como el primer día de la semana
        },
    });
});



function validarDatos(dni, nombre, dpto, direccion, localidad, provincia, fecha_inicio) {

    if (dni.trim() === '' || nombre.trim() === '' || dpto.trim() === '' || fecha_inicio.trim() === '') {
        Swal.fire({
            title: 'Por favor, complete todos los campos antes de enviar el formulario.',
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#e53935'
        });
    } else {
        insertar(dni, nombre, dpto, direccion, localidad, provincia, fecha_inicio);
    }
}


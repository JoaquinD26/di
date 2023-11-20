function iniciar(nombre, contrasenna) {
    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "iniciar",
        nombre: nombre,
        contrasenna: contrasenna

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

            if (response.success === true) {

                Swal.fire({
                    title: response.msg,
                    text: '',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem("token", response.data);
                        // Realiza la redirección o la acción que desees
                        window.location.replace("../views/tabla.html");

                    }
                });
            } else {

                Swal.fire({
                    title: response.msg,
                    text: '',
                    icon: 'error',
                    confirmButtonColor: '#e53935',
                    confirmButtonText: 'Volver a Intentar'
                });
            }
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function registrar(nombre, contrasenna) {
    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "registrar",
        nombre: nombre,
        contrasenna: contrasenna

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


            if (response.data.success === true) {

                Swal.fire({
                    title: response.data.msg,
                    text: '',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50', // Color verde
                    confirmButtonText: 'Aceptar'
                });

            } else {

                Swal.fire({
                    title: response.data.msg,
                    text: '',
                    icon: 'error',
                    confirmButtonColor: '#e53935', // Color verde
                    confirmButtonText: 'Volver a Intentar'
                });
            }

        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function cargarPagina(accion, nombreUsuario, dni, nombre, dpto, direccion, localidad, provincia, fecha_inicio) {


    var tokenStorage = localStorage.getItem("token");

    verificarTokenEnServicioWeb(accion, nombreUsuario, tokenStorage, dni, nombre, dpto, direccion, localidad, provincia, fecha_inicio);

}

function verificarTokenEnServicioWeb(accion, nombreUsuario, tokenStorage, dni, nombre, dpto, direccion, localidad, provincia, fecha_inicio) {
    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "verificar",
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

            if (!response || response.data === false) {
                window.location.replace("../views/login.html");
            } else {

                if (accion === 'eliminar') {
                    confirmarEliminar(dni);
                } else if (accion === 'insertar') {
                    validarDatos(dni, nombre, dpto, direccion, localidad, provincia, fecha_inicio);
                } else if (accion === 'eliminarUser') {
                    confirmarEliminarUser(nombreUsuario);
                }

            }
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function cerrarSesion() {

    Swal.fire({
        title: 'Sesión cerrada',
        text: '',
        icon: 'success',
        confirmButtonColor: '#4CAF50', // Color verde
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {

            localStorage.clear();
            window.location.replace("../views/login.html");

        }
    });

}

function activarRegistro() {

    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "numeroUsuarios"
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

            var button = document.getElementById('registro');

            if (response.data) {
                button.setAttribute('disabled', 'true');
            }

        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}
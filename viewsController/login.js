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

            alert(response.msg);
            localStorage.setItem("token", response.data);
            if (response.success === true) {
                window.location.replace("../views/tabla.html");
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

            alert(response.data);

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

                console.log(response.data);

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
    alert('Sesión cerrada');
    localStorage.clear();
    window.location.replace("../views/login.html");

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

            if(response.data){
                button.setAttribute('disabled', 'true');
            }

        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}
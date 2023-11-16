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
            if(response.success === true){
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

function cargarPagina(dni) {
    

    var tokenStorage = localStorage.getItem("token");

    verificarTokenEnServicioWeb(tokenStorage, dni);

}

function verificarTokenEnServicioWeb(tokenStorage, dni) {
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

                if(dni){
                    eliminar(dni);
                }
            }
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function cerrarSesion() {
    alert('Sesión cerrada'); // Puedes quitar esto, es solo un ejemplo
    localStorage.clear();
    window.location.replace("../views/login.html");

}

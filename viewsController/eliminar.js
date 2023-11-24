function eliminar(clave) {

    var tokenStorage = localStorage.getItem("token");

    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = {
        action: "delete",
        dni: clave,
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

            if(!response.success){

                Swal.fire({
                    icon: "error",
                    title: "Tu sesión expiró o no iniciaste sesión",
                    showConfirmButton: false,
                    timer: 2000,
                    willClose: () => {
                        window.location.replace("../views/login.html");
                    }
                });

            }

            if (response.data.success) {

                Swal.fire({
                    title: response.data.msg,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#4CAF50'
                }).then((result) => {
                    if (result.isConfirmed) {
                        entablar('', obtenerValorInput(), obtenerValorInput2(), obtenerPlaceholder());
                    }
                });

            } else {

                if (response.msg != null) {
                    var message = 'Hubo un error al intentar eliminar, debido a la estructura de la base de datos';
                } else {
                    var message = response.data.msg;
                }

                Swal.fire({
                    title: message,
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

function confirmarEliminar(dni) {

    Swal.fire({
        title: "¿Estás seguro?, se borrará el profesor con el dni, " + dni,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: "#e53935",
        confirmButtonText: "Si, lo quiero eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar(dni);
        }
    });

}

function eliminarUser(clave) {

    var tokenStorage = localStorage.getItem("token");

    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "delete",
        nombre: clave,
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

            if(!response.success){

                Swal.fire({
                    icon: "error",
                    title: "Tu sesión expiró o no iniciaste sesión",
                    showConfirmButton: false,
                    timer: 2000,
                    willClose: () => {
                        window.location.replace("../views/login.html");
                    }
                });

            }

            if (response.data.success) {

                Swal.fire({
                    title: response.data.msg,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#4CAF50'
                }).then((result) => {
                    if (result.isConfirmed) {
                        usuarios();
                    }
                });

            } else {

                Swal.fire({
                    title: response.data.msg,
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

function confirmarEliminarUser(nombre) {
    Swal.fire({
        title: "¿Estás seguro de querer eliminar a " + nombre + "?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: "#e53935",
        confirmButtonText: "Si, lo quiero eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarUser(nombre);
        }
    });

}

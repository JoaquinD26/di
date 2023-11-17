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
            console.log(clave);
            alert(response.data);
            entablar('', obtenerValorInput(), obtenerValorInput2(), obtenerPlaceholder());
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

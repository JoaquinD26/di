function eliminar(clave) {
    
    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = {
        action: "delete",
        dni: clave
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
            alert(response.msg);
            entablar('', obtenerValorInput(), obtenerValorInput2(), obtenerPlaceholder());
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

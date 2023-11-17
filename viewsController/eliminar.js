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
            alert(response.msg);
            entablar('', obtenerValorInput(), obtenerValorInput2(), obtenerPlaceholder());
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function confirmarEliminar(dni){
    // Muestra un cuadro de diálogo con "Aceptar" y "Cancelar"
  var confirmacion = confirm("¿Estás seguro de que deseas eliminar?");

  // Si el usuario hace clic en "Aceptar", ejecuta la función eliminar
  if (confirmacion) {
    eliminar(dni);
  } else {
    // Si el usuario hace clic en "Cancelar", puedes agregar código para revertir cambios o simplemente no hacer nada
    alert("Eliminación cancelada");
  }

}

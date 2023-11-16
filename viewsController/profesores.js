function getProfesores(departamentoN) {
    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = { action: "get", departamento: departamentoN };
    console.log("Valor del departamento seleccionado:", departamentoN); // Verificar el valor del departamento

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then(function (response) {
            var p = document.getElementById("msg");
            var select = document.getElementById("profesores");
            select.innerHTML = '';
            var nulloption = document.createElement('option');
            nulloption.innerHTML = '  --seleccionar--  ';
            select.appendChild(nulloption);

            p.innerHTML = response.msg;

            for (var i = 0; i < response.data.length; i++) {
                var option = document.createElement('option');
                option.value = response.data[i].DNI; // Accede directamente a response.data
                option.innerHTML = response.data[i].NOMBRE; // Accede directamente a response.data
                select.appendChild(option);
            }
        })
        .catch((error) => console.error("Error:", error)); // Añade una captura de error al final del flujo de promesa
}


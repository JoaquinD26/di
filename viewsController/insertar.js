function insertar(campo1, campo2, campo3) {
    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = {
        action: "insert",
        dni: campo1,
        nombre: campo2,
        depto: campo3
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
            console.log(response);

            if (response.success) {
                window.location.replace("../views/tabla.html");
                alert(response.msg);

            } else {


                var prefixes = [
                    "SQLSTATE[45000]: <<Unknown error>>: 1644 ",
                    "SQLSTATE[23000]: Integrity constraint violation: 1062 "
                ];

                for (var prefix of prefixes) {
                    if (response.msg.includes(prefix)) {
                        clean_message = response.msg.replace(prefix, '');
                    }
                }

                alert(clean_message);
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

function validarDatos() {
    var dni = document.getElementById('dni').value;
    var nombre = document.getElementById('nombre').value;
    var codigoDepartamento = document.getElementById('codigo_departamento').value;

    console.log(dni);
    console.log(nombre);
    console.log(codigoDepartamento);

    if (dni.trim() === '' || nombre.trim() === '' || codigoDepartamento.trim() === '') {
        alert('Por favor, complete todos los campos antes de enviar el formulario.');
    } else {
        insertar(dni, nombre, codigoDepartamento);
    }
}


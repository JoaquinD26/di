function entablar(opcion, filtros, filtros2, pagina, paginaA) {

    var tokenStorage = localStorage.getItem("token");

    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = {
        action: "list",
        opcion: opcion,
        filtros: filtros,
        filtros2: filtros2,
        pagina: pagina,
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


            var table = document.getElementById("myTable");

            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            var infoBox = document.getElementById('infoBox');
            if (!infoBox) {
                infoBox = document.createElement('div');
                infoBox.id = 'infoBox';
                infoBox.style.position = 'absolute';
                infoBox.style.top = '10px';
                infoBox.style.right = '10px';
                document.body.appendChild(infoBox);
            }

            var lastPageNumber = response.pagina.ultimaPag;
            var totalRegistros = response.pagina.totalRegistros;

            infoBox.innerText = `Última página: ${lastPageNumber}, Registros: ${totalRegistros}`;

            var comment = document.createElement('p');
            comment.innerText = `Al introducir un valor mayor al numero de paginas, 
            en este caso ${lastPageNumber}, irá a la ultima página`;
            infoBox.appendChild(comment);

            var input = document.getElementById('InputPage');
            input.style.pointerEvents = 'none';
            paginaActual(response.data.pagina, paginaA);

            for (var i = 0; i < response.data.Dregistros.length; i++) {
                var tr = document.createElement('tr');
                tr.setAttribute('id', [i]);
                tr.setAttribute('value', response.data.Dregistros[i].DNI);
                var tdNombre = document.createElement('td');
                var tdDepartamento = document.createElement('td');
                var tdDireccion = document.createElement('td');
                var tdLocalidad = document.createElement('td');
                var tdProvincia = document.createElement('td');
                var tdFechaInicio = document.createElement('td');
                var tdButtonEditar = document.createElement('td');
                var tdButtonEliminar = document.createElement('td');

                tdNombre.textContent = response.data.Dregistros[i].NOMBRE;
                tdDepartamento.textContent = response.data.Dregistros[i].ID_DEPARTAMENTO;
                tdDireccion.textContent = response.data.Dregistros[i].DIRECCION;
                tdLocalidad.textContent = response.data.Dregistros[i].LOCALIDAD;
                tdProvincia.textContent = response.data.Dregistros[i].PROVINCIA;
                tdFechaInicio.textContent = response.data.Dregistros[i].FECHA_INGRESO;

                var editarButton = document.createElement('button');
                var editarIcon = document.createElement('i');
                editarIcon.classList.add('fas', 'fa-pencil-alt');
                editarButton.appendChild(editarIcon);
                editarButton.setAttribute('onclick',
                    "toggleEditMode(this)");


                var eliminarButton = document.createElement('button');
                var eliminarIcon = document.createElement('i');
                eliminarIcon.classList.add('fas', 'fa-trash');
                eliminarButton.appendChild(eliminarIcon);
                eliminarButton.setAttribute('id', 'eliminar');
                eliminarButton.setAttribute('onclick', "confirmarEliminar(this.parentNode.parentNode.getAttribute('value'));");

                tdButtonEditar.appendChild(editarButton);
                tdButtonEliminar.appendChild(eliminarButton);

                tr.appendChild(tdNombre);
                tr.appendChild(tdDepartamento);
                tr.appendChild(tdDireccion);
                tr.appendChild(tdLocalidad);
                tr.appendChild(tdProvincia);
                tr.appendChild(tdFechaInicio);
                tr.appendChild(tdButtonEditar);
                tr.appendChild(tdButtonEliminar);


                table.appendChild(tr);
            }


        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
            Swal.fire({
                icon: "error",
                title: "Tu sesión expiró o no iniciaste sesión",
                showConfirmButton: false,
                timer: 2000,
                willClose: () => {
                    window.location.replace("../views/login.html");
                }
            });
        });

}

function borrarFiltros() {
    var i = document.getElementById('myInput');
    var i2 = document.getElementById('myInput2');
    var ip = document.getElementById('InputPage');

    i.value = '';
    i2.value = '';

    ip.value = '';
    ip.placeholder = 1;

    entablar('', '', '', 1, 1);

}


function soloNumeros(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function paginaActual(pag, none) {
    var borrarFiltros = document.getElementById('borrarFiltrosButton');
    borrarFiltros.disabled = true;
    var input = document.getElementById('InputPage');
    input.placeholder = '';

    var tiempoEspera = 1000; // Establece el tiempo de espera en 5 segundos (puedes ajustar esto según sea necesario)
    var temporizador;
    var tiempoEsperaClic = 10000; // Establece el tiempo de espera para el clic en 10 segundos (puedes ajustar esto según sea necesario)
    var clickTimer;

    if (pag !== '') {
        input.placeholder = pag;
    } else {
        input.placeholder = none;
    }

    function iniciarTemporizador() {
        temporizador = setTimeout(function () {

            input.value = '';
            borrarFiltros.disabled = false;
            input.blur();
            input.style.pointerEvents = 'auto';

        }, tiempoEspera);
    }

    input.addEventListener('keyup', function () {
        clearTimeout(temporizador);
        temporizador = 1000;
        iniciarTemporizador();
    });

    input.addEventListener('click', function (e) {
        clearTimeout(clickTimer);
        if (e.detail === 1) {
            clickTimer = setTimeout(function () {
                temporizador = 1000;
            }, tiempoEsperaClic);
        }
    });

    // Inicia el temporizador después de configurar los event listeners
    // Esto evita que el temporizador se active inmediatamente al cargar la página
    iniciarTemporizador();

}

function obtenerValorInput() {
    return document.getElementById('myInput').value;
}

function obtenerValorInput2() {
    return document.getElementById('myInput2').value;
}

function obtenerPlaceholder() {
    return document.getElementById('InputPage').placeholder;
}





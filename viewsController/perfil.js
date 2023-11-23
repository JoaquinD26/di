function datosPerfil() {

    var tokenStorage = localStorage.getItem("token");

    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "get",
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
 
            var nombre = document.getElementById('nombre');
            nombre.innerText = 'Bienvenido, ' + response.data.nombre;
            var nombre2 = document.getElementById('nombre2');
            nombre2.innerHTML = '<strong>Nombre: </strong>' + response.data.nombre;
            var token = document.getElementById('token');
            token.innerHTML = '<strong>Expiración Sesión: </strong>' + response.data.token_expiracion;
            var permisos = document.getElementById('permisos');
            permisos.innerHTML = '<strong>Permisos: </strong>' + response.data.permisosAdmin;


        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function usuarios() {

    var tokenStorage = localStorage.getItem("token");

    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "list",
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

            for (var i = 0; i < response.data.length; i++) {
                var tr = document.createElement('tr');
                tr.setAttribute('id', [i]);
                tr.setAttribute('value', response.data[i].nombre);
                var tdNombre = document.createElement('td');
                var tdExpiracion = document.createElement('td');
                var tdAdmin = document.createElement('td');
                var tdButtonEditar = document.createElement('td');
                var tdButtonEliminar = document.createElement('td');

            
                tdNombre.textContent = response.data[i].nombre;
                if (response.data[i].token_expiracion){

                    tdExpiracion.textContent = response.data[i].token_expiracion;

                }else{

                    tdExpiracion.textContent = 'Nunca ha iniciado sesión';


                }
                tdAdmin.textContent = response.data[i].permisosAdmin;
               
            
                var editarButton = document.createElement('button');
                var editarIcon = document.createElement('i');
                editarIcon.classList.add('fas', 'fa-pencil-alt');
                editarButton.appendChild(editarIcon);
                editarButton.setAttribute('onclick', 
                "toggleEditModeUser(this)");

                var eliminarButton = document.createElement('button');
                var eliminarIcon = document.createElement('i');
                eliminarIcon.classList.add('fas', 'fa-trash');
                eliminarButton.appendChild(eliminarIcon);
                eliminarButton.setAttribute('id', 'eliminar');
                eliminarButton.setAttribute('onclick', "confirmarEliminarUser(this.parentNode.parentNode.getAttribute('value'));");

                tdButtonEditar.appendChild(editarButton);
                tdButtonEliminar.appendChild(eliminarButton);
            
                tr.appendChild(tdNombre);
                tr.appendChild(tdExpiracion);
                tr.appendChild(tdAdmin);
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
                willClose: () => {
                    window.location.replace("../views/login.html");
                }
            });
        });
}




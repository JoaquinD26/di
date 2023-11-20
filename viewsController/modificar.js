function modificar(clave, campo2, campo3, campo4, campo5, campo6) {
    var tokenStorage = localStorage.getItem("token");
    var url = "http://localhost/di/sw/profesores_sw.php";
    var data = {
        action: "update",
        dni: clave,
        nombre: campo2,
        depto: campo3,
        direccion: campo4,
        localidad: campo5,
        provincia: campo6,
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
                var clean_message = response.data.msg;

                var prefixes = [
                    "SQLSTATE[45000]: <<Unknown error>>: 1644 ",
                    "SQLSTATE[23000]: Integrity constraint violation: 1062 "
                ];
    
                for (var prefix of prefixes) {
                    if (response.data.msg.includes(prefix)) {
                        clean_message = response.data.msg.replace(prefix, '');
                    }
                }

                Swal.fire({
                    title: clean_message,
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#e53935'
                    
                }).then((result) => {
                    if (result.isConfirmed) {
                        entablar('', obtenerValorInput(), obtenerValorInput2(), obtenerPlaceholder());
                    }
                });

            }
            
        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}

function toggleEditMode(button) {
    cargarPagina();
    var tr = button.parentNode.parentNode;
    var tds = tr.getElementsByTagName('td');
    var isEditMode = tr.classList.contains('editMode');

    if (isEditMode) {

        var clave = tr.getAttribute('value');
        var nombre = tds[0].textContent;
        var departamento = tds[1].textContent;
        var direccion = tds[2].textContent;
        var localidad = tds[3].textContent;
        var provincia = tds[4].textContent;

        var originalNombre = tr.getAttribute('data-original-nombre'); // Obtén el valor original del nombre
        var originalDepartamento = tr.getAttribute('data-original-departamento'); // Obtén el valor original del departamento
        var originalDireccion = tr.getAttribute('data-original-direccion');
        var originalLocalidad = tr.getAttribute('data-original-localidad');
        var originalProvincia = tr.getAttribute('data-original-provincia');

        // Verifica si se han realizado cambios en los campos antes de ejecutar las funciones
        if (nombre !== originalNombre
            || departamento !== originalDepartamento
            || direccion !== originalDireccion
            || localidad !== originalLocalidad
            || provincia !== originalProvincia) {

            modificar(clave, nombre, departamento, direccion, localidad, provincia);

        }

        tr.classList.remove('editMode');
        button.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        // Deshabilita edición
        tds[0].setAttribute('contenteditable', 'false');
        tds[1].setAttribute('contenteditable', 'false');
        tds[2].setAttribute('contenteditable', 'false');
        tds[3].setAttribute('contenteditable', 'false');
        tds[4].setAttribute('contenteditable', 'false');
    } else {
        tr.classList.add('editMode');
        button.innerHTML = 'Guardar';
        // Habilita la edición
        tds[0].setAttribute('contenteditable', 'true');
        tds[1].setAttribute('contenteditable', 'true');
        tds[2].setAttribute('contenteditable', 'true');
        tds[3].setAttribute('contenteditable', 'true');
        tds[4].setAttribute('contenteditable', 'true');

        // Al entrar en el modo de edición, actualiza los valores originales
        tr.setAttribute('data-original-nombre', tds[0].textContent);
        tr.setAttribute('data-original-departamento', tds[1].textContent);
        tr.setAttribute('data-original-direccion', tds[2].textContent);
        tr.setAttribute('data-original-localidad', tds[3].textContent);
        tr.setAttribute('data-original-provincia', tds[4].textContent);
    }
}

function modificarUser(clave, campo) {
    var tokenStorage = localStorage.getItem("token");
    var url = "http://localhost/di/sw/usuario_sw.php";
    var data = {
        action: "update",
        nombre: clave,
        permisos: campo,
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
                    
                }).then((result) => {
                    if (result.isConfirmed) {
                        usuarios();
                    }
                });

            }

        })
        .catch(function (error) {
            console.error('Error al procesar la solicitud:', error);
        });
}


function toggleEditModeUser(button) {
    cargarPagina();
    var tr = button.parentNode.parentNode;
    var tds = tr.getElementsByTagName('td');
    var isEditMode = tr.classList.contains('editMode');

    if (isEditMode) {

        var clave = tr.getAttribute('value');
        var Admin = tds[2].textContent;

        var original = tr.getAttribute('data-original-Admin');

        // Verifica si se han realizado cambios en los campos antes de ejecutar las funciones
        if (Admin !== original) {

            if(Admin == 1 || Admin == 0){

                modificarUser(clave, Admin);
    
            }else{
                Swal.fire({
                    title: 'Tiene que ser 0 o 1',
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#e53935'
                    
                }).then((result) => {
                    if (result.isConfirmed) {
                        usuarios();
                    }
                });
            }

           
        }

        tr.classList.remove('editMode');
        button.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        // Deshabilita edición
        tds[2].setAttribute('contenteditable', 'false');
    } else {
        tr.classList.add('editMode');
        button.innerHTML = 'Guardar';
        // Habilita la edición
        tds[2].setAttribute('contenteditable', 'true');

        // Al entrar en el modo de edición, actualiza los valores originales
        tr.setAttribute('data-original-Admin', tds[2].textContent);
    }
}


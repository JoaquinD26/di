function getDepartamentos() {
    // Carga de Departamentos
    var url = "http://localhost/di/sw/departamento_sw.php";
    var data = { action: "get" };
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.text(); // Use text() instead of json()
        })
        .then((text) => {
            try {
                console.log(text);
                var response = JSON.parse(text); // Parse the text if it's JSON
                var p = document.getElementById("msg");
                var select = document.getElementById("departamentos");
                p.innerHTML = response.msg;
                for (var i = 0; i < response.data.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = response.data[i].CODIGO;
                    opt.innerHTML = response.data[i].NOMBRE;
                    select.appendChild(opt);
                }
            } catch (error) {
                console.error("Error in processing response:", error);
                // Handle the error here or throw it to stop the execution.
                throw error;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            // Handle the error here
        });

}
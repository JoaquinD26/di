<?php
require_once('../models/usuario.php');
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$json = json_encode(array()); 

$nombre = isset($data["nombre"]) ? $data["nombre"] : null;
$contrasenna = isset($data["contrasenna"]) ? $data["contrasenna"] : null;
$tokenStorage = isset($data["tokenStorage"]) ? $data["tokenStorage"] : null;
$permisos = isset($data["permisos"]) ? $data["permisos"] : null;
$tokenStorage = isset($data["tokenStorage"]) ? $data["tokenStorage"] : null;
$usuario = new Usuario($nombre, $contrasenna, $tokenStorage, $permisos);
$verificacion = $usuario->verificarTokenEnBD('jomeishion');



if (isset($data["action"])) {
    $action = $data["action"];
    
    try {

        switch ($action) {
            case "registrar":
                $json = json_encode(array(
                    "msg"=>'Se ha registrado correctamente',
                    "success"=>true,
                    "data"=> $usuario->registrar()
                ));
            break;
            case "iniciar":
                
                $clave = $usuario->iniciar();

                if ($clave !== 'error') {
            
                    $existingToken = $usuario->obtenerTokenValido();
            
                    if ($existingToken) {
                        // Si hay un token válido, reutilizarlo
                        $token = $existingToken;
                       
                    } else {
                        // Si no hay un token válido, generar uno nuevo
                        $token = $usuario->generarToken('jomeishion');
            
                        // Almacenar el nuevo token en la base de datos
                        $usuario->almacenarTokenEnBaseDeDatos($token);
                    }
            
                    // Devolver el token como parte de la respuesta JSON
                    $json = json_encode(array(
                        "msg" => 'Usuario reconocido, Bienvenido '.$nombre,
                        "success" => true,
                        "data" => $token
                    ));

                } else {
                    // Autenticación fallida
                    $json = json_encode(array(
                        "msg" => 'Usuario no reconocido, vuelva a intentarlo',
                        "success" => false,
                        "data" => null
                    ));
                }
            break;
            case "list":
                if (!$verificacion) {
                    exit();
                }
                $json = json_encode(array(
                    "msg" => "Listado de Usuarios",
                    "success" => true,
                    "data" => Usuario::list($tokenStorage)
                ));
            break;
            case "get":
                if (!$verificacion) {
                    exit();
                }
                $json = json_encode(array(
                    "msg" => "Listado de Usuarios",
                    "success" => true,
                    "data" => Usuario::getUser($tokenStorage)
                ));
            break;
            case "update":
                if (!$verificacion) {
                    exit();
                }
                $json = json_encode(array(
                    "data" => $usuario->modificar()
                ));
            break;
            case "delete":
                if (!$verificacion) {
                    exit();
                }
                $json = json_encode(array(
                    "data" => $usuario->eliminar()
                ));
            break;
            case "numeroUsuarios":
                $json = json_encode(array(
                    "success" => true,
                    "data" => Usuario::numeroUsuarios()
                ));
            break;
            
            
        }

    } catch (Exception $exception) {
        $json = json_encode(array(
            "msg"=>$exception->getMessage(),
            "success"=>false,
            "data"=> array()
        ));
    }
}

echo $json;
?>

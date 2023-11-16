<?php
require_once('../models/usuario.php');
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$json = json_encode(array()); 

$nombre = isset($data["nombre"]) ? $data["nombre"] : null;
$contrasenna = isset($data["contrasenna"]) ? $data["contrasenna"] : null;
$tokenStorage = isset($data["tokenStorage"]) ? $data["tokenStorage"] : null;

$usuario = new Usuario($nombre, $contrasenna, $tokenStorage);

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
            case "verificar":
                $json = json_encode(array(
                    "msg"=>'Verificación correcta',
                    "success"=>true,
                    "data"=> $usuario->verificarTokenEnBD('jomeishion')
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
                        "msg" => 'Se inició sesión correctamente',
                        "success" => true,
                        "data" => $token
                    ));

                } else {
                    // Autenticación fallida
                    $json = json_encode(array(
                        "msg" => 'Inicio de sesión incorrecto, vuelva a intentarlo',
                        "success" => false,
                        "data" => null
                    ));
                }
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

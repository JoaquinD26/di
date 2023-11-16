<?php
require_once('../models/profesores.php');
header('Content-Type: application/json; charset=utf-8');


$data = json_decode(file_get_contents('php://input'), true);
$action = isset($data["action"]) ? $data["action"] : null;
$departamento = isset($data["departamento"]) ? $data["departamento"] : null;

$filtros = isset($data["filtros"]) ? $data["filtros"] : null;
$filtros2 = isset($data["filtros2"]) ? $data["filtros2"] : null;
$pagina = isset($data["pagina"]) ? $data["pagina"] : null;
$opcion = isset($data["opcion"]) ? $data["opcion"] : null;

$dni = isset($data["dni"]) ? $data["dni"] : null;
$nombre = isset($data["nombre"]) ? $data["nombre"] : null;
$depto = isset($data["depto"]) ? $data["depto"] : null;

$profesor = new Profesor($dni, $nombre, $depto);

$json = json_encode(array());
try {

    switch ($action) {
        case "get":
            $json = json_encode(array(
                "msg" => "Listado de profesores del departamento",
                "success" => true,
                "data" => Profesor::getProfesoresDpto($departamento)
            ));
            break;
        case "list":
            $json = json_encode(array(
                "msg" => "Listado de profesores",
                "success" => true,
                "data" => Profesor::getProfesores($opcion, $filtros, $filtros2, $pagina),
                "pagina" => Profesor::getInfo($filtros, $filtros2)
            ));
            break;
        case "insert":
            $json = json_encode(array(
                "msg" => "Se ha añadido un nuevo profesor",
                "success" => true,
                "data"=> $profesor->insertar()
            ));
            break;
        case "update":
            $json = json_encode(array(
                "msg" => "Se ha modificado profesor",
                "success" => true,
                "data" => $profesor->modificar()
            ));
            break;
        case "delete":
            $json = json_encode(array(
                "msg" => "Se ha eliminado un profesor",
                "success" => true,
                "data" => $profesor->eliminar()
            ));
            break;
        }
} catch (Exception $exception) {
    $json = json_encode(array(
        "msg" => $exception->getMessage(),
        "success" => false,
        "data" => array()
    ));
}
echo $json;
?>
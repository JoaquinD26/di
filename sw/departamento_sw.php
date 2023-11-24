<?php

require_once('../models/Departamento.php');
header('Content-Type: application/json; charset=utf-8');



$data = json_decode(file_get_contents('php://input'), true);
$json = json_encode(array()); 

if (isset($data["action"])) {
    $action = $data["action"];
    
    try {
        switch ($action) {
            case "get":
                $json = json_encode(array(
                    "msg"=>"Listado de departamentos",
                    "success"=>true,
                    "data"=> Departamento::getDepartamentos()
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

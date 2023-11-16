<?php
require_once ('../models/BD.php');
class Departamento {

    private $codigo;
    private $nombre;
    private $Data = array();

    public function __construct($codigo, $nombre) {
         $this->codigo = $codigo;
         $this->nombre = $nombre;
    }

    public static function getDepartamentos() {
        
        $pdo = BD::getInstance();

        try {
            
            $sql = "SELECT * FROM departamento"; 
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $Data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (Exception $e) {
            // Si se produce una excepción la relanza para ser tratada en la llamada
            throw new Exception($e->getMessage(), 1);
        }

        return $Data;
        
    }
}
/*
// Crear una instancia de la clase Departamento
$departamento = new Departamento("001", "BIOLOGIA CELULAR");

// Obtener y mostrar el código del departamento
echo "Código del departamento: " . $departamento->getCodigo() . "<br>";

// Obtener y mostrar el nombre del departamento
echo "Nombre del departamento: " . $departamento->getNombre() . "<br>";
*/
?>

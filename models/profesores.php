<?php
require_once('../models/BD.php');

class Profesor
{
    public $dni;
    public $nombre;
    public $codigo_departamento;
    public $direccion;
    public $localidad;
    public $provincia;
    public $fecha_inicio;

    // Constructor
    public function __construct($dni, $nombre, $codigo_departamento, $direccion, $localidad, $provincia, $fecha_inicio) {
        $this->dni = $dni;
        $this->nombre = $nombre;
        $this->codigo_departamento = $codigo_departamento;
        $this->direccion = $direccion;
        $this->localidad = $localidad;
        $this->provincia = $provincia;
        $this->fecha_inicio = $fecha_inicio;
    }

    // Getter para el DNI
    public function getDni() {
        return $this->dni;
    }

    // Setter para el DNI
    public function setDni($dni) {
        $this->dni = $dni;
    }

    // Getter para el nombre
    public function getNombre() {
        return $this->nombre;
    }

    // Setter para el nombre
    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    // Getter para el código del departamento
    public function getCodigoDepartamento() {
        return $this->codigo_departamento;
    }

    // Setter para el código del departamento
    public function setCodigoDepartamento($codigo_departamento) {
        $this->codigo_departamento = $codigo_departamento;
    }

    public static function getProfesoresDpto($departamentoId)
    {
        $pdo = BD::getInstance();

        try {
            $sql = "SELECT * FROM profesor WHERE id_departamento = :departamento";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':departamento', $departamentoId);
            $stmt->execute();
            $Data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }

        return $Data;
    }

    public static function getProfesores($Opcion, $filtrosP, $filtrosP2, $PaginaP)
    {
        $pdo = BD::getInstance();

        
        if (empty($filtrosP) && empty($filtrosP2)) {
            $filtrosQ = '%';
            $filtrosQ2 = '%';
        } elseif (empty($filtrosP)) {
            $filtrosQ = '';
            $filtrosQ2 = '%' . $filtrosP2 . '%';
        } elseif (empty($filtrosP2)) {
            $filtrosQ = '%' . $filtrosP . '%';
            $filtrosQ2 = '';
        } else {
            $filtrosQ = '%' . $filtrosP . '%';
            $filtrosQ2 = '%' . $filtrosP2 . '%';
        }
        
        $result1 = array();

        $Info = self::getInfo($filtrosQ, $filtrosQ2);
        $numRegistrosPorPagina = $Info['numRegistrosPorPagina'];
        $UltimaP = $Info['ultimaPag'];

        switch ($Opcion) {
            case 'primera':
                $PaginaP = 1;
                break;
            case 'anterior':
                if ($PaginaP > 1) {
                    $PaginaP = $PaginaP - 1;
                }
                break;
            case 'siguiente':
                if ($PaginaP < $UltimaP) {
                    $PaginaP = $PaginaP + 1;
                }
                break;
            case 'ultima':
                $PaginaP = $UltimaP;
                break;
        }

         if ($PaginaP > $UltimaP){
 
                $PaginaP = $UltimaP;
                
            }
            else if ($PaginaP < 1){

               $PaginaP = 1;

            }

            $PaginaQ = ($PaginaP - 1) * $numRegistrosPorPagina;

        try {

                $sql = "SELECT * 
                FROM profesor 
                where (nombre like :filtros or id_departamento like :filtros)
                or (nombre like :filtros2 or id_departamento like :filtros2)
                limit :pagina, :registros";

                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':filtros', $filtrosQ);
                $stmt->bindParam(':filtros2', $filtrosQ2);
                $stmt->bindParam(':pagina', $PaginaQ, PDO::PARAM_INT);
                $stmt->bindParam(':registros', $numRegistrosPorPagina, PDO::PARAM_INT);
                $stmt->execute();
                $Data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }


        $result1['Dregistros'] = $Data;
        $result1['pagina'] = $PaginaP;

        return $result1;
    }

    public static function getInfo($filtrosP, $filtrosP2)
    {
        $pdo = BD::getInstance();

        if (empty($filtrosP) && empty($filtrosP2)) {
            $filtrosQ = '%';
            $filtrosQ2 = '%';
        } elseif (empty($filtrosP)) {
            $filtrosQ = '';
            $filtrosQ2 = '%' . $filtrosP2 . '%';
        } elseif (empty($filtrosP2)) {
            $filtrosQ = '%' . $filtrosP . '%';
            $filtrosQ2 = '';
        } else {
            $filtrosQ = '%' . $filtrosP . '%';
            $filtrosQ2 = '%' . $filtrosP2 . '%';
        }
        
        $result = array();

        try {
            $sql2 = "SELECT count(*) as total 
            FROM profesor 
            where (nombre like :filtros or id_departamento like :filtros)
            or (nombre like :filtros2 or id_departamento like :filtros2)";

            $stmt = $pdo->prepare($sql2);
            $stmt->bindParam(':filtros', $filtrosQ);
            $stmt->bindParam(':filtros2', $filtrosQ2);
            $stmt->execute();
            $registros = $stmt->fetch(PDO::FETCH_ASSOC);
            $totalRegistros = $registros['total'];
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }

        /*
        if ($totalRegistros % 7 == 0) {
            $numRegistrosPorPagina = 7;
        } elseif ($totalRegistros % 5 == 0) {
            $numRegistrosPorPagina = 5;
        } elseif ($totalRegistros % 3 == 0) {
            $numRegistrosPorPagina = 3;
        } elseif ($totalRegistros % 2 == 0) {
            $numRegistrosPorPagina = 2;
        } else {
            $numRegistrosPorPagina = 1;
        }
        */

        $numRegistrosPorPagina = 10;

        $UltimaP = ceil($totalRegistros / $numRegistrosPorPagina);

        $result['totalRegistros'] = $totalRegistros;
        $result['numRegistrosPorPagina'] = $numRegistrosPorPagina;
        $result['ultimaPag'] = $UltimaP;
    
        return $result;
    }

    public function insertar() {
        $pdo = BD::getInstance();
        try {

            $currentDateTime = new DateTime();
            $expDateTime = new DateTime($this->fecha_inicio);

            // Se agrega un profesor despues de haber ingresado or lo tanto la fecha_ingreso que van a introducir al añadirle 
            // siempre será menor que la actual, es decir, siempre va a ser una fecha ya pasada.

            if ($currentDateTime > $expDateTime) { 

            $sql = "INSERT INTO profesor (DNI, NOMBRE, ID_DEPARTAMENTO, DIRECCION, LOCALIDAD, PROVINCIA, FECHA_INGRESO) 
            VALUES (:dni, :nombre, :codigo_departamento, :direccion, :localidad, :provincia, :fecha_inicio)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':dni', $this->dni);
            $stmt->bindParam(':nombre', $this->nombre);
            $stmt->bindParam(':codigo_departamento', $this->codigo_departamento);
            $stmt->bindParam(':direccion', $this->direccion);
            $stmt->bindParam(':localidad', $this->localidad);
            $stmt->bindParam(':provincia', $this->provincia);
            $stmt->bindParam(':fecha_inicio', $this->fecha_inicio);
            
            $stmt->execute();

            $result = true;

            }else{
               $result = false;
            }
           

        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
        return $result;
    }

    public function eliminar() {
        $pdo = BD::getInstance();
        try {
            $sql = "DELETE FROM profesor WHERE dni = :dni";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':dni', $this->dni);
            $stmt->execute();
           

        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
    }

    public function modificar() {
        $pdo = BD::getInstance();
        try {
    
            $sql = "UPDATE profesor 
            SET NOMBRE = :nombre, ID_DEPARTAMENTO = :codigo_departamento, 
            DIRECCION = :direccion, 
            LOCALIDAD = :localidad, 
            PROVINCIA = :provincia WHERE dni = :dni";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':dni', $this->dni);
            $stmt->bindParam(':nombre', $this->nombre);
            $stmt->bindParam(':codigo_departamento', $this->codigo_departamento);
            $stmt->bindParam(':direccion', $this->direccion);
            $stmt->bindParam(':localidad', $this->localidad);
            $stmt->bindParam(':provincia', $this->provincia);
            $stmt->execute();

            
           return 'Se modificó perfectamente';
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
    }
    


}
?>

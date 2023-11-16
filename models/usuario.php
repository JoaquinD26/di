<?php
require_once('../models/BD.php');
require '../vendor/autoload.php';

use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\ValidAt;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;
use Lcobucci\Clock\SystemClock;


class Usuario {

    private $nombre;
    private $contrasenna;
    private $tokenStorage;

    public function __construct($nombre, $contrasenna, $tokenStorage) {
        $this->nombre = $nombre;
        $this->contrasenna = $contrasenna;
        $this->tokenStorage = $tokenStorage;
    }

    public function registrar()
    {
        // Encriptar la contraseña con bcrypt
        $hashedPassword = password_hash($this->contrasenna, PASSWORD_BCRYPT);
    
        $pdo = BD::getInstance();

        $result = '';
    
        try {
            // Verificar si el usuario ya existe
            $sql = "SELECT nombre FROM usuario WHERE nombre = :nombre";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nombre', $this->nombre);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($data) {

                $result = 'El usuario ya existe';

            } elseif($this->nombre == null) {

                $result = 'El usuario no puede estar vacio';

            }else{
                    // Insertar el nuevo usuario en la base de datos
                    $sql2 = "INSERT INTO usuario (nombre, contrasenna) VALUES (:nombre, :contrasenna)";
                    $stmt = $pdo->prepare($sql2);
                    $stmt->bindParam(':nombre', $this->nombre);
                    $stmt->bindParam(':contrasenna', $hashedPassword);
                    $stmt->execute();

                    $result = 'El usuario se registro correctamente';
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }

        return $result;
    }
    
    public function iniciar()
    {
        $result2 = 'error';
        $pdo = BD::getInstance();
    
        try {

            $sqlGetHash = "SELECT contrasenna FROM usuario WHERE nombre = :nombre";
            $stmtGetHash = $pdo->prepare($sqlGetHash);
            $stmtGetHash->bindParam(':nombre', $this->nombre);
            $stmtGetHash->execute();
            $hash = $stmtGetHash->fetchColumn();
    
            if (password_verify($this->contrasenna, $hash)) {

                $result2 = $hash;

            }

        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
    
        return $result2;
    }

    
function obtenerTokenValido() {
    $pdo = BD::getInstance();

    try {
        $sql = "SELECT token FROM usuario WHERE nombre = :nombre AND token IS NOT NULL AND token_expiracion > NOW()";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->execute();
        return $stmt->fetchColumn();
    } catch (Exception $e) {
        throw new Exception($e->getMessage(), 1);
    }
}

function almacenarTokenEnBaseDeDatos($token) {
    $pdo = BD::getInstance();

    try {

        $sql = "UPDATE usuario
        SET token = :token, token_expiracion = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
        WHERE nombre = :nombre";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

    } catch (Exception $e) {
        throw new Exception($e->getMessage(), 1);
    }
}

function generarToken($secretKey, $expiration = 900) {
    // Crea un objeto Key a partir de la cadena de clave
    $key = InMemory::base64Encoded($secretKey);

    // Configuración del token
    $config = Configuration::forSymmetricSigner(new Sha256(), $key);
    $builder = $config->builder();

    // Configuración del contenido del token
    $builder
        ->issuedBy('tu_issuer')
        ->permittedFor('tu_audience')
        ->identifiedBy($this->nombre)
        ->issuedAt(new \DateTimeImmutable())
        ->expiresAt(new \DateTimeImmutable('+ ' . $expiration . ' seconds'));

    // Genera el token
    $token = $builder->getToken($config->signer(), $config->signingKey())->toString();

    return $token;
}


function verificarTokenEnBD($secretKey) {
    $pdo = BD::getInstance();
    $result3 = false;

    try {
        // Obtén el token y la información relacionada desde la base de datos
        $sql = "SELECT token, token_expiracion, nombre FROM usuario WHERE token = :token";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':token', $this->tokenStorage);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verifica si hay un token en la base de datos
        if ($data && isset($data['token'])) {
            $nombre = $data['nombre'];
            $exp = $data['token_expiracion'];

            $currentDateTime = new DateTime();
            $expDateTime = new DateTime($exp);

            // Verificar si el token ha expirado
            if ($currentDateTime <= $expDateTime) {

                $result3 = 'Bienvenido '.$nombre.'. Su Token expirará a las '.$expDateTime->format('H:i:s');

            }

        }

    } catch (\Exception $e) {
        // La validación falló o hubo un error en la base de datos
        return 'Error al validar el token: '.$e->getMessage();
    }

    return $result3;
}

}

?>

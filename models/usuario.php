<?php
require_once('../models/BD.php');
require '../vendor/autoload.php';

use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

class Usuario
{

    private $nombre;
    private $contrasenna;
    private $tokenStorage;
    private $permisos;

    public function __construct($nombre, $contrasenna, $tokenStorage, $permisos)
    {
        $this->nombre = $nombre;
        $this->contrasenna = $contrasenna;
        $this->tokenStorage = $tokenStorage;
        $this->permisos = $permisos;
    }

    public static function getUser($token)
    {
        $pdo = BD::getInstance();
        try {
            $sql = "SELECT nombre, token_expiracion, permisosAdmin FROM usuario WHERE token = :token";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
        return $data;
    }

    public static function list($token)
    {
        $pdo = BD::getInstance();
        try {

            $sql = "SELECT nombre, token_expiracion, permisosAdmin FROM usuario WHERE token != :token";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
        return $data;
    }

    public function eliminar()
    {
        $pdo = BD::getInstance();
        $result = array();
        try {


            $sql = "SELECT permisosAdmin FROM usuario WHERE token = :token";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':token', $this->tokenStorage);
            $stmt->execute();
            $permisos = $stmt->fetchColumn();

            if ($permisos === 1) {

                $sql = "DELETE FROM usuario WHERE nombre = :nombre";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':nombre', $this->nombre);
                $stmt->execute();

                $result = [
                    'msg' => 'Se eliminó un usuario',
                    'success' => true
                ];

            } else {

                $result = [
                    'msg' => 'No tienes permisos de administrador',
                    'success' => false
                ];
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
        return $result;
    }

    public function modificar()
    {
        $pdo = BD::getInstance();
        $result = array();
        try {


            $sql = "SELECT permisosAdmin FROM usuario WHERE token = :token";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':token', $this->tokenStorage);
            $stmt->execute();
            $permisos = $stmt->fetchColumn();

            if ($permisos === 1) {

                if ($this->permisos == 1 || $this->permisos == 0) {

                    $sql = "UPDATE usuario 
                SET permisosAdmin = :permisos WHERE nombre = :nombre";

                    $stmt = $pdo->prepare($sql);
                    $stmt->bindParam(':permisos', $this->permisos);
                    $stmt->bindParam(':nombre', $this->nombre);
                    $stmt->execute();

                    $result = [
                        'msg' => 'Se modificó correctamente',
                        'success' => true
                    ];

                } else {

                    $result = [
                        'msg' => 'Tiene que ser 0 o 1',
                        'success' => false
                    ];

                }
            } else {

                $result = [
                    'msg' => 'No tienes permisos de administrador',
                    'success' => false
                ];

            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }

        return $result;
    }

    public function registrar()
    {
        // Encriptar la contraseña con bcrypt
        $hashedPassword = password_hash($this->contrasenna, PASSWORD_BCRYPT);

        $pdo = BD::getInstance();

        $result = array();

        try {

            // Verificar si el usuario ya existe
            $sql = "SELECT nombre FROM usuario WHERE nombre = :nombre";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nombre', $this->nombre);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($data) {

                $result = [
                    'msg' => 'El usuario ya existe',
                    'success' => false
                ];

            } elseif ($this->nombre == null || $this->contrasenna == null) {

                $result = [
                    'msg' => 'El usuario o contraseña no puede estar vacio',
                    'success' => false
                ];

            } else {

                $sql = "SELECT count(*) FROM usuario";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $numeroUsuarios = $stmt->fetch(PDO::FETCH_ASSOC)['count(*)'];

                if ($numeroUsuarios < 7) {
                    // Insertar el nuevo usuario en la base de datos
                    $sql2 = "INSERT INTO usuario (nombre, contrasenna) VALUES (:nombre, :contrasenna)";
                    $stmt = $pdo->prepare($sql2);
                    $stmt->bindParam(':nombre', $this->nombre);
                    $stmt->bindParam(':contrasenna', $hashedPassword);
                    $stmt->execute();

                    $result = [
                        'msg' => 'El usuario se registró correctamente',
                        'success' => true
                    ];

                } else {
                    $result = [
                        'msg' => 'Hay un máximo de usuarios establecido por el administrador',
                        'success' => false
                    ];
                }
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

            $sql = "SELECT contrasenna FROM usuario WHERE nombre = :nombre";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nombre', $this->nombre);
            $stmt->execute();
            $hash = $stmt->fetchColumn();

            if (password_verify($this->contrasenna, $hash)) {

                $result2 = $hash;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }

        return $result2;
    }

    function obtenerTokenValido()
    {
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

    function generarToken($secretKey, $expiration = 900)
    {
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


    function almacenarTokenEnBaseDeDatos($token)
    {
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

    function verificarTokenEnBD($secretKey)
    {
        $pdo = BD::getInstance();
        $result3 = false;

        try {

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

                    $result3 = 'Bienvenido ' . $nombre . '. Su Token expirará a las ' . $expDateTime->format('H:i:s');
                }
            }
        } catch (\Exception $e) {
            return 'Error al validar el token: ' . $e->getMessage();
        }

        return $result3;
    }

    public static function numeroUsuarios()
    {
        $pdo = BD::getInstance();
        $result = '';
        try {

            $sql = "SELECT count(*) FROM usuario";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $numeroUsuarios = $stmt->fetch(PDO::FETCH_ASSOC)['count(*)'];

            if ($numeroUsuarios < 7) {

                $result = false;
            } else {

                $result = true;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 1);
        }
        return $result;
    }
}

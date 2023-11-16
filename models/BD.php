<?php
class BD {
    protected static $instance;

    static $host = "localhost";
    static $dbname = "universidad";
    static $port = "3306";
    static $user = "root";
    static $pass = "";

    public static function getInstance() {
        if(empty(self::$instance)) {
            try {
                self::$instance = new PDO("mysql:host=" . self::$host . ";dbname=" . self::$dbname . ";port=" . self::$port . ";charset=utf8", self::$user, self::$pass);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->query('SET NAMES utf8');
                self::$instance->query('SET CHARACTER SET utf8');
            } catch(PDOException $error) {
                throw new Exception("No se puede conectar a la base de datos: " . $error->getMessage());
            }
        }
        return self::$instance;
    }
}
?>

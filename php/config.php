<?php
// Конфигурация базы данных
define('DB_HOST', 'localhost');
define('DB_NAME', 'personalpostman');
define('DB_USER', 'root');
define('DB_PASS', '');

// Создание подключения к базе данных
function getDBConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("set names utf8");
        return $pdo;
    } catch(PDOException $e) {
        die("Ошибка подключения: " . $e->getMessage());
    }
}

// Создание таблиц при необходимости
function createTables($pdo) {
    // Таблица заказов
    $ordersTable = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        from_address TEXT NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        to_address TEXT NOT NULL,
        package_weight DECIMAL(5,2) NOT NULL,
        delivery_date DATE NOT NULL,
        notes TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    // Таблица партнёрских заявок
    $partnersTable = "CREATE TABLE IF NOT EXISTS partner_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $usersTable = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

    try {
        $pdo->exec($ordersTable);
        $pdo->exec($partnersTable);
        $pdo->exec($usersTable);
        
        // Создание демо пользователя admin
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = 'admin'");
        $stmt->execute();
        if ($stmt->fetchColumn() == 0) {
            $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES ('admin', ?, 'admin')");
            $stmt->execute([$hashedPassword]);
        }
        
    } catch(PDOException $e) {
        die("Ошибка создания таблиц: " . $e->getMessage());
    }
}

// Инициализация базы данных
$pdo = getDBConnection();
createTables($pdo);
?>
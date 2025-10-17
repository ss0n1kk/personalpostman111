<?php
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT id, username, email, phone, password, role FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'userId' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Неверный логин или пароль'
        ]);
    }
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка сервера: ' . $e->getMessage()
    ]);
}
?>
<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $pdo = getDBConnection();
    
    // Получение заказов
    $ordersStmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
    $orders = $ordersStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Получение партнёрских заявок
    $partnersStmt = $pdo->query("SELECT * FROM partner_applications ORDER BY created_at DESC");
    $partners = $partnersStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'orders' => $orders,
        'partners' => $partners
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при получении данных: ' . $e->getMessage()
    ]);
}
?>
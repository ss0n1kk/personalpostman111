<?php
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("INSERT INTO orders (phone, customer_name, from_address, recipient_name, to_address, package_weight, delivery_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $input['phone'],
        $input['customerName'],
        $input['fromAddress'],
        $input['recipientName'],
        $input['toAddress'],
        $input['packageWeight'],
        $input['deliveryDate'],
        $input['notes'] ?? ''
    ]);

    $orderId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'orderId' => $orderId,
        'message' => 'Заказ успешно создан'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при создании заказа: ' . $e->getMessage()
    ]);
}
?>
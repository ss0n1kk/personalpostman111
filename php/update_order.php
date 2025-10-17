<?php
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['orderId'] ?? '';
$status = $input['status'] ?? '';

if (!in_array($status, ['pending', 'approved', 'rejected'])) {
    echo json_encode(['success' => false, 'message' => 'Неверный статус']);
    exit;
}

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $orderId]);

    echo json_encode([
        'success' => true,
        'message' => 'Статус заказа обновлён'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при обновлении статуса: ' . $e->getMessage()
    ]);
}
?>
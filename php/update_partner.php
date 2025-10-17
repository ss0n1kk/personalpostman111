<?php
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$partnerId = $input['partnerId'] ?? '';
$status = $input['status'] ?? '';

if (!in_array($status, ['pending', 'approved', 'rejected'])) {
    echo json_encode(['success' => false, 'message' => 'Неверный статус']);
    exit;
}

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("UPDATE partner_applications SET status = ? WHERE id = ?");
    $stmt->execute([$status, $partnerId]);

    echo json_encode([
        'success' => true,
        'message' => 'Статус заявки обновлён'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при обновлении статуса: ' . $e->getMessage()
    ]);
}
?>
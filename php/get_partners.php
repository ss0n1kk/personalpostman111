<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->query("SELECT * FROM partner_applications ORDER BY created_at DESC");
    $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'partners' => $partners
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при получении заявок: ' . $e->getMessage()
    ]);
}
?>
<?php
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("INSERT INTO partner_applications (name, organization, phone, message) VALUES (?, ?, ?, ?)");
    
    $stmt->execute([
        $input['name'],
        $input['organization'],
        $input['phone'],
        $input['message'] ?? ''
    ]);

    $applicationId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'applicationId' => $applicationId,
        'message' => 'Заявка успешно отправлена'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при отправке заявки: ' . $e->getMessage()
    ]);
}
?>
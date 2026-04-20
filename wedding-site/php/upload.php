<?php
/**
 * Wedding Photo Upload Script for Synology NAS
 * Создаёт индивидуальную папку для каждого гостя
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Настройки
$uploadDir = '/volume1/web/wedding-photos/'; // Путь на Synology
$maxFileSize = 20 * 1024 * 1024; // 20 MB
$allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'heic', 'heif'];

// Ответ
$response = ['success' => false, 'message' => '', 'files' => []];

// Проверка метода
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Только POST запросы';
    echo json_encode($response);
    exit;
}

// Проверка имени гостя
$guestName = isset($_POST['guest_name']) ? trim($_POST['guest_name']) : '';
if (empty($guestName)) {
    $response['message'] = 'Укажите ваше имя';
    echo json_encode($response);
    exit;
}

// Санитизация имени папки
$guestFolder = preg_replace('/[^a-zA-Z0-9а-яА-ЯёЁ\s]/u', '', $guestName);
$guestFolder = str_replace(' ', '_', $guestFolder);
$guestFolder = $guestFolder . '_' . date('Ymd_His');

// Создание папки гостя
$guestPath = $uploadDir . $guestFolder . '/';
if (!file_exists($guestPath)) {
    if (!mkdir($guestPath, 0755, true)) {
        $response['message'] = 'Ошибка создания папки';
        echo json_encode($response);
        exit;
    }
}

// Создание .htaccess для защиты (если Apache)
$htaccessContent = "Options -Indexes\nDeny from all";
file_put_contents($guestPath . '.htaccess', $htaccessContent);

// Обработка файлов
if (!isset($_FILES['photos']) || empty($_FILES['photos']['name'][0])) {
    $response['message'] = 'Нет файлов для загрузки';
    echo json_encode($response);
    exit;
}

$uploadedCount = 0;
$totalFiles = count($_FILES['photos']['name']);

for ($i = 0; $i < $totalFiles; $i++) {
    $fileName = $_FILES['photos']['name'][$i];
    $fileTmp = $_FILES['photos']['tmp_name'][$i];
    $fileSize = $_FILES['photos']['size'][$i];
    $fileError = $_FILES['photos']['error'][$i];
    
    if ($fileError !== UPLOAD_ERR_OK) {
        continue;
    }
    
    // Проверка размера
    if ($fileSize > $maxFileSize) {
        continue;
    }
    
    // Проверка типа
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $fileTmp);
    finfo_close($finfo);
    
    $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    if (!in_array($mimeType, $allowedTypes) && !in_array($extension, $allowedExtensions)) {
        continue;
    }
    
    // Генерация уникального имени
    $newFileName = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
    $destination = $guestPath . $newFileName;
    
    if (move_uploaded_file($fileTmp, $destination)) {
        $uploadedCount++;
        $response['files'][] = $newFileName;
    }
}

if ($uploadedCount > 0) {
    $response['success'] = true;
    $response['message'] = "Загружено файлов: {$uploadedCount}";
    $response['folder'] = $guestFolder;
    
    // Логирование (опционально)
    $logEntry = date('Y-m-d H:i:s') . " - {$guestName} - {$uploadedCount} files\n";
    file_put_contents($uploadDir . 'upload_log.txt', $logEntry, FILE_APPEND);
} else {
    $response['message'] = 'Не удалось загрузить файлы';
}

echo json_encode($response);
?>

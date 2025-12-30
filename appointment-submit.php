<?php
// appointment-submit.php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

// Basic sanitization
$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$date    = trim($_POST['date'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
if (mb_strlen($name) < 2) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'message' => 'Name is required.']);
  exit;
}
if (mb_strlen($phone) < 7) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'message' => 'Phone is required.']);
  exit;
}
if ($service === '') {
  http_response_code(422);
  echo json_encode(['ok' => false, 'message' => 'Service is required.']);
  exit;
}

// Insert document
try {
  $doc = [
    'name' => $name,
    'phone' => $phone,
    'service' => $service,
    'preferredDate' => $date !== '' ? $date : null,
    'message' => $message !== '' ? $message : null,
    'status' => 'pending',
    'createdAt' => new MongoDB\BSON\UTCDateTime(),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
  ];

  $result = appointments_collection()->insertOne($doc);

  echo json_encode([
    'ok' => true,
    'message' => 'Appointment saved',
    'id' => (string)$result->getInsertedId()
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}

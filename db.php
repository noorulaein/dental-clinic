<?php
// db.php
require_once __DIR__ . '/vendor/autoload.php';

use MongoDB\Client;

function mongo(): Client {
  static $client = null;

  if ($client === null) {
    // Local MongoDB:
    $uri = "mongodb://127.0.0.1:27017";

    // If using MongoDB Atlas, replace with:
    // $uri = "mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority";

    $client = new Client($uri);
  }

  return $client;
}

function mongo_db() {
  // Database name
  return mongo()->selectDatabase("oral_dental_clinic");
}

function appointments_collection() {
  // Collection name
  return mongo_db()->selectCollection("appointments");
}

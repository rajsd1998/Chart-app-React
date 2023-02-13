<?php


header("Access-Control-Allow-Origin: *");


if (!$_REQUEST) {
    date_default_timezone_set('Asia/Kolkata');
    $date = date('Y-m-d', time());
    $fdate = date('Y-m-d', strtotime('-7 day', strtotime($date)));
} else {
    $fdate = $_REQUEST['fdate'];
    $date = $_REQUEST['tdate'];
}





$url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' . $fdate . '&end_date=' . $date . '&api_key=BpWNyihUZcV8wHg0tGFt6r7ttDn5gG3OUAhnzTP7';
$crl = curl_init();
curl_setopt($crl, CURLOPT_URL, $url);
curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, 0);

$response = json_decode(curl_exec($crl), true);
if (!$response) {
    die('Error: "' . curl_error($crl) . '" - Code: ' . curl_errno($crl));
}
curl_close($crl);
$neo = $response["near_earth_objects"];
$astroid_id = array();
$astroid_speed = array();
$astroid_size = array();
$astroid_date = array();
$astroid_count = array();
foreach ($neo as $date) {
    array_push($astroid_count, count($date));
    array_push($astroid_date, $date[0]["close_approach_data"][0]["close_approach_date"]);
    foreach ($date as $astroid) {
        array_push($astroid_id, $astroid["id"]);
        $speed = round($astroid["close_approach_data"][0]["relative_velocity"]["kilometers_per_hour"], 2);
        $distance = round($astroid["close_approach_data"][0]["miss_distance"]["kilometers"], 2);
        $astroid_distace[$astroid["id"]] = $distance;
        $astroid_speed[$astroid["id"]] = $speed;
        $astroid_size[$astroid["id"]] = round($astroid["estimated_diameter"]["kilometers"]["estimated_diameter_max"], 2);
    }
}
$max_speed =  max($astroid_speed);
$max_id = array_search($max_speed, $astroid_speed);

$min_distance =  min($astroid_distace);
$min_distance_id = array_search($min_distance, $astroid_distace);

$avg_size = array_sum($astroid_size) / count($astroid_size);

$data = array(
    "max_speed" => $max_speed,
    "max_id" => $max_id,
    "min_distance" => $min_distance,
    "min_distance_id" => $min_distance_id,
    "astroid_count" => $astroid_count,
    "astroid_date" => $astroid_date,
    "average_size" => $avg_size
);

$f_data = json_encode($data);
echo $f_data;

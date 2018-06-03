<?php

//-JSONデータの受信＆指定ファイル名で保存---------------------------------------------------//

$json = file_get_contents('php://input');

// JSON形式データをPHPの配列型に変換
$param = json_decode($json, true);

$file_name = $param['filename'];

$data=json_encode(
	array(
		 "id"	=>$param['id'],
		 "thread"=>$param['thread']
	)
);

// ファイル保存のおまじない
$file = fopen($file_name, "w") or die("OPEN error $file_name");
flock($file, LOCK_EX);
fputs($file, $data."\n");
flock($file, LOCK_UN);
fclose($file);

//-htmlへの返答する場合。-------------------------------------------------//
$callback = isset($_GET['callback']) ? $_GET["callback"] : "";
$callback = htmlspecialchars(strip_tags($callback));

// JSON形式で送信するためのヘッダー。これないとerorrになる。
header('Content-type: application/javascript; charset=utf-8');
// JSONの書きだし
printf("{$callback}(%s)", $data);

?>

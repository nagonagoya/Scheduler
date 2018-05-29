<?php

//-JSONデータの受信＆指定ファイル名で保存---------------------------------------------------//

$json = file_get_contents('php://input');

// JSON形式データをPHPの配列型に変換
$param = json_decode($json, true);

$file_name = $param['filename'];
//$day = json_encode($param['day']);
//$QrenQ = json_encode($param['QrenQ']);

$data=json_encode(
	array(
		// "day"=>$param['day'],
		//  "QrenQ"=>$param['QrenQ'],
		//  "person"=>$param['person'],
		//  "longworkMax"=>$param['longworkMax'],
		//  "longworkMax_safe"=>$param['longworkMax_safe'],
		//  "longworkMin"=>$param['longworkMin'],
		//  "longwork"=>$param['longwork'],
		//  "Qsha"=>$param['Qsha'],
		//  "Qsha_safe"=>$param['Qsha_safe'],
		//  "Qsu"=>$param['Qsu'],
		//  "Qsat"=>$param['Qsat'],
		//  "Qsun"=>$param['Qsun'],
		//  "Qren"=>$param['Qren'],
		//  "Qss"=>$param['Qss'],
		//  "Qmon"=>$param['Qmon'],
		//  "leader"=>$param['leader']

		 "pass_id"	=>$param['pass_id'],
		 "thread_no"=>$param['thread_no'],
		 "person_no"=>$param['person_no'],
		 "title"	=>$param['title'],
		 "decision"	=>$param['decision'],
		 "month"	=>$param['month'],
		 "persn"	=>$param['persn'],
		 "days"		=>$param['days'],
		 "weeks"	=>$param['weeks'],
		 "color"	=>$param['color'],
		 "avail"	=>$param['avail'],
		 "marks"	=>$param['marks'],
		 "notes"	=>$param['notes'],
		 "mark"		=>$param['mark']

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

<?php
//include( "scrape_func.php" );//■外部関数の取り込み←HTMLを加工抽出する関数郡

//■get送信データ取得
$id 				= ( isset($_GET['i']) ) ? $_GET['i'] : exit("IDの指定がありません");				//幹事ＩＤ
$thread 		= ( isset($_GET['t']) ) ? $_GET['t'] : exit("スレッド番号の指定がありません");		//スレッド番号
$person_no 	= ( isset($_GET['p']) ) ? $_GET['p'] : exit("招待者番号の指定がありません");		//自分の招待者番号:0,1,2,…

//■エスケープ処理（安全にパラメータを渡すために特殊文字を HTML エンティティに変換する）
function h($s) {
	return htmlspecialchars($s, ENT_QUOTES, 'utf-8');
}

//■JSON読込み
//echo "JSONファイル読込開始<br>";
$json = file_get_contents("data/data".$id.$thread);
if($json){
	//JSONファイル読込み成功した場合
	//echo "ファイル読込み成功：パース開始<br>";
	$data = json_decode($json, true);//JSONから連想配列に戻す
//	$id	= $data['pass_id'];
//	$thread	= $data['thread_no'];
//	$person_no	= $data['person_no'];
	$title		= $data['title'];
	$text			= $data['text'];
	$decision	= $data['decision'];
	$month		= $data['month'];
	$persn		= $data['persn'];
	$days			= $data['days'];
	$weeks		= $data['weeks'];
	$color		= $data['color'];
	$avail		= $data['avail'];
	$marks		= $data['marks'];
	$notes		= $data['notes'];

	if($id===NULL){ echo "JSONパース失敗<br>"; return; }
	$flag["file_now"] = true;	// ファイル有り
} else {
	//ファイル無しor読込み失敗した場合
	$flag["file_now"] = false;	// ファイル無し
	exit( "ファイル無しor読込み失敗:強制終了");
}

include_once('html/p2.html');
?>

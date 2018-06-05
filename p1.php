<?php
//include( "scrape_func.php" );//■外部関数の取り込み←HTMLを加工抽出する関数郡

//threadidファイル（最新のスレッド番号を保持）の読み込み
//echo "threadidファイル読込み開始<br>";
$json_threadid  = file_get_contents("data/threadid");
if($json_threadid){
	//echo "threadidファイル読込み成功：パース開始<br>";
	$data = json_decode($json_threadid, true);//JSONから連想配列に戻す
	$id = $data['id'];									//id：今は使ってないけど管理者の番号的な位置づけ
	$thread = $data['thread']+1;				//thread：スレッド番号+１
	//	echo "    id : ".$id."<br>";
	//	echo "thread : ".$thread."<br>";
}

//デフォルト設定
$person = array("Ａ氏","Ｂ氏","Ｃ氏","Ｄ氏","Ｅ氏","Ｆ氏");//デフォルト招待者名
$mailadd = array("","","","","","");//デフォルトのメアド

//indexページのURL
$url_index = $_SERVER['HTTP_HOST'].str_replace(basename($_SERVER["REQUEST_URI"]),"",$_SERVER["REQUEST_URI"]);
//招待者用入力ページのURL（設定ページで登録したあとに有効になる招待者向けページのベースURL）
$url_user  = $url_index."p2.php?";
//管理者用管理ページのURL（設定ページで登録したあとに有効になる管理者向けページURL）
$url_kanri = $url_index."p3.php?i=".$id."&t=".$thread."&p=999";

include_once('html/p1.html');
?>

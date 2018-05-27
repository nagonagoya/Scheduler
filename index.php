<?php
include( "scrape_func.php" );//■外部関数の取り込み←HTMLを加工抽出する関数郡

//----------------------------------------------------------------------//
//■初期設定　ここでシフトルールで利用する数値を全て設定すること
//■　　　　　あとでルール変更する可能性があるため
//----------------------------------------------------------------------//

//初期設定：本来はデフォルトルールファイルを作りそこから読込みべき
$Qsha = 3;									//[ルール00]同日の休日者数の上限…※容範囲あり　これを超えるとダメ：レッド警告
$Qsha_safe = 2;							//[ルール00]同日の休日者数のセーフ上限…※これを超えると注意：オレンジ警告
$Qsu = 6;										//[ルール01]1人の従業員が月に休める日数…※固定：多くても少なくてもダメ
$Qren = 1;									//[ルール02]隔月で必ず連休をとる回数…※固定：多くても少なくてもダメ…？？？？？？実装に再検討必要！
$QrenQ =array();						//[ルール02]注目月ファイルに保存する前月の連休回数
$prev_QrenQ =array();				//[ルール02]前月ファイルから読取って数えた連休回数
//$QrenQ[0] = 0; $QrenQ[1] = 1; $QrenQ[2] = 1; $QrenQ[3] = 0;
$Qsat = 1;									//[ルール03]1人の従業員の土曜が休日の回数…※固定：多くても少なくてもダメ
$Qsun = 1;									//[ルール04]1人の従業員の日曜が休日の回数…※固定：多くても少なくてもダメ
$Qss = 0;										//[ルール05]金土以外の連休の回数…※固定：多くても少なくてもダメ
$longworkMax = 7;						//[ルール06]最長連続出勤…※容範囲あり下の配列が優先順位　これを超えるとダメ：レッド警告許
$longworkMax_safe = 6;			//[ルール06]最長連続出勤…※これを超えると注意：オレンジ警告
$longworkMin = 1;						//[ルール06]最短連続出勤…使わないかも
$longwork = array(0,5,6,4,3,2,1,7);	//連続出勤理想順位...0が最初にきているのは連休を最優先にするため
$Qmon = 0;										//[ルール07]月曜が休日の回数…※固定：多くても少なくてもダメ
//$person = array("ＡＡ","ＢＢ","ＣＣ","ＤＤ","ＥＥ","ＦＦ");//従業員名
$person = array("Ａ氏","Ｂ氏","Ｃ氏","Ｄ氏","Ｅ氏","Ｆ氏");//従業員名
$leader = array(0,     0,     0,     0,     0,     0);//リーダーフラグ：１＝リーダー（複数可）
$Qld = 0;										//[ルール08]リーダーの人数：リーダーの休日者が月曜以外でこの数以上ならダメ：レッド警告
//echo "リーダー数：".$Qld."    リーダー配列長：".count($leader)."<br>";

//フラグ設定　：　前＆今月ファイルの有無とマッチしているかどうか
$flag["file_prev"] = false;		// prev：前月ファイルの有[true]無[false]
$flag["file_now"] = false;			// day：今月ファイルの有[true]無[false]
$flag["file_match"] = false;	// match：前＆今月ファイルが共に有り、かつ内容も同じ[true]、それ以外[false]

//とりあえずダミー値を設定
$dpm = 31;//日数/今月
$lastdpm = 28;//日数/先月
$week21 = 6;//先月の21日の曜日
$daylengthx=count($person)+2;//[人数+日+曜日]
$daylengthy = $lastdpm+$longworkMax+1;//[先月の日数+最長連勤+1]



////////////////////////////////////////////////////////////////////////
$thread_no 	= ( isset($_GET['t']) ) ? $_GET['t'] : exit("スレッド番号の指定がありません");		//スレッド番号
$person_no 	= ( isset($_GET['p']) ) ? $_GET['p'] : exit("招待者番号の指定がありません");		//自分の招待者番号:0,1,2,…
//////////////////////////////////////////////////////////////////////////
$title		= "飲み会しようぜ";									//スレッドのタイトル
$decision	= 999;												//日程決定 days[]のkey値(0,1,2,…):決定, 999:未決定
$month		= 4;												//開始月
$persn		= array("Ａ氏","Ｂ氏","Ｃ氏","Ｄ氏");				//招待者名
$days		= array(27,28,29,30, 1, 2, 3, 4, 5, 6, 7);			//日付
$weeks		= array( 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0);			//曜日     0: Sun .... 6: Sat
$color		= array( 0, 1, 2, 2, 0, 0, 2, 2, 2, 2, 0);			//曜日色   0:平日(黒), 1;土曜(青), 2:日曜or祝日(赤)
$avail		= array( 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1);			//入力可否 0:不可, 1:可能
$marks		= array(											//招待者が日付に付けたマーク
				array( 2, 2, 1, 0, 0, 0, 2, 1, 2, 2, 2),		//Ａ氏の入力 0:×, 1;△, 2:〇 3:全角空白
				array( 0, 2, 0, 1, 0, 0, 2, 2, 0, 2, 2),		//Ｂ氏の入力 0:×, 1;△, 2:〇 3:全角空白
				array( 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2),		//Ｃ氏の入力 0:×, 1;△, 2:〇 3:全角空白
				array( 1, 0, 2, 2, 0, 0, 2, 1, 2, 2, 1)			//Ｄ氏の入力 0:×, 1;△, 2:〇 3:全角空白
			  );		 
$notes		= array(												//招待者が日付に付けたコメント
				array("","","","","","","","","","","この日がいい"),
				array("","","","翌朝早い早いから途中棄権するわ","","","","","","",""),
				array("","","","","","","","","","",""),
				array("できればパス","","","","","","","８時からならＯＫ","","","")
			  ); 
//●●●●まだ必要な設定：
//・チャットに関するデータ（可変長データ、配信者：コメント））
	
//----------------------------------------------------------------------//
//■エスケープ処理（安全にパラメータを渡すために特殊文字を HTML エンティティに変換する）
//----------------------------------------------------------------------//
function h($s) {
	return htmlspecialchars($s, ENT_QUOTES, 'utf-8');
}


////----------------------------------------------------------------------//
////■注目月度のタイムスタンプを求める確認用関数：不要になった
////----------------------------------------------------------------------//
//
//function ym(){
//	$today=date("d");//今日の日
//	$ym = date("Y-m");//今日の年月
//	echo "今日：".$ym."-".$today."<br>";
//	$timeStamp = strtotime($ym."-01");//今日のタイムスタンプを作成
// if((int)$today>20){
//	 echo"20日を過ぎましたので翌々月度に設定します<br>";
//	 $timeStamp = mktime(0,0,0,date("m")+2,1,date("Y"));
// }else{
//	 echo"20日以前なので翌月度に設定します<br>";
//	 $timeStamp = mktime(0,0,0,date("m")+1,1,date("Y"));
// }
//	 $ym = date("Y-m",$timeStamp);
//	echo "今月度：".$ym."<br>";
//	return $timeStamp;
//}

// timeStamp と ym : 注目する年月度のタイムスタンプとそのY-mを求める
$timeStamp = false;//注目する年月度のタイムスタンプ
if( isset($_GET['ym']) ){
	$timeStamp = strtotime($_GET['ym']."-01");
}
if ($timeStamp === false) {
		//ymが設定されていないか間違っている場合：今日が20日以前なら翌月、21日以降なら翌々月を注目月度とする
		$timeStamp = mktime(0,0,0,date("m")+(((int)date("d")>20)?2:1),1,date("Y"));
}
$ym = date("Y-m",$timeStamp);//注目する月度

//先月度、翌月度
$prev = date("Y-m",mktime(0,0,0,date("m",$timeStamp)-1,1,date("Y",$timeStamp)));//mktime(時,分,秒,月,日,年)
$next = date("Y-m",mktime(0,0,0,date("m",$timeStamp)+1,1,date("Y",$timeStamp)));

//先月の最終日？（先月は何日まであるか）
$lastdpm = date("t",strtotime($prev."-01"));
$daylengthy = $lastdpm+$longworkMax+1;//[先月の日数+最長連勤+1]←day[x][y]配列のy要素の数

//先月度の2１日は何曜日？
// 0: Sun .... 6: Sat
$week21 = date("w",mktime(0,0,0,date("m",$timeStamp)-1,21,date("Y",$timeStamp)));


//day[][]配列の設定（従業員数分の出欠指定と日にちと曜日）
//第１要素：[0~count($person)-1]:従業員の勤務シフト、[count($person)]:日にち、[count($person)+1]:曜日
//第２要素：[0~$longworkMax]:20日以前のシフト、[$longworkMax+1~daylengthy-1]注目月度開始(21日~)
//今月のファイルの有無チェック　＆　day[][]配列の作成　：　ファイルがあれば$flag["file_now"] = true;
//■■■注目月のday[][]配列の読込み■■■
//echo "当月ファイル読込開始<br>";
$json = file_get_contents("data".$ym);
if($json){
	//注目月のファイル読込み成功した場合
	//echo "ファイル読込み成功：パース開始<br>";
	$data = json_decode($json, true);//JSONから連想配列に戻す
	$day=$data['day'];//連想配列に格納したday[][]配列データをday[][]に戻す
	$QrenQ=$data['QrenQ'];//連想配列に格納したQrenQ[]配列データをQrenQ[]に戻す
	$person=$data['person'];//連想配列に格納したperson[]配列データをperson[]に戻す
	$longworkMax=$data['longworkMax'];//
	$longworkMax_safe=$data['longworkMax_safe'];//
	$longworkMin=$data['longworkMin'];//
	$longwork=$data['longwork'];//
	$Qsha=$data['Qsha'];//
	$Qsha_safe=$data['Qsha_safe'];//
	$Qsu=$data['Qsu'];//
	$Qsat=$data['Qsat'];//
	$Qsun=$data['Qsun'];//
	$Qren=$data['Qren'];//
	$Qss=$data['Qss'];//
	$Qmon=$data['Qmon'];//
	if( count($data['leader']) > 0 ){
		$leader=$data['leader'];
		$Qld = 0;
		for( $i=0; $i<count($leader); $i++ ){
			$Qld += $leader[$i] ? 1 : 0;
		}
	}
//	echo "leader：".count($data['leader'])."<br>";//連想配列に格納したperson[]配列データをperson[]に戻す

/*
	// day[][]確認ルーチン
for($j=0; $j<$daylengthx; $j++){
	for($i = 0; $i < $daylengthy; $i++){
		printf("%02d ",$day[$j][$i]); if($i ==$daylengthy-1) printf("<br>");
	}
}
*/
	if($day===NULL){ echo "JSONパース失敗<br>"; return; }
	$flag["file_now"] = true;	// 今月ファイル有り
} else {
	//ファイル無しor読込み失敗した場合→空のday[][]配列を作成
	//従業員の出欠指定とりあえず全出勤
	//echo "ファイル無しor読込み失敗：配列作成開始<br>";
	for( $i = 0; $i <count($person); $i++){
		$day[$i] = array_fill(0, $daylengthy, 0);
	}
	for( $i = 0; $i <$daylengthy; $i++){
		//日にち　$longworkMax：7なら先月13日からカウント
		$day[count($person)][$i]=(20-$longworkMax-1+$i) % $lastdpm+1;
		//曜日　0:平日,　1:土,　2:日,　(3:祝)
		$f=($week21+7*5-$longworkMax-1+$i)%7;//曜日算出　0:sun,...6:sat 10の位：1：土曜　2：日or祝
		$day[count($person)+1][$i]=$f+(($f==6)?10:(($f==0)?20:0));
	}
	$flag["file_now"] = false;	// 今月ファイル無し
}



//前月のファイルの有無チェック　＆　prev_day[][]配列の作成　：　ファイルがあれば$flag["file_prev"] = true;
//■■■前月のday[][]配列の読込み■■■
//echo "前月ファイル読込開始<br>";
$json = file_get_contents("data".$prev);
if($json){
	//前月のファイル読込み成功した場合
	//echo "ファイル読込み成功：パース開始<br>";
	$data = json_decode($json, true);//JSONから連想配列に戻す
	$prev_day=$data['day'];//連想配列に格納したday[][]配列データをday[][]に戻す
	$prev_QrenQ=$data['QrenQ'];//連想配列に格納したQrenQ[]配列データをQrenQ[]に戻す
	$prev_person=$data['person'];//連想配列に格納したperson[]配列データをperson[]に戻す
	$flag["file_prev"] = true;	// 前月ファイル有り
	// prev_day[][]から連休チェックし$prev_QrenQ[]作成ルーチン
	for($j=0; $j<count($person); $j++){
		$c=0;
		if($j<count($prev_person)){
			for($i = $longworkMax; $i < count($prev_day[0])-1; $i++){
				if($prev_day[$j][$i]%10==1 && $prev_day[$j][$i+1]%10==1) $c++;
			}
		}
		//$prev_QrenQ=array();
		$prev_QrenQ[$j]=$c;
	}
//	var_dump($prev_QrenQ);echo "　←prev_QrenQ[]<br>";
	
//	// prev_day[][]確認ルーチン
//	for($j=0; $j<$daylengthx; $j++){
//		for($i = 0; $i < count($prev_day[0]); $i++){
//			printf("%02d ",$prev_day[$j][$i]); if($i ==count($prev_day[0])-1) printf("<br>");
//		}
//	}
	
}

//echo "count(\$day[0]) : ".count($day[0])."<br>";
//echo "配列長：".$daylengthy."<br>";


// 前＆今月ファイルが共にある場合の処理：
//勤務シフトday[][]と前月連休回数QrenQ[]の内容も同じかどうかのチェック：一致すれば$flag["file_match"]=true;
if($flag["file_prev"] && $flag["file_now"]){
	$flag["file_match"] = true;
	for( $i = 0; $i < count($person); $i++){
		//day[][]とprev_day[][]の内容が一致するかチェック
		for( $j = 0; $j <= $longworkMax; $j++){
			if( $day[$i][$j]%10 != $prev_day[$i][count($prev_day[0])-$longworkMax+$j-1]%10 ) {
				$flag["file_match"] = false;
				$i=999; $j=999;
			}
		}
		//QrenQ[][]とprev_QrenQ[][]の内容が一致するかチェック
		if($QrenQ[$i] != $prev_QrenQ[$i]){
			$flag["file_match"] = false;
			$i=999;
		}
	}
}


// 前月ファイルはあるが今月ファイルが無い場合の処理：
//前月末近くの勤務シフトprev_day[][]と連休回数prev_QrenQ[]の内容を注目月のday[][]とQrenQ[]にコピー
if($flag["file_prev"]==true && $flag["file_now"]==false){
	//echo "前月ファイルはあるが今月ファイルが無い場合の処理<br>";
	for( $i = 0; $i < count($person); $i++){
			if( $i < count($prev_person) ){
				$QrenQ[$i]=$prev_QrenQ[$i];
			}else{
				$QrenQ[$i]=0;
			}
		for( $j = 0; $j <= $longworkMax; $j++){
			if( $i < count($prev_person) ){
				$day[$i][$j] = $prev_day[$i][count($prev_day[0])-$longworkMax+$j-1];
			}else{
				$day[$i][$j] = 0;
			}
		}
	}
//	var_dump($day);echo "　←day<br>";
//	echo "aaa:".count($prev_person)."　←prev_person<br>";
}

//前月ファイルも今月ファイルも無かった時の処理：
//当月ファイル用の前月連休回数データQrenQ[]を全て連休無しに設定
if($flag["file_prev"]==false && $flag["file_now"]==false){
	for($j=0; $j<count($person); $j++){
		$QrenQ[$j]=0;//とりあえず前月の連休は無かったことにする
	}
}

//var_dump($flag);echo "<br>";

//$day[1][1] =1;
//echo "daylenghty:".$daylengthy."<br>";
//echo "count(\$person):".count($person)."<br>";
//var_dump($day);
//echo "<br>";

//	echo "本　　　日：".date("Y-m-d",mktime(0,0,0,date("m"),date("d"),date("Y")))."<br>";
//	echo "注目月度：".$ym."<br>";
/*
	echo "timeStamp：".$timeStamp."<br>";
	echo "先月の日数：".$lastdpm."日<br>";
	echo "先　月：".$prev."<br>";
	echo "翌　月：".$next."<br>";
	echo "配列長：".$daylengthy."<br>";
	echo "21日の曜日：".$week21."<br>";



// day[][]確認ルーチン
for($j=0; $j<$daylengthx; $j++){
	for($i = 0; $i < $daylengthy; $i++){
		printf("%02d ",$day[$j][$i]); if($i ==$daylengthy-1) printf("<br>");
	}
}
*/

//祝日チェック
//先月のカレンダーサイトをスクレイピング
//echo "先月：".$prev."の祝日<br>";
$url = "http://www.himekuricalendar.com/month".str_replace("-","_",$prev);
//■■■■■2015.07.04追加 ↓↓↓ START
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
	$contents = curl_exec($ch);
	curl_close($ch);
//■■■■■2015.07.04追加 ↑↑↑ END
//$contents = ___scrape($url);//■■■■■2015.07.04　削除　なぜかカレンダーサイトだけスクレープできなくなった
$contents = str_replace("</FONT>","</FONT>\r\n",$contents);//改行を入れるとスクレイプできる
$contents = str_replace("&nbsp;","",$contents);//スペースの除去
$count=0;//祝日+振替休日のカウンタ
if( preg_match_all("|/images/markmonth.gif'><SPAN CLASS='day'><B><FONT COLOR='#FF0000'>(.*)</FONT>|", $contents, $hday_1, PREG_PATTERN_ORDER)){//■祝日の赤枠周辺を抽出
	foreach( $hday_1[1] as $value ){//■$dday_1[1][0,1...]←タグの中身だけ　$hday_1[0][0,1...]←タグと中身 
		//echo "祝　　　　　　日[".$count."] ：".$value . "<br>";
		$f = (int)$value-((20-$longworkMax-1) % $lastdpm+1);
		//printf("配列の位置変換：%s<br>",$f);
		if($f >0 ){
			$day[count($person)+1][$f] = ($day[count($person)+1][$f]%10) +20;
		}
		$count++;
	}
}
//echo "祝日+振替休日：".$count."<br>";

//今月のカレンダーサイトをスクレイピング
//echo "今月：".$ym."の祝日<br>";
$url = "http://www.himekuricalendar.com/month".str_replace("-","_",$ym);
//■■■■■2015.07.04追加 ↓↓↓ START
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
	$contents = curl_exec($ch);
	curl_close($ch);
//■■■■■2015.07.04追加 ↑↑↑ END
//$contents = ___scrape($url);//■■■■■2015.07.04　削除　なぜかカレンダーサイトだけスクレープできなくなった
$contents = str_replace("</FONT>","</FONT>\r\n",$contents);//改行を入れるとスクレイプできる
$contents = str_replace("&nbsp;","",$contents);//スペースの除去
$count=0;//祝日+振替休日のカウンタ
if( preg_match_all("|/images/markmonth.gif'><SPAN CLASS='day'><B><FONT COLOR='#FF0000'>(.*)</FONT>|", $contents, $hday_2, PREG_PATTERN_ORDER)){//■祝日の赤枠周辺を抽出
	foreach( $hday_2[1] as $value ){//■$dday_2[1][0,1...]←タグの中身だけ　$hday_2[0][0,1...]←タグと中身
		//echo "祝　　　　　　日[".$count."] ：".$value . "<br>";
		$f = $daylengthy-1-(20-(int)$value);
		//printf("配列の位置変換：%s<br>",$f);
		if($f < $daylengthy ){
			$day[count($person)+1][$f] = ($day[count($person)+1][$f]%10) + 20;
		}
		$count++;
	}
}
//echo "祝日+振替休日：".$count."<br>";

//// day[][]確認ルーチン
//for($j=0; $j<$daylengthx; $j++){
//	for($i = 0; $i < $daylengthy; $i++){
//		printf("%02d ",$day[$j][$i]); if($i ==$daylengthy-1) printf("<br>");
//	}
//}

/*
$week .= str_repeat('<td></td>', $youbi);
for ($day =1; $day<= $lastdpm; $day++, $youbi++){
	$week .= sprintf('<td class="youbi_%d">%d</td>', $youbi % 7, $day);
	if ($youbi % 7 == 6 OR $day == $lastdpm) {
		if ($day == $lastdpm) {
			$week .= str_repeat('<td></td>', 6- ($youbi % 7));
		}
		$weeks[] = '<tr>'. $week. '</tr>';
		$week ='';
	}
}
*/
//var_dump($day);
//var_dump($lastdpm);
//var_dump($youbi);
//var_dump($week);
//exit;

include_once('html/html01.php');
?>

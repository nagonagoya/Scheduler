<!DOCTYPE HTML>
<html lang="ja">
<head>
	<META charset="UTF-8">
	<TITLE>日程決め～る</TITLE>
	<link href="css/s.css" rel="stylesheet" type="text/css">
	<link rel="shortcut icon" href="favicon/f01.ico">
</head>

<body>



<!--■■■my_body(container) BEGIN■■■-->
	<div id="my_body">



<!--■■■header BEGIN■■■-->
	<div id="my_header">
		<p><button id="title" class="title" onclick="location.href='http://hhh.chobi.net/s1/'"> SiteName</button>　　<span class="ym"><?php echo $title; ?></span></p>
	</div><!--/my_header-->



<!--■■■nav BEGIN■■■-->
	<div id="my_nav">
		<div id="mynav">
			<ul>
				<li class="btn"><button class="s" onclick="location.href='?ym=<?php echo h($prev); ?>'">&laquo; 前</button><button class="s" onclick="location.href='?ym=<?php echo h($next); ?>'">次 &raquo;</button></li>
				<li class="btn"><button id="autoplan" class="m">自動プラン</button></li>
				<li class="btn"><button id="clear" class="m">当月クリア</button></li>
				<li class="btn"><button id="rule" class="m">ルール変更</button></li>
				<li class="btn"><button id="csvcopy" class="m" data-clipboard-text="copy失敗">ＣＳＶ出力</button></li>
				<li class="btn"><button id="deleteD" class="m">ファイル削除</button></li>
				<l class="btn"i><button id="saveD"   class="m">ファイル保存</button></li>
			</ul>
			<p  class="small">
							<br><br>
				　当月ファイル ： <span id="file_exist_now" class="small-border"></span><br><br>
				　前月ファイル ： <span id="file_exist_prev" class="small-border"></span><br><br>
				　<a class="small-border" target="_blank" href="http://www.himekuricalendar.com/month<?php echo str_replace("-","_",date("Y-m")); ?>">本日</a>
				<span>  <?php echo date("Y-m-d"); ?></span>
			</p>

<!--
					<div id="test02">非ずボタン</div>
			<div id="test03">非ずボタン</div>
-->
				</div><!--/mynav-->
	</div><!--/my_nav-->
<!--■■■nav END   ■■■-->



<!--■■■article BEGIN■■■-->
	<div id="my_article">
	<div id="myarticle">


	<!--	<p><button id="togglebtn_a">＋</button><span id="togglespn_a" class="middle"></span></p>	-->

	<table >
		<tbody id="table1">
		</tbody>
		<tbody id="table2">
		</tbody>
	</table><!--/table table-condensed-->

		<br>
		<p><button id="togglebtn_b" class="togglebtn0">＋</button><span id="togglespn_b" class="middle"> ： 使い方</span></p>
		<div id="manual" class="manual">
			<h3>１分でわかる基本操作</h3>
		</div>

	</div><!--/marticle-->
	</div><!--/my_article-->
<!--■■■article END   ■■■-->


<!--■■■footer BEGIN■■■-->
	<div id="my_footer">
		<p class="middle">※ Javascriptを有効にしてご利用下さい。</p>
	</div><!--/my_footer-->
<!--■■■footer END    ■■■-->



	</div><!--/my_body-->
<!--■■■my_body(container) END    ■■■-->


<link type="text/css" rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/cupertino/jquery-ui.min.css" />
<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="http://code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
<!--<script src="js/jquery-1.10.1.min.js"></script><!--利用するjQeryのリンク-->
<script src="js/jquery.balloon.js"></script><!--バルーン表示ライブラリ-->
<!--クリップボードコピーのライブラリ<script src="js/ZeroClipboard.min.js"></script>-->
<script src="http://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.5/ZeroClipboard.min.js"></script><!--クリップボードコピーのライブラリ-->


<script>



	//常識設定
	var week = new Array("日","月","火","水","木","金","土");

	//初期設定
	var person = JSON.parse('<?=json_encode($person);?>');		//従業員名
	var ym =JSON.parse('<?=json_encode($ym);?>');							//注目年月度←JSONで渡さないと引き算される
	var longworkMax =<?php echo $longworkMax; ?>;							//最長連続出勤…※許容範囲：あり：上限
	var longworkMax_safe =<?php echo $longworkMax_safe; ?>;		//最長連続出勤…※許容範囲：あり：注意
	var longworkMin =<?php echo $longworkMin; ?>;							//最短連続出勤
	var longwork = JSON.parse('<?=json_encode($longwork);?>');//連続出勤理想順位
	var Qsha = <?php echo $Qsha; ?>;													//同日の休日者数上限…※許容範囲：あり：上限
	var Qsha_safe = <?php echo $Qsha_safe; ?>;								//同日の休日者数上限…※許容範囲：あり：注意
	var Qsu = <?php echo $Qsu; ?>;														//休日日数…※許容範囲なし
	var Qsat = <?php echo $Qsat; ?>;													//土曜休日…※許容範囲なし
	var Qsun = <?php echo $Qsun; ?>;													//日曜休日…※許容範囲なし
	var Qren = <?php echo $Qren; ?>;													//連休回数…※許容範囲なし
	var QrenQ = JSON.parse('<?=json_encode($QrenQ);?>');			//従業員毎の前月の連休回数
	var Qss = <?php echo $Qss; ?>;														//金土以外…※許容範囲なし
	var Qmon = <?php echo $Qmon; ?>;													//月曜休日…※許容範囲なし
	var leader = JSON.parse('<?=json_encode($leader);?>');		//リーダーフラグ（１：リーダー）
	var Qld = <?php echo $Qld; ?>;														//リダ全休…※許容範囲：あり：上限　※月曜以外
//	console.log("leader:"+leader+"   Qld:"+Qld);//リーダー情報の表示

	var flag = JSON.parse('<?=json_encode($flag);?>');									//従業員毎の前月の連休回数
	flag["pre//v_lastweek"]=false;				//直前のday[][]がルール06最長連勤に抵触していないかのフラグ：抵触していたらfalse
	//↑値は後で設定するので今はどちらでもいいけど一応宣言しとく
	flag["prev_day_pressed"]=false;	//前月のday[][]との整合性判断フラグ：一度でも直前シフトday[*][0~longworkMax]か前月連勤QrenQ[]を触ったらtrueにする
	//console.log("flag [prev]:"+flag["file_prev"]+", [now]:"+flag["file_now"]+", [match]:"+flag["file_match"]);

	//とりあえず設定
	var dpm = <?php echo $dpm; ?>;//日数/今月
	var lastdpm = <?php echo $lastdpm; ?>;//日数/先月
	var week21 = <?php echo $week21; ?>;//先月の21日の曜日
	var daylengthx = person.length+2;//[人数+日+曜日]
	var daylengthy = lastdpm+longworkMax+1;//[先月の日数+最長連勤+1]
	var day = JSON.parse('<?=json_encode($day);?>');//JSON形式でphpの配列をjavascriptに渡す
//	console.log(day);//うまくダミーのday[][]ができたか確認

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var thread_no	= <?php echo $thread_no; ?>;  				//スレッド番号
	var person_no	= <?php echo $person_no; ?>;  				//自分の招待者番号
	var title		= "<?php echo $title; ?>";					//スレッドのタイトル
	var decision	= <?php echo $decision; ?>;					//日程決定 days[]のkey値(0,1,2,…):決定, 999:未決定
	var month		= <?php echo $month; ?>;					//開始月
	var persn		= JSON.parse('<?=json_encode($persn );?>');	//招待者名
	var days		= JSON.parse('<?=json_encode($days  );?>');	//日付
	var weeks		= JSON.parse('<?=json_encode($weeks );?>');	//曜日     0: Sun .... 6: Sat
	var color		= JSON.parse('<?=json_encode($color );?>');	//曜日色   0:平日(黒), 1;土曜(青), 2:日曜or祝日(赤)
	var avail		= JSON.parse('<?=json_encode($avail );?>');	//入力可否 0:不可, 1:可能
	var marks		= JSON.parse('<?=json_encode($marks );?>');	//招待者が日付に付けたマーク
	var notes		= JSON.parse('<?=json_encode($notes );?>');	//招待者が日付に付けたコメント
	var mark		= ["×", "△", "〇","　"];					//マークの記号

	console.log("thread_no	: "+thread_no);
	console.log("person_no	: "+person_no);
	console.log("title		: "+title	);
	console.log("decision	: "+decision);
	console.log("month		: "+month	);
	console.log("person		: "+persn	);
	console.log("days		: "+days	);
	console.log("week		: "+weeks	);
	console.log("color		: "+color	);
	console.log("avail		: "+avail	);
	console.log("marks		: "+marks	);
	console.log("notes		: "+notes	);
	console.log("mark		: "+mark	);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


</script>

<script src="js/p01.js"></script><!--自作JS-->

</body>
</html>

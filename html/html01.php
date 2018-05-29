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
			<h3>１秒でわかる基本操作</h3>
			<br>
			<p>　とにかく　使えばわかる！</p>
			<br>
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//常識設定
	var week = new Array("日","月","火","水","木","金","土");

	//初期設定
	var pass_id		= <?php echo $pass_id; ?>;  				//幹事ＩＤ
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

	console.log("psaa_id	: "+pass_id	);
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

	var flag_text_error = false		//コメント入力に問題があった場合：true、問題ない場合：false

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

<script src="js/p01.js"></script><!--自作JS-->

</body>
</html>

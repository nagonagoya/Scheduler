$(document).ready(function(){

//■■■■■クラス・関数群・BEGIN▼▼▼▼▼

//◆JQuary UI datepicker設定
$(function() {
	$("#datepicker1").datepicker();
	$("#datepicker2").datepicker();
});

//◆トースト通知
function toast(message,speed){
	if(speed===undefined) speed=3000;
	$('body').append('<div id="toast-cont"><div id="toast"></div></div>');
	$('#toast').text(message).fadeIn('fast');
	var timer = setTimeout(function(){
		$('#toast').fadeOut('slow',function(){
			$(this).parent().remove();
		});
	}, speed);
}

//◆登録前データチェック＆エラー表示：未実装
function check_rules(){
	console.log("チェックＯＫ");
	return true;
}

//◆イベント設定データ保存
function save_event(){
	//１、設定データの保存
	console.log("設定データ保存");
	var event_title = $("#event_title").val();	//イベントタイトル
	var event_text = $("#event_text").val();		//イベント案内文
	var person = [];														//招待者名
	var days = [];		//日付
	var weeks = [];		//曜日     0: Sun .... 6: Sat
	var color = [];		//曜日色   0:平日(黒), 1;土曜(青), 2:日曜or祝日(赤)
	var avail = [];		//入力可否 0:不可, 1:可能
	var marks = [];		//マーク   0:×, 1;△, 2:〇 3:全角空白
	var notes = [];		//招待者が日付に付けたコメント
	var m = [];				//一時変数（marks用）
	var n = [];				//一時変数（notes用）
	var bgn = new Date(($("#datepicker1").val()).replace(''/'','-'));	//一時変数開始期間
	var end = new Date(($("#datepicker2").val()).replace(''/'','-'));	//一時変数終了期間
	var month = bgn.getMonth()+1;																	//開始月
	console.log("開始"+$("#datepicker1").val());
	console.log("終了"+$("#datepicker2").val());
	console.log("開始"+bgn.getDate());
	console.log("終了"+week[end.getDay()]);
	person = copyArray(user_prsn);
	//期間中の日付＆曜日＆色＆入力可否＆マーク＆コメント　生成
	for(var d = bgn; d <= end; d.setDate(d.getDate()+1)) {
		days.push(d.getDate());
		weeks.push(d.getDay());
		c = (d.getDay() == 0 ? 2 : 0);
		c = (d.getDay() == 6 ? 1 : c);
		color.push(c);	//0:平日、1:土、2:日
		avail.push(1);	//0:入力不可、1:入力可能
		m.push(3);			//0:×、1;△、2:〇、3:全角空白
		n.push("");			//コメント：デフォルト＝空白
	}
	//マーク＆コメント×ユーザ数　生成
	for (p = 0; p < user_prsn.length; p++){
			marks.push(m);
			notes.push(n);
	}
	console.log("月　"+(bgn.getMonth()+1));
	console.log("日付"+days);
	console.log("曜日"+weeks);
	console.log("色　"+color);
	console.log("人　"+user_prsn);
	console.log("イベントタイトル；"+$("#event_title").val());
	console.log("イベントテキスト："+$("#event_text").val());
	//保存用ハッシュ作成
	var param = {
		'filename': "data/data" + id + thread,
		'id':			id,
		'thread':	thread,
		//'person_no':person_no,
		'title':	event_title,
		'text':		event_text,
		'decision':	999,
		'month':	month,
		'persn':	user_prsn,
		'days':		days,
		'weeks':	weeks,
		'color':	color,
		'avail':	avail,
		'marks':	marks,
		'notes':	notes,
	};
	var send_data= JSON.stringify(param);
		console.log("#send_data：" + send_data);
	// 送信処理
	$.ajax({
		type: "post",
		url: 	"s_data_save.php",
		data: send_data,
		crossDomain: false,
		dataType : "jsonp",
		scriptCharset: 'utf-8'
	}).done(function(data){
		//toast("データを 保存しました\n\r管理画面は以下のアドレスからアクセスしてください\n\r"+make_kanri_url());
		//●画面の再読み込みを実装しないと・・・
	}).fail(function(XMLHttpRequest, textStatus, errorThrown){
		toast("データ保存失敗：\n\r"+errorThrown);
	});

	//２、現在のスレッド番号の保存
	var param = {
		'filename': ("data/threadid"),
		'id':	id,
		'thread':(thread),
	};
	var send_data= JSON.stringify(param);
		console.log("#send_data：" + send_data);
	// 送信処理
	$.ajax({
		type: "post",
		url: "s_data_save_threadid.php",
		data: send_data,
		crossDomain: false,
		dataType : "jsonp",
		scriptCharset: 'utf-8'
	}).done(function(data){
		toast("データを 保存しました");
		//●画面の再読み込みを実装しないと・・・
	}).fail(function(XMLHttpRequest, textStatus, errorThrown){
		toast("データ保存失敗：\n\r"+errorThrown);
	});
	return true;
}

//◆招待者用の各ページの作成
function make_user_url(p){
	let str = url_user;
	str += "i="+id;
	str += "&t="+thread;
	str += "&p="+p;
	console.log("url: "+str);
	return str;
}

//◆管理者用のページの作成
function make_kanri_url(){
	let str = url_kanri;
	str += "i="+id;
	str += "t="+thread;
	console.log("url: "+str);
	return str;
}

//◆招待者データを初期化
function init_user_body(){
	console.log("[招待者の設定]表示データを初期化")
	user_prsn = [];
	user_prsn = copyArray(person);
	user_mail = [];
	user_mail = copyArray(mailadd);
	user_del = [];
	for( var i in user_prsn ){user_del[i]=0;}
	//console.log(user_del);
}

//◆招待者設定を表示
function disp_user_body(){
	console.log("[招待者の設定]表示");
	console.log("user_prsn: "+user_prsn);
	var str ="";
	for(var i = 0; i<user_prsn.length; i++){
		str +="<tr id=\"empTR"+i+"\">";
		str +="<td><button id=\"empD"+i+"\" class=\"togglebtn0\">-</button></td>";
		str +="<td id=\"empN"+i+"\">"+(i+1)+"</td>";
		str +="<td><input id=\"empE"+i+"\" type=\"text\" value=\""+user_prsn[i];
		console.log("user_prsn["+i+"]: "+user_prsn[i]);
		str +="\" size=\"9\" maxlength=\"7\" class=\"togglebtn0\" style=\"width:100px; text-align:left;\"></td>";
		str +="<td><input id=\"empM"+i+"\" type=\"text\" value=\""+user_mail[i];
		str +="\" size=\"9\" maxlength=\"30\" class=\"togglebtn0\" style=\"width:200px; text-align:left;\"></td>";
		str +="<td><div id=\"empU"+i+"\" class=\"url\" style=\"font-size: xx-small;\">"+make_user_url(i)+"</div></td>";
		str +="</tr>";
	}
	str +="<tr><td><button id=\"empAdd\" class=\"togglebtn0\">+</button></td><td>追加</td><td></td><td></td>";
	$("#settings_user_body *").remove();
	$("#settings_user_body").append(str);
	check_user();
}

//◆バリデーションチェック＆エラー表示：「招待者」全体
function check_user(){
	console.log("登録前データチェック：招待者：全体開始");
	var count=0;
	for(var i = 0; i<user_prsn.length; i++){
		if(check_user_line(i)==false){
			count++;
		}
	}
	if(count===0){
		return true;
	}else{
		return false;
	}
}

//◆バリデーションデータチェック＆エラー表示：「招待者」指定行
function check_user_line(id){
	console.log("登録前データチェック：招待者：指定行["+id+"]");
	var count=0;
	var str1=$("input[id=\"empE"+id+"\"]").val();
	var str2="";
	//未入力チェック
	if(str1.length<=0){
		console.log("未入力チェック：   ＮＧ");
		$("input[id=\"empE"+id+"\"]").attr("class","togglebtn1");
		return false;
	}else{
		console.log("未入力チェック：   ＯＫ");
		$("input[id=\"empE"+id+"\"]").attr("class","togglebtn1");
	}
	//全角文字除去
	console.log("名前[str1]："+str1+"   から全角文字を除去");
	//return true;
	for(i = 0; i < str1.length; i++) {
			var len = escape(str1.charAt(i)).length;
			if(len <= 4) {
				console.log(""+i+"文字目："+escape(str1.charAt(i))+"   半角");
				str2+=escape(str1.charAt(i));
			} else {
				console.log(""+i+"文字目："+escape(str1.charAt(i))+"   全角");
			}
	}
	//残った半角文字の禁則文字チェック
	if(str2.match(/[^0-9A-Za-z]+/)){
		console.log("半角英数チェック："+str2+"   ＮＧ");
		$("input[id=\"empE"+id+"\"]").attr("class","togglebtn1");
		//toast("半角英数で入力して下さい。");
		return false;
	}else{
		console.log("半角英数チェック："+str2+"   ＯＫ");
		$("input[id=\"empE"+id+"\"]").attr("class","togglebtn0");
		//$("#alert2").text('');
		return true;
	}
}

//◆配列を参照ではなくコピーする関数：多次元配列も対応
function copyArray(arr){
	var newarr = [];
	for(var i = 0;i<arr.length;i++){
		if(Array.isArray(arr[i])){
			newarr[i] = copyArray(arr[i]);
		}else{
			newarr[i] = arr[i];
		}
	}
	return newarr;
}
//■■■■■クラス・関数群・END  ▲▲▲▲▲

//■■■■■初期表示・BEGIN▼▼▼▼▼
init_user_body();
disp_user_body();
//■■■■■初期表示・END  ▲▲▲▲▲

//■■■■■イベント処理・BEGIN▼▼▼▼▼
//■ナビ：「登録」ボタン押下時
$(document).on('click', 'button[id="btn_save"]', function() {

	console.log("登録：#btn_save pressed");
	//登録前データチェック
	if(check_user()==false){
		alert("招待者名に問題があります\n\r保存前に入力内容をご確認下さい");
		return false;
	}
	if(check_rules()==false){
		return false;
	}
	//保存データの存在チェック ＆ 確認 ＆ データ保存
	$.get('s_data_exists.php',{filename:"data/data"+id+thread},function(text){
		if(text=="true"){
			if( confirm("すでにこのイベントは別の方が作成されたようです。\n\r初めからやり直してください。\n\r") ){
				return;
			}
		} else {
			if( confirm("設定したイベントを登録しますか？\n\r") ){
				save_event();
			}
		}
	});
});

//■招待者の設定：削除ボタン押下時
$(document).on('click', 'button[id^="empD"]', function() {
	var id = $(this).attr("id").substr(4)/1;	// id名の”empD”以降の数値部分の取得
	console.log("#empD["+id+"]：pressed");
	if(user_prsn.length<=2){
		toast("　　２人未満には設定できません　　",5000);
		return;
	}
	var str = "tr[id=\"empTR"+id+"\"]";
	console.log(str);
//	$(str + " *").remove();
	$(str).hide('slow',function(){
		$(str).remove();
		user_del.splice(id, 1);
		user_mail.splice(id, 1);
		user_prsn.splice(id, 1);
//		emp_ldr.splice(id, 1);
		console.log(user_del);
		console.log(user_prsn);
//		console.log(emp_ldr);
		console.log("psn_lenght:"+user_prsn.length);
		for(var i=id; i<user_prsn.length; i++){
			$("tr[id=\"empTR"+(i+1)+"\"]").attr('id', "empTR"+i);
			$("button[id=\"empD"+(i+1)+"\"]").attr('id', "empD"+i);
			$("td[id=\"empN"+(i+1)+"\"]").text(""+(i+1));
			$("td[id=\"empN"+(i+1)+"\"]").attr('id', "empN"+i);
			$("input[id=\"empE"+(i+1)+"\"]").attr('id', "empE"+i);
			$("button[id=\"empL"+(i+1)+"\"]").attr('id', "empL"+i);
		}
	});
});

//■招待者の設定：「招待者名」変更時
$(document).on('focusout', 'input[id^="empE"]', function() {
	var id = $(this).attr("id").substr(4)/1;	// id名の”empL”以降の数値部分の取得
	console.log("招待者名[#empE"+id+"]：focusout");
	var str1=$(this).val();
	console.log("str1:"+str1+",   user_prsn["+id+"]:"+user_prsn[id]);
	if(str1!=user_prsn[id]){
		check_user_line(id);
		user_prsn[id]=str1;
	}
});

//■招待者の設定：「追加」ボタン押下時
$(document).on('click', 'button[id="empAdd"]', function() {
	console.log("#empAdd：pressed");
	user_del.push(0);
	user_prsn.push("未設定");
	user_mail.push("");
//	emp_ldr.push(0);
	disp_user_body();
	// disp_rule00('n_end');
	// disp_rule00('c_end');
});
//■■■■■イベント処理・END  ▲▲▲▲▲

});

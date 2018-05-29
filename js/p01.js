$(function() {

//■■■■■クラス・関数群・BEGIN■■■■■■■■■■■■■■■■■■■■■

//■トースト通知クラス
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

//■指定したd番目の招待者（persn）が自分かどうかチェックし、それに応じたクラス名を返す
function mc_person(d){	//mc : Make Class の略
	if( d == persn.length - 1 ){
		return "person_me";		//●あとでperson_leaderをperson_meに変更すること
	}
	return "person_other";
}

//■指定したd番目の日付と曜日の色を祝日や日程決定状態も含めてチェックし、それに応じたクラス名を返す
function mc_dayweek(d){	//mc : Make Class の略
	if( d == decision ){
		return "youbiA"+color[d];		//日程決定かつ指定日(d)が決定日
	}else{
		return "youbiB"+color[d];		//上記以外
	}
}

//■指定したd番目の日付の招待者（p）のマークと日程決定状態も含めてチェックし、それに応じたクラス名を返す
function mc_marks(p, d){	//mc : Make Class の略
	if( d == decision ){				//日程決定かつ指定日(d)が決定日
			return "fA"+marks[p][d];
	}else{								//上記以外
		if( p == persn.length-1 ){
			return "fC"+marks[p][d];	//自分の列
		}else{
			return "fB"+marks[p][d];	//自分以外の列
		}
	}
}

//■指定配列の自分（person_no）の列の並びを最後尾に移動する
function change_array_column(x){
	let buf = x.slice(person_no, person_no + 1);
	x.splice(person_no, 1);
	Array.prototype.push.apply(x, buf);
}

//■指定配列の並びを元通りに戻す
function restore_array_column(x){
//		let buf = x.slice(x.length -1, x.length);
//		x.pop();
//		x.splice(person_no, 0, buf);
	let buf1 = x.splice(-1,1);
	let buf2 = x.splice(person_no,(x.length-person_no));
	Array.prototype.push.apply(x, buf1);
	Array.prototype.push.apply(x, buf2);
}

//■配列を参照ではなくコピーする関数：多次元配列も対応
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

//■■■■■クラス・関数群・END■■■■■■■■■■■■■■■■■■■■■

//////////////////////////////////////////////////////////////////////////////////////////////////////////


	//■指定配列の自分（person_no）の列の並びを最後尾に移動する
	change_array_column(persn);
	change_array_column(marks);
	change_array_column(notes);
	console.log("persn		: "+persn	);
	console.log("marks		: "+marks	);
	console.log("notes		: "+notes	);

	//テーブルのヘッダー作成
	//ランキング
	var str_head ="<td class=\"youbiD\"></td>";
	//開始月
	str_head +="<td colspan=\"2\" class=\"youbiD\">"+month+"月</td>";
	//招待者名
	for(let i = 0; i < persn.length; i++){
		str_head +="<td id=\"p"+("0"+i).substr(-2)+"\" class=\""+mc_person(i)+"\">"+persn[i]+"</td>";
	}
	//コメント
	str_head +="<td id=\"notes_head\" class=\"youbiD\">コメント</td>";
	$("#table2").append(str_head);//●あとで#table1に変更すること

	//テーブルのボディの作成
	var str_body ="";
	for(let d = 0; d < days.length; d++){
		str_body +="<tr>";
		//ランキング
		str_body +="<td class=\"youbiD\"></td>";
		//日付
		str_body +="<td class=\""+mc_dayweek(d)+"\">"+days[d]       +"</td>";
		//曜日
		str_body +="<td class=\""+mc_dayweek(d)+"\">"+week[weeks[d]]+"</td>";
		//招待者のマーク
		for(let p = 0; p < persn.length; p++){
			str_body +="<td id="+(100*p+d)+" class=\""+mc_marks(p,d)+"\" title=\""+notes[p][d]+"\">"+mark[marks[p][d]]+"</td>";
			//console.log("[j,i],marks,mark : ["+j+"]["+i+"] "+marks[j][i]+" ("+mark[marks[j][i]]+")");
		}
		//自分のコメント
		str_body +="<td><input id=\"note"+d+"\" type=\"text\" value=\""+notes[persn.length-1][d];
		str_body +="\" size=\"9\" maxlength=\"20\" class=\"togglebtn0\" style=\"width:200px; text-align:left;\"></td>";
		str_body +="</tr>";
	}
	$("#table2").append(str_body);

	//テーブルのフッタの作成
	//ランキング
	var str_foot ="<td class=\"youbiD\"></td>";
	//登録ボタン
	str_foot +="<td id=\"save\" colspan=\""+(persn.length+3)+"\" class=\"btn_entry\">登　　録</td>";
	$("#table2").append(str_foot);

	//チャット

//////////////////////////////////////////////////////////////////////////////////////////////////////////




//■■■■■クリックイベント設定・BEGIN■■■■■■■■■■■■■■■■■■■■
	$(document).ready(function(){


		$(function() {
		  // 2ツールチップ機能を適用
		  	$('#table2').tooltip({
			  // 表示時のエフェクトを無効化
			  show: {
			    delay: 500,
			    duration: 0,
			    easing: 'linear'
			  },
			  // 非表示時のエフェクトをObject型で指定
			  hide: {
			    delay: 0,
			    duration: 1000,
			    easing: 'linear'
			  }
			});
		});


		//マニュアルボタン1周りの前準備
		var toggle2 =1;//　1:「+」を表示、　2:「－」を表示
		$('#manual').toggle();
		$('#togglespn_b').text(" ： マニュアルを表示");

		//■マニュアルボタンの処理
		$('#togglebtn_b').click(function() {
			console.log("#togglebtn_b：pressed");
			$('#manual').toggle('slow');
			if(toggle2 ==1 ){
				$(this).text("－");
				$('#togglespn_b').text(" ： マニュアルを隠す");
				toggle2 =0;
			}else{
				$(this).text("＋");
				$('#togglespn_b').text(" ： マニュアルを表示");
				toggle2 = 1;
			}
		});


		//■バリデーションデータチェック＆エラー表示：「従業員」指定行
		function check_text(id){
			console.log("登録前データチェック：従業員：指定行["+id+"]");
			var count=0;
			var str1=$("input[id=\"note"+id+"\"]").val();
			var str2="";
			//全角文字除去
			console.log("コメント："+str1+"   から全角文字を除去");
			//	return true;
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
				$("input[id=\"note"+id+"\"]").attr("class","togglebtn1");
				toast("全角文字か半角英数以外の文字は使えません");
				return false;
			}else{
				console.log("半角英数チェック："+str2+"   ＯＫ");
				$("input[id=\"note"+id+"\"]").attr("class","togglebtn0");
				//$("#alert2").text('');
				return true;
			}
		}


		//■コメント変更時
		$(document).on('focusout', 'input[id^="note"]', function() {
			var d   = $(this).attr("id").substr(4)/1;	// id名の”empL”以降の数値部分の取得
			var str = $(this).val();
			console.log("days["+d+"]="+days[d]+"： focusout    str:"+str);
			if(str!=notes[persn.length-1][d]){
				if (check_text(d)==false) {
					$(this).focus();
					flag_text_error = true;
				}else{
					notes[persn.length-1][d]=str;
					console.log("notes		: "+notes	);
					flag_text_error = false;
				}
			}
		});

		//■marks[][]テーブルをクリックされた時の処理：day[][]配列の変更 ＆ class名の変更 ＆ textの変更 ＆ check[][]の変更
		$(".fC0, .fC1, .fC2, .fC3").click(function() {
			var id  = $(this).attr("id");						// idの数値部分の取得
			var f   = (($(this).attr("class")).substr(2))/1;	// classの数値部分の取得
			var d   = id%100;									// 日付
			var p   = Math.floor(id/100);						// 招待者
			var str = "fC"+((marks[p][d]+1)%4);					// マークの値を＋１進め４でまるめ（剰余）
			console.log("mark["+p+ "]["+d+ "]:pressed,  id: "+id+
						",  value: "+marks[p][d]+", → "+((marks[p][d]+1)%4)+
						",  class: "+$(this).attr("class")+" → "+str);
			marks[p][d] = (marks[p][d]+1)%4;					// マークの値を＋１進めた値に更新
			$(this).attr('class', str).text(mark[marks[p][d]]);	// マークのClassと記号を更新
			//●まだ機能追加が必要：ランキングをチェックし表示する
			//chk_rule_day(id);
		});



		//■データ保存ボタンの処理
		$('#save').click(function() {
			console.log("#saveD：pressed");
			//当該ファイルがサーバに存在しているか確認する。
			$.get('s_data_exists.php',{filename:"data" + pass_id + thread_no},function(text){
				if(text=="false"){
					window.alert("当該データがサーバにないため保存できません\n\rスレッドが削除された可能性があります\n\r");
				} else {
					//指定配列の並びを元通りに戻す
					restore_array_column(persn);
					restore_array_column(marks);
					restore_array_column(notes);
					//データ保存
					save_data();
					//指定配列の自分（person_no）の列の並びを最後尾に移動する
					change_array_column(persn);
					change_array_column(marks);
					change_array_column(notes);
				}
			});

			//■JSONデータとしてサーバにデータを保存する
			function save_data(){
			// PHPにday[][]配列とQrenQ[]配列、シフトルールに関する変数を渡しPHPからサーバに保存させる
			// 送るデータ形式はJSONでなければ、PHP側でエラーが出るのでJSON.stringify()でJSON形式に変換
				var param = {
					'filename': "data" + pass_id + thread_no,
					'pass_id':	pass_id,
					'thread_no':thread_no,
					'person_no':person_no,
					'title':	title,
					'decision':	decision,
					'month':	month,
					'persn':	persn,
					'days':		days,
					'weeks':	weeks,
					'color':	color,
					'avail':	avail,
					'marks':	marks,
					'notes':	notes,
					'mark':		mark
				};
				var send_data= JSON.stringify(param);
					console.log("#send_data：" + send_data);
				// 送信処理
				$.ajax({
		            type: "post",
		            url: "s_data_save.php",
		            data: send_data,
		            crossDomain: false,
		            dataType : "jsonp",
		            scriptCharset: 'utf-8'
		        }).done(function(data){
		            toast("データを 保存しました ");
					//●画面の再読み込みを実装しないと・・・
		        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
		            toast("データ保存失敗：\n\r"+errorThrown);
		        });
			}
		});


		//■データ削除ボタンの処理
		$('#deleteD').click(function() {
			console.log("#deleteD：pressed");
			$.get('s_data_exists.php',{filename:"data"+ym},function(text){
				if(text=="false"){
					toast("削除するデータがありません");
					return;
				} else {
					if(confirm("本当に削除しますか？")){
						$.get('s_data_delete.php',{filename:"data"+ym},function(text){toast(text);});
						//flag["file_now"]=false;//本来おのフラグはfalseにすべきだが再表示するまで使わないのと逆に前月とのday[][]合否判定がおかしくなるかもなので変更しないようにしてみる
						$('#file_exist_now').text("無");;
					}
				}
			});
		});


	});
//■■■■■クリックイベント設定・END■■■■■■■■■■■■■■■■■■■■







//■■■■■その他の関数群・BEGIN■■■■■■■■■■■■■■■■■■■■

//■■■■■その他の関数群・END■■■■■■■■■■■■■■■■■■■■


});

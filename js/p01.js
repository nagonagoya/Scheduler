$(function() {




//トースト通知クラス
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

	//チェック用配列check[][]の作成
	//check[チェック項目][人数分と項目としてのフラグ用に1個]　：ルールチェックに利用 check[0][*]は日毎の休日者数
	const HORIZON = 0;					//チェック項目の対象が日付（水平）
	const VERTICAL = 1;					//チェック項目の対象が従業員（垂直）
	//console.log("HORIZON:"+HORIZON+",   VERTICAL:"+VERTICAL);
	var checkitem = new Array("休日者数",
														"休日日数",
														"連休回数",
														"土曜休日",
														"日曜休日",
														"金土以外",
														"最長連勤",
														"月曜休日",
														"リダ全休");//チェック項目
	var check_x_y = new Array(HORIZON,
														VERTICAL,
														VERTICAL,
														VERTICAL,
														VERTICAL,
														VERTICAL,
														VERTICAL,
														VERTICAL,
														HORIZON);//チェック項目の対象が日付（水平）か、従業員（垂直）か
	var checktips = new Array("【正常：0～2】　【注意：3】　【警告：4～】",
														"【正常：6】　【注意：なし】　【警告：6以外】",
														"【正常：前月度連休あり→0,なし→1】　【注意：なし】　【警告：正常以外】",
														"【正常：1】　【注意：なし】　【警告：1以外】",
														"【正常：1】　【注意：なし】　【警告：1以外】",
														"【正常：0】　【注意：なし】　【警告：0以外】",
														"【正常：0～6】　【注意：7】　【警告：8～】",
														"【正常：0】　【注意：なし】　【警告：0以外】",
														"【正常：リーダー数未満】　【注意：なし】　【警告：リーダー数以上】");//チェック項目の説明
	var check =new Array(checkitem.length);
	for(var i=0; i<check.length; i++){check[i]=(i==0)?new Array(daylengthy+1):new Array(person.length+1);}
	//必要かわからないけどとりあえず各ルールチェック項目毎の総括チェック欄を0に設定
	check[0][daylengthy]=0;
	for(var i=1; i<check.length; i++) { check[i][person.length]=0; }

	//全ルールをチェックしcheck[][]を設定
	chk_rule_all();
	chk_rule("prev_lastweek",0);//直前シフト状況の合否判定

//	console.log(checkitem.length);
//	console.log(check);



//■■■■■テーブルの作成・BEGIN■■■■■■■■■■■■■■■■■■■■

//	//テーブルのヘッダー1作成
//	var str_head ="<tr><td colspan=\"2\" class=\"youbiC\">前月連休</td>";
//	for(var i = 0; i<person.length; i++){
//		str_head +="<td id=\""+i+"renQ\"class=\"fC"+((QrenQ[i]>=Qren)?"1\">連":"0\">")+"</td>";
//	}
//		str_head +="</tr>";
//	$("#table1").append(str_head);
//
//	//テーブルのボディ１の作成
//	var str_body1 ="";
//	for(var i = 0; i <= longworkMax; i++){
//		str_body1 +="<tr>";
//	//	var f = "0"; if(day[person.length+1][i]==0){f="2";} if(day[person.length+1][i]==6){f="1";}//f:曜日クラスの部品
//	//	console.log(f);
//		str_body1 +="<td class=\"youbiA"+Math.floor(day[person.length+1][i]/10)+"\">"+day[person.length][i]+"</td>";//日にち
//		str_body1 +="<td class=\"youbiA"+Math.floor(day[person.length+1][i]/10)+"\">"+week[day[person.length+1][i]%10]+"</td>";//曜日
//		for(var j = 0; j<person.length; j++){
//			str_body1 +="<td id="+(100*j+i)+" class=\"fA"+day[j][i]+"\">"+((day[j][i]%10==1)?"○":"")+"</td>";//従業員の日毎の出欠指定
//		}
//	//	str_body1 +="<td class=\"chA0\">"+000+"</td></tr>";//check[0]休日者数の結果
//		str_body1 +="/</tr>";//check[0]休日者数の結果
//		str_body1 +="</tr>";
//	}
//	$("#table1").append(str_body1);

//■■■■■スタイルのクラス名を出力する関数群・BEGIN■■■■■■■■■■■■■■■■■■■■


//指定したルール(item)のｘ番目をチェックし、それに応じたクラス名を返す
function mc_chk(item,x){	//mc : Make Clas　の略
	switch (item){
		//休日者数
		case 0:
			if( check[item][x]>Qsha)	return "ch1";
			if( check[item][x]>Qsha_safe)	return "ch2";
			return "ch0";
			break;
		
		//休日日数
		case 1:
			if( check[item][x]==Qsu)	return "ch0";
			return "ch1";
			break;
		
			//連休回数
		case 2:
			if((QrenQ[x]==0 &&  check[item][x] != Qren) ||(QrenQ[x]>=Qren &&  check[item][x] != 0)) return "ch1";
			return "ch0";
			break;
		
		//土曜休日
		case 3:
			if( check[item][x]==Qsat)	return "ch0";
			return "ch1";
			break;
		
		//日曜休日
		case 4:
			if( check[item][x]==Qsun)	return "ch0";
			return "ch1";
			break;
		
		//金土以外
		case 5:
			if( check[item][x]==Qss)	return "ch0";
			return "ch1";
			break;
			
		//最長連勤
		case 6:
			if( check[item][x] > longworkMax)	return "ch1";
			if( check[item][x] > longworkMax_safe)	return "ch2";
			return "ch0";
			break;
			
		//月曜休日
		case 7:
			if( check[item][x]==Qmon)	return "ch0";
			return "ch1";
			break;
			
		//リダ全休
		case 8:
			if( check[item][x]<Qld || Qld<=0 )	return "ch0";
			return "ch1";
			break;
			
		default:
			return "ch0";
			break;
	}
}

//トグルボタンの(item)の状況に応じたクラス名を返す
//問題なし：togglebtn0：ノーマル
//警告あり：togglebtn1：レッド
//注意程度：togglebtn2：オレンジ
function mc_tgl(item){	//mc : Make Clas　の略
	switch (item){
		//直前の勤務シフト表示　トグルボタン
		case 0:
		//警告あり：togglebtn1：レッド
			//直前day[][]が[ルール06]最長連勤を満たしていない時
			if( flag["prev_lastweek"]==false ){
				return "togglebtn1";
			}
		//注意程度：togglebtn2：オレンジ
			//前＆今月ファイルも共にあるがday[][]やQrenQ[]の値が一致しない時
			if( flag["file_prev"]==true && flag["file_now"]==true && flag["file_match"]==false ){
				return "togglebtn2";
			}
			//前月ファイルがあるのに一度でも直前勤務シフトや前月連休をクリックしたら前月との整合性がとれてないことにする
			if( flag["file_prev"]==true && flag["prev_day_pressed"]==true ){
				return "togglebtn2";
			}
		//問題なし：togglebtn0：ノーマル
			return "togglebtn0";
			break;
			
		default:
			return "togglebtn0";
			break;
	}

}

//■指定したｘ番目の招待者（persn）が自分かどうかチェックし、それに応じたクラス名を返す
function mc_person(x){	//mc : Make Clas の略
	if( x == persn.length - 1 ){
		return "person_leader";		//●あとでperson_leaderをperson_meに変更すること
	}
	return "person_normal";
}

//■指定したｘ番目の日付と曜日の色を祝日や日程決定状態も含めてチェックし、それに応じたクラス名を返す
function mc_dayweek(x){	//mc : Make Clas の略
	if( x == decision ){
		return "youbiA"+color[x];		//日程決定かつ指定日(x)が決定日
	}else{
		return "youbiB"+color[x];		//上記以外
	}
}

//■■■■■クラス出力関数群・END■■■■■■■■■■■■■■■■■■■■■

//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//■指定配列の自分（person_no）の列の並びを最後尾に移動する
	function change_array_column(x){
		let buf = x.slice(person_no, person_no + 1);
		x.splice(person_no, 1);
		Array.prototype.push.apply(x, buf);
	}
	
	//■指定配列の並びを元通りに戻す
	function restore_array_column(x){
		let buf = x.slice(x.length -1, x.length);
		x.pop();
		x.splice(person_no, 0, buf);
	}

	//■
	change_array_column(persn);
	change_array_column(marks);
	change_array_column(notes);
	console.log("persn		: "+persn	);
	console.log("marks		: "+marks	);
	console.log("notes		: "+notes	);

	//テーブルのヘッダー作成
	var str_head ="<td colspan=\"2\" class=\"youbiD\">"+month+"月</td>";
	for(let i = 0; i < persn.length; i++){
		str_head +="<td id=\"p"+("0"+i).substr(-2)+"\" class=\""+mc_person(i)+"\">"+persn[i]+"</td>";
	}
	$("#table2").append(str_head);//●あとで#table1に変更すること

	//テーブルのボディの作成
	var str_body ="";
	for(let i = 0; i < days.length; i++){
		str_body +="<tr>";
		str_body +="<td class=\""+mc_dayweek(i)+"\">"+days[i]       +"</td>";//日付
		str_body +="<td class=\""+mc_dayweek(i)+"\">"+week[weeks[i]]+"</td>";//曜日
		for(let j = 0; j < persn.length; j++){
			str_body +="<td id="+(100*j+i)+" class=\"fB"+marks[j][i]+"\">"+mark[marks[j][i]]+"</td>";//従業員の日毎の出欠指定
			console.log("[j,i],marks,mark : ["+j+"]["+i+"] "+marks[j][i]+" ("+mark[marks[j][i]]+")");
		}
		str_body +="</tr>";
	}
	$("#table2").append(str_body);


//////////////////////////////////////////////////////////////////////////////////////////////////////////



//	//テーブルのヘッダー２作成
//	var str_head ="<td colspan=\"2\" class=\"youbiD\">"+month+"月</td>";
//	for(let i = 0; i<person.length; i++){
//		str_head +="<td id=\"p"+("0"+i).substr(-2)+"\" class=\""+mc_person(i)+"\">"+person[i]+"</td>";
//	}
//
////◆	str_head +="<td class=\"chT\" title=\""+checktips[0]+"\">"+checkitem[0]+"</td></tr>";
//	str_head +="<td class=\"chT\" title=\""+checktips[0]+"\">"+checkitem[0]+"</td>";//◆
//	str_head +="<td class=\"chT\" title=\""+checktips[8]+"\">"+checkitem[8]+"</td></tr>";//◆
//	$("#table2").append(str_head);
//
//	//テーブルのボディ２の作成
//	var str_body2 ="";
//	for(var i = longworkMax+1; i < daylengthy; i++){
//		str_body2 +="<tr>";
//	//	var f = "0"; if(day[person.length+1][i]==0){f="2";} if(day[person.length+1][i]==6){f="1";}//f:曜日クラスの部品
//	//	console.log(f);
//		str_body2 +="<td class=\"youbiB"+Math.floor(day[person.length+1][i]/10)+"\">"+day[person.length][i]+"</td>";//日にち
//		str_body2 +="<td class=\"youbiB"+Math.floor(day[person.length+1][i]/10)+"\">"+week[day[person.length+1][i]%10]+"</td>";//曜日
//		for(var j = 0; j<person.length; j++){
//			str_body2 +="<td id="+(100*j+i)+" class=\"fB"+day[j][i]+"\">"+((day[j][i]%10==1)?"○":"")+"</td>";//従業員の日毎の出欠指定
//		}
////◆		str_body2 +="<td id=\""+i+"c00\" class=\""+mc_chk(0,i)+"\">"+check[0][i]+"</td></tr>";//check[0]休日者数の結果
//		str_body2 +="<td id=\""+i+"c00\" class=\""+mc_chk(0,i)+"\">"+check[0][i]+"</td>";//check[0]休日者数の結果//◆
//		str_body2 +="<td id=\""+i+"c08\" class=\""+mc_chk(8,i)+"\">"+check[8][i]+"</td></tr>";//check[0]休日者数の結果//◆
//		str_body2 +="</tr>";
//	}
//	$("#table2").append(str_body2);
//
//	//テーブルのチェック項目の作成
//	var str_check ="";
//	for(var i = 0; i < checkitem.length; i++){
//		if(check_x_y[i]==VERTICAL){
//			str_check +="<tr>";
//			str_check +="<td colspan=\"2\" class=\"chT\" title=\""+checktips[i]+"\">"+checkitem[i]+"</td>";//チェック項目名
//			for(var j = 0; j<person.length; j++){
//				//そのチェック結果
//				str_check +="<td id=\""+j+"c"+("0"+i).substr(-2)+"\" class=\""+mc_chk(i,j)+"\">"+check[i][j]+"</td>";
//			}
//			str_check +="</tr>";
//		}
//	}
//	$("#table2").append(str_check);
//■■■■■テーブルの作成・END■■■■■■■■■■■■■■■■■■■■




//■■■■■クリックイベント設定・BEGIN■■■■■■■■■■■■■■■■■■■■
	$(document).ready(function(){


$(function() {
  // 2ツールチップ機能を適用
  $('.chT').tooltip({
  // 表示時のエフェクトを無効化
  show: {
    delay: 1000,
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

		//直前シフトボタン1周りの前準備
		var toggle1 =1;//　1:「+」を表示、　2:「－」を表示
		$('#table1').toggle();
		$('#togglespn_a').text(" ： 直前シフトを表示");
		chk_rule("prev_lastweek",0);
		$('#togglebtn_a').attr('class', mc_tgl(0));//クラス名の判定＆設定

		//マニュアルボタン1周りの前準備
		var toggle2 =1;//　1:「+」を表示、　2:「－」を表示
		$('#manual').toggle();
		$('#togglespn_b').text(" ： マニュアルを表示");

		//ファイルの有無表示
		$('#file_exist_now').text((flag["file_now"]==true)?"有":"無");;
		$('#file_exist_prev').text((flag["file_prev"]==true)?"有":"無");;

		//■直前シフトボタンの処理
		$('#togglebtn_a').click(function() {
			console.log("#togglebtn_a：pressed");
			$('#table1').toggle('slow');
			if(toggle1 ==1 ){
				$(this).text("－");
				$('#togglespn_a').text(" ： 直前シフトを隠す");
				toggle1 =0;
			}else{
				$(this).text("＋");
				$('#togglespn_a').text(" ： 直前シフトを表示");
				toggle1 = 1;
			}
		});

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

		//■leader[]テーブルをクリックされた時の処理：leader[]配列の変更 ＆ class名の変更 ＆ textの変更 ＆ check[][]の変更
		$(".person_normal, .person_leader").click(function() {
			var id = $(this).attr("id").substr(-2)/1;	// id名の”p”以降の数値部分の取得
			var cl = $(this).attr("class").substr(7);	// class名の”person_”以降の文字取得
//			console.log("id:"+id+"   class:"+cl);
			leader[id] = 1 - leader[id];//leader[]の値を反転（0→1、1→0）
			Qld += (leader[id]==1) ? 1 : -1;//Qld:リーダーの人数を変更
			$(this).attr('class',( leader[id] == 1) ? "person_leader" : "person_normal");//従業員のcalssの変更
			for(var i=longworkMax+1; i<daylengthy; i++){	//全日付について[ルール08：リダ全休]のチェック＆classの変更
				chk_rule(8,i);
				$( "#"+i+"c08" ).attr('class', mc_chk(8,i)).text(check[8][i]);
			}
			console.log("leader["+id+"] pressed:  value:→"+leader[id]+",  id:"+$(this).attr("id")+",  class:→"+$(this).attr("class"));
//			console.log("check[8][] : "+check[8]);
		});

		//■day[][]テーブルをクリックされた時の処理：day[][]配列の変更 ＆ class名の変更 ＆ textの変更 ＆ check[][]の変更
		$(".fA0, .fB0, .fA1, .fB1").click(function() {
			var id = $(this).attr("id");	// idの数値部分の取得
			var f=(($(this).attr("class")).substr(2))/1;	// classの数値部分の取得
			var str="f" + ((Math.floor(id%100)>longworkMax)?"B":"A") + (f+(1-f%10)*2-1);	// classの数値部分を反転してclass名に設定
			console.log("day["+Math.floor( id/100)+ "]["+( id%100)+ "]:pressed,  id: "+id+ ",  class: "+$(this).attr("class")+" → "+str);
			day[Math.floor(id/100)][id%100] = day[Math.floor(id/100)][id%100]+(1-day[Math.floor(id/100)][id%100]%10)*2-1;
			$(this).attr('class', str).text(((day[Math.floor(id/100)][id%100]%10==1)?"○":""));
			chk_rule_day(id);//このidのday[][]を押された事によるルールをチェックし、check[][]の変更 & classも変更
		});

		//■連休テーブルQrenQ[]をクリックされた時の処理:QrenQ[]配列の変更(Qren or 0) ＆ class名の変更 & textの変更
		$(".fC0, .fC1").click(function() {
			var id = parseInt($(this).attr("id"),10);		// idの数値部分の取得
			var f=(($(this).attr("class")).substr(2))/1;	// classの数値部分の取得
			var str_c="fC" + (f+(1-f%10)*2-1);	// classの数値部分を反転してclass名に設定
			QrenQ[id] = (QrenQ[id]<Qren)? Qren : 0;
			$(this).attr('class', str_c).text(( (QrenQ[id]>=Qren) ? "連" : "" ));//クリックされた場所のclass変更＆text変更
			//console.log("renQ ：　id : "+id+",  f:"+f+ ",  str_c:"+str_c+ ",  x:"+id+",  QrenQ:"+QrenQ);
			flag["prev_day_pressed"]=true;	//一度でもクリックしたら前月のday[][]との整合性判断フラグをたてる
			$('#togglebtn_a').attr('class', mc_tgl(0));//トグルボタンのclass名変更
			chk_rule(2,id);//ルール02：連休回数のチェック&chack[02][id]値変更
			var str_id = "#"+id+"c02";//check[02][id]のid名作成
			$( str_id ).attr('class', mc_chk(2,id)).text(check[2][id]);//check[02][id]値の変更によるclassとtextの変更
			console.log("QrenQ["+id+"]:pressed,  id:"+$(this).attr("id")+",  class: fC"+f+ " → "+str_c+",  check[2]["+id+"]-id: "+str_id+",  QrenQ:"+QrenQ);
		});

		//■自動プランボタンの処理
		$('#autoplan').click(function(){
			console.log("#autoplan：pressed");
			//[1]自動プランを作れる状態かチェック→ダメならメッセージを出し終了
			//[1-1]前月度の直前勤務状況で全員が1回以上休日指定されているか？（最長連勤をチェックするために必要）
			if( flag["prev_lastweek"]==false ){
				toast("前月度の勤務シフトが無いため作成できません。直前シフトに全員の休日を設定して下さい",5000);
				return;
			}
			//[1-2]今月にすでに休日指定をしている場合、指定が無効なにるのでその確認
			for( var i=0; i<person.length; i++){ if( check[1][i] > 0 ) i=1000; }
			if(i>999){
				if( confirm("【 自動プランの確認 】\n\n現在指定されている当月の休日は全てクリアされます\n\nまた、プランを考えるまで かなり時間がかかります\nその間、画面がフリーズしたようになりますが何も操作しないでお待ち下さい\n\nよろしいですか？\n\r")==false) return;
				delete_day();//day[][]の今月部分のみを０にしcheck[][]とそのclassやtextも書換える
			} else {
				if( confirm("【 自動プランの確認 】\n\nプランを考えるまで かなり長い時間がかかります\nその間、画面がフリーズしたようになりますが何も操作しないでお待ち下さい\n\nよろしいですか？\n\r")==false) return;
			}

			var flag_stop=false;//長考防止フラグ：このフラグがたったら最適解が得れてなくても、終了して全ての再帰ループから抜ける
			//できればこのときまでに評価99未満のプランがあればそれを表示する
			var loop_counter=0;//念のため強制終了用のカウンター
			var checkplan_count=0;//プランを立てた回数
			var point_best=99;//算出したプランの中の最高評価
			//↑：数が小さいほど良い。0が最高評価、check[][]のオレンジ評価１つで+1、-1のままなら一度も合格プランを作れなかった
			var plan_count_Max=person.length*Qsu;//自動プランの探索深度上限。これ未満でないとダメ
//			var plan_count_Max=12;//自動プランの探索深度上限。これ未満でないとダメ
			console.log("longwork[]:"+longwork);

//■■■■■■■■■■■■■■■■　planning　■■■■■■■■■■■■■■■■
			var p = planning(0,day);

//関数：planning：prsn人目のqsu日目の休日プランを考える。OKなら更に深度を深めて再帰し4人目6日目までの合格プランを導く
//考え：深度の進め方は　1人1日目→1人2日目→...1人6日目→2人1日目→...2人6日目→...4人6日目の順でプランを立ててチェックする
//　　　立てるプランの順番は連勤優先順位の順（連勤優先順位の最初が0なのは連休を設定ーしかも優先的に早めにーするため）
//　　　プランに対してチェックを行い途中でもそのプランの評価をする。良い評価なら更に深度を深め、そうでなければ次のプランを立てる
//　　　評価は最高評価が[0](全てがセーフ判定だった)、オレンジが判定が１件あるごとに[+1]、レッド判定が1つでもつけば[100](ダメ評価)とする
//動き：今の階層の中でベターなルートの評価を保持する：point_betterに100を設定：いらない気もするが一応設定
//　　　[P]連勤優先順にプランを立てチェック関数でで評価を受ける
//　　　　[A]評価がpoint_bestより良い場合→よい評価を獲得できる可能性あり
//　　　　　[A-1]今の深度が最終深度の場合
//　　　　　　[A-1-a]現行のpoint_bestより良い評価だった場合
//　　　　　　　・point_bestに今の評価値を設置
//　　　　　　　・day[][]配列にplan[][]配列の値をコピー（参照ではない）
//　　　　　　　・point_bestを[返す]
//　　　　　　[A-1-b]現行のpoint_bestと同等以下の評価だった場合
//　　　　　　　・今の評価を[返す]
//　　　　　[A-2]まだ最終深度に達していない場合→探索深度：plan_countをインクリメントして自分を再帰
//　　　　　　[A-2-a]戻り値が最高評価０の場合０を[返す]
//　　　　　　[A-2-b]戻り値が最高評価０でない場合その値をpoint_betterと比較して良い方をpoint_betterに設定
//　　　　[B]評価がpoint_bestと同等以下だった場合→これ以上この階層以下のプランに深度を進めて探索しても良い結果が得られない
//　　　　→[P]に戻って次の優先順位のプランを立てる
//　　　[Q]ここにたどりつくのは最高評価の0を得れなかったかこの階層の時点ですでにどのプランも最高評価を更新できない評価だった場合となる
//　　　今の階層のベター評価を[返す]
//引数：plan_count：プランの深度---　0~(4*6-1) ← person.length*Qsu未満まで
//　　　pan_reference：今まで立てたプランが入ったday[][]配列のコピー。これをまた再帰された先で参照でなくコピー(plan)してから使う
//戻値：point：0~100：0は文句なしの最高評価なので探索ストップ。オレンジ判定１つで+1。レッド判定で100
			function planning(plan_count,plan_reference){
				console.log("■■■planning■■■");
				loop_counter++; if(loop_counter%1000==0){//念のため3000回の再帰で強制終了
					var str="まだ最適プランが思いつきません。\nがんばってはいるのですが…\n\n現在思いついたプランは… "+
						((point_best<99)?((100-point_best)/1+"/100点 のできです。"):("さっぱりありません。"));
					str+="\n\nもう少しお待ちいただけますか？\n\n[OK] ← 待つ\n\n[キャンセル] ← 待てぬ\n\n";
					if( confirm(str)==false){
						console.log("Forced termination!---loop_counter:"+loop_counter);
						flag_stop=true;
						return 100;
					}
				}
				var plan = copyArray(plan_reference);//plan[][]をコピー（参照ではなく複製）
				var prsn = Math.floor(plan_count/Qsu);//何人目かを算出
				var qsu = plan_count%Qsu;//の何日目かを算出：休日日数カウンター…値：1~Qsu
				var lwc=0;//連勤longwork[wc]の注目順番カウンター…値：0 ~ longwork.length-1(=longwerkMax)
				var lastq=-1;//前月の最後に休日だった日
				if(plan_count>=plan_count_Max){ console.log("Forced termination!---plan_count>=plan_count_Max:"+plan_count); exit; }
				if(prsn>=person.length) { console.log("Forced termination!---prsn>=person.length:"+prsn);return ;}
				if(prsn>4) { console.log("Forced termination!---prsn>0:"+prsn);return ;}//とりあえず1人目で強制終了
				if(qsu>Qsu) { console.log("Forced termination!---qsu>Qsu:"+qsu);return ;}//これも念のためとりあえず1人目で強制終了
				//まずplan[prsn][]の最後に休日だった日を探す
				for(var y=daylengthy-1; y>=0; y--){
					if(plan[prsn][y]%10==1){
						lastq=y;
						console.log("起点日-発見：plan["+prsn+"][→"+lastq+"]");
						break;//必ずどこかでbreakするはず
					}
				}
				if(lastq==-1){ console.log("plan[prsn][*]の最後の休日-発見できず：強制終了！");exit;}
				//連勤優先順で休日を設定できるか探索
				var point_better=200;//この階層での評価値point：200は一度も評価されてないの意味
				//[P]連勤優先順にプランを立てチェック関数でで評価を受ける
				for(var lwc=0; lwc<longwork.length; lwc++){
					console.log("探索：["+(prsn+1)/1+"]人["+(qsu+1)/1+"]日目 トライ："+(lwc+1)/1+"回目 総合再帰："+loop_counter+" 評価回数："+(checkplan_count++)+"　■開始");
					console.log("…longwork[ lwc："+lwc+" ]:"+longwork[lwc]);
					if(lastq+longwork[lwc]+1<=longworkMax) {console.log("…探索失敗：longworkMax以下:"+(lastq+longwork[lwc]+1)/1); continue;}
					if(lastq+longwork[lwc]+1>=daylengthy) {console.log("…探索失敗：daylengthy以上:"+(lastq+longwork[lwc]+1)/1); continue;}
					point=check_plan(prsn,qsu,lastq+longwork[lwc]+1,plan);//■■■■■■プランの評価
					//[A]評価がpoint_bestより良い場合→よい評価を獲得できる可能性あり
					if(point<point_best){
//					if(point==0){
						plan[prsn][lastq+longwork[lwc]+1]=1;
						console.log("…評価OK：plan["+prsn+"][→"+(lastq+longwork[lwc]+1)/1+"]");
						//[A-1]今の深度が最終深度の場合
						if(plan_count == plan_count_Max-1) {
							//[A-1-a]現行のpoint_estより良い評価だった場合
							if(point<point_best){
								console.log("最終深度：New RECORD!!! point_best:"+point_best+" -> "+point);
								point_best=point;//point_best更新
								day=copyArray(plan);//day[][]にplan[][]をコピー
								return point;
							} else {
							//[A-1-b]現行のpoint_estと同等以下の評価だった場合
								console.log("最終深度：point:"+point+" / point_best:"+point_best);
								return point;
							}
						} else {
						//[A-2]まだ最終深度に達していない場合→探索深度：plan_countをインクリメントして自分を再帰
							plan_count++;
							var result = planning(plan_count,plan);
							if(flag_stop){console.log("Forced termination!---loop_counter:MAX"); return 100;}
							//[A-2-a]戻り値が最高評価０の場合０を[返す]
							if(result==0){
								console.log("最高評価獲得！！！　return");
								return 0;
							} else {
							//[A-2-b]戻り値が最高評価０でない場合その値をpoint_betterと比較して良い方をpoint_betterに設定
								console.log("最高評価獲得ならず");
								if(point_better>result) point_better=result;
								plan[prsn][lastq+longwork[lwc]+1]=0;//今立てたプランを戻す
								plan_count--;//プラン深度も戻す
							}
						}
					}else{
					//[B]評価がpoint_bestと同等以下だった場合→これ以上この階層以下のプランに深度を進めて探索しても良い結果が得られない
					//→[P]に戻って次の優先順位のプランを立てる
						console.log("…評価NG：plan["+prsn+"][→"+(lastq+longwork[lwc]+1)/1+"]");
					}
				}
				//[Q]ここにたどりつくのは最高評価の0を得れなかったかこの階層の時点ですでにどのプランも最高評価を更新できない評価だった場合
				//今の階層のベター評価を[返す]
			console.log("plan作成終了\n最高評価の0を得れなかった\nplan：\n");
			disp_console_plan(plan,prsn);
				return point_better;
			}

			//[3]自動プランの結果を表示する
			console.log("plan作成関数の終了");
			console.log("day：\n");
			disp_console_plan(day,person.length-1);
			console.log("point_best:"+point_best);
			disp_day_check();

			//[4]自動プランの結果に対するメッセージをトースト表示する
			if(point_best==0) {
				toast("　　お待たせしました　　",3000);
			} else if(point_best<99) {
				toast("　　こんなプランですみません　　",4000);
			}else {
				toast("　　お騒がせして　誠に申し訳ございませんでした　　",5000);
			}

		});



		//■今月クリアボタンの処理
		$('#clear').click(function() {
			console.log("#clear：pressed");
			delete_day();//day[][]の今月部分のみを０にしcheck[][]とそのclassやtextも書換える
		});

		//■CSV出力ボタンの処理
		var clip = new ZeroClipboard(document.getElementById("csvcopy"));
		clip.on("ready", function() {
		});
		clip.on("beforecopy", function() {
			console.log("#csvcopy:pressed");
			//CSVデータの作成・BEGIN
			var str="平成"+(ym.substr(0,4)-1988)+"年"+(ym.substr(5,2)-0)+"月度　勤務シフト\n\n\t";
			for(var i=0; i<person.length; i++){
				str+=person[i]+"\t\t";
			}
			str+="備考\n";
			for(var y=longworkMax+1; y<daylengthy; y++){
				str+=day[person.length][y]+"\t";
				for( var x=0; x<person.length; x++){
					str+=( (day[x][y]%10==1) ? "休" : "" )+"\t\t";
				}
				str+="\n";
			}
			str+="\n\n\n";
			console.log("clipboard-data:\n"+str);
			//CSVデータの作成・END
			$('button#csvcopy').attr('data-clipboard-Text', str);
		});
		clip.on("aftercopy", function() {
			toast("クリップボードに CSV データを コピーしました",3000);
			//console.log("fire aftercopy");
		});

		//■ルール変更ボタンの処理
		$('#rule').click(function() {
			console.log("#rule：pressed");
			toast("　このサイトからは利用できません　");
			return;
		});

		//■データ保存ボタンの処理
		$('#saveD').click(function() {
			console.log("#saveD：pressed");
			//まずはすでに当月のファイルが保存されているか確認しあれば上書き注意の警告をする。OKもしくはファイルがなければ保存する
			$.get('s_data_exists.php',{filename:"data"+ym},function(text){
				if(text=="true"){
					if( confirm("当月のデータがすでに保存されています\n\r上書きしますか？\n\r") ){
						save_day();
					}
				} else {
					save_day();
				}
			});
			
			function save_day(){
			// PHPにday[][]配列とQrenQ[]配列、シフトルールに関する変数を渡しPHPからサーバに保存させる
			// 送るデータ形式はJSONでなければ、PHP側でエラーが出るのでJSON.stringify()でJSON形式に変換
			var param = {
				'filename': "data" + ym,
				'day': day,
				'QrenQ':QrenQ,
				'person':person,
				'longworkMax':longworkMax,
				'longworkMax_safe':longworkMax_safe,
				'longworkMin':longworkMin,
				'longwork':longwork,
				'Qsha':Qsha,
				'Qsha_safe':Qsha_safe,
				'Qsu':Qsu,
				'Qsat':Qsat,
				'Qsun':Qsun,
				'Qren':Qren,
				'Qss':Qss,
				'Qmon':Qmon,
				'leader': leader
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
            toast(" 当月の データを 保存しました ");
						flag["file_now"]=true;
						$('#file_exist_now').text("有");;
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

	//配列を参照ではなくコピーする関数：多次元配列も対応
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

//day[][]配列の今月(21日~20日)だけを全て0に設定　day[][]の値とそのclassとtext check[][]の値とそのclassとtextを書換え
function delete_day(){
	//まずはday[][]を全て０にしそのclassをfB0にtextは空にする
	for(var x = 0; x < person.length; x++){
		for(var y = longworkMax+1; y < daylengthy; y++){
			day[x][y]=0;
			$("#"+String(x*100+y)).attr('class', "fB0").text("");
		}
	}
	//次にチェック項目の確認＆変更
	chk_rule_all();
}

//今のday[][]配列の値をそのままcheckしday[][]とcheck[][]を表示する
function disp_day_check(){
	//まずはday[][]を全て０にしそのclassをfB0にtextは空にする
	for(var x = 0; x < person.length; x++){
		for(var y = longworkMax+1; y < daylengthy; y++){
			var str="f" + ((y>longworkMax)?"B":"A") + (day[x][y]%10);	// classの数値部分を反転してclass名に設定
			$("#"+String(x*100+y)).attr('class', str).text(((day[x][y]%10==1)?"○":""));
		}
	}
	//次にチェック項目の確認＆変更
	chk_rule_all();
}





//■■■■■■■■■■■■■■■■　disp plan to console　■■■■■■■■■■■■■■■■
function disp_console_plan(a,count){
	for (var i=0; i<=count; i++){
		console.log(""+a[i]);
	}
}
//■■■■■■■■■■■■■■■■　check_plan　■■■■■■■■■■■■■■■■

function check_plan(prsn,qsu,lastq,plan_reference){
			var plan = copyArray(plan_reference);//plan[][]をコピー（参照ではなく複製）
			var point=0;
			plan[prsn][lastq]=1;
			qsu++;
			console.log("□□□check_plan□□□");
			console.log("prsn:"+prsn+", lastq:"+lastq+", ++qsu:"+qsu+", plan:\n");
			disp_console_plan(plan,prsn);

	//00：休日者数
			console.log("…00：休日者数");
			var c = 0;//休日がQsha_safeを超えている日の日数
			for( var y=longworkMax+1; y < daylengthy; y++){
				var f=0;
				for( var x=0; x <= prsn; x++){
					f += plan[x][y]%10;
				}
				if( f > Qsha){console.log("…return 100: c > Qsha"); return 100; }
				c+=(f>Qsha_safe)?(f-Qsha_safe):0;
			}
			if( c > 0) {console.log("…point++: c > Qsha_safe poin:"+point+"->"+(point+c)/1);point+=c;}
			console.log("…__：OK   c:"+c);

	//01：休日日数
			console.log("…01：休日日数");
			c=0;
			for( i=longworkMax+1; i<=lastq; i++){
				if(plan[prsn][i]%10==1) c++;
			}
			if( c != qsu ) {console.log("…return 100: c != qsu"); return 100; }
			if( c > Qsu ) {console.log("…return 100: c > Qsu"); return 100; }
			console.log("…__：OK   c:"+c);

	//02：連休回数
			console.log("…02：連休回数");
			c=0;
			//※　前月度の最終日が休日の場合はそれも含めて計算 ３連休は連休2回　４連休は連休３回とカウント
			for( i=longworkMax; i<lastq; i++){
				if(plan[prsn][i]%10==1 && plan[prsn][i+1]%10==1) c++;
			}
			if(c > Qren) {console.log("…return 100: c > Qren"); return 100; }
			if(QrenQ[prsn] >0 &&  c > 0) {console.log("…return 100: QrenQ[prsn] >0 &&  c > 0"); return 100; }
			if(qsu==Qsu && QrenQ[prsn]==0 &&  c != Qren) {console.log("…return 100: qsu==Qsu && QrenQ[prsn]==0 &&  c != Qren  c:"+c); return 100; }
			console.log("…__：OK   c:"+c+", QrenQ["+prsn+"]:"+QrenQ[prsn]+", qsu:"+qsu+", Qsu:"+Qsu);

	//03：土曜休日
			console.log("…03：土曜休日");
			c=0;
			for( i=longworkMax+1; i<=lastq; i++){
				if(plan[prsn][i]%10==1 && day[person.length+1][i]%10==6) c++;
			}
			if( c > Qsat){console.log("…return 100: c > Qsat"); return 100; }
			if( qsu==Qsu && c != Qsat){console.log("…return 100: qsu==Qsu && c != Qsat"); return 100; }
			console.log("…__：OK   c:"+c);

	//04：日曜休日
			console.log("…04：日曜休日");
			c=0;
			for( i=longworkMax+1; i<=lastq; i++){
				if(plan[prsn][i]%10==1 && day[person.length+1][i]%10==0) c++;
			}
			if( c > Qsun){console.log("…return 100: c > Qsun"); return 100; }
			if( qsu==Qsu && c != Qsun){console.log("…return 100: qsu==Qsu && c != Qsun"); return 100; }
			console.log("…__：OK   c:"+c);

	//05：金土以外の連休
			console.log("…05：金土以外");
			c=0;
			for( var i=longworkMax; i<daylengthy-1; i++){　//※　前月度の最終日も含めて計算
				if(plan[person.length+1][i]%10!=5 && plan[prsn][i]%10==1 && plan[prsn][i+1]%10==1) c++;
			}
			if( c != Qss){console.log("…return 100: c != Qss"); return 100; }
			console.log("…__：OK   c:"+c);

	//06：最長連勤
			console.log("…06：最長連勤");
			c_max=0;
			for(var k=0; k<=prsn; k++){
				var y_max=(k==prsn && qsu!=Qsu)?lastq+1:daylengthy;
				c=0;
				for( var i=0; i<y_max-1; i++){　//※　前月度の直前数日(longworkMax)も含めて計算
					if(c==0 && plan[k][i]%10==0) continue;//前月度の最後の休日より前の最長連勤は無視する
					c=1;
					if(plan[k][i]%10==0){
						c=1;
						for(var j=i+1; j < y_max; j++){
							if(plan[k][j]%10==0){
								c++;
							} else{
								break;
							}
						}
						if(c > longworkMax){console.log("…return 100: c > longworkMax"); return 100; }
						if(c > longworkMax_safe)c_max++;
						i=j;
					}
				}
			}
			if(c_max > 0){console.log("…point++: c > longworkMax_safe: poin:"+point+"->"+(point+c_max)/1);point+=c_max;}
			console.log("…__：OK   c:"+c_max);

	//07：月曜休日
			console.log("…07：月曜休日");
			c=0;
			for( var i=longworkMax+1; i<daylengthy; i++){
				if(plan[prsn][i]%10==1 && plan[person.length+1][i]%10==1) c++;
			}
			if( c != Qmon){console.log("…return 100: c != Qmon"); return 100; }

	//99：全部ＯＫ！
			console.log("…99：ALL CLEAR! --- point:"+point);
			return point;

}

//■■■■■その他の関数群・END■■■■■■■■■■■■■■■■■■■■





//■■■■■ルールチェック関数群・BEGIN■■■■■■■■■■■■■■■■■■■■

//指定されたidのday[][]を押された後の処理：ルールをチェックし、check[][]の値変更 & class ＆ textも変更
function chk_rule_day( id ){
	var x=Math.floor(id/100);
	var y=id%100
	for(var i=0; i < checkitem.length; i++){
		var str = "";
		if(check_x_y[i]==HORIZON){
			//[ルール00]のチェック
			chk_rule(i,y);
			str = "#"+y+"c"+(("0"+i).substr(("0"+i).length-2,2));
			$( str ).attr('class', mc_chk(i,y)).text(check[i][y]);
			//console.log("check[rule:"+i+"]["+y+"]-id: "+str);
		}else{
			//[ルール01～]のチェック
			chk_rule(i,x);
			str = "#"+x+"c"+(("0"+i).substr(("0"+i).length-2,2));
			$( str ).attr('class', mc_chk(i,x)).text(check[i][x]);
			//console.log("check[rule:"+i+"]["+x+"]-id: "+str);
		}
	}

	//[ルール別枠：直前勤務シフトをクリックしたときのルール06最長連勤のチェック]
	if(y<=longworkMax){
		flag["prev_day_pressed"]=true;-//一度でもクリックしたら前月のday[][]との整合性判断フラグをたてる
		chk_rule("prev_lastweek",0);
		$('#togglebtn_a').attr('class', mc_tgl(0));
	}
}



//全てのチェック項目（"prev_lastweek"を除く）の確認＆変更
function chk_rule_all(){
	for(var i=0; i < checkitem.length; i++){
		var start = (check_x_y[i]==HORIZON) ? longworkMax+1:0;
		var end   = (check_x_y[i]==HORIZON) ? daylengthy   :person.length;
		for(var j = start; j < end; j++){
			chk_rule(i,j);
			var str = "#"+j+"c"+(("0"+i).substr(("0"+i).length-2,2));
			$( str ).attr('class', mc_chk(i,j)).text(check[i][j]);
		}
		//console.log("check[8][] : "+check[8]);
	}
}




//指定されたルール(item)のｘ番目(item:0の時のみday[][x]、item:1～はday[x][])をチェックし
//check[][]の変更 ＆ check[item][daylengthy]に総括を変更 ＆ 変更したcheck[][]の値を返す
function chk_rule(item,x){
	switch (item){
		//休日者数
		case 0:
			var c = 0;
			for( var i=0; i < person.length; i++){ c += day[i][x]%10;}
			check[item][x] = c;
			if( check[item][x]>Qsha)	check[item][daylengthy]++;
			return c;
			break;
		
		//休日日数
		case 1:
			var c=0;
			for( var i=longworkMax+1; i<daylengthy; i++){
				if(day[x][i]%10==1) c++;
			}
			check[item][x]=c;
			if( check[item][x] != Qsu)	check[item][person.length]++;
			return c;
			break;
		
		//連休回数
		case 2:
			var c=0;
			//※　前月度の最終日が休日の場合はそれも含めて計算 ３連休は連休2回　４連休は連休３回とカウント
			for( var i=longworkMax; i<daylengthy-1; i++){
				if(day[x][i]%10==1 && day[x][i+1]%10==1) c++;
			}
			check[item][x]=c;
			//前回連休がなく今月指定の連休回数でない場合と、前月も連休ありなのに今回も連休ありの場合のみカウント
			if((QrenQ[x]==0 &&  check[item][x] != Qren) ||(QrenQ[x]==1 &&  check[item][x] != 0))	check[item][person.length]++;
//console.log("check[連休回数]："+check[item][person.length]);
			return c;
			break;
		
		//土曜休日
		case 3:
			var c=0;
			for( var i=longworkMax+1; i<daylengthy; i++){
				if(day[x][i]%10==1 && day[person.length+1][i]%10==6) c++;
			}
			check[item][x]=c;
			if( check[item][x] != Qsat)	check[item][person.length]++;
			return c;
			break;
		
		//日曜休日
		case 4:
			var c=0;
			for( var i=longworkMax+1; i<daylengthy; i++){
				if(day[x][i]%10==1 && day[person.length+1][i]%10==0) c++;
			}
			check[item][x]=c;
			if( check[item][x] != Qsun)	check[item][person.length]++;
			return c;
			break;
		
		//金土以外の連休
		case 5:
			var c=0;
			for( var i=longworkMax; i<daylengthy-1; i++){　//※　前月度の最終日も含めて計算
				if(day[person.length+1][i]%10!=5 && day[x][i]%10==1 && day[x][i+1]%10==1) c++;
			}
			check[item][x]=c;
			if( check[item][x] != Qss)	check[item][person.length]++;
			return c;
			break;
		
		//最長連勤
		case 6:
			var c=0;
			var c_max=0;
			for( var i=0; i<daylengthy-1; i++){　//※　前月度の直前数日(longworkMax)も含めて計算
				if(c==0 && day[x][i]%10==0) continue;//前月度の最後の休日より前の最長連勤は無視する
				c=1;
				if(day[x][i]%10==0){
					c=1;
					for(var j=i+1; j < daylengthy; j++){
						if(day[x][j]%10==0){
							c++;
						} else{
							break;
						}
					}
					if(c > c_max) c_max=c;
					i=j;
				}
			}
			check[item][x]=c_max;
//			console.log("c_max : "+c_max);
			return c_max;
			break;
		
		//月曜休日
		case 7:
			var c=0;
			for( var i=longworkMax+1; i<daylengthy; i++){
				if(day[x][i]%10==1 && day[person.length+1][i]%10==1) c++;
			}
			check[item][x]=c;
			if( check[item][x] != Qmon)	check[item][person.length]++;
			return c;
			break;
		
		//リダ全休
		case 8:
			var c = 0;
			for( var i=0; i < person.length; i++){
				if(day[i][x]%10==1 && leader[i]==1){ //休日かつリーダーなら
					c++;
				}
			}
			check[item][x] = c;
			if( check[item][x]>=Qld) check[item][daylengthy]++;
			return c;
			break;
		
		//■[別枠チェック]：直前の最長連勤チェック
		//day[0～longworkMax][*]が1人でも全日出勤(0)ならflag["prev_lastweek"]=falseにし、OK(休日があった)だった人数を返す
		case "prev_lastweek":
			var f=false;
			var c=0;
			for(var x=0; x < person.length; x++){
				f=false;
				for( var y=0; y <=longworkMax; y++){
					if(day[x][y]%10==1){
						f=true;
						break;
					}
				}
				if(f)c++;
			}
			flag["prev_lastweek"]=( c==person.length ) ? true : false;
			return c;
			break;
		
		default :
			return 0;
			break;
		
	}
	
}
//■■■■■ルールチェック関数群・END■■■■■■■■■■■■■■■■■■■■

});
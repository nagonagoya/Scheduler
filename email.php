<?php
require("./PHPMailer_Class/class.phpmailer.php");
//言語設定、内部エンコーディングを指定する
mb_language("japanese");
mb_internal_encoding("UTF-8");

//日本語添付メールを送る
$to = "keykeikai@gmail.com"; //宛先
//$to = "h_kawamura@hrs-grp.co.jp"; //宛先
//$to = "keykeikai@gmail.com"; //宛先
$subject = "テストでーす"; //題名
$body="以下の内容でフォームより送信されました。nn";
$body="本文の内容を入れますn";
$from = "h_hayashi@hrs-grp.co.jp"; //送り主
//$attachfile = "temp_excel00.xls"; //添付ファイルパス

$mail = new PHPMailer();
$mail->CharSet = "iso-2022-jp";
$mail->Encoding = "7bit";

$mail->AddAddress($to);
$mail->From = $from;
$mail->FromName = mb_encode_mimeheader(mb_convert_encoding($fromname,"JIS","UTF-8"));
$mail->Subject = mb_encode_mimeheader(mb_convert_encoding($subject,"JIS","UTF-8"));
$mail->Body  = mb_convert_encoding($body,"JIS","UTF-8");

//添付ファイル追加
$mail->AddAttachment($attachfile);
$mail->AddAttachment($attachfile2);
$mail->Send(); //メール送信?>

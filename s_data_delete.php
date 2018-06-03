<?php
//-指定ファイルの削除---------------------------------------------------//

$file_name = $_GET["filename"];

if(file_exists( $file_name ) === false ){
	echo htmlspecialchars("削除する当月のデータがありません", ENT_QUOTES, "utf-8");
	return;
}

if(unlink( $file_name ) === true ){
	echo htmlspecialchars("当月のデータを削除しました", ENT_QUOTES, "utf-8");
	return;
}

echo htmlspecialchars("削除に失敗しました", ENT_QUOTES, "utf-8");
<?php
//-指定ファイルの有無---------------------------------------------------//

$file_name = $_GET["filename"];

if( file_exists( $file_name ) ){
	echo htmlspecialchars("true", ENT_QUOTES, "utf-8");
}else{
	echo htmlspecialchars("false", ENT_QUOTES, "utf-8");
}
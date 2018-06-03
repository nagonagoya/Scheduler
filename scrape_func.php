<?php

//----------------------------------------------------------------------//
//■スクレイピング (UTF-8)
//----------------------------------------------------------------------//
function ___scrape($url){
	//■読み込むURL
	$data = array(
		'url' => $url,
	);
	//■UserAgent偽装
	$header = Array(
		"Content-Type: application/x-www-form-urlencoded",
		"User-Agent: Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.63 Safari/537.36"
	);
	//■POST送信情報
	$options = array('http' => array(
		'method' => 'POST',
		'header'  => implode("\r\n", $header), 
		'content' => http_build_query($data),
	));
	$contents =  file_get_contents($url, false, stream_context_create($options));
	mb_language("Japanese");	//■コード変換前のおまじない
	$contents = mb_convert_encoding($contents, "UTF-8", "auto");//■UTF-8にｺｰﾄﾞ変換：
	return($contents);
}


//■参照したいURLを取得■
function getURL( $pURL ) {
   $_data = null;
   if( $_http = fopen( $pURL, "r" ) ) {
      while( !feof( $_http ) ) {
         $_data .= fgets( $_http, 1024 );
      }
      fclose( $_http );
   }
   return( $_data );
}



/*

$_rawData = getURL( "http://www.example.com/" );

*/


//■改行を半角スペースに変換し参照しやすくする■
function cleanString( $pString ) {
   $_data = str_replace( array( chr(10), chr(13), chr(9) ), chr(32), $pString );
      while( strpos( $_data, str_repeat( chr(32), 2 ), 0 ) != false ) {
         $_data = str_replace( str_repeat( chr(32), 2 ), chr(32), $_data );
      }
      return( trim( $_data ) );
}



/*

$_rawData = cleanString( $_rawData );

*/


//■前後の文字列を指定しその間の文字列を取得する■
//◆getBlock("開始文字列","終了文字列","参照するソース",false)◆
function getBlock( $pStart, $pStop, $pSource, $pPrefix = true ) {
   $_data = null;
   $_start = strpos( strtolower( $pSource ), strtolower( $pStart ), 0 );
   $_start = ( $pPrefix == false ) ? $_start + strlen( $pStart ) : $_start;
   $_stop = strpos( strtolower( $pSource ), strtolower( $pStop ), $_start );
   if( $_start > strlen( $pElement ) && $_stop > $_start ) {
      $_data = trim( substr( $pSource, $_start, $_stop - $_start ) );
   }
   return( $_data );
}

//■HTMLタグから取得する■
//◆getElement("タグ名","参照するソース")◆
function getElement( $pElement, $pSource ) {
   $_data = null;
   $pElement = strtolower( $pElement );
   $_start = strpos( strtolower( $pSource ), chr(60) . $pElement, 0 );
   $_start = strpos( $pSource, chr(62), $_start ) + 1;
   $_stop = strpos( strtolower( $pSource ), "</" . $pElement .    chr(62), $_start );
   if( $_start > strlen( $pElement ) && $_stop > $_start ) {
      $_data = trim( substr( $pSource, $_start, $_stop - $_start ) );
   }
   return( $_data );
}



/*

$_rawData = getBlock( start_string, end_string, raw_source, include_start_string );
$_rawData = getElement( html_tag, raw_source );

*/



/*

$_count = getBlock( "Total of", "results", $_rawData, false );

*/



/*

$_count = getElement( "b", $_rawData );

*/



?>

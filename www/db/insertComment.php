<?php
include "db.php";
$id = $_GET['id'];
$idUser = $_GET['idUser'];
$comment = $_GET['comment'];
date_default_timezone_set('Europe/Lisbon');
$date = date('Y/m/d H:i:s', time());
$row=mysqli_fetch_array($result,MYSQLI_NUM);
$query1="INSERT INTO REPORT (`description`,`dateReport`,`USERS_idUSERS`,`POSTS_idPOSTS`) VALUES ('$comment','$date','$idUser','$id')";
$q1=mysqli_query($link,$query1);
?>
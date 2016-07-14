<?php
include "db.php";
$id = $_GET['id'];
$idUser = $_GET['idUser'];
$row=mysqli_fetch_array($result,MYSQLI_NUM);
$query1="DELETE FROM `deca-wave`.`POSTS` WHERE `POSTS`.`idPOSTS` = ".$id;
$q1=mysqli_query($link,$query1);
echo $query1;
?>
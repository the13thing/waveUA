<?php
include "db.php";
$id = $_GET['id'];
$idUser = $_GET['idUser'];
$row=mysqli_fetch_array($result,MYSQLI_NUM);
$query1="INSERT INTO SUBSCRIPTIONS (`USERS_idUSERS`,`USERS_idUSERS1`) VALUES ('$idUser','$id')";
$q1=mysqli_query($link,$query1);
echo $query1;
?>
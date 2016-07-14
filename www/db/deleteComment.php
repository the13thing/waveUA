<?php
include "db.php";
$id = $_GET['id'];
$row=mysqli_fetch_array($result,MYSQLI_NUM);
$query1="DELETE FROM `deca-wave`.`REPORT` WHERE `REPORT`.`idREPORT` = ".$id;
$q1=mysqli_query($link,$query1);
echo $query1;
?>
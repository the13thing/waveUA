<?php
include "db.php";
$id = $_GET['id'];
$idUser = $_GET['idUser'];
$query="SELECT * FROM `SUBSCRIPTIONS` WHERE USERS_idUSERS='".$idUser."' AND `SUBSCRIPTIONS`.`USERS_idUSERS1` = '$id'";
$result=mysqli_query($link,$query);
if ($result -> num_rows) {
    $result = mysqli_query($link, $query);
    $row=mysqli_fetch_array($result,MYSQLI_NUM);
}
$query1="DELETE FROM `SUBSCRIPTIONS` WHERE `SUBSCRIPTIONS`.`idSub` = '$row[0]' AND `SUBSCRIPTIONS`.`USERS_idUSERS` = '$idUser'";
$q1=mysqli_query($link,$query1);
echo $query1;
?>
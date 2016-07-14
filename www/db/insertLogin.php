<?php
include "db.php";
$name = $_GET['nameUser'];
$id = $_GET['idUser'];
$img = $_GET['imgUser'];
$imgC = $_GET['oe'];
date_default_timezone_set('Europe/Lisbon');
$date = date('Y/m/d H:i:s', time());
$query="SELECT * FROM `USERS` WHERE `idUSERS` LIKE '".$id."'";
$query1="INSERT INTO USERS (`idUSERS`,`nameUser`,`email`,`foto`,`dateUsers`,`type`) VALUES ('$id','$name','','$img&oe=$imgC','$date','1')";
$result=mysqli_query($link,$query);
if ($result -> num_rows){
    $row=mysqli_fetch_array($result,MYSQLI_NUM);
    echo $row[5];
}
else {
    $q=mysqli_query($link,$query1);
}

?>
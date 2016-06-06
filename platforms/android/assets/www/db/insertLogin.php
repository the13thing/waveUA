<?php
include "db.php";
$name = $_POST['nameUser'];
$id = $_POST['idUser'];
date_default_timezone_set('Europe/Lisbon');
$date = date('Y/m/d h:i:s a', time());
$query="SELECT * FROM `users` WHERE `idUSERS` LIKE '".$id."'";
$query1="INSERT INTO users (`idUSERS`,`nameUser`,`email`,`foto`,`dateUsers`,`type`) VALUES ('$id','$name','','','$date','1')";
$result=mysqli_query($link,$query);
if ($result -> num_rows){
    echo "existe";
}
else {
    $q=mysqli_query($link,$query1);
}

?>
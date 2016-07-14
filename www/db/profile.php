<?php
include "db.php";
$idUser = $_GET['user'];

if ($userF = $_GET['userF']){
    $query="SELECT * FROM `SUBSCRIPTIONS` WHERE USERS_idUSERS='".$userF."'";
    $result=mysqli_query($link,$query);
    if ($result -> num_rows) {
        $result=mysqli_query($link,$query);
        $row=array();
        while ($r = mysqli_fetch_assoc($result)){
            $row[]=$r;
        }
        echo json_encode($row);
    }
    else {
        echo '{"result":"empty"}';
    }
}
else {
    $query="SELECT * FROM `USERS` WHERE idUSERS='".$idUser."'";
    $result=mysqli_query($link,$query);
    $row=array();
    while ($r = mysqli_fetch_assoc($result)){
        $row[]=$r;
    }
    echo json_encode($row);
}
?>

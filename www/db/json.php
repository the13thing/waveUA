<?php
include "db.php";
if ($idUser = $_GET['subs']){
    $query="SELECT * FROM `SUBSCRIPTIONS` WHERE USERS_idUSERS='".$idUser."'";
    $result=mysqli_query($link,$query);
    $row=array();
    while ($r = mysqli_fetch_assoc($result)){
        $row[]=$r;
    }
    echo json_encode($row);
}
elseif ($idUser = $_GET['subsFol']){
    $query="SELECT * FROM `SUBSCRIPTIONS` WHERE USERS_idUSERS1='".$idUser."'";
    $result=mysqli_query($link,$query);
    $row=array();
    while ($r = mysqli_fetch_assoc($result)){
        $row[]=$r;
    }
    echo json_encode($row);
}
else {
    $idUser = $_GET['user'];
    $query="SELECT * FROM `POSTS` INNER JOIN MUSICS ON POSTS.MUSICS_idmusics=MUSICS.idmusics INNER JOIN USERS ON POSTS.USERS_idUSERS=USERS.idUSERS WHERE USERS.idUSERS='".$idUser."' ORDER BY `datePosts` DESC";
    $result=mysqli_query($link,$query);
    $row=array();
    while ($r = mysqli_fetch_assoc($result)){
        $row[]=$r;
    }
    echo json_encode($row);
}
?>

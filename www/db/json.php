<?php
include "db.php";
$data=array();
$query="SELECT * FROM musics";
$result=mysqli_query($link,$query);
$row=array();
while ($r = mysqli_fetch_assoc($result)){
    $row[]=$r;
}
echo json_encode($row)
?>

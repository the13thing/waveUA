<?php
include "db.php";
$title=$_POST['title'];
$artist=$_POST['artist'];
$album=$_POST['album'];
$q=mysqli_query($link,"INSERT INTO musics (`name`,`artist`,`album`) VALUES ('$title','$artist','$album')");
$query="SELECT * FROM `musics` WHERE `name` LIKE '".$title."'";
$result=mysqli_query($link,$query);
while ($row = mysqli_fetch_array($result)) {
    $data=$row;
}
$q1=mysqli_query($link,"INSERT INTO musics_has_playlists (`MUSICS_idmusics`,`PLAYLISTS_idPLAYLISTS`) VALUES ('$data[0]','1')");

if($q&&$q1)
    echo "ok";
else
    echo "error";

?>
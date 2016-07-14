<?php
include "db.php";
$id = $_GET['id'];
$row=mysqli_fetch_array($result,MYSQLI_NUM);
$query1="SELECT * FROM REPORT INNER JOIN USERS ON REPORT.USERS_idUSERS=USERS.idUSERS WHERE `POSTS_idPOSTS` LIKE $id";
$result=mysqli_query($link,$query1);
if ($result -> num_rows) {
    while ($r = mysqli_fetch_assoc($result)) {
        $row[] = $r;
    }
    $output = json_encode($row);
    echo $output;
}
?>
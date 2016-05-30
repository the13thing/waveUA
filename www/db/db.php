<?php
header("Access-Control-Allow-Origin: *");
<<<<<<< HEAD
$servername = "mysql-sa.mgmt.ua.pt";
$username = "deca-wave-dbo";
$password = "tMBNA9C6sex2LYCD";
$db = "deca-wave";
=======
$servername = "localhost";
$username = "root";
$password = "";
$db = "mydb";
>>>>>>> 2e77bb76f2cfe24632930a9f6fd8bbdff2cda4a0

// Create connection
$link = new mysqli($servername, $username, $password, $db);

// Check connection
if ($link->connect_error) {
    die("Connection failed: " . $link->connect_error);
}
?>

<?php
// This file is used to display a thank you message after the form is submitted.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = 'vladimirpoesenaers@gmail.com';
    $subject = 'Bestelling Astamorris 2.0 - ' . ($_POST['firstname'] ?? '') . ' ' . ($_POST['name'] ?? '');
    $headers = "From: noreply@astamorris.be\r\n";
    $headers .= "Cc: kevin.van.humbeeck@gmail.com\r\n";
    $headers .= "Reply-To: noreply@astamorris.be\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    $message = "<html><body>";
    $message .= "<h2>Er is een nieuwe bestelling ontvangen:</h2>";
    foreach ($_POST as $key => $value) {
        // Skip keys starting with 'size', 'color', or 'amount'
        if (preg_match('/^(size|color|amount)/i', $key)) {
            continue;
        }
    
        // If key is 'basketItems', output as table and store for later use
        if ($key === 'basketItems') {
            $basketItems = json_decode($value, true); // true for associative arrays

            $basketTable = "<table border='1' cellpadding='5' cellspacing='0'><tr><th>Artikel</th><th>Maat</th><th>Kleur</th><th>Aantal</th><th>Prijs</th></tr>";
            foreach ($basketItems as $item) {
                $basketTable .= "<tr>";
                $basketTable .= "<td>" . htmlspecialchars($item['name'] ?? '') . "</td>";
                $basketTable .= "<td>" . htmlspecialchars($item['size'] ?? '') . "</td>";
                $basketTable .= "<td>" . htmlspecialchars($item['color'] ?? '') . "</td>";
                $basketTable .= "<td>" . htmlspecialchars($item['amount'] ?? '') . "</td>";
                $basketTable .= "<td> &euro; " . htmlspecialchars($item['price'] * ($item['amount'] ?? 0)) . "</td>";
                $basketTable .= "</tr>";
            }
            $basketTable .= "</table>";
            $message .= "<h3>Basket Items:</h3>";
            continue;
        }
    
        $message .= "<strong>" . ucfirst(htmlspecialchars($key)) . ":</strong> " . htmlspecialchars($value) . "<br>";
    }
    $message .= "</body></html>";
    $message .= $basketTable;
    
    mail($to, $subject, $message, $headers);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Astamorris 2.0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Kevin Van Humbeeck">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="container">
        <img id="logo" src="img/logo.png" alt="Logo" width="850" height="383">
        <hr />
        <div class="desc">
            Bedankt voor je bestelling! <br />
            U mag <span class="highlight">&euro; <?php echo $_POST['basketTotal']; ?></span> overschrijven op rekeningnummer <span class="highlight">BE68 7555 7149 3034</span> met vermelding <span class="highlight">Astamorris <?php echo $_POST['firstname'] . ' ' . $_POST['name']; ?></span>. <br />
            U ontvangt een mail wanneer uw bestelling naar u werd verzonden of wanneer u deze kan ophalen.
            <br><br>
            <?php
            if (isset($basketTable)) {
                echo $basketTable;
            }
            ?>
        </div>
    </body>
</html>
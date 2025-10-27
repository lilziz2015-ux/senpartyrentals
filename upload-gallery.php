<?php
// ========== CONFIG ==========
$upload_dir = "gallery/";  // Folder for uploads
$password = "SenParty123"; // Change this password

// ========== PASSWORD PROTECT ==========
if (!isset($_POST['password']) || $_POST['password'] !== $password) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gallery Upload | Sen Party Rentals</title>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background: #f5f9ff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #333;
        }
        form {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
        }
        input[type=password], input[type=submit] {
          padding: 0.6rem;
          margin-top: 1rem;
          width: 100%;
          font-size: 1rem;
          border-radius: 6px;
          border: 1px solid #0077ff;
        }
        input[type=submit] {
          background: #0077ff;
          color: white;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <form method="POST">
        <h2>🔐 Gallery Upload Access</h2>
        <p>Enter your password to upload new media.</p>
        <input type="password" name="password" placeholder="Enter password" required>
        <input type="submit" value="Access Uploads">
      </form>
    </body>
    </html>
    <?php
    exit;
}

// ========== HANDLE UPLOAD ==========
$message = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $allowed = ['jpg','jpeg','png','webp','mp4'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        $message = "❌ File type not allowed.";
    } else {
        $new_name = uniqid('media_') . '.' . $ext;
        $target = $upload_dir . $new_name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $message = "✅ Upload successful! Saved as $new_name";
        } else {
            $message = "⚠️ Upload failed. Check folder permissions.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upload to Gallery | Sen Party Rentals</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #bbdefb, #e3f2fd);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      color: #333;
    }
    .upload-box {
      background: #fff;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      text-align: center;
      width: 400px;
    }
    input[type=file], input[type=submit] {
      margin-top: 1rem;
      width: 100%;
      padding: 0.6rem;
      border-radius: 6px;
      border: 1px solid #0077ff;
    }
    input[type=submit] {
      background: #0077ff;
      color: white;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    .msg { margin-top: 1rem; font-weight: 600; }
    a {
      display: inline-block;
      margin-top: 1rem;
      color: #0077ff;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="upload-box">
    <h2>📸 Upload New Media</h2>
    <form method="POST" enctype="multipart/form-data">
      <input type="hidden" name="password" value="<?php echo $password; ?>">
      <input type="file" name="file" accept="image/*,video/*" required>
      <input type="submit" value="Upload">
    </form>
    <?php if($message): ?>
      <p class="msg"><?php echo $message; ?></p>
    <?php endif; ?>
    <a href="gallery.html">← Back to Gallery</a>
  </div>
</body>
</html>

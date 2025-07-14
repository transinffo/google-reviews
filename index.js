const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// При старте — обновим отзывы
exec('node scrape.js', (err, stdout, stderr) => {
  if (err) console.error(stderr);
  else console.log(stdout);
});

app.get('/', (req, res) => {
  let reviews = [];
  try {
    reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
  } catch (err) {
    reviews = [];
  }

  const html = reviews.map(r => `
    <div style="border:1px solid #ccc; padding:10px; margin:10px;">
      <strong>${r.author_name}</strong> – ★${r.rating}<br/>
      <em>${r.relative_time_description}</em><br/>
      <p>${r.text}</p>
    </div>
  `).join('');

  res.send(`
    <html>
      <head><title>Google Відгуки</title></head>
      <body>
        <h1>Останні відгуки</h1>
        ${html}
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));

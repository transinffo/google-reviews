const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  let reviews = [];
  try {
    reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
  } catch {
    reviews = [];
  }

  let html = reviews.map(r => `
    <div style="border:1px solid #ccc; margin:10px; padding:10px;">
      <strong>${r.author}</strong> — ${r.rating}<br/>
      <small>${r.date}</small>
      <p>${r.text}</p>
    </div>
  `).join('');

  res.send(`
    <html><head><title>Отзывы Google</title></head>
    <body>
      <h1>Отзывы</h1>
      ${html}
    </body></html>
  `);
});

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

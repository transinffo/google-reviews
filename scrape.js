const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = 'https://www.google.com/maps/place/?q=place_id:ChIJf1l0juHP1EAR9vrR9S19wGk';

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Ждём появления кнопки "Отзывы"
  await page.waitForSelector('[aria-label="Отзывы"]', { timeout: 10000 });

  // Кликаем на кнопку "Отзывы"
  await page.click('[aria-label="Отзывы"]');

  // Ждём контейнер с отзывами
  await page.waitForSelector('.section-review-content', { timeout: 10000 });

  // Собираем отзывы
  const reviews = await page.evaluate(() => {
    const nodes = document.querySelectorAll('.section-review-content');
    const data = [];
    nodes.forEach(node => {
      const author = node.querySelector('.section-review-title')?.innerText.trim() || '';
      const rating = node.querySelector('.section-review-stars')?.getAttribute('aria-label') || '';
      const date = node.querySelector('.section-review-publish-date')?.innerText.trim() || '';
      const text = node.querySelector('.section-review-text')?.innerText.trim() || '';
      data.push({ author, rating, date, text });
    });
    return data;
  });

  await browser.close();

  // Записываем отзывы в файл
  fs.writeFileSync('reviews.json', JSON.stringify(reviews, null, 2));
  console.log(`Отзывы собраны: ${reviews.length}`);
})();

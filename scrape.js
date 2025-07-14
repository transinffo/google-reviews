const { scrapeReviews } = require('google-reviews-scraper');
const fs = require('fs');

(async () => {
  try {
    const placeId = 'ChIJ4zvW9oPz1EAROeO3nS1OcS8'; // ЗАМЕНИ НА СВОЙ Place ID
    const reviews = await scrapeReviews({ placeId, language: 'uk' });

    fs.writeFileSync('reviews.json', JSON.stringify(reviews, null, 2));
    console.log('Отзывы успешно обновлены!');
  } catch (error) {
    console.error('Ошибка при парсинге:', error.message);
  }
})();

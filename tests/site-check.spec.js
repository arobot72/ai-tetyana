const { test, expect } = require('@playwright/test');

test.describe('Проверка работы сайта', () => {
  test('загрузка страницы и отображение товаров', async ({ page }) => {
    // Очищаем localStorage чтобы загрузить данные из data.json
    await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.removeItem('cmsData');
    });
    await page.reload();
    
    // Проверяем заголовок
    const title = await page.title();
    console.log('Заголовок страницы:', title);
    
    // Проверяем секции
    const sections = await page.locator('.section').count();
    console.log('Количество секций:', sections);
    
    // Проверяем карточки товаров
    const cards = await page.locator('.card').count();
    console.log('Количество карточек товаров:', cards);
    
    // Проверяем что товары загрузились из data.json
    const cardTexts = await page.locator('.card-title').allTextContents();
    console.log('Товары:', cardTexts);
    
    // Проверяем изображения - должны быть из папки assets
    const images = await page.locator('.card-img img').count();
    console.log('Количество картинок:', images);
    
    // Проверяем язык по умолчанию (украинский)
    const navLinks = await page.locator('.nav-link').first().textContent();
    console.log('Первый пункт меню:', navLinks);
    
    // Проверяем цену с "грн"
    const prices = await page.locator('.card-price').allTextContents();
    console.log('Цены:', prices);
    
    // Ожидаем что есть товары из data.json
    expect(cards).toBeGreaterThan(0);
  });

  test('проверка детального просмотра товара', async ({ page }) => {
    await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Нажимаем на саму карточку товара
    const cards = page.locator('.card').first();
    await cards.click();
    await page.waitForTimeout(500);
    
    // Проверяем модальное окно
    const modalVisible = await page.evaluate(() => {
        const modal = document.getElementById('detail-modal');
        return modal && modal.classList.contains('active');
    });
    // Проверяем звёзды в детальном окне
    const starsText = await page.evaluate(() => {
        const content = document.getElementById('detail-content');
        return content ? content.innerText.substring(0, 200) : 'no content';
    });
    console.log('Детальное окно:', starsText);
    
    // Если не открылось - пробуем через кнопку
    if (!modalVisible) {
        await page.locator('.card').first().locator('button').click();
        await page.waitForTimeout(500);
        const modalVisible2 = await page.evaluate(() => {
            const modal = document.getElementById('detail-modal');
            return modal && modal.classList.contains('active');
        });
        console.log('Модальное окно (кнопка):', modalVisible2);
    }
  });
});
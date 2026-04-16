const { test, expect } = require('@playwright/test');

test('очистить и добавить', async ({ page }) => {
  await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
  
  // ОЧИЩАЕМ localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  
  await page.click('a:has-text("Admin")');
  await page.fill('#admin-login', 'admin');
  await page.fill('#admin-password', 'admin123');
  await page.click('button:has-text("Вхід")');
  await page.waitForSelector('.admin-panel.active');
  
  // Добавляем товар
  await page.fill('input[name="title_ua"]', 'Послуги перекладу');
  await page.fill('textarea[name="desc_ua"]', 'Професійний переклад');
  await page.fill('input[name="price"]', '150');
  await page.click('button:has-text("💾 Зберегти")');
  await page.waitForTimeout(500);
  
  // Добавляем раздел
  await page.click('button:has-text("Розділи")');
  await page.waitForSelector('#admin-sections.active');
  await page.waitForTimeout(500);
  await page.fill('#section-form input[name="title_ua"]', 'Переклад');
  await page.fill('#section-form input[name="tags"]', '#Переклад');
  await page.click('#save-section-btn');
  await page.waitForTimeout(500);
  
  // Открываем сайт и проверяем
  await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
  
  const content = await page.content();
  console.log('Есть Переклад на сайте:', content.includes('Переклад'));
});
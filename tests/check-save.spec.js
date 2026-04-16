const { test, expect } = require('@playwright/test');

test('проверка сохранения данных после перезагрузки', async ({ page }) => {
  await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
  
  // Очищаем и добавляем данные
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
  
  // Перезагружаем страницу
  await page.reload();
  
  // Входим снова
  await page.click('a:has-text("Admin")');
  await page.fill('#admin-login', 'admin');
  await page.fill('#admin-password', 'admin123');
  await page.click('button:has-text("Вхід")');
  await page.waitForSelector('.admin-panel.active');
  
  // Проверяем что данные сохранились
  const items = await page.locator('#items-list').textContent();
  const sections = await page.locator('#sections-list').textContent();
  
  console.log('Товары:', items);
  console.log('Разделы:', sections);
  
  expect(items).toContain('Послуги перекладу');
  expect(sections).toContain('Переклад');
});
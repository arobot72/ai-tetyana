// test-admin.spec.js - Тест админ-панели
const { test, expect } = require('@playwright/test');

test.describe('Админ-панель', () => {
  test('добавление нового товара', async ({ page }) => {
    test.setTimeout(15000);
    
    // Открываем страницу
    await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
    
    // Очищаем localStorage для чистого состояния
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Открываем админ-панель через ссылку Admin в подвале
    await page.click('a:has-text("Admin")');
    
    // Вводим логин и пароль
    await page.fill('#admin-login', 'admin');
    await page.fill('#admin-password', 'admin123');
    await page.click('button:has-text("Вхід")');
    
    // Проверяем что админ-панель открылась
    await expect(page.locator('.admin-panel')).toBeVisible({ timeout: 5000 });
    
    // Заполняем форму нового товара
    await page.fill('input[name="title_ua"]', 'Тестовый товар');
    await page.fill('textarea[name="desc_ua"]', 'Тестовое описание');
    await page.fill('input[name="price"]', '500');
    
    // Сохраняем товар
    await page.click('button:has-text("💾 Зберегти")');
    await page.waitForTimeout(500);
    
    // Проверяем что товар сохранился в списке
    await expect(page.locator('#items-list')).toContainText('Тестовый товар');
  });

  test('добавление нового раздела', async ({ page }) => {
    test.setTimeout(15000);
    
    // Открываем страницу
    await page.goto('file:///Users/au/Downloads/AI-Project/ai-tetyana/index.html');
    
    // Очищаем localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Открываем админ-панель
    await page.click('a:has-text("Admin")');
    
    // Входим
    await page.fill('#admin-login', 'admin');
    await page.fill('#admin-password', 'admin123');
    await page.click('button:has-text("Вхід")');
    
    // Переходим в раздел "Розділи"
    await page.click('button:has-text("Розділи")');
    
    // Явно ждём активации секции и видимости формы
    await page.waitForSelector('#admin-sections.active', { timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Заполняем форму нового раздела - используем локатор внутри формы раздела
    const sectionForm = page.locator('#section-form');
    await sectionForm.locator('input[name="title_ua"]').fill('Тестовый раздел');
    await sectionForm.locator('textarea[name="description_ua"]').fill('Тестовое описание');
    await sectionForm.locator('input[name="tags"]').fill('#Тег1, #Тег2');
    
    // Сохраняем раздел
    await page.click('#save-section-btn');
    await page.waitForTimeout(500);
    
    // Проверяем что раздел сохранился
    await expect(page.locator('#sections-list')).toContainText('Тестовый раздел');
  });
});
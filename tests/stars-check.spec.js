const { test, expect } = require('@playwright/test');

test('проверка звёзд для товара с рейтингом 4.5 (как в админке)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
        localStorage.clear();
        const testData = {
            items: [{
                id: 999,
                short: 'test',
                title: { ua: 'Тестовий товар', en: 'Test Item' },
                description: { ua: 'Опис', en: 'Desc' },
                details: { ua: 'Деталі', en: 'Details' },
                rating: 4.5,
                price: 1000,
                price_type: 'course',
                tags: ['courses'],
                detailed: true,
                show: true
            }],
            sections: [{
                id: 1,
                short: 'courses',
                title: { ua: 'Курси', en: 'Courses' },
                description: { ua: 'Опис', en: 'Desc' },
                tags: ['courses'],
                section_type: 'courses',
                template: 'cards',
                show: true,
                order: 1
            }],
            tags: [{id:1, name:'courses', description:'Курси'}],
            contacts: {}
        };
        localStorage.setItem('cmsData', JSON.stringify(testData));
    });
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Нажимаем на товар
    await page.locator('.card-btn').first().click();
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
        const content = document.getElementById('detail-content');
        const text = content.innerText;
        const match = text.match(/([★☆⯪]+)\s+([\d.]+)/);
        return match ? { stars: match[1], value: match[2] } : { error: 'No stars' };
    });
    
    console.log('Rating 4.5 -> stars:', result);
    // 4.5 / 2 = 2.25 -> 2 полные звезды, без полузвезды
    expect(result.stars).toBe('★★☆☆☆');
});
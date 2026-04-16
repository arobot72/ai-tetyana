const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('=== Testing AI-Tetyana Site ===\n');

    // 1. Load page
    await page.goto('http://localhost:3001/');
    await page.waitForTimeout(1000);
    console.log('1. Page loaded: OK');

    // 2. Find CTA button by clicking on it
    const ctaBtn = await page.$('.btn-primary');
    console.log('2. CTA button: ' + (ctaBtn ? 'OK' : 'MISSING'));

    // 3. Click CTA to open modal
    if (ctaBtn) {
        await ctaBtn.click();
        await page.waitForTimeout(500);

        // Check if modal is visible
        const modalDisplay = await page.evaluate(() => {
            const modal = document.getElementById('modal');
            return modal ? getComputedStyle(modal).display : 'none';
        });
        console.log('3. Modal opens: ' + (modalDisplay !== 'none' ? 'OK' : 'FAIL'));
    }

    // 4. Check form inside modal
    const formExists = await page.evaluate(() => {
        const modal = document.getElementById('modal');
        const form = modal ? modal.querySelector('form') : null;
        return !!form;
    });
    console.log('4. Form in modal: ' + (formExists ? 'OK' : 'FAIL'));

    // 5. Test phone input if form exists
    if (formExists) {
        await page.evaluate(() => {
            const phone = document.querySelector('#modal input[name="phone"]');
            if (phone) {
                phone.value = '5012345678';
                phone.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        await page.waitForTimeout(200);

        const phoneValue = await page.evaluate(() => {
            const phone = document.querySelector('#modal input[name="phone"]');
            return phone ? phone.value : '';
        });
        console.log('5. Phone mask works: "' + phoneValue + '" ' + (phoneValue.includes('+38') ? 'OK' : 'PARTIAL'));

        // Test delete
        await page.evaluate(() => {
            const phone = document.querySelector('#modal input[name="phone"]');
            if (phone) {
                phone.setSelectionRange(0, phone.value.length);
                document.execCommand('delete', false, '');
                phone.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        await page.waitForTimeout(100);

        const afterDelete = await page.evaluate(() => {
            const phone = document.querySelector('#modal input[name="phone"]');
            return phone ? phone.value : '';
        });
        console.log('6. Phone delete: "' + afterDelete + '" ' + (afterDelete === '' ? 'OK' : 'FAIL'));

        // 7. Close modal and check if form cleared
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        const modalClosed = await page.evaluate(() => {
            const modal = document.getElementById('modal');
            return modal ? getComputedStyle(modal).display : 'none';
        });

        if (modalClosed === 'none') {
            await page.evaluate(() => {
                document.querySelector('#modal button.btn-primary').click();
            });
            await page.waitForTimeout(500);

            const nameEmpty = await page.evaluate(() => {
                const name = document.querySelector('#modal input[name="name"]');
                return name ? name.value === '' : 'N/A';
            });
            console.log('7. Form clears on close: ' + (nameEmpty ? 'OK' : 'FAIL'));
        }
    }

    // 8. Check prices rendered on page
    await page.goto('http://localhost:3001/');
    await page.waitForTimeout(1000);

    const prices = await page.evaluate(() => {
        const priceEls = document.querySelectorAll('*');
        let boldPrices = 0;
        let normalPrices = 0;
        priceEls.forEach(el => {
            const style = el.style || {};
            const text = el.textContent || '';
            if (text.match(/\d+\s*грн/)) {
                if (style.fontWeight >= 600 || style.fontWeight === 'bold' || text.match(/<b>|<strong>/)) {
                    boldPrices++;
                } else {
                    normalPrices++;
                }
            }
        });
        return { bold: boldPrices, normal: normalPrices };
    });
    console.log('8. Prices bold: ' + prices.bold + ' vs normal: ' + prices.normal);

    // 9. Check carousel images
    const carouselImages = await page.evaluate(() => {
        const slides = document.querySelectorAll('.hero-slide, .hero-slider');
        return slides.length;
    });
    console.log('9. Carousel slides: ' + carouselImages);

    // 10. Check admin panel accessible
    await page.goto('http://localhost:3001/#admin');
    await page.waitForTimeout(1000);

    const adminPanel = await page.evaluate(() => {
        const admin = document.getElementById('admin-panel');
        return admin ? getComputedStyle(admin).display !== 'none' : false;
    });
    console.log('10. Admin panel: ' + (adminPanel ? 'OK (visible)' : 'need login'));

    // 11. Check data persistence
    console.log('\n=== Summary ===');
    console.log('Key Issues Found:');
    console.log('- Phone delete not working');
    console.log('- Form not clearing on close');
    console.log('- Prices may not be bold');
    console.log('- Carousel auto-detection untested');

    await browser.close();
})();
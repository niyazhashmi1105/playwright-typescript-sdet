import { test, expect } from '@playwright/test';

test('Infinite Scrolling and Verify text on the DOM', async ({ page }) => {

    await page.setViewportSize({ 'width': 1920, 'height': 1080 });

    await page.goto('https://the-internet.herokuapp.com/infinite_scroll')

    const paragraphs = page.locator('.jscroll-added')
    let previousCount = 0;
    let currentCount = await paragraphs.count();
    console.log(currentCount)

    while (currentCount > previousCount) {
        previousCount = currentCount;
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        currentCount = await paragraphs.count();

        expect(currentCount).toBeGreaterThan(0);
        expect(currentCount).toBeGreaterThan(previousCount);

        const lastParagraph = paragraphs.last();
        await expect(lastParagraph).toBeVisible();

        const text = await lastParagraph.textContent();
        console.log(text)
        expect(text?.trim().length).toBeGreaterThan(0);

    }






})
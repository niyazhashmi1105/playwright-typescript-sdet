import { test, expect } from '@playwright/test'

test("Mock Fruit aand doesn't call API", async ({ page }) => {

    page.setViewportSize({ 'width': 1920, 'height': 1020 })
    await page.route("*/**/api/v1/fruits", async route => {
        const json = [{ name: 'Jack Fruit', id: 100 }]
        await route.fulfill({ json })
    })

    await page.goto('https://demo.playwright.dev/api-mocking');
    await expect(page.getByText('Jack Fruit')).toBeVisible();
    await page.waitForTimeout(5000)
})

test('Intercept Request and Mock the response', async ({ page }) => {

    page.setViewportSize({ 'width': 1920, 'height': 1020 })
    await page.route('**/verify', async route => {
        console.log('Request Intercepted to: ', route.request().url());

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: 'SUCCESS',
                message: 'Citizen registration verified successfully.',
                transaction_id: 'TXN-PLAYWRIGHT-MOCK-0000',
                amount_deducted: '₹0.00 (~$0.00 USD)',
                username: 'niyaz123',
                timestamp: new Date().toISOString()
            })
        })
    });

    await page.goto('http://mock-api.techwithjatin.com/')
    await page.locator('#username').fill('niyaz123')
    await page.locator('#password').fill('niyaz123')
    await page.getByText('Register').click()
    const verifyText = await page.locator('#modalCode').textContent();
    console.log(verifyText?.trim())
    expect(verifyText?.trim()).toContain('₹0.00 (~$0.00 USD) DEDUCTED')
    await page.waitForTimeout(10000)
})

test('gets the json from api and adds a new fruit', async ({ page }) => {

    page.setViewportSize({ 'width': 1920, 'height': 1020 })
    await page.route('**/api/v1/fruits', async route => {
        const response = await route.fetch();
        const json = await response.json();
        json.push({ name: 'Loquat', id: 100 });
        await route.fulfill({ response, json });
    });

    await page.goto('https://demo.playwright.dev/api-mocking');
    await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
    await page.waitForTimeout(10000)
});


test.skip('gets the json from HAR and checks the new fruit has been added', async ({ page }) => {
    await page.routeFromHAR('./hars/fruit.har', {
        url: '*/**/api/v1/fruits',
        update: false,
    });

    await page.goto('https://demo.playwright.dev/api-mocking');

    await expect(page.getByText('Playwright', { exact: true })).toBeVisible();
});


test('record HAR', async ({ page, context }) => {
    await context.routeFromHAR('mock/verify.har', {
        update: true,
        url: '**/verify'
    });

    await page.goto('http://mock-api.techwithjatin.com');
    await page.locator('#username').fill('niyaz123')
    await page.locator('#password').fill('niyaz123')
    await page.getByText('Register').click()
    
});

test('replay HAR for verify', async ({ page, context }) => {
    await context.routeFromHAR('mock/verify.har', {
        url: '**/verify',
        notFound: 'fallback'
    });

    await page.goto('http://mock-api.techwithjatin.com');
    await page.locator('#username').fill('niyaz123')
    await page.locator('#password').fill('niyaz123')
    await page.getByText('Register').click()

    const verifyText = await page.locator('#modalCode').textContent();
    console.log(verifyText)
    //expect(await page.locator('#modalCode').innerText()).toContain('₹83.00 (~$1.00 USD)')
});
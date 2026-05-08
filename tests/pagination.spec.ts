import { test, expect } from '@playwright/test'

test('Verify checkbox is checked on any page', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/')

    const table = page.locator('#productTable tbody')
    expect(table).toBeVisible()

    const pages = page.locator('#pagination>li');
    const count = await pages.count();
    console.log(count)

    const rows = table.locator('tr')
    await expect(rows).toHaveCount(5)

    const allRows = await rows.all()

    let found = false;

    for (let i = 0; i < count; i++) {

        if (count > 0) {
            await pages.nth(i).click();
        }

        for (let row of allRows) {
            const productName = await row.locator('td').nth(1).innerText();
            console.log(productName);

            if (productName === 'E-Reader') {
                await row.locator('td').nth(3).locator('input[type="checkbox"]').check();
                await page.waitForTimeout(3000)
                console.log(`Found and checked: ${productName} on page ${i + 1}`);
                found = true;
                break;
            }
        }

        if (found) break;
    }

})


test('Verify checkbox is checked on any page using single line if Element is visible on current page', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/')

    //await page.locator('#productTable tbody tr:has(td:has-text("Wireless Earbuds"))').locator('input[type="checkbox"]').check();

    await page.locator('#productTable tbody tr', {
        has: page.locator('td', { hasText: 'Wireless Earbuds' })})
        .locator('input[type="checkbox"]')
        .check();

    await page.waitForTimeout(3000)

})


test('Dynamic pagination test', async ({page}) => {

    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');

    let hasMorePages:boolean = true
    let pageNo = 0;

    while(hasMorePages){

        const allrows = await page.locator('#example tbody tr').all();
        console.log('-----------------------------------------------------------------');
        console.log('Data on Page No: ', pageNo+1);
        console.log('-----------------------------------------------------------------');
        
        for(let row of allrows){
            const rowData = await row.innerText();
            console.log(rowData);
        }
        pageNo++;
        const nextButton =  page.locator('button[aria-label="Next"]');
        const isDisabled = await nextButton.getAttribute('class')

        if(!isDisabled?.includes('disabled')) await nextButton.click();
        else hasMorePages = false;
    }
})
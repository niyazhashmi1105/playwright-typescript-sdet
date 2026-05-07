import { test, expect, Page } from '@playwright/test';

test('Hajj Committee Automation for All States', async ({ page, context }) => {

   await page.setViewportSize({width:1920,height:1080})

    await page.goto('https://hajcommittee.gov.in/selection-list')
    await page.waitForLoadState('networkidle')

    const allStates = page.locator('.st_ws_cont ul li')
    expect(allStates.first()).toBeVisible()
    const states = (await allStates.allInnerTexts())
    //console.log(states)
    console.log(await allStates.count())


    for (const state of states) {
        if (state === 'Jharkhand') {
            await page.locator('.st_ws_cont ul li', { hasText: state }).hover()
            const newPagePromise = context.waitForEvent('page')
            await page.locator('.st_ws_cont ul li', { hasText: state }).click()
            const newPage = await newPagePromise
            await newPage.bringToFront()

            //reading all the data
            await readTableData(newPage,'.table tbody','tr','td','.table thead tr th')

        }
    }
    await page.waitForTimeout(10000)

})

async function readTableData(page: Page,tableLocator:string,rowsLocator:string,colsLocator:string,columnsPerRowLocator:string) {

    const table = page.locator(tableLocator)
    await table.waitFor({ state: 'visible' })
    const rows = table.locator(rowsLocator)
    await rows.first().waitFor({ state: 'visible' })
    await expect(rows).toHaveCount(1659);
    const allCols = rows.locator(colsLocator)
    await allCols.first().waitFor({ state: 'visible' })
    await expect(allCols).toHaveCount(13272);
    const allText = await allCols.allInnerTexts();
    expect(allText).toHaveLength(13272)

    const columnsPerRow = await page.locator(columnsPerRowLocator).count();
    let count = 0;
    for (let i = 0; i < allText.length; i += columnsPerRow) {

        const name = allText[i + 2];
        const bankRef = allText[i + 6];
        const district = allText[i + 7];

        if (district === 'Hazaribagh') {
            console.log(`People Name: ${name} with Bank Ref. No. ${bankRef} for ${district} place`);
            count++;
        }
        

    }
    console.log("Total Number of People from Hazaribagh: ",count)
    expect(count).toBe(96)
}
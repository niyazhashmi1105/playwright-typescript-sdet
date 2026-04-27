import { test, expect } from '@playwright/test';


test.describe('Element Interactions', () => {

    test('Selecting value from scrolling dropdown', async ({ page }) => {

        page.setViewportSize({ 'width': 1920, 'height': 1020 })
        await page.goto('https://testautomationpractice.blogspot.com/')
        const dropdown = page.getByPlaceholder('Select an item')
        await dropdown.waitFor({ state: 'visible' })
        await dropdown.click()

        const options = await page.locator('#dropdown div').all()
        console.log(options.length)

        for (const option of options) {
            const items = await option.innerText()
            console.log(items)
            if (items === 'Item 84') {
                await option.click()
                expect(items).toBe('Item 84');
                break;
            }
        }
    })

    test('Mouse Hover', async ({ page }) => {

        page.setViewportSize({ 'width': 1920, 'height': 1020 })
        await page.goto('https://testautomationpractice.blogspot.com/')
        const pointMeBtn = page.getByText('Point Me');
        expect(pointMeBtn).toBeVisible()

        await pointMeBtn.hover()
        const options = page.locator('.dropdown a')
        await options.first().waitFor({ state: 'visible' })

        const allOptions = await options.all()
        console.log(allOptions.length)

        for (const option of allOptions) {
            const links = await option.innerText()
            console.log(links);
            if (links === 'Mobiles') {
                await option.click();
                //console.log(page.url())
                expect(page.url()).toBe('https://testautomationpractice.blogspot.com/#')
                break;
            }
        }
        await page.waitForTimeout(3000)
    })

    test('Wikipaedia Search', async ({ page, context }) => {

        page.setViewportSize({ 'width': 1920, 'height': 1020 })
        await page.goto('https://testautomationpractice.blogspot.com/')
        const wikiInputBox = page.locator('#Wikipedia1_wikipedia-search-input')
        expect(wikiInputBox).toBeVisible()
        await wikiInputBox.fill('Google')

        const searchBtn = page.locator('.wikipedia-search-button')
        await searchBtn.click()

        const results = page.locator('#wikipedia-search-result-link a');
        await results.first().waitFor({ state: 'visible' })

        const firstLinkText = await results.first().innerText()
        expect(firstLinkText).toEqual('Google')

        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            results.first().click()
        ])

        expect(newTab.url()).toContain('Google')
        await page.waitForTimeout(3000)
    })

    test('Double Click', async ({ page }) => {

        page.setViewportSize({ 'width': 1920, 'height': 1020 })
        await page.goto('https://testautomationpractice.blogspot.com/')

        const inputBox1 = page.locator('#field1')
        expect(inputBox1).toBeVisible()

        const inputBox2 = page.locator('#field2')
        expect(inputBox2).toBeVisible()

        const copyTextBtn = page.getByText('Copy Text')
        await copyTextBtn.dblclick()

        const getValue = await inputBox2.getAttribute('value')
        console.log(getValue)

    })


    test('Drag and drop', async ({ page }) => {

        page.setViewportSize({ 'width': 1920, 'height': 1020 })
        await page.goto('https://testautomationpractice.blogspot.com/')

        const source = page.locator('#draggable')
        expect(source).toBeVisible()

        const target = page.locator('#droppable')
        expect(target).toBeVisible()

        await source.dragTo(target)
        expect(await page.locator("div[id='droppable'] p").innerText()).toBe('Dropped!')

        await page.waitForTimeout(3000)

    })

    test.only('Stock Market for Gainers Dynamic Table Automation', async ({ page }) => {

        page.setViewportSize({ 'width': 1920, 'height': 1020 })
        //await page.goto('https://money.rediff.com/gainers/bse/daily/groupa?src=gain_lose')
        await page.goto('https://money.rediff.com/losers/bse/daily/groupall')

        const table = page.locator('.dataTable tbody')
        expect(table).toBeVisible()
        const rows = table.locator('tr')


        let text = (await page.locator("div[class='alignC bold grey']").innerText()).trim();

        const numbers = text.match(/\d+/g)?.map(Number)
        let totalPages = 0;

        if (numbers && numbers.length >= 3) {
            const [start, end, total] = numbers;
            const perPage = end - start + 1;
            totalPages = Math.ceil(total / perPage);
        }
        console.log(totalPages)

        let currentPage = 1;
        while (currentPage <= totalPages) {

            const allRows = await rows.allInnerTexts()
            console.log(allRows.length)

            console.log('---------------------------------')
            console.log(`Records on ${currentPage} are: `)
            console.log('---------------------------------')

            for (const row of allRows) {
                console.log(row);
            }

            const nextButton = page.getByText(">");

            if (await nextButton.isVisible()) {
                await nextButton.hover();
                await nextButton.click();
                await page.waitForLoadState('domcontentloaded')
                await page.waitForTimeout(1000)
            }

            currentPage++;
        }


    })

})

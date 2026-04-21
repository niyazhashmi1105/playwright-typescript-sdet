import { test, chromium, expect,devices } from '@playwright/test'

// yarn playright test --grep "@sanity" sanity
// yarn playright test --grep "@regression" regression
// yarn playright test --grep "@sanity" --grep-invert "@regression" only sanity not regression
// yarn playright test --grep "@sanity|@regression" sanity or regression
// yarn playright test --grep (?=.*@sanity) (?=.*@regression) both sanity and regression

 test.use({ ...devices['Pixel 5'] });
test.only('Multiple tabs handling', async () => {

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page1 = await context.newPage()

   

    await page1.goto('https://testautomationpractice.blogspot.com/')


    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page1.getByRole('button', { name: 'New Tab' }).click()
    ])

    await newPage.bringToFront()

    const pages = context.pages()
    console.log(pages.length)

    console.log(await pages[0].title())
    console.log(await pages[1].title())

    expect(await pages[0].title()).toBe('Automation Testing Practice')
    expect(await pages[1].title()).toBe('SDET-QA Blog')


})


test('Multiple Pop up Windows handling', async () => {

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://testautomationpractice.blogspot.com/')


    const newPages: any[] = [];
    context.on('page', p => newPages.push(p));
    await page.getByRole('button', { name: 'Popup Windows' }).click();
    await expect.poll(() => context.pages().length).toBe(3);

    //await newPage.bringToFront()

    const pages = context.pages()
    console.log(pages.length)

    for (const p of pages) {
        console.log(p.url())
        if(p.url().includes('Playwright')){
            expect(p.url()).toEqual('https://playwright.dev/')
            await p.close()
        }
    }


})
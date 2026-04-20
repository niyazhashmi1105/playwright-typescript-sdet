import { test, expect, Locator } from '@playwright/test';


test.describe('Dropdown Tests', () => {
    test('should select an option from the dropdown', async ({ page }) => {

        page.setViewportSize({ width: 1920, height: 1020 })

        await page.goto('https://practice.expandtesting.com/dropdown');

        const dropdown: Locator = page.locator('#country')
        const dropdownOptions: Locator = page.locator('#country>option');
        await expect(dropdownOptions).toHaveCount(252);

        const options = await dropdownOptions.allTextContents()
        const count = await dropdownOptions.count()
        console.log(count)

        await dropdown.selectOption('Ethiopia')
        await dropdown.selectOption({ label: 'Ethiopia' })
        await dropdown.selectOption({ value: 'ET' })
        await page.waitForTimeout(3000)

        for (let option of options) {
            console.log(option)
            if (option === 'India') {
                await dropdown.selectOption(option)
                console.log(`${option} is selected from the dropdown`)
                break;
            }
        }

        await dropdown.selectOption({ index: 100 })
        await page.waitForTimeout(3000)

        for (let i = 0; i < count; i++) {

            const text = await dropdownOptions.nth(i).innerText()
            console.log(text.trim())
            if (text.trim() === 'India') {
                await dropdown.selectOption({ label: text.trim() })
                break;
            }
        }

        await page.waitForTimeout(5000)
    });

    test('Auto Suggestion Dropdown', async ({ page }) => {


        await page.goto('https://www.amazon.in/')

        const [response] = await Promise.all([
            page.waitForResponse(res =>
                res.url().includes('/suggestions') && res.status() === 200
            ),
            await page.locator('#twotabsearchtextbox').fill('smart')
        ])

        //console.log('Suggestions API responded:', response.status());

        const options = page.locator('.left-pane-results-container>div');
        expect(page.locator('.left-pane-results-container>div', { hasText: 'smart watch for man' })).toBeVisible()

        console.log(await options.count())
        let count = await options.count()

        for (let i = 0; i < count; i++) {
            let text = await options.nth(i).innerText();
            if (text === 'smartwatch for man') {

                await options.nth(i).click()
                console.log(`${text} clicked successfully`);
                break;
            }

        }
    })

    test('Bootstrap Dropdown', async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        await page.getByPlaceholder('Username').fill('Admin')
        await page.getByPlaceholder('Password').fill('admin123')
        await page.getByRole('button', { name: 'Login' }).click()
        await page.getByText('PIM').click()

        await page.locator('.oxd-select-text-input').nth(2).click()
        await page.waitForTimeout(3000)

        const options = page.locator("div[role='listbox'] span")
        const count = await options.count()
        await page.waitForTimeout(2000)
        console.log(count)
        expect(count).toBeGreaterThan(0)

        const allOptions = await options.allTextContents()
        console.log(allOptions)
        console.log(allOptions.length)
        expect(allOptions.length).toBeGreaterThan(0)


        // for(let i=0;i<count;i++){
        //     const option =  await options.nth(i).textContent();
        //     console.log(option)
        //     if(option === 'QA Lead'){
        //         await options.nth(i).click()
        //         await page.waitForTimeout(2000)
        //         break;
        //     }
        // }

        for (let option of allOptions) {
            if (option === 'Software Architect') {
                await page.locator("div[role='listbox'] span", { hasText: option }).click();
                await page.waitForTimeout(500)
                break;
            }
        }

    })
});
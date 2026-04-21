import {test, expect} from '@playwright/test';

test.only('calendar test', async ({page}) => {


    await page.goto('https://testautomationpractice.blogspot.com/');

    const calendarInput = page.locator('#datepicker');
    expect(calendarInput).toBeVisible();

    await calendarInput.click();

    const year = '2030'
    const month = 'December';
    const date = '25';

    while(true){

        const currentMonth = await page.locator('.ui-datepicker-month').textContent();
        const currentYear = await page.locator('.ui-datepicker-year').textContent();
        console.log(currentMonth, currentYear);

        if(currentMonth === month && currentYear === year){
            break;
        }
        
        await page.locator('.ui-datepicker-next').click();
        //await page.locator('.ui-datepicker-prev').click();
    }  
        

        const allDates = await page.locator('.ui-datepicker-calendar td').all()

        for(let dt of allDates){
            const dateText = await dt.innerText();
            if(dateText === date){
                await dt.click();
                break;
            }
        }
    
    
    await page.waitForTimeout(2000);


})


test('Date Picker2 test', async ({context,page})=>{


    await page.goto('https://testautomationpractice.blogspot.com/');
    
    const calendarInput = page.locator('#txtDate');
    expect(calendarInput).toBeVisible();

    await calendarInput.click()
    await page.locator('.ui-datepicker-month').selectOption({value:'10'});
    await page.locator('.ui-datepicker-year').selectOption({label:'2028'});

    await page.locator('.ui-datepicker-calendar tbody tr td:has-text("25")').click();
    

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        await page.getByText('Comments (Atom)').click()
    ])

    await newPage.waitForLoadState();
    console.log('New page URL: ', newPage.url());
    expect(newPage.url()).toEqual('https://testautomationpractice.blogspot.com/feeds/posts/default');

    await page.bringToFront();
    await page.locator('#singleFileInput').setInputFiles('playwright-report/index.html');

    await page.getByRole('button', {name: 'Upload Single File'}).click();
    expect(page.locator('#singleFileStatus')).toContainText('Single file selected: index.html')

    await page.locator('#multipleFilesInput').setInputFiles(['playwright-report/index.html','./.github/workflows/playwright.yml']);
    await page.getByRole('button', {name: 'Upload Multiple Files'}).click();

    expect(page.locator("p[id='multipleFilesStatus']")).toContainText('Multiple files selected:');

    await page.waitForTimeout(5000);

})
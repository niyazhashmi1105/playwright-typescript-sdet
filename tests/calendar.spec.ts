import { test, expect, Page, Locator } from '@playwright/test';


test('calendar test', async ({ page }) => {


    await page.goto('https://testautomationpractice.blogspot.com/');

    const calendarInput = page.locator('#datepicker');
    expect(calendarInput).toBeVisible();

    await calendarInput.click();

    const year = '2030'
    const month = 'December';
    const date = '25';

    while (true) {

        const currentMonth = await page.locator('.ui-datepicker-month').textContent();
        const currentYear = await page.locator('.ui-datepicker-year').textContent();
        console.log(currentMonth, currentYear);

        if (currentMonth === month && currentYear === year) {
            break;
        }

        await page.locator('.ui-datepicker-next').click();
        //await page.locator('.ui-datepicker-prev').click();
    }


    const allDates = await page.locator('.ui-datepicker-calendar td').all()

    for (let dt of allDates) {
        const dateText = await dt.innerText();
        if (dateText === date) {
            await dt.click();
            break;
        }
    }


    await page.waitForTimeout(2000);


})


test('Date Picker2 test', async ({ context, page }) => {


    await page.goto('https://testautomationpractice.blogspot.com/');

    const calendarInput = page.locator('#txtDate');
    expect(calendarInput).toBeVisible();

    await calendarInput.click()
    await page.locator('.ui-datepicker-month').selectOption({ value: '10' });
    await page.locator('.ui-datepicker-year').selectOption({ label: '2028' });

    await page.locator('.ui-datepicker-calendar tbody tr td:has-text("25")').click();

    //New Tab Handling
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        await page.getByText('Comments (Atom)').click()
    ])

    await newPage.waitForLoadState('domcontentloaded');
    console.log('New page URL: ', newPage.url());
    expect(newPage.url()).toEqual('https://testautomationpractice.blogspot.com/feeds/posts/default');

    //Upload Single and Multiple Files
    await page.bringToFront();
    await page.locator('#singleFileInput').setInputFiles('playwright-report/index.html');

    await page.getByRole('button', { name: 'Upload Single File' }).click();
    expect(page.locator('#singleFileStatus')).toContainText('Single file selected: index.html')

    await page.locator('#multipleFilesInput').setInputFiles(['playwright-report/index.html', './.github/workflows/playwright.yml']);
    await page.getByRole('button', { name: 'Upload Multiple Files' }).click();

    expect(page.locator("p[id='multipleFilesStatus']")).toContainText('Multiple files selected:');

    await page.waitForTimeout(5000);

})

test('Booking.com Date Picker Automation', async ({ page }) => {

    await page.setViewportSize({ 'width': 1920, 'height': 1080 })
    await page.goto('https://www.booking.com/')
    await page.getByRole('button', { name: 'Dismiss sign-in info.' }).click();

    await page.getByTestId('searchbox-dates-container').click()
    const year = '2027'
    const month = 'June';
    const checkinDate = '25';
    const checkOutDate = '30';

    while (true) {

        const monthYear = await page.locator("h3[id*='bui-calendar-month']").first().innerText();
        console.log(monthYear)
        const splitMonthYear = monthYear.split(" ");
        const calendarMonth = splitMonthYear[0]
        const calendarYear = splitMonthYear[1]

        if (calendarMonth === month && calendarYear === year) {
            break;
        }
        const nextBtn = page.locator('button[aria-label*="Next"]').first()
        await nextBtn.waitFor({ state: 'visible' })
        await nextBtn.click()
    }

    const allDates = await page.locator("table[role='grid'] tr td").all()
    for (const date of allDates) {
        const dt = await date.innerText()
        //console.log(dt)
        if (dt === checkinDate) {
            await date.click()
        }
        if (dt === checkOutDate) {
            await date.click()
            break;
        }
    }
    await page.waitForTimeout(10000)
})

test('Cleartrip Calendar', async ({ page }) => {

    await page.setViewportSize({ 'width': 1920, 'height': 1080 })
    await page.goto('https://www.cleartrip.com/')

    await page.getByTestId('closeIcon').click()

    await datePickerHandler(
        page,
        'dateSelectOnward',
        '2026',
        'April',
        '29',
        'div[class="DayPicker-Caption"] div',
        'rightArrow',
        (page, month, day, year) =>
            page.locator(`div[aria-label*="${month} ${day} ${year}"]:not([disabled])`));

    await datePickerHandler(
        page,
        'dateSelectReturn',
        '2026',
        'December',
        '15',
        'div[class="DayPicker-Caption"] div',
        'rightArrow',
        (page, month, day, year) =>
            page.locator(`div[aria-label*="${month} ${day} ${year}"]:not([disabled])`));

    await page.waitForTimeout(5000)


})


test.only('Yatra Calendar', async ({ page }) => {

    await page.setViewportSize({ 'width': 1920, 'height': 1080 })
    await page.goto('https://www.yatra.com/')

    await page.getByAltText('cross').first().click()

    //Departure
    await datePickerHandler(
        page,
        'div[aria-label="Departure Date inputbox"]',
        '2026',
        'December',
        '29',
        'span[class="react-datepicker__current-month"]',
        'Next Month',
        (page, month, day, year) =>
            page.locator(
                `.react-datepicker__day:not(.react-datepicker__day--outside-month)[aria-label*="${month}"][aria-label*="${day}"][aria-label*="${year}"]:not([aria-disabled="true"])`));

    //Return
    await datePickerHandler(
        page,
        'div[aria-label="Return Date inputbox"]',
        '2027',
        'January',
        '15',
        'span[class="react-datepicker__current-month"]',
        'Next Month',
        (page, month, day, year) =>
            page.locator(`.react-datepicker__day:not(.react-datepicker__day--outside-month)[aria-label*="${month}"][aria-label*="${day}"][aria-label*="${year}"]:not([aria-disabled="true"])`));

    await page.waitForTimeout(5000)


})


type DateLocatorFn = (
    page: Page,
    month: string,
    day: string,
    year: string
) => Locator;

async function datePickerHandler(
    page: Page,
    calendarLocator: string,
    targetYear: string,
    targetMonth: string,
    targetDate: string,
    monthYearLocator: string,
    nextBtnLocator: string,
    getDateLocator: DateLocatorFn
) {

    //const calendar = page.getByTestId(calendarLocator)
    const calendar = page.locator(calendarLocator)
    await expect(calendar).toBeVisible()
    await calendar.click()

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const inputYear = parseInt(targetYear);

    const finalYear = inputYear <= currentYear ? currentYear : inputYear;

    while (true) {

        const captions = await page.locator(monthYearLocator).allTextContents();
        console.log('Visible:', captions);

        const isVisible = captions.some(text => {
            const [m, y] = text.split(" ");
            return m === targetMonth && parseInt(y) === finalYear;
        });

        if (isVisible) break;

        //const nextBtn = page.getByTestId(nextBtnLocator);
        const nextBtn = page.getByRole('button', { name: nextBtnLocator });
        
        if (await nextBtn.isVisible()) {
            await nextBtn.click();
        } else break;


    }
    //const newTargetMonth = targetMonth.substring(0, 3)
    const dateElement = getDateLocator(page, targetMonth, targetDate, targetYear);

    await dateElement.waitFor({ state: 'visible' });
    await dateElement.click();
}
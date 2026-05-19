import { test, expect } from '@playwright/test'

test.use({ 
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
});

test('Verify Redbus Journey, with maximum rating and price @smoke', async ({ page }) => {

    await page.goto('https://www.redbus.com/',{waitUntil:'commit'})
    await expect(page).toHaveTitle('Book Bus Tickets Online with redBus!')

    //Entering Source
    const source = page.getByPlaceholder('Ex: Paris');
    await source.click();
    await source.pressSequentially('Kolkata', { delay: 100 });

    await page.getByText('Kolkata, West Bengal, India').first().waitFor({ state: 'visible' });
    await page.getByText('Kolkata, West Bengal, India').first().click()

    //Entering Destination
    const dest = page.getByPlaceholder('Ex: London Airport')
    await dest.click()
    await dest.pressSequentially('Hazaribagh', { delay: 100 });
    await page.getByText('Hazaribagh, Jharkhand, India').first().waitFor({ state: 'visible' });

    await page.getByText('Hazaribagh, Jharkhand, India').first().click()

    //select onward journey
    await page.getByPlaceholder('DD/MY').click()
    await page.getByText('24').nth(1).click()

    //select return journey
    await page.getByRole('textbox', { name: 'return date' }).click();
    await page.getByText('6').nth(5).click();

    page.getByRole('button', { name: 'SEARCH' }).click()
    await expect(page).not.toHaveURL('https://www.redbus.com/');

    //Bus count
    await page.waitForLoadState("domcontentloaded")
    const count = page.locator('span[class*="subtitle"]')
    //console.log(count)
    //await page.pause() 
    expect(count.first()).toHaveText(/7 buses/)

    await page.getByText('AC (5)').first().click()

    await page.waitForLoadState("domcontentloaded")
    //Bus count after applying filter
    const filterCount = page.locator('div[class*="busesFoundText"]')
    expect(filterCount.first()).toHaveText(/5 buses found/)

    //Bus Service Providers
    await page.waitForLoadState("domcontentloaded")
    let travelsName = await page.locator("ul[data-autoid='exact'] li div[class*='travelsName']").allInnerTexts();
    for (const travel of travelsName) {
        console.log(`AC Bus Service Providers from Kolktata to Hazaribagh are , ${travel}`)
    }

    //Clear all Filters
    const clearAllButton = page.getByRole('button', { name: 'Clear All Filters' })
    await clearAllButton.scrollIntoViewIfNeeded()
    await clearAllButton.click()
    //await page.waitForTimeout(1000)

    //validate bus count
    await page.locator('div[class*="busesFoundText"]').waitFor({ state: 'visible' })
    const countAfterFilterRemoval = page.locator('div[class*="busesFoundText"]')
    await expect(countAfterFilterRemoval).toHaveText(/7 buses found/)

    await page.locator('div[class*="chip"] div[class*="rating"]').first().waitFor({ state: 'visible' })

    //Retrieve Ratings from Bus service Providers and display the maximum ratings with Bus name
    const ratings: string[] = await page.locator('div[class*="chip"] div[class*="rating"]').allInnerTexts()
    travelsName = await page.locator("ul[data-autoid='exact'] li div[class*='travelsName']").allInnerTexts();

    let maxRating: number = 0.0
    let ratingsArray: number[] = []

    //Stores only Floating point values
    for (const rating of ratings) {
        if (rating.includes(".")) {
            ratingsArray.push(parseFloat(rating))
        }
    }
    //Fetch the maximum rating
    for (const score of ratingsArray) {
        if (score > maxRating) {
            maxRating = score;
        }
    }

    travelsName = await page.locator("ul[data-autoid='exact'] li div[class*='travelsName']").allInnerTexts();
    await page.waitForLoadState('domcontentloaded')
    //Display the Bus name with maximum rating
    for (let i = 0; i < travelsName.length; i++) {
        if (ratingsArray[i] !== undefined && ratingsArray[i] === maxRating) {
            console.log(`AC Bus Service Provider: ${travelsName[i]} with ${maxRating} maximum rating`);
            break;
        }
    }

    //Find the maximum price and remove ₹ symbol before price processing
    let maxPrice: number = 0;
    const priceLocator: string[] = await page.locator('p[class*="finalFare"]').allInnerTexts()

    const updatedPriceLocator: number[] = [];
    for (const price of priceLocator) {
        const cleanStr = price.replace('₹', '').replace(',','').trim()
        const numericStr = parseInt(cleanStr)
        updatedPriceLocator.push(numericStr)
    }

    for (const price of updatedPriceLocator) {
        if (price > maxPrice) {
            maxPrice = price;
        }
    }
    
    for (let i = 0; i < travelsName.length; i++) {
        if (updatedPriceLocator[i] !== undefined && updatedPriceLocator[i] === maxPrice) {
            console.log(`AC Bus Service Provider: ${travelsName[i]} with Rs.${maxPrice} maximum price`);
            break;
        }
    }
    await page.waitForTimeout(3000)

})





import { test, expect, Page } from '@playwright/test';


// getCheapestPrice().then(result => {
//             console.log(`\n🏆 Best Deal: ${result.site} at ₹${result.price}`);
//     })

// async function getPrice(page: Page, url: string, priceLocator: string) {

//     await page.goto(url)
//     const amazonPrice: string = await page.locator(priceLocator).first().innerText() ?? ''
//     console.log(amazonPrice)
//     let price = parseFloat(amazonPrice.replace(/[^0-9.]/g, ''))
//     console.log(price)
//     console.log(`Price from ${page.url()}: ₹${price}`);
//     return price
// }

// async function getCheapestPrice() {

//     const browser = await chromium.launch()
//     const context = await browser.newContext()
//     const page = await context.newPage()

//     const aPrice = getPrice(page, 'https://www.amazon.in/dp/B0CHX1W1XY?th=1', '.a-price-whole')
//     const fPrice = getPrice(page, 'https://www.flipkart.com/search?q=iphone%2015&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off', '.hZ3P6w')

//     if (aPrice < fPrice) {
//         console.log("Amazon has cheaper price `${aPrice}` than Flipkart `${fPrice}`")
//          return { site: 'Amazon', price: aPrice };
//     }
//     else if (fPrice < aPrice) {
//         console.log("Flipkart has cheaper price `${aPrice}` than Amazon `${fPrice}`")
//          return { site: 'Flipkart', price: fPrice };
//     }
//     else {
//         console.log("Both have same price")
//         return { site: 'Both', price: aPrice };
//     }

// }

// tests/fetchMinimumPrice.spec.ts

// 🔹 Helper: Clean and parse price text
function parsePrice(priceText: string): number {
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''))  // ✅ Remove trailing dot
    return isNaN(price) ? 0 : price;
}

// 🔹 Helper: Fetch price from a website
async function fetchPrice(page: Page, url: string, priceLocator: string): Promise<number> {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    //await page.locator(priceLocator).first().waitFor({ state: 'visible', timeout: 30000 });

    const priceText = await page.locator(priceLocator).first().textContent() ?? '0';
    const price = parsePrice(priceText);

    console.log(`Scraped: "${priceText.trim()}" → Parsed: ₹${price}`);
    return price;
}

// ============================================================
// 🔹 Test Suite
// ============================================================

test.describe('Mobile Price Comparison', () => {

    // ✅ Test 1: Fetch price from Amazon
    test('should fetch mobile price from Amazon', async ({ page }) => {
        const price = await fetchPrice(
            page,
            'https://www.amazon.in/dp/B0CHX1W1XY',  // 🔁 Replace with actual URL
            '.a-price-whole'
        );

        console.log(`Amazon Price: ₹${price}`);
        expect(price).toBeGreaterThan(0); // ✅ Assert price is valid
    });

    // ✅ Test 2: Fetch price from Flipkart
    test('should fetch mobile price from Flipkart', async ({ page }) => {
        const price = await fetchPrice(
            page,
            'https://www.flipkart.com/search?q=iphone%2015&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off',
            '.hZ3P6w'
        );

        console.log(`Flipkart Price: ₹${price}`);
        expect(price).toBeGreaterThan(0); // ✅ Assert price is valid
    });

    // ✅ Test 3: Compare prices and find cheapest
    test('should return the cheapest price between Amazon and Flipkart', async ({ browser }) => {

        // ✅ Open two pages in parallel
        const amazonPage = await browser.newPage();
        const flipkartPage = await browser.newPage();

        try {
            // ✅ Fetch both prices in parallel
            const [amazonPrice, flipkartPrice] = await Promise.all([
                fetchPrice(
                    amazonPage,
                    'https://www.amazon.in/dp/B0CHX1W1XY',       // 🔁 Replace with actual URL
                    '.a-price-whole'
                ),
                fetchPrice(
                    flipkartPage,
                    'https://www.flipkart.com/search?q=iphone%2015&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off',
                    '.hZ3P6w'
                )
            ]);

            console.log(`\n📊 Price Comparison:`);
            console.log(`   Amazon   : ₹${amazonPrice}`);
            console.log(`   Flipkart : ₹${flipkartPrice}`);

            // ✅ Find cheapest
            const cheapestPrice = Math.min(amazonPrice, flipkartPrice);
            const cheapestSite = amazonPrice < flipkartPrice ? 'Amazon' : 'Flipkart';

            console.log(`\n🏆 Cheapest: ${cheapestSite} at ₹${cheapestPrice}`);

            // ✅ Assertions
            expect(amazonPrice).toBeGreaterThan(0);
            expect(flipkartPrice).toBeGreaterThan(0);
            expect(cheapestPrice).toBe(Math.min(amazonPrice, flipkartPrice));

        } finally {
            await amazonPage.close();
            await flipkartPage.close();
        }
    });

    // ✅ Test 4: Assert Amazon is cheaper
    test('should assert Amazon price is cheaper than Flipkart', async ({ browser }) => {
        const amazonPage = await browser.newPage();
        const flipkartPage = await browser.newPage();

        try {
            const [amazonPrice, flipkartPrice] = await Promise.all([
                fetchPrice(amazonPage, 'https://www.amazon.in/dp/B0CHX1W1XY', '.a-price-whole'),
                fetchPrice(flipkartPage, 'https://www.flipkart.com/search?q=iphone%2015&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off', '.hZ3P6w')
            ]);

            console.log(`Amazon: ₹${amazonPrice} | Flipkart: ₹${flipkartPrice}`);

            // ✅ Assert Amazon is cheaper
            expect(amazonPrice).toBeLessThan(flipkartPrice);

        } finally {
            await amazonPage.close();
            await flipkartPage.close();
        }
    });

    // ✅ Test 5: Assert Flipkart is cheaper
    test('should assert Flipkart price is cheaper than Amazon', async ({ browser }) => {
        const amazonPage = await browser.newPage();
        const flipkartPage = await browser.newPage();

        try {
            const [amazonPrice, flipkartPrice] = await Promise.all([
                fetchPrice(amazonPage, 'https://www.amazon.in/dp/B0CHX1W1XY', '.a-price-whole'),
                fetchPrice(flipkartPage, 'https://www.flipkart.com/search?q=iphone%2015&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off', '.hZ3P6w')
            ]);

            console.log(`Amazon: ₹${amazonPrice} | Flipkart: ₹${flipkartPrice}`);

            // ✅ Assert Flipkart is cheaper
            expect(flipkartPrice).toBeLessThan(amazonPrice);

        } finally {
            await amazonPage.close();
            await flipkartPage.close();
        }
    });

});


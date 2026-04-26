import { test, expect, request } from '@playwright/test';

test('Fetch BSE Prices At Open Close, Intervals', async ({ request }) => {

    const response = await request.get(
        'https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/BSE/segment/CASH/1/daily?intervalInMinutes=1&minimal=true')


    console.log(await response.json())
    expect(response.status()).toBe(200)

    const responseBody = await response.json();
    const candles = responseBody.candles;
    expect(responseBody).toHaveProperty('candles');
    expect(candles.length).toBeGreaterThan(0);

    const { open, close, high, low } = analyzeStock(candles);
    console.log({ open, close, high, low });

    if (high > open) {
        console.log("📈 Price went UP after market opened");
    } else {
        console.log("📉 Price never went above opening price");
    }
    expect(high).toBeGreaterThanOrEqual(open);

})

type Candle = [number, number];
function analyzeStock(candles: Candle[]) {
    if (!candles.length) throw new Error('No data');

    const open = candles[0][1];
    const close = candles[candles.length - 1][1];

    let high = open;
    let low = open;

    for (const [, price] of candles) {
        if (price > high) high = price;
        if (price < low) low = price;
    }

    return { open, close, high, low };
}
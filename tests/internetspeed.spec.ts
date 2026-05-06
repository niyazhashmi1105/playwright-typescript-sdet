import { test, expect } from '@playwright/test'

test('Measure the Internet Speed Dynamically', async ({ page }) => {
    page.setViewportSize({ 'width': 1920, 'height': 1020 })

    await page.goto('https://fast.com/')

    const speed = page.locator('#speed-value');
    const units = page.locator('#speed-units');

    while(true){
        await speed.waitFor({state:'visible'})
        await units.waitFor({state:'visible'})
        console.log(await speed.innerText()+" "+await units.innerText())
        const className = await speed.getAttribute('class')
        if(className !== null && className.includes('succeeded')){
                break;
        }
    }

    await speed.waitFor({state:'visible'})
    await units.waitFor({state:'visible'})
    console.log("------------FINAL SPEED------------")
    console.log(await speed.innerText()+" "+await units.innerText())
    const internetSpeed = await speed.innerText()
    const internetUnits = await units.innerText()
    expect(await speed.innerText()).toEqual(internetSpeed)
    expect(await units.innerText()).toEqual(internetUnits)
    await page.waitForTimeout(5000)
})
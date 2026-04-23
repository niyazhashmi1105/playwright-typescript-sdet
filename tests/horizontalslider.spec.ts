import {test,expect} from '@playwright/test'

test('Horizontal Slider', async({page})=>{

    await page.goto('https://the-internet.herokuapp.com/horizontal_slider')

    const slider = page.locator("input[type='range']")
    expect(slider).toBeVisible()
    await slider.focus()

    const getInitialValue = await page.locator('.sliderContainer span').innerText()
    
    expect(parseInt(getInitialValue)).toBe(0)

    for(let i=0;i<10;i++) await page.keyboard.press('ArrowRight')

    const getFinalValue = await page.locator('.sliderContainer span').innerText()
    //console.log(getFinalValue)
    expect(parseInt(getFinalValue)).toBe(5)
})
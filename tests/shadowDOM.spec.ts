import {test,expect} from '@playwright/test'

test('Shadow DOM', async({page})=>{

    await page.goto('https://the-internet.herokuapp.com/shadowdom')

    const text = page.locator("span[slot='my-text']")
    expect(text).toHaveText("Let's have some different text!")
    const otherTexts = page.locator("ul[slot='my-text'] li")
    expect(otherTexts.last()).toHaveText("In a list!")

})
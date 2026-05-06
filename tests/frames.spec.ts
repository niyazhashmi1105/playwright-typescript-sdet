import {test} from '@playwright/test';

test('Frames Handling', async({page})=>{

    await page.goto('https://ui.vision/demo/webtest/frames/')

    const allFrames = page.frames()
    console.log(allFrames.length)

    //await page.frameLocator('[src="frame_1.html"]').locator('input[name="mytext1"]').fill('frame 1 located')

    await page.frameLocator('[src="frame_3.html"]').locator('input[name="mytext3"]').fill('frame 3 located')

    await page.frameLocator('[src="frame_3.html"]').
    frameLocator('[src="https://docs.google.com/forms/d/1yfUq-GO9BEssafd6TvHhf0D6QLDVG3q5InwNE2FFFFQ/viewform?embedded=true"]')
    .locator('#i6').click();
    // await frame.frameLocator('[src="https://docs.google.com/forms/d/1yfUq-GO9BEssafd6TvHhf0D6QLDVG3q5InwNE2FFFFQ/viewform?embedded=true"]')
    // .locator('#i6').click()

    await page.waitForTimeout(3000)
})
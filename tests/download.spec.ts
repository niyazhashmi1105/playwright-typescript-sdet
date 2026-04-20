import { test, expect } from '@playwright/test'


test('Verify Download', async ({ page }) => {

   
    await page.goto('https://get.jenkins.io/war-stable/latest/')

    const downloadPromise = page.waitForEvent('download')
    await page.locator('a[href="jenkins.war"]').click()

    const download = await downloadPromise;
   
    await download.saveAs('/Users/mdniyazhashmi/playwright-sdet-test-main/tests/downloads/'+download.suggestedFilename());
    expect(download.suggestedFilename()).toBe('jenkins.war');
    
})
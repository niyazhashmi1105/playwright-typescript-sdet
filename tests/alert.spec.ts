import {test, expect} from '@playwright/test';


test('Alerts Handling', async({page})=>{

    await page.goto('https://testautomationpractice.blogspot.com/')

    page.on('dialog',dialog=>{
        
       //dialog.dismiss()
        dialog.defaultValue()
        console.log(dialog.defaultValue())
        dialog.accept('automation')
    })

    //await page.getByRole('button',{name:'Simple Alert'}).click()
    //await page.locator('#confirmBtn').click()
    await page.locator('#promptBtn').click()
    await page.waitForTimeout(2000)
})
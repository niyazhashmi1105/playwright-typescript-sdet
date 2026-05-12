import {test,expect} from '@playwright/test';

test('Chart Automation @smoke',async({page})=>{

    test.setTimeout(60 * 1000);
     page.setViewportSize({'width': 1920,'height':1080})

     await page.goto('https://www.statista.com/statistics/793628/worldwide-developer-survey-most-used-languages/')

     await page.getByText('Accept all').click()
     await page.getByText('Expand statistic').click()

     const languages = page.locator('.highcharts-point');
     console.log(await languages.count())
     const count = await languages.count()
     expect(count).toBe(42)

     let languageName:string = "";
     let languagePercent:string = "";

     let allLanguages:string[] = [];
     for(let i=0;i<count;i++){

        await page.locator('.highcharts-point').nth(i).hover({force:true});
        languageName = await page.locator("table[class='tooltip'] tr:nth-child(1) td span").textContent() ?? ''
        languagePercent = await page.locator("table[class='tooltip'] tr:nth-child(3) td").textContent() ?? ''
        const data = languagePercent.replace('•','').trim()
        console.log("Programming language : " + languageName + ", Percentage : " + data);
        allLanguages.push(languageName,data)
      }

     expect(allLanguages).toContain('JavaScript')
     expect(allLanguages).toContain('66%')
})
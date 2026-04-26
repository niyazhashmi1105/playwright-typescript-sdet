import {test,expect} from '@playwright/test';

test('Count links and check if it is working or Broken', async({page,request})=>{
    page.setViewportSize({'width': 1920,'height':1080})
    test.setTimeout(180 * 1000);

    await page.goto('https://www.rediff.com/')

    const links = await page.locator('a').all()
    //console.log(links.length);

    expect(links.length).toBeGreaterThan(0);

    let brokenLinksCount = 0;
    let workingLinksCount = 0;

    for(const link of links){
        const url = await link.getAttribute('href');
        //console.log(url);
        if(!url || url.startsWith('javascript')|| url.startsWith('#') ||url.startsWith('tel')){
            continue;
        }
        try{

            const response = await request.fetch(url,{method: 'HEAD'});
            const status = response.status();
            if(status >= 400){
                console.log(`Broken Links: ${url} --> ${status}`)
                brokenLinksCount++;
            }
            else{
                console.log(`Working Links: ${url} --> ${status}`)
                workingLinksCount++;
            }

        }catch(Error){
            console.error(`Error opening in link: ${url}`)
        }
    }

    console.log(`Total Links: ${links.length}`);
    console.log(`Broken Links: ${brokenLinksCount}`)
    console.log(`Working Links: ${workingLinksCount}`)
    expect(brokenLinksCount).toBeLessThan(workingLinksCount)


})
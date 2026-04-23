import { test, expect } from '@playwright/test'

test('Dynamic Web Table - Verify Chrome CPU Load', async ({ page }) => {


    await page.goto('https://testautomationpractice.blogspot.com/')

    const table = page.locator('#taskTable tbody')
    expect(table).toBeVisible()

    const rows = table.locator('tr');
    const count = await rows.count()
    console.log(count)
    expect(count).toBe(4)

    const rowData = await rows.allInnerTexts()
    console.log(rowData.length)
    expect(rowData.length).toBe(4)

    //const cols = rows.locator('td')
    //console.log(await cols.allTextContents())

    let cpuLoad: string[] = [];

    for (let data of rowData) {

        console.log(data)
        if (data.includes('Chrome')) {
            const cells = data.split(/\s+/)
            for (let cell of cells) {
                if (cell.includes('%')) {
                    cpuLoad.push(cell.trim())
                }
            }
        }
    }
    //console.log('Chrome CPU Load:', cpuLoad);
    //console.log('Chrome CPU Load:', cpuLoad[0]);
    expect(page.locator('#displayValues strong').first()).toHaveText(cpuLoad[0])
})

test('Verify Firefox Memory Size', async ({ page }) => {


    await page.goto('https://testautomationpractice.blogspot.com/')

    const table = page.locator('#taskTable tbody')
    expect(table).toBeVisible()

    const rows = table.locator('tr');
    const count = await rows.count()
    console.log(count)
    expect(count).toBe(4)

    const rowData = await rows.allInnerTexts()
    console.log(rowData.length)
    expect(rowData.length).toBe(4)

    let memorySize: string[] = [];

    for (let row of rowData) {
        console.log(row)
        if (row.includes('Firefox')) {

            const cells = row.split(/\s+/)
            console.log(cells)

            for (let i = 0; i < cells.length; i++) {

                if (cells[i] === 'MB') {
                    memorySize.push(cells[i - 1].trim())
                }
            }

        }
    }

    console.log(memorySize[0]);
    expect(await page.locator('#displayValues strong').nth(1).innerText()).toContain(memorySize[0])
})


test('Verify Chrome Network Speed', async ({ page }) => {


    await page.goto('https://testautomationpractice.blogspot.com/')

    const table = page.locator('#taskTable tbody')
    expect(table).toBeVisible()

    const rows = table.locator('tr');
    const count = await rows.count()
    console.log(count)
    expect(count).toBe(4)

    const rowData = await rows.allInnerTexts()
    console.log(rowData.length)
    expect(rowData.length).toBe(4)

    let networkSpeed: string[] = [];

    for (let row of rowData) {
        console.log(row)
        if (row.includes('Chrome')) {

            const cells = row.split(/\s+/)
            console.log(cells)

            for (let i = 0; i < cells.length; i++) {
                if (cells[i].includes('Mbps')) {
                    networkSpeed.push(cells[i - 1].trim())
                }
            }

        }
    }

    //console.log(networkSpeed[0]);
    expect(await page.locator('#displayValues strong').nth(2).innerText()).toContain(networkSpeed[0])
})


test('Verify Firefox Disk Space', async ({ page }) => {


    await page.goto('https://testautomationpractice.blogspot.com/')

    const table = page.locator('#taskTable tbody')
    expect(table).toBeVisible()

    const rows = table.locator('tr');
    const count = await rows.count()
    console.log(count)
    expect(count).toBe(4)

    const rowData = await rows.allInnerTexts()
    console.log(rowData.length)
    expect(rowData.length).toBe(4)

    let diskSpace: string[] = [];

    for (let row of rowData) {
        console.log(row)
        if (row.includes('Firefox')) {

            const cells = row.split(/\s+/)
            console.log(cells)

            for (let i = 0; i < cells.length; i++) {
                if (cells[i] === 'MB/s') {
                    diskSpace.push(cells[i - 1].trim())
                }
            }

        }
    }

    console.log(diskSpace[0]);
    expect(await page.locator('#displayValues strong').nth(3).innerText()).toContain(diskSpace[0])
})


test('Verify Chrome CPU Load - Alternative Way', async({page})=>{

    await page.goto('https://testautomationpractice.blogspot.com/')

    const table = page.locator('#taskTable tbody')
    expect(table).toBeVisible()

    const rows = await table.locator('tr').all();
    expect(rows).toHaveLength(4)

    let cpuLoad = '';

    for(const row of rows){

        const processName = await row.locator('td').nth(0).innerText()
        if(processName === 'Chrome'){
                cpuLoad = await row.locator('td',{hasText:'%'}).innerText()
                console.log(cpuLoad)
                break;
        }
    }

    expect(page.locator('#displayValues strong').first()).toHaveText(cpuLoad)
})

test('Verify Data Table After Sorting Last Name Column', async({page})=>{

    await page.setViewportSize({ 'width': 1920, 'height': 1080 });
        await page.goto('https://the-internet.herokuapp.com/tables');

        const namesArrUnsorted = await page.locator('#table1 tr td:nth-child(1)').allTextContents();
        console.log(namesArrUnsorted);
        
        //Click on Last Name column
        await page.locator('#table1 tr th').first().click()

        const namesArrSorted = await page.locator('#table1 tr td:nth-child(1)').allTextContents();
        console.log(namesArrSorted);

        expect(namesArrUnsorted).toEqual(expect.arrayContaining(namesArrSorted));
        expect(namesArrSorted).toEqual(expect.arrayContaining(namesArrUnsorted));
        
})

test('Verify Data Table After Sorting For All Columns', async({page})=>{

    await page.setViewportSize({ 'width': 1920, 'height': 1080 });
        await page.goto('https://the-internet.herokuapp.com/tables');

        const arrUnsorted = (await page.locator('#table1 tr td').allInnerTexts());
        console.log(arrUnsorted);
        
        //Click on Last Name column
        await page.locator('#table1 tr th').first().click()

        const arrSorted = await page.locator('#table1 tr td').allInnerTexts();
        console.log(arrSorted);

        expect(arrUnsorted).toEqual(expect.arrayContaining(arrSorted));
        expect(arrSorted).toEqual(expect.arrayContaining(arrUnsorted));


})
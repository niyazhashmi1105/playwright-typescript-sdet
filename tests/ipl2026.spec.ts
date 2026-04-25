import { test, expect } from '@playwright/test'

test('Get values from IPL Table 2026', async ({ page }) => {
    page.setViewportSize({ 'width': 1920, 'height': 1020 })

    await page.goto('https://www.iplt20.com/points-table/men/2026')
    await page.getByText('Accept cookies').click()

    const table = page.locator('.ih-td-tab').first();
    expect(table).toBeVisible()

    const tbody = table.locator('tbody:nth-child(2)');
    const rows = await tbody.locator('tr').all();
    //console.log(rows.length)

    let teams: string[] = [];
    for (let row of rows) {
        const pos = await row.locator('td').nth(0).innerText();
        const teamName = await row.locator('td').nth(2).innerText();
        const netRunRate = await row.locator('td').nth(7).innerText();
        const points = await row.locator('td').nth(10).innerText();
        teams.push(pos, teamName, netRunRate, points);
    }

    console.log(teams[1]+" has maximum "+teams[3]+" points "+"with Net Run rate of "+teams[2]+" and stood at position "+teams[0]);
    expect(parseInt(teams[0])).toBe(1)
    expect(teams[1]).toBe('PBKS')
    expect(parseFloat(teams[2])).toBe(1.420)
    expect(parseInt(teams[3])).toBe(11)
})

import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../test-data/users';

type TestFixtures = {
    inventoryPage: InventoryPage;
};

export const test = base.extend<TestFixtures>({
    inventoryPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();

        await loginPage.login(
            users.standardUser.username,
            users.standardUser.password
        );

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('.inventory_list')).toBeVisible();

        const inventoryPage = new InventoryPage(page);

        await use(inventoryPage);
    },
});

export { expect };

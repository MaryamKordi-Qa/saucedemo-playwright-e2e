
import { test as base } from '@playwright/test';
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

        const inventoryPage = new InventoryPage(page);

        await use(inventoryPage);
    },
});

export { expect } from '@playwright/test';

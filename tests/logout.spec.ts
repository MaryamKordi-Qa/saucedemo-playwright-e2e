import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/LoginPage';
import { allure } from 'allure-playwright';

test.describe('Logout Module', () => {
    test.beforeEach(async () => {
        await allure.epic('SauceDemo E2E Testing');
        await allure.feature('Logout');
    });

    test('TC_LOGOUT_001 - Verify successful logout', async ({ page, inventoryPage }) => {
        await allure.story('Verify successful logout');
        await allure.severity('normal');

        const loginPage = new LoginPage(page);

        // Log out from the application
        await inventoryPage.logout();

        // Verify redirection to the login page
        await expect(page).toHaveURL('/');
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();

        // Verify protected inventory page cannot be accessed after logout
        await page.goto('/inventory.html');

        await expect(page).toHaveURL('/');
        await expect(loginPage.usernameInput).toBeVisible();
    });
});

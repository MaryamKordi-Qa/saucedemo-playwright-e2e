
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

test.describe('Login Module', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('TC_LOGIN_001 - login with valid credentials', async ({ page }) => {
        await loginPage.login(
            users.standardUser.username,
            users.standardUser.password,
        );

        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.getByText('Products', { exact: true })).toBeVisible();
    });

    test('TC_LOGIN_002 - login with invalid password', async () => {
        await loginPage.login(
            users.invalidUser.username,
            users.invalidUser.password,
        );

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Username and password do not match any user in this service',
        );
    });

    test('TC_LOGIN_003 - login with empty username', async () => {
        await loginPage.login('', users.standardUser.password);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Username is required',
        );
    });

    test('TC_LOGIN_004 - login with empty password', async () => {
        await loginPage.login(users.standardUser.username, '');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Password is required',
        );
    });

    test('TC_LOGIN_005 - login with locked out user', async () => {
        await loginPage.login(
            users.lockedOutUser.username,
            users.lockedOutUser.password,
        );

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Sorry, this user has been locked out.',
        );
    });

    test('TC_LOGIN_006 - login with empty username and password', async () => {
        await loginPage.login('', '');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Username is required',
        );
    });
});

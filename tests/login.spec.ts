
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';
import { allure } from 'allure-playwright';

test.describe('Login Module', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        await allure.epic('SauceDemo E2E Testing');
        await allure.feature('Login');

        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('TC_LOGIN_001 - login with valid credentials', async ({ page }) => {
        await allure.story('Valid login');
        await allure.severity('critical');

        await loginPage.login(
            users.standardUser.username,
            users.standardUser.password,
        );

        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.getByText('Products', { exact: true })).toBeVisible();
    });

    test('TC_LOGIN_002 - login with invalid password', async () => {
        await allure.story('Invalid password validation');
        await allure.severity('normal');

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
        await allure.story('Empty username validation');
        await allure.severity('normal');

        await loginPage.login('', users.standardUser.password);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Username is required',
        );
    });

    test('TC_LOGIN_004 - login with empty password', async () => {
        await allure.story('Empty password validation');
        await allure.severity('normal');

        await loginPage.login(users.standardUser.username, '');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Password is required',
        );
    });

    test('TC_LOGIN_005 - login with locked out user', async () => {
        await allure.story('Locked out user validation');
        await allure.severity('critical');

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
        await allure.story('Empty username and password validation');
        await allure.severity('minor');
        await loginPage.login('', '');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Epic sadface: Username is required',
        );
    });
});

import {test, expect} from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

test.describe('Inventory Modules', () => {
    let inventoryPage : InventoryPage;

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);

        inventoryPage = new InventoryPage(page);
    });

    test('TC_INV_001 - Inventory page is displayed', async ({page}) => {
        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.getByText('Products')).toBeVisible();
    });

    test('TC_INV_002 - Six products are displayed', async ({page}) => {
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('TC_INV_003 - Sort products by name A to Z', async ({page}) => {
        await inventoryPage.sortProducts('az');

        const names = await inventoryPage.productNames.allTextContents();
        expect(names).toEqual([...names].sort());
    });

    test('TC_INV_004 - Sort products by name Z to A', async ({page}) => {
        await inventoryPage.sortProducts('za');

        const names = await inventoryPage.productNames.allTextContents();
        expect(names).toEqual([...names].sort().reverse());
    });

    test('TC_INV_005 - Sort products by price low to high', async ({page}) => {
        await inventoryPage.sortProducts('lohi');

        const prices = await inventoryPage.productPrices.allTextContents();
        const numericPrices = prices.map(price => Number(price.replace('$', '')));
        expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
    });

    test('TC_INV_006 - Sort products by price high to low', async ({page}) => {
        await inventoryPage.sortProducts('hilo');
        const prices = await inventoryPage.productPrices.allTextContents();
        const numericPrices = prices.map(price => Number(price.replace('$', '')));
        expect(numericPrices)
    });

    test('TC_INV_007 - Add product to cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveText('1');

    });

    test('TC_INV_008 - Remove product from cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).not.toBeVisible();
    });
});
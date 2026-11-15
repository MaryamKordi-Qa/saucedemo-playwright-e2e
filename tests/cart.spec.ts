import {test, expect} from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Cart Module', () => {
    let inventoryPage: InventoryPage;
    let cartPage : CartPage;

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);

    });

    test('TC_CART_001 - Verify added product in cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await cartPage.navigate();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.productNames).toHaveText('Sauce Labs Backpack');
    });

    test('TC_CART_002 - Remove product from cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await cartPage.navigate();

        await cartPage.removeProduct('Sauce Labs Backpack');
        await expect(cartPage.cartItems).toHaveCount(0);
    });

    test('TC_CART_003 - Continue shooping from cart', async ({page}) => {
        await cartPage.navigate();
        await cartPage.continueShopping();

        await expect(page).toHaveURL(/inventory.html/);
    });

    test('TC_CART_004 - Proceed to checkout', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await cartPage.navigate();

        await cartPage.checkout();
        await expect(page).toHaveURL(/checkout-step-one.html/);

    });
})
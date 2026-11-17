
import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/CartPage';
import { allure } from 'allure-playwright';

test.describe('Cart Module', () => {
    test.beforeEach(async () => {
        await allure.epic('SauceDemo E2E Testing');
        await allure.feature('Cart');
});

    test('TC_CART_001 - Verify added product in cart', async ({ page, inventoryPage }) => {
        await allure.story('Verify added product in cart');
        await allure.severity('normal');

        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);
        await cartPage.goToCart();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.productNames).toHaveText('Sauce Labs Backpack');
    });

    test('TC_CART_002 - Remove product from cart', async ({ page, inventoryPage }) => {
        await allure.story('Remove product from cart');
        await allure.severity('normal');

        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);
        await cartPage.goToCart();

        await cartPage.removeProduct('Sauce Labs Backpack');

        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.productNames).toHaveCount(0);
    });

    test('TC_CART_003 - Continue shopping from cart', async ({ page, inventoryPage }) => {
        await allure.story('Continue shopping from cart');
        await allure.severity('normal');

        const cartPage = new CartPage(page);

        await cartPage.goToCart();
        await cartPage.continueShopping();

        await expect(page).toHaveURL(/inventory.html/);
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('TC_CART_004 - Proceed to checkout', async ({ page, inventoryPage }) => {
        await allure.story('Proceed to checkout');
        await allure.severity('normal');

        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);
        await cartPage.goToCart();

        await cartPage.checkout();

        await expect(page).toHaveURL(/checkout-step-one.html/);
        await expect(
            page.locator('.title')
        ).toHaveText('Checkout: Your Information');
    });

});

import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Module', () => {
   

    test('TC_CART_001 - Verify added product in cart', async ({page, inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);
        await cartPage.navigate();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.productNames).toHaveText('Sauce Labs Backpack');
    });

    test('TC_CART_002 - Remove product from cart', async ({page, inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);
        await cartPage.navigate();

        await cartPage.removeProduct('Sauce Labs Backpack');
        await expect(cartPage.cartItems).toHaveCount(0);
    });

    test('TC_CART_003 - Continue shopping from cart', async ({page, inventoryPage}) => {
        const cartPage = new CartPage(page);
        await cartPage.navigate();
        await cartPage.continueShopping();

        await expect(page).toHaveURL(/inventory.html/);
    });

    test('TC_CART_004 - Proceed to checkout', async ({page, inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);
        await cartPage.navigate();

        await cartPage.checkout();
        await expect(page).toHaveURL(/checkout-step-one.html/);

    });
});

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

        // Add a product to the cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);

        // Open cart and verify the added product
        await cartPage.goToCart();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.productNames).toHaveText('Sauce Labs Backpack');
    });

    test('TC_CART_002 - Remove product from cart', async ({ page, inventoryPage }) => {
        await allure.story('Remove product from cart');
        await allure.severity('normal');

        // Add a product to the cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);

        // Open cart before removing the product
        await cartPage.goToCart();

        await cartPage.removeProduct('Sauce Labs Backpack');

        // Verify the cart is empty
        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.productNames).toHaveCount(0);
    });

    test('TC_CART_003 - Continue shopping from cart', async ({ page, inventoryPage }) => {
        await allure.story('Continue shopping from cart');
        await allure.severity('normal');

        // Add a product to the cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);

        // Open cart and verify the added product
        await cartPage.goToCart();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.productNames).toHaveText('Sauce Labs Backpack');

        // Continue shopping
        await cartPage.continueShopping();

        // Verify navigation back to inventory
        await expect(page).toHaveURL(/inventory.html/);
        await expect(inventoryPage.inventoryItems).toHaveCount(6);

        // Verify cart badge still contains one product
        await expect(inventoryPage.cartBadge).toHaveText('1');

        // Reopen cart and verify product persistence
        await cartPage.goToCart();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.productNames).toHaveText('Sauce Labs Backpack');
    });

    test('TC_CART_004 - Proceed to checkout', async ({ page, inventoryPage }) => {
        await allure.story('Proceed to checkout');
        await allure.severity('normal');

        // Add a product to the cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        const cartPage = new CartPage(page);

        // Open cart before proceeding to checkout
        await cartPage.goToCart();

        await cartPage.checkout();

        // Verify navigation to checkout information page
        await expect(page).toHaveURL(/checkout-step-one.html/);
        await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    });
});

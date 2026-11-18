
import { test, expect } from '../fixtures/test-fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';
import { allure } from 'allure-playwright';

function parsePrice(priceText: string): number {
    return Number(priceText.replace(/[^\d.-]/g, ''));
}

test.describe('Checkout Module', () => {
    let cartProductPrice: string;

    test.beforeEach(async ({ page, inventoryPage }) => {
        await allure.epic('SauceDemo E2E Testing');
        await allure.feature('Checkout');

        const cartPage = new CartPage(page);

        // Add a product and capture its price
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await cartPage.goToCart();

        cartProductPrice = await cartPage.productPrices.first().innerText();

        // Proceed to checkout
        await cartPage.checkout();
    });

    test('TC_CHECKOUT_001 - Verify checkout information page', async ({ page }) => {
        await allure.story('Checkout information page is displayed');
        await allure.severity('normal');

        const checkoutPage = new CheckoutPage(page);

        // Verify checkout information fields
        await expect(page).toHaveURL(/checkout-step-one.html/);
        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.postalCodeInput).toBeVisible();
    });

    test('TC_CHECKOUT_002 - Validate empty first name', async ({ page }) => {
        await allure.story('Empty first name validation');
        await allure.severity('normal');

        const checkoutPage = new CheckoutPage(page);

        // Submit checkout form without first name
        await checkoutPage.fillCustomerInformation('', 'joe', '12345');
        await checkoutPage.continueCheckout();

        // Verify first name validation error
        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });

    test('TC_CHECKOUT_003 - Validate empty last name', async ({ page }) => {
        await allure.story('Empty last name validation');
        await allure.severity('normal');

        const checkoutPage = new CheckoutPage(page);

        // Submit checkout form without last name
        await checkoutPage.fillCustomerInformation('leo', '', '12345');
        await checkoutPage.continueCheckout();

        // Verify last name validation error
        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    });

    test('TC_CHECKOUT_004 - Validate empty postal code', async ({ page }) => {
        await allure.story('Empty postal code validation');
        await allure.severity('normal');

        const checkoutPage = new CheckoutPage(page);

        // Submit checkout form without postal code
        await checkoutPage.fillCustomerInformation('leo', 'joe', '');
        await checkoutPage.continueCheckout();

        // Verify postal code validation error
        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    });

    test('TC_CHECKOUT_005 - Complete checkout successfully', async ({ page }) => {
        await allure.story('Complete checkout successfully');
        await allure.severity('critical');

        const checkoutPage = new CheckoutPage(page);

        // Submit valid customer information
        await checkoutPage.fillCustomerInformation('leo', 'joe', '12345');
        await checkoutPage.continueCheckout();

        // Verify order summary
        await expect(page).toHaveURL(/checkout-step-two.html/);
        await expect(checkoutPage.summaryItems).toHaveCount(1);
        await expect(checkoutPage.summaryItems).toContainText('Sauce Labs Backpack');

        // Complete the order
        await checkoutPage.finishCheckout();

        // Verify successful checkout
        await expect(page).toHaveURL(/checkout-complete.html/);
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

    test('TC_CHECKOUT_006 - Cancel checkout and return to cart', async ({ page }) => {
        await allure.story('Cancel checkout and return to cart');
        await allure.severity('normal');

        const checkoutPage = new CheckoutPage(page);
        const cartPage = new CartPage(page);

        // Cancel checkout
        await checkoutPage.cancelCheckout();

        // Verify return to cart with the product preserved
        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.productNames).toContainText('Sauce Labs Backpack');
    });

    test('TC_CHECKOUT_007 - Verify order total calculation', async ({ page }) => {
        await allure.story('Verify order total calculation');
        await allure.severity('critical');

        const checkoutPage = new CheckoutPage(page);

        // Submit valid customer information
        await checkoutPage.fillCustomerInformation('leo', 'joe', '12345');
        await checkoutPage.continueCheckout();

        // Verify order summary page
        await expect(page).toHaveURL(/checkout-step-two.html/);

        // Capture order amounts
        const itemTotalText = await checkoutPage.itemTotal.innerText();
        const taxText = await checkoutPage.tax.innerText();
        const totalText = await checkoutPage.total.innerText();

        const expectedItemTotal = parsePrice(cartProductPrice);
        const itemTotal = parsePrice(itemTotalText);
        const tax = parsePrice(taxText);
        const total = parsePrice(totalText);

        // Verify item subtotal against the actual cart product price
        expect(itemTotal).toBe(expectedItemTotal);

        // Verify total equals subtotal plus tax
        expect(total).toBeCloseTo(itemTotal + tax, 2);
    });

    test('TC_CHECKOUT_008 - Verify product price in order summary', async ({ page }) => {
        await allure.story('Verify product price in order summary');
        await allure.severity('normal');

        const checkoutPage = new CheckoutPage(page);

        // Submit valid customer information
        await checkoutPage.fillCustomerInformation('leo', 'joe', '12345');
        await checkoutPage.continueCheckout();

        // Verify product price in order summary
        await expect(page).toHaveURL(/checkout-step-two.html/);
        await expect(
            checkoutPage.summaryItems.locator('.inventory_item_price')
        ).toHaveText(cartProductPrice);
    });
});

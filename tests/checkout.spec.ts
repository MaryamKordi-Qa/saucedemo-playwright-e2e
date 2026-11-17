
import { test, expect } from '../fixtures/test-fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';

test.describe('Checkout Module', () => {
    let cartProductPrice: string;

    test.beforeEach(async ({ page, inventoryPage }) => {
        const cartPage = new CartPage(page);

        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await cartPage.goToCart();

        cartProductPrice = await cartPage.productPrices.first().innerText();

        await cartPage.checkout();
    });

    test('TC_CHECKOUT_001 - Verify checkout information page', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await expect(page).toHaveURL(/checkout-step-one.html/);
        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.postalCodeInput).toBeVisible();
    });

    test('TC_CHECKOUT_002 - Validate empty first name', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.fillCustomerInformation('', 'leo', '12345');
        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });

    test('TC_CHECKOUT_003 - Validate empty last name', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.fillCustomerInformation('leo', '', '12345');
        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    });

    test('TC_CHECKOUT_004 - Validate empty postal code', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.fillCustomerInformation('leo', 'dicap', '');
        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    });

    test('TC_CHECKOUT_005 - Complete checkout successfully', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.fillCustomerInformation('leo', 'dicap', '12345');
        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two.html/);
        await expect(checkoutPage.summaryItems).toHaveCount(1);
        await expect(checkoutPage.summaryItems).toContainText('Sauce Labs Backpack');

        await checkoutPage.finishCheckout();

        await expect(page).toHaveURL(/checkout-complete.html/);
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

    test('TC_CHECKOUT_006 - Cancel checkout and return to cart', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        const cartPage = new CartPage(page);

        await checkoutPage.cancelCheckout();

        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.productNames).toContainText('Sauce Labs Backpack');
    });

    test('TC_CHECKOUT_007 - Verify order total calculation', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.fillCustomerInformation('leo', 'dicap', '12345');
        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two.html/);

        const itemTotalText = await checkoutPage.itemTotal.innerText();
        const taxText = await checkoutPage.tax.innerText();
        const totalText = await checkoutPage.total.innerText();

        const itemTotal = Number(itemTotalText.replace('Item total: $', ''));
        const tax = Number(taxText.replace('Tax: $', ''));
        const total = Number(totalText.replace('Total: $', ''));

        expect(itemTotal).toBe(29.99);
        expect(total).toBeCloseTo(itemTotal + tax, 2);
    });

    test('TC_CHECKOUT_008 - Verify product price in order summary', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.fillCustomerInformation('leo', 'dicap', '12345');
        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two.html/);

        await expect(
            checkoutPage.summaryItems.locator('.inventory_item_price')
        ).toHaveText(cartProductPrice);
    });
});

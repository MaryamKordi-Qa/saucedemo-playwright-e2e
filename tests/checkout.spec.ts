import {test, expect} from '@playwright/test';
import {CheckoutPage} from '../pages/CheckoutPage';
import {LoginPage} from '../pages/LoginPage';
import {InventoryPage} from '../pages/InventoryPage';
import {CartPage} from '../pages/CartPage';
import {users} from '../test-data/users';


let cartProductPrice: string | null;

test.describe('Checkout Module', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);

        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await cartPage.navigate();
        cartProductPrice = await cartPage.productPrices.first().textContent();
        await cartPage.checkout();
    });

    test('TC_CHECKOUT_001 - Verify checkout information page', async ({page}) => {
        await expect(page).toHaveURL(/checkout-step-one.html/);
        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.postalCodeInput).toBeVisible();
    });

    test('TC_CHECKOUT_002 - Validate empty first name', async () => {
        await checkoutPage.fillCustomerInformation('', 'leo', '12345');
        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });

    test('TC_CHECKOUT_003 - Validate empty last name', async () => {
        await checkoutPage.fillCustomerInformation('leo', '', '12345');
        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    });

    test('TC_CHECKOUT_004 - Validate empty postal code', async() => {
        await checkoutPage.fillCustomerInformation('leo', 'dicap','');
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    });

    test('TC_CHECKOUT_005 - Complete checkout successfully', async ({page}) => {
        await checkoutPage.fillCustomerInformation('leo', 'dicap', '12345');
        await checkoutPage.continueCheckout();
        await expect(page).toHaveURL(/checkout-step-two.html/);
        await expect(checkoutPage.summaryItems).toHaveCount(1);
        await expect(checkoutPage.summaryItems).toContainText('Sauce Labs Backpack');

        await checkoutPage.finishCheckout();
        await expect(page).toHaveURL(/checkout-complete.html/);
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

    test('TC_CHECKOUT_006 - Cancel checkout and return to cart', async ({page}) => {
        await checkoutPage.cancelCheckout();
        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.productNames).toContainText('Sauce Labs Backpack');

    });

    test('TC_CHECKOUT_007 - Verify order total calculation', async ({page}) => {
        await checkoutPage.fillCustomerInformation('leo', 'dicap', '12345');
        await checkoutPage.continueCheckout();
        await expect(page).toHaveURL(/checkout-step-two.html/);

        const itemTotalText = await checkoutPage.itemTotal.textContent();
        const taxText = await checkoutPage.tax.textContent();
        const totalText = await checkoutPage.total.textContent();

        const itemTotal = Number(itemTotalText?.replace('Item total: $', ''));
        const tax = Number(taxText?.replace('Tax: $', ''));
        const total = Number(totalText?.replace('Total: $', ''));

        expect(total).toBeCloseTo(itemTotal + tax, 2);

    });

    test('TC_CHECKOUT_008 - Verify product price in order summary', async ({page}) => {
        

        await checkoutPage.fillCustomerInformation('leo', 'dicap', '12345');
        await checkoutPage.continueCheckout();
        await expect(page).toHaveURL(/checkout-step-two.html/);

        const summaryPrice = await checkoutPage.summaryItems.locator('.inventory_item_price').textContent();
        expect(summaryPrice).toBe(cartProductPrice);
    });

});



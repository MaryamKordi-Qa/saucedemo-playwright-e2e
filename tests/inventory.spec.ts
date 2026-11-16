import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/CartPage';

test.describe('Inventory Modules', () => {
    

    test('TC_INV_001 - Inventory page is displayed', async ({page, inventoryPage}) => {
        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.getByText('Products')).toBeVisible();
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('TC_INV_002 - Six products are displayed', async ({inventoryPage}) => {
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('TC_INV_003 - Sort products by name A to Z', async ({inventoryPage}) => {
        await inventoryPage.sortProducts('az');

        const names = await inventoryPage.productNames.allTextContents();

        const expectedNames = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];

        expect(names).toEqual(expectedNames);
    });

    test('TC_INV_004 - Sort products by name Z to A', async ({inventoryPage}) => {
        await inventoryPage.sortProducts('za');

        const names = await inventoryPage.productNames.allTextContents();

        const expectedNames = [
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack',
        ];

        expect(names).toEqual(expectedNames);
    });

    test('TC_INV_005 - Sort products by price low to high', async ({inventoryPage}) => {
        await inventoryPage.sortProducts('lohi');

        const prices = await inventoryPage.productPrices.allTextContents();

        const numericPrices = prices.map(price =>
            Number(price.replace('$', ''))
        );

        const expectedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];

        expect(numericPrices).toEqual(expectedPrices);
    });

    test('TC_INV_006 - Sort products by price high to low', async ({inventoryPage}) => {
        await inventoryPage.sortProducts('hilo');

        const prices = await inventoryPage.productPrices.allTextContents();

        const numericPrices = prices.map(price =>
            Number(price.replace('$', '')));

        const expectedPrices = [49.99, 29.99, 15.99, 15.99, 9.99, 7.99];

        expect(numericPrices).toEqual(expectedPrices);
    });

    test('TC_INV_007 - Add product to cart', async ({inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveText('1');

    });

    test('TC_INV_008 - Remove product from cart', async ({inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveCount(0);
    });

    test('TC_INV_009 - Add multiple products to cart', async ({inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

        await expect(inventoryPage.cartBadge).toHaveText('3');
    });

    test('TC_INV_010 - Verify multiple products in cart', async ({page, inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

        const cartPage = new CartPage(page);
        await cartPage.navigate();
        await expect(cartPage.cartItems).toHaveCount(3);

        await expect(cartPage.productNames).toContainText([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
        ]);
    });

    test('TC_INV_011 - Remove one product from cart', async ({page, inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

        await expect(inventoryPage.cartBadge).toHaveText('3');

        const cartPage = new CartPage(page);
        await cartPage.navigate();
        await cartPage.removeProduct('Sauce Labs Bike Light');

        await expect(cartPage.cartItems).toHaveCount(2);
        await expect(
            cartPage.productNames.filter({hasText: 'Sauce Labs Bike Light'})
        ).toHaveCount(0);
        
        await expect(cartPage.productNames).toContainText([
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
        ]);

    });

    test('TC_INV_012 - Remove all products from cart', async ({page, inventoryPage}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

        const cartPage = new CartPage(page);
        await cartPage.navigate();


        await cartPage.removeProduct('Sauce Labs Backpack');
        await cartPage.removeProduct('Sauce Labs Bike Light');
        await cartPage.removeProduct('Sauce Labs Bolt T-Shirt');

        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.productNames).toHaveCount(0);
        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    });
});
import {Page, Locator} from '@playwright/test'

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    }

    async navigate(){
        await this.page.locator('.shopping_cart_link').click();
    }

    async checkout(){
        await this.checkoutButton.click();
    }

    async continueShopping(){
        await this.continueShoppingButton.click();
    }

    async removeProduct(productName: string){
        const product = this.cartItems.filter({hasText: productName});
        await product.getByRole('button', { name: 'Remove' }).click();
    }
}
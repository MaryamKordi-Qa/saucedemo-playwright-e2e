
import { Page, Locator } from '@playwright/test';

type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly sortDropDown: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.sortDropDown = page.locator('[data-test="product-sort-container"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async sortProducts(option: SortOption) {
        await this.sortDropDown.selectOption(option);
    }

    async addProductToCart(productName: string) {
        const product = this.inventoryItems.filter({
            has: this.page.locator('.inventory_item_name', {
                hasText: productName,
            }),
        });

        await product.getByRole('button', { name: 'Add to cart' }).click();
    }

    async removeProductFromCart(productName: string) {
        const product = this.inventoryItems.filter({
            has: this.page.locator('.inventory_item_name', {
                hasText: productName,
            }),
        });

        await product.getByRole('button', { name: 'Remove' }).click();
    }
}

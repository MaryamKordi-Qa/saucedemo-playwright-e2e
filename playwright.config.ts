
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    // Test execution
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    timeout: 30_000,

    // Assertions
    expect: {
        timeout: 5_000,
    },

    // Reports
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright', {
            resultsDir: 'allure-results',
        }],
    ],

    // Shared settings
    use: {
        baseURL: 'https://www.saucedemo.com',

        actionTimeout: 10_000,
        navigationTimeout: 30_000,

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },

    // Browser projects
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});

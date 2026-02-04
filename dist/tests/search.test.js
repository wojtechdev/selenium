"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("../utils/driver");
const selenium_webdriver_1 = require("selenium-webdriver");
const chai_1 = require("chai");
describe('UŁ Search Page Tests', () => {
    let driver;
    const BASE_URL = 'https://www.uni.lodz.pl/wyniki-wyszukiwania';
    // Helper function to dismiss cookie banner if present
    async function dismissCookieBanner() {
        try {
            const cookieBtn = await driver.findElement(selenium_webdriver_1.By.xpath("//*[contains(text(), 'AKCEPTUJ WSZYSTKIE')]"));
            if (await cookieBtn.isDisplayed()) {
                await cookieBtn.click();
                await driver.wait(selenium_webdriver_1.until.stalenessOf(cookieBtn), 5000);
            }
        }
        catch {
            // Cookie banner not present or already accepted
        }
    }
    before(async () => {
        driver = await (0, driver_1.buildDriver)();
        await driver.get(BASE_URL);
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css('body')), 10000);
        await dismissCookieBanner();
    });
    beforeEach(async () => {
        // Dismiss cookie banner before each test in case it reappears
        await dismissCookieBanner();
    });
    after(async () => {
        await driver.quit();
    });
    describe('Search Input Functionality', () => {
        it('should display search input field', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            (0, chai_1.expect)(await searchInput.isDisplayed()).to.be.true;
        });
        it('should allow typing in search field', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('informatyka');
            const value = await searchInput.getAttribute('value');
            (0, chai_1.expect)(value).to.equal('informatyka');
        });
        it('should execute search when clicking search button', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('studia');
            const searchButton = await driver.findElement(selenium_webdriver_1.By.css('input[value="Szukaj"]'));
            await searchButton.click();
            await driver.wait(selenium_webdriver_1.until.urlContains('%5Bsword%5D=studia'), 10000);
            const currentUrl = await driver.getCurrentUrl();
            (0, chai_1.expect)(currentUrl).to.include('studia');
        });
        it('should execute search when pressing Enter key', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('nauka');
            await searchInput.sendKeys(selenium_webdriver_1.Key.RETURN);
            await driver.wait(selenium_webdriver_1.until.urlContains('%5Bsword%5D=nauka'), 10000);
            const currentUrl = await driver.getCurrentUrl();
            (0, chai_1.expect)(currentUrl).to.include('nauka');
        });
        it('should handle special characters in search', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('łódź uniwersytet');
            const value = await searchInput.getAttribute('value');
            (0, chai_1.expect)(value).to.equal('łódź uniwersytet');
        });
    });
    describe('Search Results Display', () => {
        it('should show results after valid search', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('rekrutacja');
            const searchButton = await driver.findElement(selenium_webdriver_1.By.css('button[type="submit"], input[type="submit"]'));
            await searchButton.click();
            await driver.wait(selenium_webdriver_1.until.urlContains('%5Bsword%5D=rekrutacja'), 10000);
            await driver.wait(selenium_webdriver_1.until.titleContains('Wyniki wyszukiwania'), 10000);
            // Check for results or no results message
            const pageContent = await driver.findElement(selenium_webdriver_1.By.css('body')).getText();
            (0, chai_1.expect)(pageContent.length).to.be.greaterThan(0);
        });
        it('should handle search with no results gracefully', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('xyznonexistentquery12345');
            const searchButton = await driver.findElement(selenium_webdriver_1.By.css('input[value="Szukaj"]'));
            await searchButton.click();
            await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//*[contains(text(), 'Nie znaleziono wyników')]")), 10000);
            const noResultsMessage = await driver.findElement(selenium_webdriver_1.By.xpath("//*[contains(text(), 'Nie znaleziono wyników')]"));
            (0, chai_1.expect)(await noResultsMessage.isDisplayed()).to.be.true;
        });
    });
    describe('URL Parameter Handling', () => {
        it('should maintain search parameters in URL', async () => {
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            await searchInput.clear();
            await searchInput.sendKeys('matematyka');
            const searchButton = await driver.findElement(selenium_webdriver_1.By.css('input[value="Szukaj"]'));
            await searchButton.click();
            await driver.wait(selenium_webdriver_1.until.urlContains('%5Bsword%5D=matematyka'), 10000);
            const currentUrl = await driver.getCurrentUrl();
            (0, chai_1.expect)(currentUrl).to.include('tx_kesearch_pi1');
            (0, chai_1.expect)(currentUrl).to.include('matematyka');
        });
        it('should load with page parameter in URL', async () => {
            const urlWithPage = 'https://www.uni.lodz.pl/wyniki-wyszukiwania?id=91&tx_kesearch_pi1%5Bpage%5D=2&tx_kesearch_pi1%5Bsword%5D=studia';
            await driver.get(urlWithPage);
            await driver.wait(selenium_webdriver_1.until.titleContains('Wyniki wyszukiwania'), 10000);
            const currentUrl = await driver.getCurrentUrl();
            (0, chai_1.expect)(currentUrl).to.include('page');
            // Verify search input contains the search word from URL
            const searchInput = await driver.findElement(selenium_webdriver_1.By.id('searchInput'));
            const inputValue = await searchInput.getAttribute('value');
            (0, chai_1.expect)(inputValue).to.equal('studia');
        });
    });
});

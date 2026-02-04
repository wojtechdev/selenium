"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("../utils/driver");
const selenium_webdriver_1 = require("selenium-webdriver");
const chai_1 = require("chai");
describe('UŁ Candidate Page', () => {
    let driver;
    const BASE_URL = 'https://www.uni.lodz.pl/strefa-kandydacka';
    before(async () => {
        driver = await (0, driver_1.buildDriver)();
        await driver.get(BASE_URL);
    });
    after(async () => {
        await driver.quit();
    });
    it('successfully loads candidate page', async () => {
        const title = await driver
            .findElement(selenium_webdriver_1.By.id('hero-page-title'))
            .getText()
            .then((value) => value);
        (0, chai_1.expect)(title.replace(/\s+/g, ' ').trim()).to.equal('STREFA KANDYDACKA');
    });
});

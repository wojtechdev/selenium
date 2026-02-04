"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDriver = buildDriver;
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = __importDefault(require("selenium-webdriver/chrome"));
const BASE_URL = 'https://www.uni.lodz.pl/';
async function buildDriver() {
    const options = new chrome_1.default.Options();
    options.addArguments('--log-level=3'); // Only show fatal errors
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    const driver = await new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.CHROME).setChromeOptions(options).build();
    await driver.get(BASE_URL);
    return driver;
}

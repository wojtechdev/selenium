import { buildDriver } from '../utils/driver';
import { By, Key, until, WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';

describe('UŁ Home Page', () => {
  let driver: WebDriver;
  const BASE_URL = 'https://www.uni.lodz.pl/';

  before(async () => {
    driver = await buildDriver();
    await driver.get(BASE_URL);
  });

  after(async () => {
    await driver.quit();
  });

  it('successfully loads page', async () => {
    const title = await driver
      .findElement(By.id('hero-page-title'))
      .getText()
      .then((value) => value);

    expect(title.replace(/\s+/g, ' ').trim()).to.equal('UNIWERSYTET ŁÓDZKI');
  });

  it('has a working search feature', async () => {
    const searchButton = await driver.findElement(By.id('search-open'));
    await searchButton.click();
    const searchInput = await driver.findElement(By.id('header-search'));
    await searchInput.sendKeys('rekrutacja', Key.RETURN);
    await driver.wait(until.titleContains('Wyniki wyszukiwania'));
  });
});

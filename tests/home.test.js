import { buildDriver } from '../utils/driver.js';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';

describe('WFIS Home Page', () => {
  it('successfully loads page', async () => {
    let driver = await buildDriver();
    await driver.get('https://www.wfis.uni.lodz.pl/');
    const title = await driver
      .findElement(By.id('hero-page-title'))
      .getText()
      .then((value) => value);

    expect(title.replace(/\s+/g, ' ').trim()).to.equal('WYDZIAŁ FIZYKI I INFORMATYKI STOSOWANEJ');
  });
});

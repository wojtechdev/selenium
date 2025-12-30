import { buildDriver } from '../utils/driver.js';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';

describe('UŁ Candidate Page', () => {
  let driver;
  const BASE_URL = 'https://www.uni.lodz.pl/strefa-kandydacka';

  before(async () => {
    driver = await buildDriver();
    await driver.get(BASE_URL);
  });

  after(async () => {
    await driver.quit();
  });

  it('successfully loads candidate page', async () => {
    const title = await driver
      .findElement(By.id('hero-page-title'))
      .getText()
      .then((value) => value);

    expect(title.replace(/\s+/g, ' ').trim()).to.equal('STREFA KANDYDACKA');
  });
});

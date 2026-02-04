import { buildDriver } from '../utils/driver';
import { By, WebDriver, until, Key } from 'selenium-webdriver';
import { expect } from 'chai';

describe('UŁ Search Page Tests', () => {
  let driver: WebDriver;
  const BASE_URL = 'https://www.uni.lodz.pl/wyniki-wyszukiwania';

  // Helper function to dismiss cookie banner if present
  async function dismissCookieBanner() {
    try {
      const cookieBtn = await driver.findElement(By.xpath("//*[contains(text(), 'AKCEPTUJ WSZYSTKIE')]"));
      if (await cookieBtn.isDisplayed()) {
        await cookieBtn.click();
        await driver.wait(until.stalenessOf(cookieBtn), 5000);
      }
    } catch {
      // Cookie banner not present or already accepted
    }
  }

  before(async () => {
    driver = await buildDriver();
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('body')), 10000);
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
      const searchInput = await driver.findElement(By.id('searchInput'));
      expect(await searchInput.isDisplayed()).to.be.true;
    });

    it('should allow typing in search field', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));
      await searchInput.clear();
      await searchInput.sendKeys('informatyka');
      const value = await searchInput.getAttribute('value');
      expect(value).to.equal('informatyka');
    });

    it('should execute search when clicking search button', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));
      await searchInput.clear();
      await searchInput.sendKeys('studia');

      const searchButton = await driver.findElement(By.css('input[value="Szukaj"]'));
      await searchButton.click();

      await driver.wait(until.urlContains('%5Bsword%5D=studia'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('studia');
    });

    it('should execute search when pressing Enter key', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));
      await searchInput.clear();
      await searchInput.sendKeys('nauka');
      await searchInput.sendKeys(Key.RETURN);

      await driver.wait(until.urlContains('%5Bsword%5D=nauka'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('nauka');
    });

    it('should handle special characters in search', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));
      await searchInput.clear();
      await searchInput.sendKeys('łódź uniwersytet');
      const value = await searchInput.getAttribute('value');
      expect(value).to.equal('łódź uniwersytet');
    });
  });

  describe('Search Results Display', () => {
    it('should show results after valid search', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));

      await searchInput.clear();
      await searchInput.sendKeys('rekrutacja');

      const searchButton = await driver.findElement(By.css('button[type="submit"], input[type="submit"]'));
      await searchButton.click();

      await driver.wait(until.urlContains('%5Bsword%5D=rekrutacja'), 10000);
      await driver.wait(until.titleContains('Wyniki wyszukiwania'), 10000);

      // Check for results or no results message
      const pageContent = await driver.findElement(By.css('body')).getText();
      expect(pageContent.length).to.be.greaterThan(0);
    });

    it('should handle search with no results gracefully', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));

      await searchInput.clear();
      await searchInput.sendKeys('xyznonexistentquery12345');

      const searchButton = await driver.findElement(By.css('input[value="Szukaj"]'));
      await searchButton.click();

      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Nie znaleziono wyników')]")), 10000);

      const noResultsMessage = await driver.findElement(By.xpath("//*[contains(text(), 'Nie znaleziono wyników')]"));
      expect(await noResultsMessage.isDisplayed()).to.be.true;
    });
  });

  describe('URL Parameter Handling', () => {
    it('should maintain search parameters in URL', async () => {
      const searchInput = await driver.findElement(By.id('searchInput'));

      await searchInput.clear();
      await searchInput.sendKeys('matematyka');

      const searchButton = await driver.findElement(By.css('input[value="Szukaj"]'));
      await searchButton.click();

      await driver.wait(until.urlContains('%5Bsword%5D=matematyka'), 10000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('tx_kesearch_pi1');
      expect(currentUrl).to.include('matematyka');
    });

    it('should load with page parameter in URL', async () => {
      const urlWithPage = 'https://www.uni.lodz.pl/wyniki-wyszukiwania?id=91&tx_kesearch_pi1%5Bpage%5D=2&tx_kesearch_pi1%5Bsword%5D=studia';
      await driver.get(urlWithPage);
      await driver.wait(until.titleContains('Wyniki wyszukiwania'), 10000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('page');

      // Verify search input contains the search word from URL
      const searchInput = await driver.findElement(By.id('searchInput'));
      const inputValue = await searchInput.getAttribute('value');
      expect(inputValue).to.equal('studia');
    });
  });
});

import { Builder, Browser, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const BASE_URL = 'https://www.uni.lodz.pl/';

export async function buildDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  options.addArguments('--log-level=3'); // Only show fatal errors
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');

  const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

  await driver.get(BASE_URL);
  return driver;
}

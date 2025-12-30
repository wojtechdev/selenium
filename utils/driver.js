import { Builder, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export async function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--log-level=3'); // Only show fatal errors
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');

  return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
}

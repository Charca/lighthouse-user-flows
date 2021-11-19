/**
 * This is a modified version of the user-flow-original.js script, which
 * is the raw user flow exported directly from the Chrome DevTools Recorder Panel.
 * The code is commented out with each one of the modifications I've made (numbered 1 to 8).
 */
 const puppeteer = require('puppeteer');
 // 1. Add dependencies
 const open = require('open');
 const fs = require('fs');
 const lighthouse = require('lighthouse/lighthouse-core/fraggle-rock/api.js');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // 2. Create a new flow
    const flow = await lighthouse.startFlow(page, { name: 'My User Flow' });

    async function waitForSelectors(selectors, frame) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function waitForSelector(selector, frame) {
      if (selector instanceof Array) {
        let element = null;
        for (const part of selector) {
          if (!element) {
            element = await frame.waitForSelector(part);
          } else {
            element = await element.$(part);
          }
          if (!element) {
            throw new Error('Could not find element: ' + part);
          }
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('|'));
        }
        return element;
      }
      const element = await frame.waitForSelector(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForElement(step, frame) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      });
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (selector instanceof Array) {
        let elements = [];
        let i = 0;
        for (const part of selector) {
          if (i === 0) {
            elements = await frame.$$(part);
          } else {
            const tmpElements = elements;
            elements = [];
            for (const el of tmpElements) {
              elements.push(...(await el.$$(part)));
            }
          }
          if (elements.length === 0) {
            return [];
          }
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
          i++;
        }
        return elements;
      }
      const element = await frame.$$(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForFunction(fn) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, 5000);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":951,"height":894})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://coffee-cart.netlify.app/');
        await Promise.all(promises);
    }
    // 3. Capture a cold navigation report
    {
      const targetPage = page;
      await flow.navigate('https://coffee-cart.netlify.app/', {
        stepName: 'Cold navigation'
      });
    }
    // 4. Capture a warm navigation report
    {
      const targetPage = page;
      await flow.navigate('https://coffee-cart.netlify.app/', {
        stepName: 'Warm navigation',
        configContext: {
          settingsOverrides: { disableStorageReset: true },
        }
      });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Cappucino"],["#app > div:nth-child(3) > ul > li:nth-child(3) > div > div > div.cup-body"]], targetPage);
        await element.click({ offset: { x: 178.90185546875, y: 166.6608657836914} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Americano"],["#app > div:nth-child(3) > ul > li:nth-child(6) > div > div > div.cup-body"]], targetPage);
        await element.click({ offset: { x: 140.90185546875, y: 75.28585815429688} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Cart page"],["#app > ul > li:nth-child(2) > a"]], targetPage);
        await element.click({ offset: { x: 37.6875, y: 16} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Proceed to checkout"],["#app > div.list > div > button"]], targetPage);
        await element.click({ offset: { x: 162.5, y: 23.921875} });
    }
    // 5. Capture a snapshot report
    {
      await flow.snapshot({ stepName: 'Checkout modal opened' });
    }
    // 6. Start capturing a timespan report
    {
      await flow.startTimespan({ stepName: 'Checkout flow' });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Name"],["#name"]], targetPage);
        await element.click({ offset: { x: 54.515625, y: 4.921875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Name"],["#name"]], targetPage);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('Maxi');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "Maxi");
        }
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Tab");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up("Tab");
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Email"],["#email"]], targetPage);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('charca@gmail.com');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "charca@gmail.com");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Submit"],["#app > div.list > div > div > div > form > div:nth-child(4) > button"]], targetPage);
        await element.click({ offset: { x: 79.859375, y: 28.859375} });
    }
    // 7. End the timespan report
    {
      await flow.endTimespan();
    }

    await browser.close();

    // 8. Generate the report, write the output to an HTML file, and open the file in a browser
    const reportPath = __dirname + '/user-flow.report.html';
    const report = flow.generateReport();
    fs.writeFileSync(reportPath, report);
    open(reportPath, { wait: false });
})();

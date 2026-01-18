const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/Users/noot/Documents/offensive-security/memento/design/research-screenshots';

async function main() {
  console.log('Researching Linear design...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // Use domcontentloaded instead of networkidle for faster loading
    await page.goto('https://linear.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'linear-homepage.png'), fullPage: false });
    console.log('Captured Linear homepage');

    // Extract styles
    const linearStyles = await page.evaluate(() => {
      const styles = {
        colors: new Set(),
        fonts: new Set(),
        cssVars: {}
      };

      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const computed = window.getComputedStyle(el);
        const bgColor = computed.backgroundColor;
        const color = computed.color;
        const fontFamily = computed.fontFamily;

        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') styles.colors.add(bgColor);
        if (color) styles.colors.add(color);
        if (fontFamily) styles.fonts.add(fontFamily);
      });

      // Try to get CSS variables
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const rules = document.styleSheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === ':root' || rules[j].selectorText === 'html') {
              const cssText = rules[j].cssText;
              const varMatches = cssText.match(/--[\w-]+:\s*[^;]+/g);
              if (varMatches) {
                varMatches.forEach(match => {
                  const [name, value] = match.split(':').map(s => s.trim());
                  styles.cssVars[name] = value;
                });
              }
            }
          }
        } catch (e) {
          // CORS
        }
      }

      return {
        colors: Array.from(styles.colors).slice(0, 40),
        fonts: Array.from(styles.fonts),
        cssVars: styles.cssVars
      };
    });

    // Save Linear-specific findings
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'linear-findings.json'),
      JSON.stringify(linearStyles, null, 2)
    );

    console.log('Linear styles extracted');
    console.log('Colors found:', linearStyles.colors.length);
    console.log('Fonts found:', linearStyles.fonts);

    // Try features page
    await page.goto('https://linear.app/features', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'linear-features.png'), fullPage: false });
    console.log('Captured Linear features');

    // Try changelog for UI examples
    await page.goto('https://linear.app/changelog', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'linear-changelog.png'), fullPage: false });
    console.log('Captured Linear changelog');

  } catch (error) {
    console.error('Linear research error:', error.message);
  }

  await browser.close();
  console.log('\nLinear research complete!');
}

main().catch(console.error);

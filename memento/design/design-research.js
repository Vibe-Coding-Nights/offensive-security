const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/Users/noot/Documents/offensive-security/memento/design/research-screenshots';

async function captureNotion(page, findings) {
  console.log('\n=== Researching Notion ===');
  findings.notion = { colors: [], typography: [], components: [], patterns: [] };

  try {
    await page.goto('https://www.notion.so', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Capture homepage
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'notion-homepage.png'), fullPage: false });
    console.log('Captured Notion homepage');

    // Extract CSS variables and styles from the page
    const notionStyles = await page.evaluate(() => {
      const styles = {
        colors: new Set(),
        fonts: new Set(),
        computedStyles: []
      };

      // Get all elements and extract computed styles
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const computed = window.getComputedStyle(el);
        const bgColor = computed.backgroundColor;
        const color = computed.color;
        const fontFamily = computed.fontFamily;
        const fontSize = computed.fontSize;

        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') styles.colors.add(bgColor);
        if (color) styles.colors.add(color);
        if (fontFamily) styles.fonts.add(fontFamily);
      });

      // Get CSS custom properties from :root
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars = {};
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const rules = document.styleSheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === ':root') {
              const cssText = rules[j].cssText;
              const varMatches = cssText.match(/--[\w-]+:\s*[^;]+/g);
              if (varMatches) {
                varMatches.forEach(match => {
                  const [name, value] = match.split(':').map(s => s.trim());
                  cssVars[name] = value;
                });
              }
            }
          }
        } catch (e) {
          // CORS restriction on external stylesheets
        }
      }

      return {
        colors: Array.from(styles.colors).slice(0, 30),
        fonts: Array.from(styles.fonts),
        cssVars
      };
    });

    findings.notion.extractedStyles = notionStyles;

    // Navigate to templates or features page for more UI patterns
    await page.goto('https://www.notion.so/templates', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'notion-templates.png'), fullPage: false });
    console.log('Captured Notion templates page');

    // Try to capture dark mode if available (check for theme toggle)
    const darkModeToggle = await page.$('[data-theme-toggle], [aria-label*="dark"], [aria-label*="theme"]');
    if (darkModeToggle) {
      await darkModeToggle.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'notion-dark-mode.png'), fullPage: false });
      console.log('Captured Notion dark mode');
    }

  } catch (error) {
    console.error('Notion research error:', error.message);
    findings.notion.error = error.message;
  }

  return findings;
}

async function captureLinear(page, findings) {
  console.log('\n=== Researching Linear ===');
  findings.linear = { colors: [], typography: [], components: [], patterns: [] };

  try {
    await page.goto('https://linear.app', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Capture homepage
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'linear-homepage.png'), fullPage: false });
    console.log('Captured Linear homepage');

    // Extract styles
    const linearStyles = await page.evaluate(() => {
      const styles = {
        colors: new Set(),
        fonts: new Set()
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

      return {
        colors: Array.from(styles.colors).slice(0, 30),
        fonts: Array.from(styles.fonts)
      };
    });

    findings.linear.extractedStyles = linearStyles;

    // Navigate to features page
    await page.goto('https://linear.app/features', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'linear-features.png'), fullPage: false });
    console.log('Captured Linear features page');

    // Try method page for UI patterns
    await page.goto('https://linear.app/method', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'linear-method.png'), fullPage: false });
    console.log('Captured Linear method page');

  } catch (error) {
    console.error('Linear research error:', error.message);
    findings.linear.error = error.message;
  }

  return findings;
}

async function captureCraft(page, findings) {
  console.log('\n=== Researching Craft ===');
  findings.craft = { colors: [], typography: [], components: [], patterns: [] };

  try {
    await page.goto('https://www.craft.do', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Capture homepage
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'craft-homepage.png'), fullPage: false });
    console.log('Captured Craft homepage');

    // Extract styles
    const craftStyles = await page.evaluate(() => {
      const styles = {
        colors: new Set(),
        fonts: new Set()
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

      return {
        colors: Array.from(styles.colors).slice(0, 30),
        fonts: Array.from(styles.fonts)
      };
    });

    findings.craft.extractedStyles = craftStyles;

    // Navigate to features
    await page.goto('https://www.craft.do/features', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'craft-features.png'), fullPage: false });
    console.log('Captured Craft features page');

  } catch (error) {
    console.error('Craft research error:', error.message);
    findings.craft.error = error.message;
  }

  return findings;
}

async function captureObsidian(page, findings) {
  console.log('\n=== Researching Obsidian ===');
  findings.obsidian = { colors: [], typography: [], components: [], patterns: [] };

  try {
    await page.goto('https://obsidian.md', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Capture homepage
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'obsidian-homepage.png'), fullPage: false });
    console.log('Captured Obsidian homepage');

    // Extract styles
    const obsidianStyles = await page.evaluate(() => {
      const styles = {
        colors: new Set(),
        fonts: new Set()
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

      return {
        colors: Array.from(styles.colors).slice(0, 30),
        fonts: Array.from(styles.fonts)
      };
    });

    findings.obsidian.extractedStyles = obsidianStyles;

    // Navigate to features/plugins
    await page.goto('https://obsidian.md/plugins', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'obsidian-plugins.png'), fullPage: false });
    console.log('Captured Obsidian plugins page');

  } catch (error) {
    console.error('Obsidian research error:', error.message);
    findings.obsidian.error = error.message;
  }

  return findings;
}

// Utility to convert RGB to Hex
function rgbToHex(rgb) {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return null;
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function main() {
  console.log('Starting design research with Playwright...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  let findings = {};

  // Research each app
  findings = await captureNotion(page, findings);
  findings = await captureLinear(page, findings);
  findings = await captureCraft(page, findings);
  findings = await captureObsidian(page, findings);

  // Convert RGB colors to Hex for better documentation
  for (const app of Object.keys(findings)) {
    if (findings[app].extractedStyles && findings[app].extractedStyles.colors) {
      findings[app].hexColors = findings[app].extractedStyles.colors
        .map(rgbToHex)
        .filter(c => c !== null);
    }
  }

  // Save findings to JSON for processing
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'findings.json'),
    JSON.stringify(findings, null, 2)
  );

  console.log('\n=== Research Complete ===');
  console.log(`Findings saved to ${path.join(SCREENSHOT_DIR, 'findings.json')}`);
  console.log(`Screenshots saved to ${SCREENSHOT_DIR}`);

  await browser.close();
}

main().catch(console.error);

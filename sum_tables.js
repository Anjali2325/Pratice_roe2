// sum_tables.js
const { chromium } = require('playwright');

(async () => {
  // List of the pages to visit — seeds 32 through 41 inclusive.
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=32',
    'https://sanand0.github.io/tdsdata/js_table/?seed=33',
    'https://sanand0.github.io/tdsdata/js_table/?seed=34',
    'https://sanand0.github.io/tdsdata/js_table/?seed=35',
    'https://sanand0.github.io/tdsdata/js_table/?seed=36',
    'https://sanand0.github.io/tdsdata/js_table/?seed=37',
    'https://sanand0.github.io/tdsdata/js_table/?seed=38',
    'https://sanand0.github.io/tdsdata/js_table/?seed=39',
    'https://sanand0.github.io/tdsdata/js_table/?seed=40',
    'https://sanand0.github.io/tdsdata/js_table/?seed=41'
  ];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let grandTotal = 0;

  for (const url of urls) {
    console.log(`Visiting: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (err) {
      console.error(`Failed to load ${url}: ${err.message}`);
      continue;
    }

    // Evaluate in page: gather all table cell text and extract numbers robustly.
    const pageSum = await page.evaluate(() => {
      // helper to extract numbers from a string, returns array of numeric strings
      function extractNumbers(str) {
        if (!str || typeof str !== 'string') return [];
        // Match numbers like: 1,234.56 or -1,234 or 1234 or .56 or -0.5
        const matches = str.match(/-?\d[\d,]*\.?\d*|-?\.\d+/g);
        return matches || [];
      }

      // Collect text from table cells (td and th to be safe)
      const cells = Array.from(document.querySelectorAll('table td, table th'));
      let sum = 0;
      for (const cell of cells) {
        const text = cell.innerText || cell.textContent || '';
        const nums = extractNumbers(text);
        for (const n of nums) {
          // remove comma thousands separators then parse
          const cleaned = n.replace(/,/g, '');
          const parsed = parseFloat(cleaned);
          if (!isNaN(parsed)) sum += parsed;
        }
      }
      return sum;
    });

    console.log(`Page sum for ${url}: ${pageSum}`);
    grandTotal += pageSum;
  }

  await browser.close();

  // Print the grand total with a consistent number of decimals (if needed)
  // If you expect integers, you can print as integer. We'll show up to 6 decimal places if necessary.
  const formatted = Number.isInteger(grandTotal) ? grandTotal.toString() : grandTotal.toFixed(6);
  console.log('========================');
  console.log('GRAND TOTAL (sum of all numbers in all tables across pages):');
  console.log(formatted);
  console.log('========================');

  // Exit with success code
  process.exit(0);
})();

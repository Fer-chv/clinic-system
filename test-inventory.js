import puppeteer from 'puppeteer';

async function testInventory() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Navigate to login page
    await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle2' });

    // Wait for the form elements
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });

    // Fill email
    await page.click('input[type="email"]');
    await page.keyboard.type('admin@clinic.com');

    // Fill password
    await page.click('input[type="password"]');
    await page.keyboard.type('password');

    // Click login button
    await page.click('button[type="button"]');

    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Navigate to inventory
    await page.goto('http://localhost:5175/inventory', { waitUntil: 'networkidle2' });

    // Take screenshot
    await page.screenshot({ path: 'inventory-test.png', fullPage: true });

    // Wait for table to load
    await page.waitForSelector('.ant-table', { timeout: 5000 });

    console.log('✓ Inventory page loaded successfully');
    console.log('✓ Screenshot saved to inventory-test.png');

    // Get page content for verification
    const content = await page.content();
    if (content.includes('Inventario') || content.includes('Productos') || content.includes('Servicios')) {
      console.log('✓ Inventory module content verified');
    }

    // Keep browser open for inspection (10 seconds)
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testInventory();

const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Starting PDF generation for PEA Brain Pitch Deck...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to match the slide dimensions
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    
    const url = 'http://localhost:3002/pitch.html?print-pdf';
    console.log(`Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wait for the slide content and images to render completely
    console.log('Waiting for elements to load...');
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const pdfPath = path.resolve('public/pea_brain_pitch.pdf');
    console.log(`Saving PDF to: ${pdfPath}`);
    
    await page.pdf({
      path: pdfPath,
      width: '1440px',
      height: '900px',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });
    
    console.log('PDF generation complete!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
})();

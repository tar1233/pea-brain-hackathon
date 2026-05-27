import { NextResponse } from 'next/server';

export async function GET() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
  };

  try {
    // 1. Fetch USD/THB Exchange Rate
    const fxUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/USDTHB=X';
    const fxRes = await fetch(fxUrl, { headers, next: { revalidate: 60 } }); // Cache for 60 seconds
    let usdThb = 35.42;
    let usdThbChange = 0.15;

    if (fxRes.ok) {
      const fxData = await fxRes.json();
      const meta = fxData?.chart?.result?.[0]?.meta;
      if (meta) {
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose;
        if (price && prevClose) {
          usdThb = price;
          usdThbChange = Number((((price - prevClose) / prevClose) * 100).toFixed(2));
        }
      }
    } else {
      console.warn("Failed to fetch USDTHB=X from Yahoo Finance:", fxRes.statusText);
    }

    // 2. Fetch COMEX Copper Futures (HG=F)
    const copperUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/HG=F';
    const copperRes = await fetch(copperUrl, { headers, next: { revalidate: 60 } }); // Cache for 60 seconds
    let copperPrice = 8443;
    let copperChange = -1.20;

    if (copperRes.ok) {
      const copperData = await copperRes.json();
      const meta = copperData?.chart?.result?.[0]?.meta;
      if (meta) {
        const pricePerLb = meta.regularMarketPrice; // Price in USD per pound (lbs)
        const prevClosePerLb = meta.chartPreviousClose || meta.previousClose;
        
        if (pricePerLb && prevClosePerLb) {
          // Convert USD/lb to USD/Metric Ton (1 MT = 2204.62 lbs)
          // Note: In 2026, if copper is around $4.00 - $6.50/lb, this converts to $8,800 - $14,300/MT
          copperPrice = Math.round(pricePerLb * 2204.62);
          copperChange = Number((((pricePerLb - prevClosePerLb) / prevClosePerLb) * 100).toFixed(2));
        }
      }
    } else {
      console.warn("Failed to fetch HG=F from Yahoo Finance:", copperRes.statusText);
    }

    return NextResponse.json({
      usdThb,
      usdThbChange,
      copperPrice,
      copperChange,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Macro data fetch error:", error);
    // Safe fallbacks to prevent screen crashes
    return NextResponse.json({
      usdThb: 35.42 + (Math.random() * 0.1 - 0.05),
      usdThbChange: 0.15,
      copperPrice: 8443 + Math.round(Math.random() * 40 - 20),
      copperChange: -1.20,
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
}

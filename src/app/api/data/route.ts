import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    
    // If API Gateway URL is set, proxy the request to AWS
    if (apiUrl) {
      console.log("Proxying request to AWS API Gateway:", apiUrl);
      const res = await fetch(apiUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error("API Gateway returned " + res.status);
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Fallback: This should never be reached in production if URL is set
    throw new Error("NEXT_PUBLIC_API_GATEWAY_URL is not configured.");
  } catch (error: any) {
    console.error("API Gateway Proxy Error:", error);
    return NextResponse.json({ error: error.message || "Failed to connect to AWS Backend" }, { status: 500 });
  }
}

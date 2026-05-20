import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PEA Brain — AI Smart Supply Chain",
  description:
    "ระบบ AI ช่วยบริหารจัดการ Supply Chain อัจฉริยะสำหรับ กฟภ. — Risk Alert Dashboard",
  keywords: ["PEA", "procurement", "AI", "supply chain", "risk alert", "กฟภ"],
};

export const viewport: Viewport = {
  themeColor: "#F8F7FC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

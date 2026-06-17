import type { Metadata, Viewport } from "next";
import { DataProvider } from "./context/DataContext";
import FeedbackOverlay from "./components/FeedbackOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "PEA Brain — AI Smart Supply Chain",
  description:
    "ระบบ AI ช่วยบริหารจัดการ Supply Chain อัจฉริยะสำหรับ กฟภ. — Risk Alert Dashboard",
  keywords: ["PEA", "procurement", "AI", "supply chain", "risk alert", "กฟภ"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PEA Brain",
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                var reason = event.reason;
                if (!reason) return;
                var message = reason.message || (typeof reason === 'object' ? JSON.stringify(reason) : String(reason));
                if (
                  message.indexOf('MetaMask') !== -1 ||
                  message.indexOf('metamask') !== -1 ||
                  message.indexOf('extension') !== -1 ||
                  message.indexOf('Failed to connect to') !== -1 ||
                  message.indexOf('session') !== -1
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  event.stopImmediatePropagation();
                  console.warn('PEA Brain (Safety Check): Suppressed extension unhandled rejection to prevent Next.js dev overlay crash.', reason);
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <DataProvider>{children}</DataProvider>
        <FeedbackOverlay />
      </body>
    </html>
  );
}

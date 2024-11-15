import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClientProviders from "./context/ClientProviders";
import { ProductProvider } from './context/ProductContext';
import "./styles/globals.css";
import { Provider } from "./components/ui/provider";
import { LanguageProvider } from "./context/LanguageProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Template de e-commerce con Next.js y Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <LanguageProvider>
          <Provider >
            <ProductProvider>
              <ClientProviders>
                <Header />
                <main>{children}</main>
                <Footer />
              </ClientProviders>
            </ProductProvider>
          </Provider>
        </LanguageProvider>
      </body>
    </html>
  );
}

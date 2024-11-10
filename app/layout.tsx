import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Förråd-Organiserare",
  description: "Förråd-Organiserare för en enkel och effektiv förrådsadministration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" type="image/png" href="/fav-icons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/fav-icons/favicon.svg" />
        <link rel="shortcut icon" href="/fav-icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/fav-icons/apple-touch-icon.png" />
        <link rel="manifest" href="/fav-icons/site.webmanifest" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}


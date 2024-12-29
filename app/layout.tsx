import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from 'next/font/google'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={raleway.className}
      >
        {children}
      </body>
    </html>
  );
}

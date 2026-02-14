import { Dancing_Script, Caveat, Quicksand } from "next/font/google";
import "./globals.css";

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Happy Valentine's Day 💕",
  description: "A special Valentine's Day message, made with love.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dancing.variable} ${caveat.variable} ${quicksand.variable}`}>
        {children}
      </body>
    </html>
  );
}

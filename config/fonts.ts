import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Montserrat as FontMontserrat,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontMontserrat = FontMontserrat({
  subsets: ["latin"],
  weight: '400',
});
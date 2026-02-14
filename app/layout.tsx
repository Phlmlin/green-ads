import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    themeColor: "#059669",
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export const metadata: Metadata = {
    title: "Green Ads - Petites Annonces Gabon",
    description: "Plateforme de petites annonces au Gabon - Véhicules, Immobilier, Emploi, Services et plus",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: "/icons/icon-192.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={inter.className}>{children}</body>
        </html>
    );
}

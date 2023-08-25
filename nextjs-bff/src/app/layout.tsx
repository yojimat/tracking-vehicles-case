import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracking Vehicles",
  description: "Create routes and track vehicles using Google Maps API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}

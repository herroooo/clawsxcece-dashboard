import React from "react";
import "./app/globals.css";

export const metadata = {
  title: "@clawsxcece Lead Engine",
  description: "Compliant Inbound Capture & Outreach Pipeline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

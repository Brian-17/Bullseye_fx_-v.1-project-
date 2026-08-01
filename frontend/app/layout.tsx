import "./globals.css";

export const metadata = {
  title: "Bullseye FX",
  description: "AI Trading Academy Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

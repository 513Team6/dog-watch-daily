import "./globals.css";

export const metadata = {
  title: "Dog Watch Daily",
  description: "Daily photo updates for dogs being watched",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

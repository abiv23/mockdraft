// app/layout.jsx
import './globals.css'; // Or wherever your Tailwind styles are

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
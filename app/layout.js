import "./globals.css";

export const metadata = {
  title: "Qvitto",
  description: "Kvitton, levererade direkt vid kassan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv" style={{ colorScheme: 'light' }}>
      <body style={{ background: '#ffffff', color: '#111111' }}>
        {children}
      </body>
    </html>
  );
}
export const metadata = {
  title: "EventSpace Prototype",
  description: "Rentals for College Fests - Navigation/Utility Prototype",
};
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

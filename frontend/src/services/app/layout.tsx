import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
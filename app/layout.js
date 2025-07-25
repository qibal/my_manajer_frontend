import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/tiptap.scss"; // Impor SCSS di sini
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/Shadcn/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Manajer",
  description: "Aplikasi manajemen untuk semua kebutuhan bisnis Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

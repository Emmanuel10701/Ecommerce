"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import { Provider } from "./provider";
import { CartProvider } from '../context/page';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

const handleSearch = (query: string) => {
  console.log("Search query:", query);
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAnalyticsPage = pathname.startsWith('/analytics');
  const isUserPage = pathname.startsWith('/users');
  const isWorkersPage = pathname.startsWith('/workers'); // Add this line
  const isCalender = pathname.startsWith('/calender'); // Add this line
  const isLogin = pathname.startsWith('/login'); // Add this line
  const isRegister = pathname.startsWith('/register'); // Add this line
  const subscribers = pathname.startsWith('/subscibers'); // Add this line
  const isNotfound = pathname.startsWith('/not-found'); // Add this line
  const listpage = pathname.startsWith('/productstable'); // Add this line
  const employees = pathname.startsWith('/employees'); // Add this line
  const settings = pathname.startsWith('/settingPage'); // Add this line
  const castomers = pathname.startsWith('/castomers'); // Add this line
  const cartpage = pathname.startsWith('/checkout'); // Add this line
  const checkout = pathname.startsWith('/Cartpage'); // Add this line
  const reset = pathname.startsWith('/forgot'); // Add this line
  const forget = pathname.startsWith('/reset'); // Add this line
  const createproduct = pathname.startsWith('/createproduct'); // Add this line
  const orders = pathname.startsWith('/Orders'); // Add this line
  const allProducts = pathname.startsWith('/Productslistpage'); // Add this line
  const isExcludedPage = isAnalyticsPage||reset||forget ||isNotfound||castomers||cartpage||checkout||allProducts||orders||createproduct||listpage||employees||settings||subscribers|| isUserPage ||isRegister|| isWorkersPage||isLogin ||isCalender|| pathname.startsWith('/maindata');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <CartProvider>
            {!isExcludedPage && <Navbar onSearch={handleSearch} />}
            <main className="main-content">
              {children}
            </main>
            {!isExcludedPage && <Footer />}
          </CartProvider>
        </Provider>
      </body>
    </html>
  );
}

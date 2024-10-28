"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import { Provider } from "./provider";
import { CartProvider } from '../context/page';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

const handleSearch = (query) => {
  console.log("Search query:", query);
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAnalyticsPage = pathname.startsWith('/analytics');
  const isUserPage = pathname.startsWith('/users');
  const isWorkersPage = pathname.startsWith('/workers');
  const isCalender = pathname.startsWith('/calender');
  const isLogin = pathname.startsWith('/login');
  const isRegister = pathname.startsWith('/register');
  const subscribers = pathname.startsWith('/subscibers');
  const isNotfound = pathname.startsWith('/not-found');
  const listpage = pathname.startsWith('/productstable');
  const employees = pathname.startsWith('/employees');
  const settings = pathname.startsWith('/settingPage');
  const castomers = pathname.startsWith('/castomers');
  const cartpage = pathname.startsWith('/checkout');
  const checkout = pathname.startsWith('/Cartpage');
  const reset = pathname.startsWith('/forgot');
  const forget = pathname.startsWith('/reset');
  const createproduct = pathname.startsWith('/createproduct');
  const orders = pathname.startsWith('/Orders');
  const allProducts = pathname.startsWith('/Productslistpage');
  
  const isExcludedPage = isAnalyticsPage || reset || forget || isNotfound || castomers || cartpage || checkout || allProducts || orders || createproduct || listpage || employees || settings || subscribers || isUserPage || isRegister || isWorkersPage || isLogin || isCalender || pathname.startsWith('/maindata');

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

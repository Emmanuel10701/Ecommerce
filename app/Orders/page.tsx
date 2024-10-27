'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '../../components/spinner/page'; 
import Sidebar from '../../components/sidebar/page'; // Import Sidebar
import moment from 'moment';
import { FaSync, FaFilePdf, FaEllipsisV } from 'react-icons/fa'; // Import additional icons
import { useRouter } from 'next/navigation';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces'; // Import TDocumentDefinitions

// Define the Order type
interface Order {
  id: number;
  customerName: string;
  amount: number;
  datePlaced: string; // Assuming date is in ISO format
}
const router = useRouter();

const PAGE_SIZE = 10; // Number of items per page

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: session, status } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  // Function to fetch orders
  const fetchOrders = async (page: number, retries = 3) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders");
      setOrders(response.data.orders || []);
      setTotalOrders(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (retries > 0) {
        // Retry the request
        fetchOrders(page, retries - 1);
      } else {
        if (axios.isAxiosError(error)) {
          toast.error(`Error: ${error.response?.status} - ${error.response?.statusText}`);
        } else {
          toast.error('An unexpected error occurred.');
        }
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to generate and download PDF
  const exportToPDF = () => {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Orders Report', style: 'header' },
        {
          text: 'This report includes detailed information about all orders.',
          style: 'intro',
        },
        {
          text: 'Orders Information:',
          style: 'subheader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Customer Name', 'Amount', 'Date Placed'],
              ...orders.map(order => [
                order.customerName,
                `$${order.amount.toFixed(2)}`,
                moment(order.datePlaced).format('YYYY-MM-DD'),
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#00796b', // Teal color
          margin: [0, 0, 0, 10],
        },
        intro: {
          fontSize: 12,
          margin: [0, 0, 0, 20],
          color: '#555', // Dark gray
        },
        subheader: {
          fontSize: 18,
          bold: true,
          color: '#004d40', // Darker teal color
          margin: [0, 20, 0, 10],
        },
      },
      pageMargins: [40, 60, 40, 60], // Custom margins for better layout
      defaultStyle: {
        font: 'Roboto', // Ensure this is available or use a standard font
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).download('orders_report.pdf');
    setDropdownOpen(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0) setCurrentPage(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoading(true); // Set loading to true when refreshing
    setTimeout(() => {
      fetchOrders(currentPage);
      setIsRefreshing(false);
      setLoading(false); // Reset loading after refreshing
    }, 1000);
  };
  const handleLogin = () => {
    router.push("/login");
  };


  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6">You need to log in or register to access this page.</p>
          <button 
            onClick={handleLogin} 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            disabled={isProcessing} // Disable button while processing
          >
            {isProcessing ? 'Processing...' : 'Go to Login Page'}
          </button>
        </div>
      </div>
    );
  }

  return (

    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} className='md:hidden' />
      <div className={`flex transition-all ${isSidebarOpen ? 'ml-[25%]' : 'ml-0'}`}>
        <div className="flex-1 p-4">
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl text-purple-400 font-bold">Orders List</h1>
            <div className="relative flex items-center space-x-4 md:space-x-4">
              {/* Dropdown for small screens */}
              <div className="md:hidden" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                >
                  <FaEllipsisV />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48">
                    <button
                      onClick={handleRefresh}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition duration-300 flex items-center"
                    >
                      <FaSync className="mr-2 text-blue-500" />
                      Refresh
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 transition duration-300 flex items-center"
                    >
                      <FaFilePdf className="mr-2 text-red-500" />
                      Export as PDF
                    </button>
                  </div>
                )}
              </div>
              {/* Buttons for larger screens */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  className="bg-blue-500 text-white py-1.5 px-3 rounded-full hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  <FaSync className="mr-2" />
                  Refresh
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-red-500 text-white py-1.5 px-3 rounded-full hover:bg-red-600 transition duration-300 flex items-center"
                >
                  <FaFilePdf className="mr-2" />
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 p-2">Customer Name</th>
                    <th className="border border-gray-300 p-2">Amount</th>
                    <th className="border border-gray-300 p-2">Date Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {orders && orders.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center p-4">No orders found</td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={index % 2 === 0 ? 'bg-orange-50' : 'bg-orange-100'}
                      >
                        <td className="border border-gray-300 p-2">{order.customerName}</td>
                        <td className="border border-gray-300 p-2">${order.amount.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2">
                          {moment(order.datePlaced).fromNow()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-300 text-gray-700 py-1 px-3 rounded-full hover:bg-gray-400 transition duration-300"
                >
                  Previous
                </button>
                <span className="text-lg">Page {currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={orders.length < PAGE_SIZE}
                  className="bg-gray-300 text-gray-700 py-1 px-3 rounded-full hover:bg-gray-400 transition duration-300"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default OrdersPage;

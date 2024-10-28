"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/spinner/page';
import Sidebar from '../../components/sidebar/page';
import moment from 'moment';
import { FaSync, FaEnvelope, FaFilePdf, FaEllipsisV } from 'react-icons/fa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

const SubscribersPage = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const router = useRouter();

  // Authentication
  const { data: session, status } = useSession();

  const handleLogin = () => {
    signIn();
  };

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
    
    if (!session) {
      return;
    }
    
    setLoading(false);
  }, [session, status]);

  // Fetch users
  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/subs?page=${page}&limit=${PAGE_SIZE}`);
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch subscribers.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUsers(currentPage);
    }
  }, [currentPage, session]);

  // Handle email modal and actions
  const handleEmailAll = () => {
    setIsEmailModalOpen(true);
    setDropdownOpen(false);
  };

  const sendEmailContent = async () => {
    try {
      await axios.post('/api/mailing', {
        emails: users.map(user => user.email).join(','),
        subject: emailSubject,
        body: emailBody,
      });
      toast.success('Email sent successfully!');
      setIsEmailModalOpen(false);
      setEmailSubject('');
      setEmailBody('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send email.');
    }
  };

  const exportToPDF = () => {
    const docDefinition = {
      content: [
        { text: 'Subscribers Report', style: 'header' },
        {
          text: 'This report includes detailed information about all subscribers.',
          style: 'intro',
        },
        {
          text: 'Subscribers Information:',
          style: 'subheader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Name', 'Email', 'Date Joined', 'Role'],
              ...users.map(user => [
                user.name,
                user.email,
                moment(user.dateJoined).format('YYYY-MM-DD'),
                user.role,
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
          color: '#00796b',
          margin: [0, 0, 0, 10],
        },
        intro: {
          fontSize: 12,
          margin: [0, 0, 0, 20],
          color: '#555',
        },
        subheader: {
          fontSize: 18,
          bold: true,
          color: '#004d40',
          margin: [0, 20, 0, 10],
        },
      },
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Roboto',
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).download('subscribers_report.pdf');
    setDropdownOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      fetchUsers(currentPage);
      setIsRefreshing(false);
      setLoading(false);
    }, 1000);
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
          >
            Go to Login Page
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
            <h1 className="text-2xl text-purple-400 font-bold">Subscribers List</h1>
            <div className="relative flex items-center space-x-4 md:space-x-4">
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
                      onClick={handleEmailAll}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 transition duration-300 flex items-center"
                    >
                      <FaEnvelope className="mr-2 text-green-500" />
                      Email All
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
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  className="bg-blue-500 text-white py-1.5 px-3 rounded-full hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  <FaSync className="mr-2" />
                  Refresh
                </button>
                <button
                  onClick={handleEmailAll}
                  className="bg-green-500 text-white py-1.5 px-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
                >
                  <FaEnvelope className="mr-2" />
                  Email All
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
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Date Joined</th>
                    <th className="border border-gray-300 p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-4">No subscribers found</td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr
                        key={user.id}
                        className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-yellow-100'}
                      >
                        <td className="border border-gray-300 p-2">{user.name}</td>
                        <td className="border border-gray-300 p-2">{user.email}</td>
                        <td className="border border-gray-300 p-2">
                          {moment(user.dateJoined).fromNow()}
                        </td>
                        <td className="border border-gray-300 p-2">{user.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                  disabled={users.length < PAGE_SIZE}
                  className="bg-gray-300 text-gray-700 py-1 px-3 rounded-full hover:bg-gray-400 transition duration-300"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isEmailModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50" ref={modalRef}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Send Email to Subscribers</h2>
            <label className="block mb-2">
              <span className="text-gray-700">Subject:</span>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Body:</span>
              <textarea
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="bg-gray-500 text-white py-1 px-3 rounded-full hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={sendEmailContent}
                className="bg-blue-500 text-white py-1 px-3 rounded-full hover:bg-blue-600 transition duration-300"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default SubscribersPage;

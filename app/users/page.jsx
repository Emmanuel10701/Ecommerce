"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/spinner/page';
import Sidebar from '../../components/sidebar/page';
import { FaSync, FaEnvelope, FaFilePdf, FaEllipsisV, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAccessDeniedModalOpen, setIsAccessDeniedModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const router = useRouter();

  // Authentication
  const { data: session, status } = useSession();

  const handleLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (!session) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [session, status]);

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/register');
      const usersData = response.data.data;
      if (Array.isArray(usersData)) {
        setUsers(usersData);
        setFilteredUsers(usersData.slice(0, PAGE_SIZE));
        setTotalPages(Math.ceil(usersData.length / PAGE_SIZE));
      } else {
        console.error('Unexpected response format');
        setFilteredUsers([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAll = () => {
    if (session?.user?.role !== 'ADMIN') {
      setIsAccessDeniedModalOpen(true);
      return;
    }
    setIsEmailModalOpen(true);
    setDropdownOpen(false);
  };

  const sendEmailContent = async () => {
    try {
      await axios.post('/api/mailing', {
        emails: filteredUsers.map(user => user.email).join(','),
        subject: emailSubject,
        message: emailBody,
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
        { text: 'Users Report', style: 'header' },
        {
          text: 'This report includes detailed information about all users.',
          style: 'intro',
        },
        {
          text: 'Users Information:',
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
                moment(user.createdAt).format('YYYY-MM-DD'),
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
    pdfMake.createPdf(docDefinition).download('users_report.pdf');
    setDropdownOpen(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers().finally(() => setIsRefreshing(false));
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered.slice(0, PAGE_SIZE));
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = page * PAGE_SIZE;
    setFilteredUsers(users.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsEmailModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <div className={`flex transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} px-4 md:px-8 py-4`}>
        <div className="flex-1">
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl text-purple-400 mt-6 font-bold">Users List</h1>
            <div className="relative flex items-center space-x-4 md:space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name"
                className="p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-100 rounded-md"
              />
              <div className="md:hidden relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                >
                  <FaEllipsisV />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <button
                      onClick={handleRefresh}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                    >
                      <FaSync className="inline-block mr-2" /> Refresh
                    </button>
                    <button
                      onClick={handleEmailAll}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                    >
                      <FaEnvelope className="inline-block mr-2" /> Email All
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300"
                    >
                      <FaFilePdf className="inline-block mr-2" /> Export to PDF
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
            <div className="bg-white rounded-lg shadow-md p-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold">Name</th>
                    <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold">Email</th>
                    <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold">Date Joined</th>
                    <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-green-50' : 'bg-green-100'}`}
                    >
                      <td className="border-b border-gray-300 p-3 text-sm font-bold">{user.name}</td>
                      <td className="border-b border-gray-300 p-3 text-sm font-medium">{user.email}</td>
                      <td className="border-b border-gray-300 p-3 text-sm font-medium">{moment(user.createdAt).format('YYYY-MM-DD')}</td>
                      <td className={`border-b border-gray-300 p-3 text-sm font-extrabold ${user.role === 'Admin' ? 'text-green-800 bg-green-100' : 'text-gray-800'}`}>
                        {user.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 flex items-center space-x-1"
                  >
                    <FaArrowLeft />
                    <span>Previous</span>
                  </button>
                  <span>{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Email Modal */}
          {isEmailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" ref={modalRef}>
                <h2 className="text-lg font-semibold mb-4">Send Email to All Users</h2>
                <label className="block mb-2">
                  Subject:
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-4">
                  Body:
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    rows={4}
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEmailModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmailContent}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Access Denied Modal */}
          {isAccessDeniedModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-red-600">Access Denied</h2>
                <p>You need to be an Admin to perform this action.</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setIsAccessDeniedModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 items-center justify-between flex rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UsersPage;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/spinner/page'; // Make sure this is the correct path
import Sidebar from '../../components/sidebar/page'; // Make sure this is the correct path
import { FaSync, FaEnvelope, FaFilePdf, FaEllipsisV } from 'react-icons/fa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  dateAdded: string; // Date in ISO 8601 format
}

const PAGE_SIZE = 10;

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
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
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Add this state

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { data: session, status } = useSession();
  
  const handleLogin = () => {
    setIsProcessing(true); // Set processing state to true
    router.push("/login")
 ;
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

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/employees');  // Adjust API endpoint
      setEmployees(response.data);
      setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
      setFilteredEmployees(response.data.slice(0, PAGE_SIZE));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchEmployees();
    }
  }, [session]);

  const isAdmin = session?.user?.role === 'ADMIN';

  const handleEmailAll = () => {
    if (isAdmin) {
      setIsEmailModalOpen(true);
      setDropdownOpen(false);
    } else {
      setShowAccessDenied(true);
    }
  };

  const sendEmailContent = async () => {
    if (!emailSubject || !emailBody) {
      toast.error('Subject and Body are required.');
      return;
    }
    try {
      await axios.post('/api/mailing', {
        emails: filteredEmployees.map(employee => employee.email).join(','), // Get emails of employees
        subject: emailSubject,
        body: emailBody,
        senderEmail: session?.user?.email, // Sender's email
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
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Employees Report', style: 'header' },
        { text: 'This report includes detailed information about all employees.', style: 'intro' },
        { text: 'Employees Information:', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Name', 'Email', 'Role', 'Date Added'],
              ...filteredEmployees.map(employee => [
                employee.name,
                employee.email,
                employee.role,
                moment(employee.dateAdded).format('MMMM Do YYYY') // Format date
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
    pdfMake.createPdf(docDefinition).download('employees_report.pdf');
    setDropdownOpen(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEmployees().finally(() => setIsRefreshing(false));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEmployees(filtered.slice(0, PAGE_SIZE));
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = page * PAGE_SIZE;
    setFilteredEmployees(employees.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  const handleRowClick = (id: string) => {
    router.push(`/employees/${id}`);  // Adjust route
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
      <div className={`flex transition-all duration-300 ${isSidebarOpen ? 'ml-[25%]' : 'ml-[2%]'} px-4 md:px-8 py-4`}>
        <div className="flex-1">
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl text-purple-400 mt-6 font-bold">Employees List</h1>
            <div className="relative flex items-center space-x-4 md:space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name"
                className="p-2 border border-gray-300 focus:outline-1 focus:bg-slate-100 rounded-md"
              />
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
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300 flex items-center"
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
                      Export PDF
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={handleRefresh}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  <FaSync className="mr-2" />
                  Refresh
                </button>
                <button
                  onClick={handleEmailAll}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center"
                >
                  <FaEnvelope className="mr-2" />
                  Email All
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center"
                >
                  <FaFilePdf className="mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-300">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    onClick={() => handleRowClick(employee.id)}
                    className={`cursor-pointer ${index % 2 === 0 ? 'bg-indigo-50' : 'bg-indigo-100'} hover:bg-indigo-200`}
                  >
                    <td className="py-2 px-4">{employee.name}</td>
                    <td className="py-2 px-4">{employee.email}</td>
                    <td className="py-2 px-4">{employee.role}</td>
                    <td className="py-2 px-4">{moment(employee.dateAdded).format('MMMM Do YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
            >
              Next
            </button>
          </div>

          {/* Email Modal */}
          {isEmailModalOpen && (
            <div
              ref={modalRef}
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Send Email to All Employees</h2>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject"
                  className="p-2 border border-gray-300 rounded-md w-full mb-4"
                />
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Body"
                  rows={5}
                  className="p-2 border border-gray-300 rounded-md w-full mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEmailModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmailContent}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Access Denied Modal */}
          {showAccessDenied && (
            <div
              ref={modalRef}
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                <p>You do not have permission to perform this action.</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowAccessDenied(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default EmployeePage;

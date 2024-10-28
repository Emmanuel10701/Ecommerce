"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaDollarSign, FaChartLine, FaBriefcase, FaPercent } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/sidebar/page'; // Ensure the correct path
import LoadingSpinner from '../../components/spinner/page'; // Import the spinner component
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import ChartGridComponent from '../../components/chartgrid2/page'; // Import the ChartGridComponent
import { TDocumentDefinitions } from 'pdfmake/interfaces'; // Import the TDocumentDefinitions type

// Define data types
interface AreaChartData {
  name: string;
  uv: number;
}

interface HistogramData {
  name: string;
  value: number;
}

interface CardData {
  id: number;
  title: string;
  content: string;
  bgColor: string;
  icon: React.ReactNode;
}

// Define the Margins type manually if it's not available in types
type Margins = [number, number, number, number];

// Sample data for charts
const areaChartData: AreaChartData[] = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: 2000 },
  { name: 'Page D', uv: 2780 },
  { name: 'Page E', uv: 1890 },
  { name: 'Page F', uv: 2390 },
  { name: 'Page G', uv: 3490 },
];

const histogramData: HistogramData[] = [
  { name: 'A', value: 4000 },
  { name: 'B', value: 3000 },
  { name: 'C', value: 2000 },
  { name: 'D', value: 2780 },
  { name: 'E', value: 1890 },
  { name: 'F', value: 2390 },
  { name: 'G', value: 3490 },
];

// Main component
const MainComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Add this state
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const cards: CardData[] = [
    { id: 1, title: 'Sales', content: 'Total sales this month.', bgColor: 'bg-green-500', icon: <FaDollarSign /> },
    { id: 2, title: 'Total Income', content: 'Total income for the period.', bgColor: 'bg-blue-500', icon: <FaChartLine /> },
    { id: 3, title: 'Revenue', content: 'Total revenue generated.', bgColor: 'bg-purple-400', icon: <FaBriefcase /> },
    { id: 4, title: 'Tax', content: 'Tax amount for this period.', bgColor: 'bg-red-500', icon: <FaPercent /> },
  ];

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoading(true); // Set loading to true when refreshing
    setTimeout(() => {
      router.refresh();
      setIsRefreshing(false);
      setLoading(false); // Reset loading after refreshing
    }, 1000);
  };

  const generateChartDescriptions = () => {
    // Generate descriptions for area and histogram charts
    const areaChartDescription = areaChartData.map(data => `${data.name}: ${data.uv}`).join(', ');
    const histogramDescription = histogramData.map(data => `${data.name}: ${data.value}`).join(', ');

    return { areaChartDescription, histogramDescription };
  };

  const exportToPDF = () => {
    const { areaChartDescription, histogramDescription } = generateChartDescriptions();
  
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Dashboard Report', style: 'header' },
        {
          text: 'This report provides detailed information on sales and financial data, including chart analyses.',
          style: 'intro',
        },
        {
          text: 'Cards Information:',
          style: 'subheader',
        },
        {
          ul: cards.map(card => ({
            text: `${card.title}: ${card.content} - $50,000`,
            style: 'listItem',
          })),
          margin: [0, 5, 0, 15] as Margins,
        },
        {
          text: 'Charts Information:',
          style: 'subheader',
        },
        {
          text: `Area Chart Data: ${areaChartDescription}`,
          margin: [0, 5, 0, 15] as Margins,
          style: 'chartInfo',
        },
        {
          text: `Histogram Data: ${histogramDescription}`,
          margin: [0, 5, 0, 15] as Margins,
          style: 'chartInfo',
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#00796b', // Teal color
          margin: [0, 0, 0, 10] as Margins,
        },
        intro: {
          fontSize: 12,
          margin: [0, 0, 0, 20] as Margins,
          color: '#555', // Dark gray
        },
        subheader: {
          fontSize: 18,
          bold: true,
          color: '#004d40', // Darker teal color
          margin: [0, 20, 0, 10] as Margins,
        },
        listItem: {
          fontSize: 12,
          color: '#333', // Dark gray
        },
        chartInfo: {
          fontSize: 12,
          color: '#333', // Dark gray
        },
      },
      pageMargins: [40, 60, 40, 60], // Custom margins for better layout
      defaultStyle: {
        font: 'Roboto', // Ensure this is available or use a standard font
      },
    };
  
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).download('document.pdf');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 p-4 bg-gray-100 flex items-center justify-center">
          <LoadingSpinner />
        </main>
      </div>
    );
  }
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
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main
        id="capture"
        className={`flex-1 p-4 bg-gray-100 overflow-y-auto md:ml-64 transition-transform duration-300 ${
          isSidebarOpen ? 'ml-0 md:ml-[25%]' : 'ml-0'
        }`}
        style={{
          marginLeft: isSidebarOpen ? '0' : '22%',
          width: isSidebarOpen ? 'calc(100% - 25%)' : '100%'
        }}
      >
        {/* Centered Export Button */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-sm"
          >
            Export as PDF
          </button>
        </div>

        {/* Refresh Button at the End */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition duration-300 text-sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Card Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 mt-16`}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`p-4 border rounded-lg ${card.bgColor} text-white flex flex-col items-start justify-between ${
                index < 4 ? 'h-[150px] sm:h-[170px] lg:h-[200px]' : 'h-[200px] sm:h-[220px] lg:h-[250px]'
              }`}
            >
              <header className="flex items-center mb-2">
                <span className="text-2xl mr-2">{card.icon}</span>
                <h3 className="text-lg font-semibold">{card.title}</h3>
              </header>
              <main className="text-sm flex-1">
                <p>{card.content}</p>
              </main>
              <footer className="w-full text-start mt-2">
                <button className="text-slate-100 text-md font-bold">$50,000</button>
              </footer>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Area Chart */}
          <div className="flex-1 min-w-[240px] max-w-[360px] p-4 border rounded-lg bg-white shadow-md">
            <h2 className="text-base font-semibold mb-2 text-center">Area Chart</h2>
            <AreaChart width={300} height={200} data={areaChartData}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </div>

          {/* Histogram */}
          <div className="flex-1 min-w-[240px] max-w-[360px] p-4 border rounded-lg bg-white shadow-md">
            <h2 className="text-base font-semibold mb-2 text-center">Histogram</h2>
            <BarChart width={300} height={200} data={histogramData}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
        <div className='flex flex-1 flex-wrap gap-2 sm:flex-col'>
         <ChartGridComponent />
        </div>
      </main>
    </div>
  );
};

export default MainComponent;

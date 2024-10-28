// src/components/sidebar/Sidebar.js
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { FaHome, FaShoppingCart, FaCalendarAlt, FaReceipt, FaCog, FaUsers, FaBox, FaTimes, FaBars } from 'react-icons/fa';
import crypto from 'crypto';

const generateColorFromString = (str) => {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return `#${hash.slice(0, 6)}`;
};

const NAV_ITEMS = [
  { path: '/analytics', label: 'Dashboard', icon: <FaHome className="text-blue-500" /> },
  { path: '/employees', label: 'Employees', icon: <FaUsers className="text-green-500" /> },
  { path: '/customers', label: 'Customers', icon: <FaUsers className="text-green-900" /> },
  { path: '/productstable', label: 'Products', icon: <FaBox className="text-green-500" /> },
  { path: '/users', label: 'Users', icon: <FaUsers className="text-green-900" /> },
  { path: '/calender', label: 'Calendar', icon: <FaCalendarAlt className="text-purple-500" /> },
  { path: '/settingPage', label: 'Settings', icon: <FaCog className="text-gray-500" /> },
];

const Sidebar = ({ className, isOpen, setIsOpen }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const getLinkClassName = (path) =>
    `flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 group ${
      path === pathname ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-slate-200 dark:hover:bg-gray-700'
    }`;

  const handleNavigation = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarColor = generateColorFromString(userEmail);

  return (
    <>
      <div className={`fixed top-0 left-0 z-40 flex items-center p-4 bg-white dark:bg-gray-800 md:hidden ${isOpen ? 'hidden' : ''}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <FaBars size={20} />
        </button>
      </div>

      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 z-30 shadow-md transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:w-64 w-full ${className}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div
              className="w-8 h-8 p-2 flex items-center justify-center rounded-full text-white font-bold text-lg"
              style={{ backgroundColor: avatarColor }}
            >
              {userInitial}
            </div>
            <div className="ml-3">
              <span className="block text-lg font-semibold text-gray-800 dark:text-gray-100">
                Hi, {userName}
              </span>
              <span className="block text-sm text-gray-600 dark:text-gray-400">
                {userEmail}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <ul className="p-3 space-y-2">
              {NAV_ITEMS.map(({ path, label, icon }) => (
                <li key={path}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(path);
                    }}
                    className={getLinkClassName(path)}
                  >
                    <span className="flex items-center">
                      <span className="text-base mr-3">{icon}</span>
                      <span className="flex-1 text-left whitespace-nowrap">{label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 -z-20 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

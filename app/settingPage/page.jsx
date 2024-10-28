"use client";
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const UserManagement: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<'admins' | 'employees'>('employees');
    const [employees, setEmployees] = useState<User[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [actionType, setActionType] = useState<'addAdmin' | 'addEmployee' | 'removeAdmin' | 'removeEmployee'>('addAdmin');
    const [showActionModal, setShowActionModal] = useState<boolean>(false);
    const [showAccessDeniedModal, setShowAccessDeniedModal] = useState<boolean>(false);
    const [showRoleConflictModal, setShowRoleConflictModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false); // Add this state

    // Fetch all users
    const fetchUsers = async () => {
        const response = await fetch('/api/register');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    };

    // Add Admin
    const addAdmin = async (userId: string, name: string) => {
        const response = await fetch('/api/admins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, name }),
        });
        if (!response.ok) {
            throw new Error('Failed to add admin');
        }
        return response.json();
    };

    // Add Employee
    const addEmployee = async (userId: string) => {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
            throw new Error('Failed to add employee');
        }
        return response.json();
    };

    // Remove Employee
    const removeEmployee = async (userId: string) => {
        const response = await fetch(`/api/employees/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to remove employee');
        }
        return response.json();
    };

    // Remove Admin
    const removeAdmin = async (userId: string) => {
        const response = await fetch(`/api/admins/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to remove admin');
        }
        return response.json();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(Array.isArray(usersData.data) ? usersData.data : []);

                const adminsData = usersData.data.filter((user: User) => user.role === 'ADMIN');
                const employeesData = usersData.data.filter((user: User) => user.role === 'STAFF');

                setAdmins(adminsData);
                setEmployees(employeesData);
            } catch (error) {
                console.error('Error fetching data', error);
                toast.error('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'loading') {
            setLoading(true);
            return;
        }

        if (session?.user?.role !== 'ADMIN') {
            setShowAccessDeniedModal(true);
            return;
        }

        fetchData();
    }, [status, session]);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleAction = async () => {
        if (!selectedUser) {
            toast.warning('Please select a user before performing an action.');
            return;
        }

        try {
            setIsProcessing(true); // Start processing
            const userRole = selectedUser.role;

            if (actionType === 'addAdmin' && userRole === 'ADMIN') {
                setShowRoleConflictModal(true);
                return;
            }
            if (actionType === 'addEmployee' && userRole === 'STAFF') {
                setShowRoleConflictModal(true);
                return;
            }

            if (actionType === 'addAdmin') {
                await addAdmin(selectedUser.id, selectedUser.name);
                toast.success('User added as admin successfully.');
            } else if (actionType === 'addEmployee') {
                await addEmployee(selectedUser.id);
                toast.success('User added as employee successfully.');
            } else if (actionType === 'removeEmployee') {
                await removeEmployee(selectedUser.id);
                toast.success('Employee removed successfully.');
            } else if (actionType === 'removeAdmin') {
                await removeAdmin(selectedUser.id);
                toast.success('Admin removed successfully.');
            }

            setShowActionModal(false);
            // Fetch updated user list
            const usersData = await fetchUsers();
            const adminsData = usersData.data.filter((user: User) => user.role === 'ADMIN');
            const employeesData = usersData.data.filter((user: User) => user.role === 'STAFF');

            setAdmins(adminsData);
            setEmployees(employeesData);
        } catch (error) {
            console.error('Error performing action', error);
            toast.error('Failed to perform action.');
        } finally {
            setIsProcessing(false); // End processing
        }
    };

    const closeActionModal = () => setShowActionModal(false);
    const closeAccessDeniedModal = () => {
        setShowAccessDeniedModal(false);
        router.back();
    };
    const closeRoleConflictModal = () => setShowRoleConflictModal(false);

    const getCurrentData = () => {
        return currentTab === 'employees' ? employees : admins;
    };

    const filteredData = getCurrentData().filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const dataToDisplay = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <CircularProgress />
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

    if (showAccessDeniedModal) {
        return (
            <Dialog open={showAccessDeniedModal} onClose={closeAccessDeniedModal}>
                <DialogTitle>Access Denied</DialogTitle>
                <DialogContent>
                    <p>You must be an admin to view this page.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAccessDeniedModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (showRoleConflictModal) {
        return (
            <Dialog open={showRoleConflictModal} onClose={closeRoleConflictModal}>
                <DialogTitle>Role Conflict</DialogTitle>
                <DialogContent>
                    <p>{selectedUser?.name} already has the role of {selectedUser?.role}. Please select a different action.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeRoleConflictModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <div className="mx-auto my-10 max-w-4xl px-4">
            <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Employee Management
            </h1>
            <p className="text-gray-500 text-center mb-8 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text">
                Manage users and employees here.
            </p>

            <div className="mb-6">
                <div className="flex justify-center space-x-4 mb-4">
                    <button
                        className={`py-2 px-4 rounded ${currentTab === 'employees' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600`}
                        onClick={() => setCurrentTab('employees')}
                    >
                        Employees
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${currentTab === 'admins' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600`}
                        onClick={() => setCurrentTab('admins')}
                    >
                        Admins
                    </button>
                </div>

                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded py-2 px-3 w-full max-w-xs"
                    />
                    <button
                        onClick={() => setShowActionModal(true)}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 ml-2"
                    >
                        {currentTab === 'employees' ? 'Add Employee' : 'Add Admin'}
                    </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataToDisplay.map(user => (
                                <tr key={user.id} onClick={() => setSelectedUser(user)} className="cursor-pointer hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setActionType(user.role === 'ADMIN' ? 'removeAdmin' : 'removeEmployee');
                                                setShowActionModal(true);
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ToastContainer />
                <Dialog open={showActionModal} onClose={closeActionModal}>
                    <DialogTitle>{actionType === 'addAdmin' ? 'Add Admin' : 'Remove User'}</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to {actionType === 'addAdmin' ? 'add' : 'remove'} {selectedUser?.name}?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeActionModal} color="primary">Cancel</Button>
                        <Button onClick={handleAction} color="primary" disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Confirm'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Pagination and other functionalities can be added here */}
            </div>
        </div>
    );
};

export default UserManagement;

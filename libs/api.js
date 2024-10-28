// libs/api.js
import { NextResponse } from 'next/server';

// Fetch all users
export const fetchUsers = async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

// Add Admin
export const addAdmin = async (userId, name) => {
    const response = await fetch('/api/admin', {
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
export const addEmployee = async (userId) => {
    const response = await fetch('/api/employee', {
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
export const removeEmployee = async (userId) => {
    const response = await fetch(`/api/employee/${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to remove employee');
    }
    return response.json();
};

// Remove Admin
export const removeAdmin = async (userId) => {
    const response = await fetch(`/api/admin/${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to remove admin');
    }
    return response.json();
};

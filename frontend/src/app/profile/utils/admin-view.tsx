import React from "react";

export function AdminView() {
    return (
        <div className="border-l-4 border-red-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Admin Dashboard
            </h2>
            <p className="text-gray-600">
                Welcome, Admin! Manage users and global marketplace settings
                here.
            </p>
        </div>
    );
}
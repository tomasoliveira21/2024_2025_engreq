import React from "react";

export function ConsumerView() {
    const consumerDetails = {
        name: "John Doe", // Replace with actual data
        email: "john.doe@example.com", // Replace with actual data
        nif: "123456789", // Replace with actual data
        role: "Consumer", // Replace with actual data
    };

    return (
        <div className="border-l-4 border-yellow-500 pl-4 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Consumer Dashboard
            </h2>
            <p className="text-gray-400 mb-6">
                Welcome, {consumerDetails.name}! Below are your business details:
            </p>
            <div className="space-y-4">
                {consumerDetails.photo ? (
                    <div>
                        <img
                            src={consumerDetails.photo}
                            alt="Consumer Photo"
                            className="w-32 h-32 rounded-full object-cover border border-gray-700 shadow-md"
                        />
                    </div>
                ) : (
                    <div
                        className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600">
                        No Photo
                    </div>
                )}
                <div>
                    <span className="font-medium text-gray-200">Name:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.name}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Email:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.email}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">NIF:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.nif}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Role:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.role}</span>
                </div>
            </div>
        </div>
    );
}
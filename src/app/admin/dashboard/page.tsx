import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <header className="bg-gray-900 py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Statistics</h2>
            <p className="mt-2">Overview of platform stats</p>
          </div>
        </div>
      </main>
    </div>
  );
};

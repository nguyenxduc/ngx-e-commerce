import React, { useState } from "react";
import {
  AdminStatsCard,
  AdminDataTable,
  AdminModal,
  AdminBreadcrumb,
  AdminNotificationSystem,
  AdminSearchBar,
  Notification,
} from "./index";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
} from "lucide-react";

const AdminComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Order Completed",
      message: "Order #12345 has been completed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Low Stock Alert",
      message: "iPhone 15 Pro is running low on stock",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "New User Registered",
      message: "John Doe has joined the platform",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      read: true,
    },
  ]);

  const statsData = [
    {
      title: "Total Users",
      value: "2,350",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-blue-600",
      description: "Active users this month",
    },
    {
      title: "Total Products",
      value: "1,234",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Package,
      iconColor: "text-purple-600",
      description: "Products in catalog",
    },
    {
      title: "Total Orders",
      value: "856",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      iconColor: "text-green-600",
      description: "Orders this month",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-indigo-600",
      description: "Revenue this month",
    },
  ];

  const tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      role: "Customer",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      role: "Admin",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "inactive",
      role: "Customer",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      status: "active",
      role: "Vendor",
    },
  ];

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "role", label: "Role" },
  ];

  const searchResults = [
    {
      id: "1",
      title: "John Doe",
      description: "Customer - john@example.com",
      type: "user" as const,
      url: "/admin/users/1",
    },
    {
      id: "2",
      title: "iPhone 15 Pro",
      description: "Product - Electronics",
      type: "product" as const,
      url: "/admin/products/iphone-15-pro",
    },
  ];

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleResultSelect = (result: any) => {
    console.log("Selected result:", result);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AdminBreadcrumb</h2>
        <AdminBreadcrumb />
      </div>

      {/* Stats Cards Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AdminStatsCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <AdminStatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Data Table Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AdminDataTable</h2>
        <AdminDataTable
          columns={columns}
          data={tableData}
          title="Users"
          searchable
          filterable
          actions={{ view: true, edit: true, delete: true }}
          onSearch={handleSearch}
          onView={(row) => console.log("View:", row)}
          onEdit={(row) => console.log("Edit:", row)}
          onDelete={(row) => console.log("Delete:", row)}
          pagination={{
            currentPage: 1,
            totalPages: 5,
            onPageChange: (page) => console.log("Page:", page),
          }}
        />
      </div>

      {/* Search Bar Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AdminSearchBar</h2>
        <div className="max-w-md">
          <AdminSearchBar
            onSearch={handleSearch}
            placeholder="Search users, products, orders..."
            searchResults={searchResults}
            onResultSelect={handleResultSelect}
            showGlobalSearch
          />
        </div>
      </div>

      {/* Notification System Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AdminNotificationSystem</h2>
        <AdminNotificationSystem
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Modal Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AdminModal</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={16} />
          <span>Open Modal</span>
        </button>

        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New User"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Customer</option>
                <option>Admin</option>
                <option>Vendor</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add User
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
    </div>
  );
};

export default AdminComponentsDemo;

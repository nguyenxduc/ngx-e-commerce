import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export const ThemeDemo: React.FC = () => {
  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            Dark Mode Demo
          </h1>
          <ThemeToggle size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cards */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Card Title</h2>
              <p className="text-base-content/70">
                This is a card with dark mode support.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Another Card</h2>
              <p className="text-base-content/70">
                Another card with different styling.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary">Secondary</button>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Form Elements</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Input field"
                  className="input input-bordered w-full"
                />
                <select className="select select-bordered w-full">
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea
                  placeholder="Textarea"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Buttons</h2>
              <div className="space-y-2">
                <button className="btn btn-primary w-full">
                  Primary Button
                </button>
                <button className="btn btn-secondary w-full">
                  Secondary Button
                </button>
                <button className="btn btn-accent w-full">Accent Button</button>
                <button className="btn btn-ghost w-full">Ghost Button</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Table Example</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th className="text-base-content">Name</th>
                      <th className="text-base-content">Email</th>
                      <th className="text-base-content">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-base-content">John Doe</td>
                      <td className="text-base-content">john@example.com</td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-base-content">Jane Smith</td>
                      <td className="text-base-content">jane@example.com</td>
                      <td>
                        <span className="badge badge-warning">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

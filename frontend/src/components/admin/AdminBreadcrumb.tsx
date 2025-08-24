import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface AdminBreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({
  items = [],
  showHome = true,
  className = "",
}) => {
  const location = useLocation();

  // Auto-generate breadcrumb from current path if no items provided
  const generateBreadcrumbFromPath = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable label
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbItems.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems =
    items.length > 0 ? items : generateBreadcrumbFromPath();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {showHome && (
        <>
          <Link
            to="/admin/dashboard"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home size={16} />
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
        </>
      )}

      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.icon && <item.icon size={16} className="mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center text-gray-900 font-medium">
              {item.icon && <item.icon size={16} className="mr-1" />}
              {item.label}
            </span>
          )}

          {index < breadcrumbItems.length - 1 && (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default AdminBreadcrumb;

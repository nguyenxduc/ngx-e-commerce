import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-blue-600",
  description,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "↗";
      case "negative":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>

          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>

        {change && (
          <div
            className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor()}`}
          >
            <span>{getChangeIcon()}</span>
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;

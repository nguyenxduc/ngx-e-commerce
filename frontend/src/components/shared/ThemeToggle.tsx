import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../stores/theme.store";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  size = "md",
}) => {
  const { theme, toggleTheme } = useThemeStore();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg text-base-content hover:text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ${sizeClasses[size]} ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon
          className={`${iconSizes[size]} transition-transform duration-200 hover:scale-110`}
        />
      ) : (
        <Sun
          className={`${iconSizes[size]} transition-transform duration-200 hover:scale-110`}
        />
      )}
    </button>
  );
};

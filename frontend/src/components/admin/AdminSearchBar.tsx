import React, { useState, useEffect, useRef } from "react";
import { Search, X, Command } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "user" | "product" | "order" | "shop";
  url: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface AdminSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showGlobalSearch?: boolean;
  searchResults?: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  loading?: boolean;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  className = "",
  showGlobalSearch = true,
  searchResults = [],
  onResultSelect,
  loading = false,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            onResultSelect?.(searchResults[selectedIndex]);
            setIsOpen(false);
            setSelectedIndex(-1);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onResultSelect]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "page":
        return "📄";
      case "user":
        return "👤";
      case "product":
        return "📦";
      case "order":
        return "🛒";
      case "shop":
        return "🏪";
      default:
        return "📄";
    }
  };

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "page":
        return "text-blue-600";
      case "user":
        return "text-green-600";
      case "product":
        return "text-purple-600";
      case "order":
        return "text-orange-600";
      case "shop":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        {/* Keyboard Shortcut */}
        {showGlobalSearch && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center space-x-1 text-xs text-gray-400">
            <Command size={12} />
            <span>K</span>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length > 0 || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search size={32} className="mx-auto mb-2 text-gray-300" />
              <p>No results found</p>
              <p className="text-sm">Try searching for something else</p>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onResultSelect?.(result);
                    setIsOpen(false);
                    setSelectedIndex(-1);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    index === selectedIndex ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-lg ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {result.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                      {result.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSearchBar;

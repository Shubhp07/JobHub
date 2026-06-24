import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { TextGenerateEffect } from '../ui/text-generate-effect';

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  showSearch = true,
  searchTerm,
  onSearchChange,
  showViewToggle = false,           
  viewMode,
  onViewModeChange,
  searchPlaceholder = "Search...",
}) => {
  return (
    <div className="bg-[#fafafa] pt-8 pb-6 px-6 border-b border-gray-100">
      <div className="w-full">
        {/* Top Row: Title and Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <TextGenerateEffect 
              words={title} 
              className="text-[28px] font-semibold text-[#1e1b4b] leading-tight m-0" 
            />
            {subtitle && (
              <p className="text-[15px] text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {buttonText && onButtonClick && (
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={onButtonClick}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="text-lg leading-none font-light">+</span>
                {buttonText}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Row: Search and View Toggle */}
        {(showSearch || showViewToggle) && (
          <div className="flex justify-end items-center gap-3">
            {showSearch && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
            )}
            
            {showViewToggle && (
              <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5">
                <button
                  onClick={() => onViewModeChange?.("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" 
                      ? "bg-[#0f172a] text-white" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange?.("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" 
                      ? "bg-[#0f172a] text-white" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

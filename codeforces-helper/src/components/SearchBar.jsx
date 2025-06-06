import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm, onSearchChange]);

  // Update local state when external search term changes (e.g., from clear filters)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleClear = () => {
    setLocalSearchTerm('');
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3">
        <Search size={20} className="text-gray-400" />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search problems by name or tags..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {localSearchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {localSearchTerm && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Searching for: <span className="font-medium">"{localSearchTerm}"</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 
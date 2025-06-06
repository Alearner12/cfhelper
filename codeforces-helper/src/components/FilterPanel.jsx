import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getContestDivisions, getProblemPositions, getPopularTags } from '../services/codeforcesApi';

const FilterPanel = ({ filters, setFilters, problemCount, onClearFilters, solvedCount = 0, totalProblems = 0 }) => {
  const [expandedSections, setExpandedSections] = useState({
    contest: true,
    rating: true,
    tags: false
  });

  const divisions = getContestDivisions();
  const positions = getProblemPositions();
  const popularTags = getPopularTags();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDivisionChange = (division) => {
    setFilters({
      ...filters,
      division: filters.division === division ? '' : division
    });
  };

  const handlePositionChange = (position) => {
    setFilters({
      ...filters,
      position: filters.position === position ? '' : position
    });
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    setFilters({
      ...filters,
      tags: newTags
    });
  };

  const hasActiveFilters = () => {
    return filters.division || filters.position || filters.minRating || 
           filters.maxRating || filters.tags.length > 0 || filters.search;
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-codeforces-blue" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
          </div>
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span>Found Problems</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {problemCount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span>Problems Solved</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {solvedCount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span>Total Database</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {totalProblems.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Contest Division & Position */}
      <div className="card">
        <button
          onClick={() => toggleSection('contest')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            Contest & Position
          </h3>
          {expandedSections.contest ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.contest && (
          <div className="mt-4 space-y-4">
            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Division
              </label>
              <div className="flex flex-wrap gap-2">
                {divisions.map((division) => (
                  <button
                    key={division}
                    onClick={() => handleDivisionChange(division)}
                    className={
                      filters.division === division 
                        ? 'filter-chip-active' 
                        : 'filter-chip'
                    }
                  >
                    {division}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <div className="flex flex-wrap gap-2">
                {positions.map((position) => (
                  <button
                    key={position}
                    onClick={() => handlePositionChange(position)}
                    className={
                      filters.position === position 
                        ? 'filter-chip-active' 
                        : 'filter-chip'
                    }
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="card">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            Problem Rating
          </h3>
          {expandedSections.rating ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.rating && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Rating
                </label>
                <input
                  type="number"
                  placeholder="800"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Rating
                </label>
                <input
                  type="number"
                  placeholder="3500"
                  value={filters.maxRating}
                  onChange={(e) => setFilters({ ...filters, maxRating: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>
            
            {/* Quick Rating Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Beginner', min: '800', max: '1200' },
                  { label: 'Easy', min: '1200', max: '1600' },
                  { label: 'Medium', min: '1600', max: '2000' },
                  { label: 'Hard', min: '2000', max: '3500' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setFilters({
                      ...filters,
                      minRating: preset.min,
                      maxRating: preset.max
                    })}
                    className="text-xs py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-codeforces-blue hover:text-white transition-colors duration-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tags Filter */}
      <div className="card">
        <button
          onClick={() => toggleSection('tags')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            Tags
            {filters.tags.length > 0 && (
              <span className="ml-2 text-xs bg-codeforces-blue text-white px-2 py-1 rounded-full">
                {filters.tags.length}
              </span>
            )}
          </h3>
          {expandedSections.tags ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.tags && (
          <div className="mt-4">
            {/* Selected Tags */}
            {filters.tags.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center space-x-1 bg-codeforces-blue text-white px-2 py-1 rounded-full text-xs"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="hover:bg-blue-700 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Popular Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {popularTags
                  .filter(tag => !filters.tags.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="filter-chip text-xs"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel; 
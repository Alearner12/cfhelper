import { useState } from 'react';
import { Star, ExternalLink, Tag, Award, ChevronLeft, ChevronRight, Check, Target, Clock } from 'lucide-react';

const ProblemList = ({ 
  problems, 
  favorites, 
  solvedProblems = [],
  onToggleFavorite,
  onToggleSolved,
  showFavoritesOnly = false,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  visibilitySettings = { showRating: true, showTags: true, showSolved: true }
}) => {
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedProblems = [...problems].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'contest':
        aValue = a.contestId || 0;
        bValue = b.contestId || 0;
        break;
      case 'position':
        aValue = a.index || '';
        bValue = b.index || '';
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const getDifficultyColor = (rating) => {
    if (!rating) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    if (rating < 1000) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (rating < 1300) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    if (rating < 1600) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    if (rating < 2000) return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
    if (rating < 2500) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
  };

  const getRatingGradient = (rating) => {
    if (!rating) return 'from-gray-400 to-gray-500';
    if (rating < 1000) return 'from-green-400 to-green-600';
    if (rating < 1300) return 'from-blue-400 to-blue-600';
    if (rating < 1600) return 'from-yellow-400 to-yellow-600';
    if (rating < 2000) return 'from-orange-400 to-orange-600';
    if (rating < 2500) return 'from-red-400 to-red-600';
    return 'from-purple-400 to-purple-600';
  };



  // Pagination helpers
  const handlePrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const itemsPerPage = 50; // Fixed items per page

  if (totalCount === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center animate-fade-in">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {showFavoritesOnly ? (
            <>
              <Star size={64} className="mx-auto mb-6 text-yellow-300 animate-bounce" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No favorite problems yet</h3>
              <p className="text-lg">Start by adding some problems to your favorites!</p>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  💡 Click the star icon on any problem to add it to your favorites
                </p>
              </div>
            </>
          ) : (
            <>
              <Target size={64} className="mx-auto mb-6 text-blue-300 animate-pulse" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No problems found</h3>
              <p className="text-lg">Try adjusting your filters or search criteria.</p>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  🔍 Use the filters on the left to narrow down your search
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sort Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-down">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <Award size={16} className="text-blue-500" />
            <span>Sort by:</span>
          </span>
          
          {[
            { key: 'rating', label: 'Rating', icon: Award },
            { key: 'name', label: 'Name', icon: Tag },
            { key: 'contest', label: 'Contest', icon: Clock },
            { key: 'position', label: 'Position', icon: Target }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.key}
                onClick={() => handleSort(option.key)}
                className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  sortBy === option.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon size={14} />
                <span>{option.label}</span>
                {sortBy === option.key && (
                  <span className="text-xs bg-white bg-opacity-20 px-1 rounded">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
            <span className="font-medium">
              {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)}
            </span>
            <span className="mx-2">of</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {totalCount.toLocaleString()}
            </span>
            <span className="ml-1">problems</span>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {sortedProblems.map((problem, index) => {
          const problemId = `${problem.contestId}-${problem.index}`;
          const isFavorite = favorites.includes(problemId);
          const isSolved = solvedProblems.includes(problemId);
          
          return (
            <div 
              key={problemId} 
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${
                isSolved 
                  ? 'border-green-400 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Solved Badge */}
              {isSolved && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Check size={16} className="text-white" />
                </div>
              )}

              {/* Problem Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold transition-colors duration-200 truncate ${
                    isSolved ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {problem.index}. {problem.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      Contest {problem.contestId}
                    </span>

                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onToggleSolved && onToggleSolved(problemId)}
                    className={`p-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                      isSolved
                        ? 'text-green-500 hover:text-green-600 bg-green-100 dark:bg-green-900/30'
                        : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                  >
                    <Check size={18} />
                  </button>
                  
                  <button
                    onClick={() => onToggleFavorite(problemId)}
                    className={`p-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                      isFavorite
                        ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                    }`}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110"
                    title="Open problem"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              {/* Problem Details */}
              <div className="space-y-4">
                {/* Rating and Position */}
                <div className="flex items-center space-x-4">
                  {visibilitySettings.showRating && problem.rating && (
                    <div className="flex items-center space-x-2">
                      <Award size={16} className="text-gray-400" />
                      <div className={`px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getRatingGradient(problem.rating)} shadow-lg`}>
                        {problem.rating}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Target size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      Position {problem.index}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {visibilitySettings.showTags && problem.tags && problem.tags.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <Tag size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium hover:shadow-md transition-all duration-200 cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 4 && (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          +{problem.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                      isSolved
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    }`}
                  >
                    {isSolved ? '✓ View Solution' : 'Solve Problem'}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div 
          key={`pagination-${currentPage}`}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-up"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Page {currentPage}</span>
              <span className="mx-2">of</span>
              <span className="font-semibold">{totalPages}</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{totalCount.toLocaleString()}</span>
              <span className="ml-1">total problems</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white shadow-md'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={(e) => handlePageClick(e, pageNum)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors duration-200 ${
                      pageNum === currentPage
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white shadow-md'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemList; 
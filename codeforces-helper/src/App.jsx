import { useState, useEffect, useMemo, useCallback } from 'react';
import { Moon, Sun, Filter, Search, Shuffle, Star, TrendingUp, User, Eye, EyeOff, Settings } from 'lucide-react';
import ProblemList from './components/ProblemList';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';
import { fetchProblems, fetchUserInfo } from './services/codeforcesApi';

function App() {
  // Initialize dark mode from localStorage immediately
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('darkMode') === 'true';
    } catch {
      return false;
    }
  });
  
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('problems');
  const [favorites, setFavorites] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  
  // Visibility settings
  const [visibilitySettings, setVisibilitySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('visibilitySettings');
      return saved ? JSON.parse(saved) : {
        showRating: true,
        showTags: true,
        showSolved: true
      };
    } catch {
      return {
        showRating: true,
        showTags: true,
        showSolved: true
      };
    }
  });
  
  const [filters, setFilters] = useState({
    division: '',
    position: '',
    minRating: '',
    maxRating: '',
    tags: [],
    search: ''
  });

  // Separate pagination state for different tabs
  const [paginationState, setPaginationState] = useState({
    problems: { currentPage: 1, itemsPerPage: 50 },
    favorites: { currentPage: 1, itemsPerPage: 50 }
  });

  useEffect(() => {
    // Load favorites from localStorage with better error handling
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      setFavorites([]);
    }

    // Load solved problems from localStorage
    try {
      const savedSolved = localStorage.getItem('solvedProblems');
      if (savedSolved) {
        const parsedSolved = JSON.parse(savedSolved);
        if (Array.isArray(parsedSolved)) {
          setSolvedProblems(parsedSolved);
        }
      }
    } catch (error) {
      console.error('Error loading solved problems from localStorage:', error);
      setSolvedProblems([]);
    }

    // Load user from localStorage
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
    
    // Load problems on mount
    loadProblems();
  }, []);

  useEffect(() => {
    // Apply dark mode class to document immediately
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Save visibility settings to localStorage
  useEffect(() => {
    localStorage.setItem('visibilitySettings', JSON.stringify(visibilitySettings));
  }, [visibilitySettings]);

  // Reset to first page when filters change
  useEffect(() => {
    setPaginationState(prev => ({
      ...prev,
      problems: { ...prev.problems, currentPage: 1 },
      favorites: { ...prev.favorites, currentPage: 1 }
    }));
  }, [filters]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const data = await fetchProblems();
      setProblems(data);
      setError(null);
    } catch (err) {
      setError('Failed to load problems. Please try again.');
      console.error('Error loading problems:', err);
    } finally {
      setLoading(false);
    }
  };

  // User login functionality
  const handleUserLogin = async (handle) => {
    setUserLoading(true);
    try {
      const userData = await fetchUserInfo(handle);
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setActiveTab('profile'); // Switch to profile tab after login
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('User not found or API error. Please check the handle and try again.');
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('problems'); // Switch back to problems tab
  };

  // Memoized filtered problems with optimized filtering
  const filteredProblems = useMemo(() => {
    let filtered = problems;

    // Apply division filter
    if (filters.division) {
      filtered = filtered.filter(problem => 
        problem.contestId && problem.contestId.toString().includes(filters.division)
      );
    }

    // Apply position filter
    if (filters.position) {
      filtered = filtered.filter(problem => 
        problem.index && problem.index.toLowerCase() === filters.position.toLowerCase()
      );
    }

    // Apply rating filters
    if (filters.minRating) {
      const minRating = parseInt(filters.minRating);
      filtered = filtered.filter(problem => 
        problem.rating && problem.rating >= minRating
      );
    }

    if (filters.maxRating) {
      const maxRating = parseInt(filters.maxRating);
      filtered = filtered.filter(problem => 
        problem.rating && problem.rating <= maxRating
      );
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(problem => 
        problem.tags && filters.tags.every(tag => 
          problem.tags.some(problemTag => 
            problemTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(problem => 
        problem.name.toLowerCase().includes(searchTerm) ||
        (problem.tags && problem.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm)
        ))
      );
    }

    // Apply solved problems filter
    if (!visibilitySettings.showSolved) {
      filtered = filtered.filter(problem => 
        !solvedProblems.includes(`${problem.contestId}-${problem.index}`)
      );
    }

    return filtered;
  }, [problems, filters, visibilitySettings.showSolved, solvedProblems]);

  // Memoized paginated problems
  const paginatedProblems = useMemo(() => {
    const { currentPage, itemsPerPage } = paginationState.problems;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProblems.slice(startIndex, endIndex);
  }, [filteredProblems, paginationState.problems]);

  // Memoized favorite problems for better performance
  const favoriteProblems = useMemo(() => {
    return filteredProblems.filter(problem => 
      favorites.includes(`${problem.contestId}-${problem.index}`)
    );
  }, [filteredProblems, favorites]);

  // Memoized paginated favorite problems
  const paginatedFavoriteProblems = useMemo(() => {
    const { currentPage, itemsPerPage } = paginationState.favorites;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return favoriteProblems.slice(startIndex, endIndex);
  }, [favoriteProblems, paginationState.favorites]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProblems.length / paginationState.problems.itemsPerPage);
  const favoriteTotalPages = Math.ceil(favoriteProblems.length / paginationState.favorites.itemsPerPage);

  const toggleFavorite = useCallback((problemId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const toggleSolved = useCallback((problemId) => {
    setSolvedProblems(prev => {
      const newSolved = prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId];
      
      localStorage.setItem('solvedProblems', JSON.stringify(newSolved));
      return newSolved;
    });
  }, []);

  const getRandomProblem = useCallback(() => {
    if (filteredProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredProblems.length);
      const randomProblem = filteredProblems[randomIndex];
      window.open(`https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`, '_blank');
    }
  }, [filteredProblems]);

  // Clear all filters function
  const clearAllFilters = useCallback(() => {
    setFilters({
      division: '',
      position: '',
      minRating: '',
      maxRating: '',
      tags: [],
      search: ''
    });
    setPaginationState(prev => ({
      ...prev,
      problems: { ...prev.problems, currentPage: 1 },
      favorites: { ...prev.favorites, currentPage: 1 }
    }));
  }, []);

  // Handle page changes for different tabs
  const handlePageChange = useCallback((page, tab = 'problems') => {
    setPaginationState(prev => ({
      ...prev,
      [tab]: { ...prev[tab], currentPage: page }
    }));
  }, []);

  // Toggle visibility settings
  const toggleVisibility = useCallback((setting) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  }, []);

  const tabs = [
    { id: 'problems', label: 'Problems', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-800/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CF</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Codeforces Helper
                </h1>
              </div>
              
              {currentUser && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Welcome, {currentUser.handle}!</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                    {solvedProblems.length} solved
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Visibility Controls */}
              <div className="hidden lg:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => toggleVisibility('showRating')}
                  className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                    visibilitySettings.showRating
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Toggle rating visibility"
                >
                  Rating
                </button>
                
                <button
                  onClick={() => toggleVisibility('showTags')}
                  className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                    visibilitySettings.showTags
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Toggle tags visibility"
                >
                  Tags
                </button>
                
                <button
                  onClick={() => toggleVisibility('showSolved')}
                  className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                    visibilitySettings.showSolved
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Toggle solved problems visibility"
                >
                  Solved
                </button>
              </div>
              
              <button
                onClick={getRandomProblem}
                className="btn-secondary flex items-center space-x-2 group"
                disabled={filteredProblems.length === 0}
              >
                <Shuffle size={16} className="group-hover:animate-spin" />
                <span>Random</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                {darkMode ? <Sun size={20} className="animate-spin" /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 backdrop-blur-md bg-white/95 dark:bg-gray-800/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 group ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'profile' && currentUser && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  {tab.id === 'favorites' && favorites.length > 0 && (
                    <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {favorites.length > 99 ? '99+' : favorites.length}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Hide on profile tab */}
          {activeTab !== 'profile' && (
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                problemCount={filteredProblems.length}
                onClearFilters={clearAllFilters}
                solvedCount={solvedProblems.length}
                totalProblems={problems.length}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className={activeTab === 'profile' ? 'lg:col-span-4' : 'lg:col-span-3'}>
            {activeTab === 'problems' && (
              <div className="space-y-6">
                <SearchBar
                  searchTerm={filters.search}
                  onSearchChange={(search) => setFilters({ ...filters, search })}
                />
                
                {loading ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-center animate-pulse">
                      Loading problems from Codeforces...
                      <br />
                      <span className="text-sm">This may take a few seconds</span>
                    </p>
                  </div>
                ) : error ? (
                  <div className="card text-center py-12 animate-shake">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button onClick={loadProblems} className="btn-primary">
                      Try Again
                    </button>
                  </div>
                ) : (
                  <ProblemList
                    problems={paginatedProblems}
                    favorites={favorites}
                    solvedProblems={solvedProblems}
                    onToggleFavorite={toggleFavorite}
                    onToggleSolved={toggleSolved}
                    totalCount={filteredProblems.length}
                    currentPage={paginationState.problems.currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(page, 'problems')}
                    visibilitySettings={visibilitySettings}
                  />
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <SearchBar
                  searchTerm={filters.search}
                  onSearchChange={(search) => setFilters({ ...filters, search })}
                />
                
                <ProblemList
                  problems={paginatedFavoriteProblems}
                  favorites={favorites}
                  solvedProblems={solvedProblems}
                  onToggleFavorite={toggleFavorite}
                  onToggleSolved={toggleSolved}
                  showFavoritesOnly={true}
                  totalCount={favoriteProblems.length}
                  currentPage={paginationState.favorites.currentPage}
                  totalPages={favoriteTotalPages}
                  onPageChange={(page) => handlePageChange(page, 'favorites')}
                  visibilitySettings={visibilitySettings}
                />
              </div>
            )}

            {activeTab === 'stats' && (
              <StatsPanel 
                problems={filteredProblems}
                favorites={favorites}
                solvedProblems={solvedProblems}
              />
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                {!currentUser ? (
                  <UserLogin
                    onLogin={handleUserLogin}
                    currentUser={currentUser}
                    onLogout={handleUserLogout}
                  />
                ) : (
                  <UserProfile
                    user={currentUser}
                    problems={problems}
                    favorites={favorites}
                    solvedProblems={solvedProblems}
                    onLogout={handleUserLogout}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

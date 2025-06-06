import { BarChart3, TrendingUp, Star, Award, Target, Users, Calendar, Tag, Activity, Zap } from 'lucide-react';

const StatsPanel = ({ problems, favorites }) => {
  // Calculate statistics
  const totalProblems = problems.length;
  const favoritesCount = favorites.length;

  // Rating distribution
  const ratingDistribution = problems.reduce((acc, problem) => {
    if (problem.rating) {
      const range = Math.floor(problem.rating / 200) * 200;
      acc[range] = (acc[range] || 0) + 1;
    }
    return acc;
  }, {});

  // Division distribution
  const divisionDistribution = problems.reduce((acc, problem) => {
    const division = problem.division || 'Unknown';
    acc[division] = (acc[division] || 0) + 1;
    return acc;
  }, {});

  // Position distribution
  const positionDistribution = problems.reduce((acc, problem) => {
    if (problem.index) {
      const position = problem.index.charAt(0);
      acc[position] = (acc[position] || 0) + 1;
    }
    return acc;
  }, {});

  // Tag distribution (top 12)
  const tagDistribution = problems.reduce((acc, problem) => {
    if (problem.tags) {
      problem.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const topTags = Object.entries(tagDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 12);

  // Helper function to get color for ratings
  const getRatingColor = (rating) => {
    if (rating < 1000) return 'bg-gray-500';
    if (rating < 1200) return 'bg-green-500';
    if (rating < 1400) return 'bg-cyan-500';
    if (rating < 1600) return 'bg-blue-500';
    if (rating < 1900) return 'bg-purple-500';
    if (rating < 2100) return 'bg-yellow-500';
    if (rating < 2400) return 'bg-orange-500';
    if (rating < 2600) return 'bg-red-500';
    return 'bg-pink-500';
  };

  const ModernStatCard = ({ icon: Icon, title, value, subtitle, gradient, animate = false }) => (
    <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            <Icon size={24} className={animate ? 'animate-bounce' : ''} />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
          </div>
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  const InteractiveChart = ({ data, title, colorFn, formatLabel, type = 'horizontal' }) => {
    const maxValue = Math.max(...Object.values(data));
    const sortedData = Object.entries(data).sort(([,a], [,b]) => b - a);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <BarChart3 size={20} className="text-blue-500" />
          <span>{title}</span>
        </h3>
        
        <div className="space-y-4">
          {sortedData.slice(0, 8).map(([key, value], index) => (
            <div key={key} className="group relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {formatLabel ? formatLabel(key) : key}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {value.toLocaleString()}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${
                      colorFn ? colorFn(key) : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{ 
                      width: `${(value / maxValue) * 100}%`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="h-full bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-medium text-white mix-blend-difference">
                    {((value / totalProblems) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#3B82F6' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-block">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Problem Statistics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive analysis of {totalProblems.toLocaleString()} Codeforces problems
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernStatCard
            icon={Target}
            title="Total Problems"
            value={totalProblems}
            subtitle="Available in database"
            gradient="from-blue-500 to-blue-600"
            animate={true}
          />
          
          <ModernStatCard
            icon={Star}
            title="Your Favorites"
            value={favoritesCount}
            subtitle="Problems you starred"
            gradient="from-yellow-500 to-orange-500"
          />
          
          <ModernStatCard
            icon={BarChart3}
            title="Average Rating"
            value={problems.length > 0 ? Math.round(problems.filter(p => p.rating).reduce((sum, p) => sum + p.rating, 0) / problems.filter(p => p.rating).length) : 0}
            subtitle="Of all problems with ratings"
            gradient="from-green-500 to-green-600"
          />
          
          <ModernStatCard
            icon={Award}
            title="Unique Contests"
            value={new Set(problems.map(p => p.contestId).filter(Boolean)).size}
            subtitle="Different competitions"
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <InteractiveChart
            data={ratingDistribution}
            title="Problems by Rating Range"
            colorFn={(rating) => getRatingColor(parseInt(rating))}
            formatLabel={(rating) => `${rating}-${parseInt(rating) + 199}`}
          />

          {/* Division Distribution */}
          <InteractiveChart
            data={divisionDistribution}
            title="Problems by Division"
            colorFn={(division) => {
              switch (division) {
                case 'Div1': return 'bg-gradient-to-r from-red-500 to-red-600';
                case 'Div2': return 'bg-gradient-to-r from-blue-500 to-blue-600';
                case 'Div3': return 'bg-gradient-to-r from-green-500 to-green-600';
                case 'Div4': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
                default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
              }
            }}
          />
        </div>

        {/* More Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Position Distribution */}
          <InteractiveChart
            data={positionDistribution}
            title="Problems by Position"
            colorFn={() => 'bg-gradient-to-r from-indigo-500 to-purple-500'}
          />

          {/* Top Tags with Circular Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Tag size={20} className="text-purple-500" />
              <span>Popular Tags</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {topTags.slice(0, 6).map(([tag, count], index) => (
                <div key={tag} className="text-center group">
                  <CircularProgress
                    percentage={(count / totalProblems) * 100 * 20} // Scale for visibility
                    size={80}
                    strokeWidth={6}
                    color={`hsl(${index * 60}, 70%, 50%)`}
                  />
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tag}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {count} problems
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Activity size={20} className="text-yellow-500" />
              <span>Your Activity</span>
            </h3>
            
            {favoritesCount > 0 ? (
              <div className="space-y-6">
                <div className="text-center">
                  <CircularProgress
                    percentage={(favoritesCount / totalProblems) * 100}
                    size={100}
                    strokeWidth={8}
                    color="#F59E0B"
                  />
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Problems Explored
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Favorites</span>
                    <span className="font-bold text-yellow-600">{favoritesCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Different Contests</span>
                    <span className="font-bold text-blue-600">
                      {new Set(favorites.map(fav => fav.split('-')[0])).size}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Exploration Rate</span>
                    <span className="font-bold text-green-600">
                      {((favoritesCount / totalProblems) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star size={48} className="mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Favorites Yet
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Start exploring problems and add them to your favorites!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Tag Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Zap size={20} className="text-green-500" />
            <span>Complete Tag Analysis</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topTags.map(([tag, count], index) => (
              <div key={tag} className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(${index * 30}, 70%, 50%)` }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tag}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {count}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {((count / totalProblems) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500 group-hover:brightness-110"
                    style={{ 
                      width: `${(count / Math.max(...topTags.map(([,c]) => c))) * 100}%`,
                      backgroundColor: `hsl(${index * 30}, 70%, 50%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 
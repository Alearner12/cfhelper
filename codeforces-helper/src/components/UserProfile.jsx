import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Calendar, Target, Award, Star, CheckCircle, Clock, BarChart3, LogOut, Activity, Zap, Users } from 'lucide-react';

const UserProfile = ({ user, problems, favorites, solvedProblems = [], onLogout }) => {
  const [selectedChart, setSelectedChart] = useState('rating');

  // Get user's rating color based on rating
  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-500';
    if (rating < 1200) return 'text-gray-600';
    if (rating < 1400) return 'text-green-600';
    if (rating < 1600) return 'text-cyan-600';
    if (rating < 1900) return 'text-blue-600';
    if (rating < 2100) return 'text-purple-600';
    if (rating < 2300) return 'text-yellow-600';
    if (rating < 2400) return 'text-orange-600';
    if (rating < 2600) return 'text-red-600';
    return 'text-red-700';
  };

  const getRatingBgColor = (rating) => {
    if (!rating) return 'from-gray-400 to-gray-500';
    if (rating < 1200) return 'from-gray-400 to-gray-600';
    if (rating < 1400) return 'from-green-400 to-green-600';
    if (rating < 1600) return 'from-cyan-400 to-cyan-600';
    if (rating < 1900) return 'from-blue-400 to-blue-600';
    if (rating < 2100) return 'from-purple-400 to-purple-600';
    if (rating < 2300) return 'from-yellow-400 to-yellow-600';
    if (rating < 2400) return 'from-orange-400 to-orange-600';
    if (rating < 2600) return 'from-red-400 to-red-600';
    return 'from-red-500 to-red-700';
  };

  const getRankColor = (rank) => {
    if (!rank) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    const rankLower = rank.toLowerCase();
    if (rankLower.includes('newbie')) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    if (rankLower.includes('pupil')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (rankLower.includes('specialist')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
    if (rankLower.includes('expert')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (rankLower.includes('candidate master')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (rankLower.includes('master')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (rankLower.includes('international master')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (rankLower.includes('grandmaster')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  // Calculate rating statistics with proper logic
  const calculateRatingStats = () => {
    const currentRating = user.rating || 0;
    const maxRating = user.maxRating || 0;
    
    // Rating change from max (if current < max, it's negative)
    const ratingChange = currentRating - maxRating;
    
    // Next rating milestone calculation
    const getNextMilestone = (rating) => {
      const milestones = [1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000];
      return milestones.find(m => m > rating) || (rating + 100);
    };
    
    const nextMilestone = getNextMilestone(currentRating);
    const toNextRank = nextMilestone - currentRating;
    
    return { currentRating, maxRating, ratingChange, toNextRank, nextMilestone };
  };

  const ratingStats = calculateRatingStats();

  // Calculate problem statistics
  const problemStats = {
    total: problems.length,
    favorites: favorites.length,
    solved: solvedProblems.length,
    explorationRate: problems.length > 0 ? ((favorites.length / problems.length) * 100).toFixed(1) : 0,
    solveRate: problems.length > 0 ? ((solvedProblems.length / problems.length) * 100).toFixed(1) : 0,
    avgRating: problems.length > 0 ? Math.round(problems.filter(p => p.rating).reduce((sum, p) => sum + p.rating, 0) / problems.filter(p => p.rating).length) : 0
  };

  // Problem difficulty distribution for favorites
  const getDifficultyDistribution = () => {
    const ranges = [
      { name: 'Easy', min: 800, max: 1199, color: 'bg-green-500' },
      { name: 'Medium', min: 1200, max: 1599, color: 'bg-yellow-500' },
      { name: 'Hard', min: 1600, max: 1999, color: 'bg-orange-500' },
      { name: 'Expert', min: 2000, max: 4000, color: 'bg-red-500' }
    ];

    return ranges.map(range => {
      const count = favorites.filter(favId => {
        const problem = problems.find(p => `${p.contestId}-${p.index}` === favId);
        return problem && problem.rating >= range.min && problem.rating <= range.max;
      }).length;
      
      const percentage = favorites.length > 0 ? (count / favorites.length) * 100 : 0;
      
      return { ...range, count, percentage };
    });
  };

  const difficultyDistribution = getDifficultyDistribution();

  const ModernStatCard = ({ icon: Icon, title, value, subtitle, gradient, textColor = "text-white" }) => (
    <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon size={24} className={textColor} />
          <div className={`text-right ${textColor}`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm opacity-90">{title}</div>
          </div>
        </div>
        {subtitle && (
          <div className={`text-xs opacity-75 ${textColor}`}>{subtitle}</div>
        )}
      </div>
    </div>
  );

  const InteractiveChart = ({ data, title, type = 'bar' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.count}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${item.color} group-hover:brightness-110`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-xs font-medium text-white mix-blend-difference">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRatingBgColor(user.rating)} flex items-center justify-center shadow-lg ring-4 ring-white ring-opacity-30`}>
                  <span className="text-3xl font-bold text-white">
                    {user.handle?.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xl opacity-90 mb-3">@{user.handle}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRankColor(user.rank)} shadow-md`}>
                      {user.rank || 'Unranked'}
                    </span>
                    
                    {user.country && (
                      <span className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm backdrop-blur-sm">
                        📍 {user.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{ratingStats.currentRating || 'Unrated'}</div>
                  <div className="text-sm opacity-80">Current Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">{ratingStats.maxRating || 'N/A'}</div>
                  <div className="text-sm opacity-80">Max Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">{solvedProblems.length}</div>
                  <div className="text-sm opacity-80">Problems Solved</div>
                </div>
                
                <button
                  onClick={onLogout}
                  className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-full font-medium hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernStatCard
            icon={Trophy}
            title="Current Rating"
            value={ratingStats.currentRating || 'Unrated'}
            subtitle={user.rank || 'Unranked'}
            gradient={getRatingBgColor(user.rating)}
          />
          
          <ModernStatCard
            icon={TrendingUp}
            title="Rating Change"
            value={ratingStats.ratingChange >= 0 ? `+${ratingStats.ratingChange}` : ratingStats.ratingChange}
            subtitle="From max rating"
            gradient={ratingStats.ratingChange >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}
          />
          
          <ModernStatCard
            icon={CheckCircle}
            title="Problems Solved"
            value={problemStats.solved}
            subtitle={`${problemStats.solveRate}% of total`}
            gradient="from-green-500 to-green-600"
          />
          
          <ModernStatCard
            icon={Star}
            title="Favorite Problems"
            value={problemStats.favorites}
            subtitle={`${problemStats.explorationRate}% explored`}
            gradient="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Rating Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Rating Progress</span>
            </h3>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Progress</span>
                  <span className={`font-bold ${getRatingColor(user.rating)}`}>
                    {ratingStats.currentRating} / {ratingStats.nextMilestone}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getRatingBgColor(user.rating)} transition-all duration-1000 ease-out relative`}
                    style={{ 
                      width: ratingStats.currentRating ? `${Math.min((ratingStats.currentRating / ratingStats.nextMilestone) * 100, 100)}%` : '0%' 
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{ratingStats.currentRating}</div>
                  <div className="text-xs text-gray-500">Current</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${ratingStats.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ratingStats.ratingChange >= 0 ? '+' : ''}{ratingStats.ratingChange}
                  </div>
                  <div className="text-xs text-gray-500">Change</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{ratingStats.toNextRank}</div>
                  <div className="text-xs text-gray-500">To Next</div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Difficulty Distribution */}
          <InteractiveChart
            data={difficultyDistribution}
            title="Favorite Problems by Difficulty"
          />
        </div>

        {/* Problem Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Activity size={20} />
              <span>Problem Insights</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Problems</span>
                <span className="font-bold text-gray-900 dark:text-white">{problemStats.total.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Favorites</span>
                <span className="font-bold text-yellow-600">{problemStats.favorites}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Solved</span>
                <span className="font-bold text-green-600">{problemStats.solved}</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 dark:text-gray-400">Exploration Rate</span>
                <span className="font-bold text-green-600">{problemStats.explorationRate}%</span>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Award size={20} />
              <span>Achievements</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  icon: '🎯', 
                  title: 'Explorer', 
                  desc: `${problemStats.favorites} favorites`,
                  unlocked: problemStats.favorites > 0 
                },
                { 
                  icon: '⭐', 
                  title: 'Rising Star', 
                  desc: `${ratingStats.currentRating} rating`,
                  unlocked: ratingStats.currentRating > 1000 
                },
                { 
                  icon: '🔥', 
                  title: 'Dedicated', 
                  desc: `${problemStats.explorationRate}% explored`,
                  unlocked: parseFloat(problemStats.explorationRate) > 1 
                },
                { 
                  icon: '💎', 
                  title: 'Elite', 
                  desc: 'High rating',
                  unlocked: ratingStats.currentRating > 1600 
                }
              ].map((achievement, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{achievement.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Zap size={20} />
              <span>Quick Actions</span>
            </h3>
            
            <div className="space-y-3">
              <button className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                View Profile on Codeforces
              </button>
              
              <button className="w-full p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
                Practice Recommendations
              </button>
              
              <button className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
                Contest Calendar
              </button>
              
              <button 
                onClick={onLogout}
                className="w-full p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <LogOut size={16} />
                <span>Switch Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
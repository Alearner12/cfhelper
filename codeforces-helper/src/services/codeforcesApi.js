import axios from 'axios';

const API_BASE_URL = 'https://codeforces.com/api';

// Cache for storing problems to reduce API calls
let problemsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const fetchProblems = async () => {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (problemsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return problemsCache;
    }

    console.log('Fetching problems from Codeforces API...');
    const response = await axios.get(`${API_BASE_URL}/problemset.problems`, {
      timeout: 30000, // 30 second timeout
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch problems from Codeforces API');
    }

    const problems = response.data.result.problems;
    console.log(`Fetched ${problems.length} problems from API`);
    
    // Process and enrich the problems data while filtering out unnecessary fields
    const processedProblems = problems
      .filter(problem => problem.contestId && problem.index && problem.name) // Filter out incomplete problems
      .map(problem => ({
        // Only keep essential fields to reduce memory usage
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        rating: problem.rating,
        tags: problem.tags || [],
        id: `${problem.contestId}-${problem.index}`,
        url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
        division: getDivisionFromContestId(problem.contestId),
        difficultyLevel: getDifficultyLevel(problem.rating),
      }));

    console.log(`Processed ${processedProblems.length} valid problems`);

    // Cache the processed data
    problemsCache = processedProblems;
    cacheTimestamp = now;

    // Store in localStorage as backup (with size limit)
    try {
      const cacheData = {
        problems: processedProblems,
        timestamp: now
      };
      localStorage.setItem('problemsCache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Failed to store cache in localStorage:', e);
    }

    return processedProblems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    
    // If we have cached data, return it even if it's old
    if (problemsCache) {
      console.log('Returning stale cached data due to API error');
      return problemsCache;
    }
    
    // Try to load from localStorage as last resort
    try {
      const cachedData = localStorage.getItem('problemsCache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        console.log('Returning data from localStorage backup');
        return parsed.problems;
      }
    } catch (e) {
      console.warn('Failed to load from localStorage cache:', e);
    }
    
    throw new Error('Failed to load problems. Please check your internet connection and try again.');
  }
};

export const fetchContestList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contest.list`, {
      timeout: 15000, // 15 second timeout
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch contests from Codeforces API');
    }

    return response.data.result;
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};

export const fetchUserInfo = async (handle) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user.info?handles=${handle}`, {
      timeout: 10000, // 10 second timeout
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch user info from Codeforces API');
    }

    return response.data.result[0];
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// Helper function to determine division from contest ID
const getDivisionFromContestId = (contestId) => {
  if (!contestId) return 'Unknown';
  
  const contestStr = contestId.toString();
  
  // Common patterns for different divisions
  if (contestStr.length >= 4) {
    const lastDigit = parseInt(contestStr.slice(-1));
    
    // For newer contests, we can use more specific patterns
    if (contestId >= 1400) {
      if (contestId % 10 === 1 || contestId % 10 === 2) return 'Div2';
      if (contestId % 10 === 3 || contestId % 10 === 4) return 'Div3';
      if (contestId % 10 === 5 || contestId % 10 === 6) return 'Div4';
    }
    
    // Div1 contests often end with even numbers for older contests
    if (lastDigit % 2 === 0 && contestId > 1000 && contestId < 1400) {
      return 'Div1';
    }
    // Div2 contests often end with odd numbers for older contests
    if (lastDigit % 2 === 1 && contestId > 1000 && contestId < 1400) {
      return 'Div2';
    }
  }
  
  return 'Mixed';
};

// Helper function to get difficulty level based on rating
const getDifficultyLevel = (rating) => {
  if (!rating) return 'Unrated';
  
  if (rating < 1000) return 'Beginner';
  if (rating < 1300) return 'Easy';
  if (rating < 1600) return 'Medium';
  if (rating < 2000) return 'Hard';
  if (rating < 2500) return 'Very Hard';
  return 'Expert';
};

// Get popular problem tags (most commonly used)
export const getPopularTags = () => {
  return [
    'math', 'implementation', 'greedy', 'dp', 'data structures',
    'brute force', 'constructive algorithms', 'graphs', 'sortings',
    'binary search', 'dfs and similar', 'trees', 'strings',
    'number theory', 'combinatorics', 'geometry', 'bitmasks',
    'two pointers', 'hashing', 'divide and conquer', 'shortest paths',
    'probabilities', 'matrices', 'flows', 'games', 'interactive'
  ];
};

// Get contest divisions
export const getContestDivisions = () => {
  return ['Div1', 'Div2', 'Div3', 'Div4', 'Mixed'];
};

// Get problem positions
export const getProblemPositions = () => {
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
};

// Clear cache function (useful for debugging or manual refresh)
export const clearCache = () => {
  problemsCache = null;
  cacheTimestamp = null;
  localStorage.removeItem('problemsCache');
  console.log('Cache cleared');
}; 
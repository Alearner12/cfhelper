# 🏆 Codeforces Helper

A modern, feature-rich React application to help competitive programmers find and organize Codeforces problems efficiently.

## ✨ Features

### 🎯 Core Features
- **Problem Extraction by Division**: Filter problems by Div1, Div2, Div3, Div4, or Mixed contests
- **Position-based Filtering**: Find problems by position (A, B, C, D, E, F, G, H, I, J)
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🔍 Advanced Filtering
- **Rating Range Filter**: Set minimum and maximum problem ratings
- **Quick Rating Presets**: Beginner (800-1200), Easy (1200-1600), Medium (1600-2000), Hard (2000-3500)
- **Tag-based Filtering**: Filter by algorithm types (DP, Graphs, Math, Implementation, etc.)
- **Search Functionality**: Search problems by name or tags
- **Multi-tag Selection**: Combine multiple tags for precise filtering

### 📊 Statistics & Analytics
- **Problem Statistics**: View distribution by rating, division, and position
- **Popular Tags**: See most common problem categories
- **Personal Analytics**: Track your favorite problems and exploration progress
- **Visual Charts**: Interactive charts showing problem distributions

### 🌟 User Experience
- **Favorites System**: Star problems for later reference
- **Random Problem Generator**: Get a random problem from filtered results
- **Problem Cards**: Rich problem display with ratings, tags, and quick actions
- **Sorting Options**: Sort by rating, name, contest, or position
- **Loading States**: Smooth loading animations and error handling

### 🚀 Performance
- **API Caching**: 30-minute cache for Codeforces API responses
- **Optimized Filtering**: Fast client-side filtering and search
- **Lazy Loading**: Efficient rendering of large problem sets

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **API**: Codeforces API integration
- **State Management**: React Hooks
- **Storage**: LocalStorage for preferences and favorites

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codeforces-helper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📱 Usage Guide

### Finding Problems by Contest Type
1. Use the **Division** filter to select Div1, Div2, Div3, or Div4
2. Choose a **Position** (A, B, C, etc.) to find problems of specific difficulty within contests
3. Example: Select "Div2" + "B" to find all Div2 B problems

### Setting Difficulty Range
1. Use the **Rating** filter to set minimum and maximum difficulty
2. Try quick presets for common difficulty ranges
3. Combine with division filters for precise targeting

### Using Tags
1. Expand the **Tags** section
2. Click on algorithm types you want to practice
3. Selected tags appear at the top - click X to remove them
4. Tags work with AND logic (problems must have ALL selected tags)

### Managing Favorites
1. Click the star icon on any problem card to add to favorites
2. Use the **Favorites** tab to view all starred problems
3. Favorites are saved locally and persist between sessions

### Random Problem Selection
1. Apply your desired filters
2. Click **Random Problem** in the header
3. A random problem matching your filters will open in a new tab

### Viewing Statistics
1. Click the **Statistics** tab
2. View problem distributions, popular tags, and personal analytics
3. Track your exploration progress and favorite patterns

## 🎨 Customization

### Theme Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Codeforces Blue (#1f8dd6)
- **Dark Theme**: Custom dark grays
- **Accent Colors**: Rating-based color coding

### Adding New Filters
To add new filter types:
1. Update the `filters` state in `App.jsx`
2. Add filter logic in the `applyFilters` function
3. Create UI components in `FilterPanel.jsx`

## 🔧 API Integration

The app integrates with the official Codeforces API:
- **Endpoint**: `https://codeforces.com/api/problemset.problems`
- **Caching**: 30-minute cache to reduce API calls
- **Error Handling**: Graceful fallback to cached data
- **Rate Limiting**: Respects API limitations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your fork and submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Codeforces](https://codeforces.com/) for providing the excellent API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Support

If you encounter any issues or have suggestions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Happy Coding! 🚀**

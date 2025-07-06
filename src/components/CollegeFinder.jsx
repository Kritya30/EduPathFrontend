import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collegesAPI, examsAPI } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, DollarSign, Trophy, Users, Heart, HeartOff, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const CollegeFinder = () => {
  const { isAuthenticated } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('browse'); // 'browse' or 'rank'
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  // Rank-based search
  const [examName, setExamName] = useState('');
  const [rank, setRank] = useState('');
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('general');
  const [recommendations, setRecommendations] = useState([]);
  
  // Data for filters
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [exams, setExams] = useState([]);
  const [shortlistedColleges, setShortlistedColleges] = useState(new Set());
  const [shortlistLoading, setShortlistLoading] = useState(new Set());

  const collegeTypes = ['all', 'Government', 'Private', 'Deemed'];
  const categoryOptions = ['general', 'obc', 'sc', 'st'];

  useEffect(() => {
    fetchInitialData();
    if (isAuthenticated) {
      fetchShortlistedColleges();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchMode === 'browse') {
      filterColleges();
    }
  }, [colleges, searchTerm, selectedCategory, selectedState, selectedType]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch colleges, categories, states, and exams in parallel
      const [collegesResponse, categoriesResponse, statesResponse, examsResponse] = await Promise.all([
        collegesAPI.getAllColleges(),
        collegesAPI.getCategories(),
        collegesAPI.getStates(),
        examsAPI.getAllExams()
      ]);

      setColleges(collegesResponse.colleges || []);
      setCategories(categoriesResponse.categories || []);
      setStates(statesResponse.states || []);
      setExams(examsResponse.exams || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlistedColleges = async () => {
    try {
      const response = await collegesAPI.getShortlist();
      const shortlistedIds = new Set(response.shortlisted_colleges?.map(college => college.id) || []);
      setShortlistedColleges(shortlistedIds);
    } catch (error) {
      console.error('Error fetching shortlisted colleges:', error);
    }
  };

  const filterColleges = () => {
    let filtered = colleges;

    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(college => college.category === selectedCategory);
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(college => college.state === selectedState);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(college => college.type === selectedType);
    }

    setFilteredColleges(filtered);
  };

  const handleRankSearch = async () => {
    if (!examName || (!rank && !percentile)) {
      setError('Please select an exam and enter your rank or percentile');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const criteria = {
        exam_name: examName,
        category: category,
      };

      if (rank) criteria.rank = parseInt(rank);
      if (percentile) criteria.percentile = parseFloat(percentile);

      const response = await collegesAPI.getRecommendations(criteria);
      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (collegeId) => {
    if (!isAuthenticated) {
      alert('Please log in to shortlist colleges');
      return;
    }

    setShortlistLoading(prev => new Set(prev).add(collegeId));

    try {
      const isShortlisted = shortlistedColleges.has(collegeId);
      
      if (isShortlisted) {
        await collegesAPI.removeFromShortlist(collegeId);
        setShortlistedColleges(prev => {
          const newSet = new Set(prev);
          newSet.delete(collegeId);
          return newSet;
        });
      } else {
        await collegesAPI.addToShortlist(collegeId);
        setShortlistedColleges(prev => new Set(prev).add(collegeId));
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      alert('Failed to update shortlist. Please try again.');
    } finally {
      setShortlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(collegeId);
        return newSet;
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CollegeCard = ({ college, showEligibility = false }) => {
    const isShortlisted = shortlistedColleges.has(college.id);
    const isShortlistLoading = shortlistLoading.has(college.id);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{college.name}</h3>
              <p className="text-sm text-gray-600">{college.full_name}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin size={14} className="mr-1" />
                {college.location}
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => handleShortlist(college.id)}
                disabled={isShortlistLoading}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                {isShortlistLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : isShortlisted ? (
                  <Heart size={20} className="text-red-600 fill-current" />
                ) : (
                  <HeartOff size={20} />
                )}
              </button>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-800">{college.category}</Badge>
            <Badge className="bg-green-100 text-green-800">{college.type}</Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Trophy size={12} className="mr-1" />
              NIRF #{college.nirf_ranking}
            </Badge>
          </div>

          {/* Eligibility Status */}
          {showEligibility && college.eligibility_status && (
            <div className={`mb-4 p-3 rounded-md ${
              college.eligibility_status === 'eligible' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className={`font-medium ${
                college.eligibility_status === 'eligible' ? 'text-green-800' : 'text-orange-800'
              }`}>
                {college.eligibility_status === 'eligible' ? '✅ Eligible' : '⚠️ Reach College'}
              </div>
              {college.cutoff_info && (
                <div className="text-sm text-gray-600 mt-1">
                  Cutoff: Rank {college.cutoff_info.rank} | {college.cutoff_info.percentile}%
                </div>
              )}
            </div>
          )}

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign size={14} className="mr-1" />
                <span>Annual Fees</span>
              </div>
              <div className="font-medium text-gray-900">
                {formatCurrency(college.fees.annual)}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={14} className="mr-1" />
                <span>Placement Rate</span>
              </div>
              <div className="font-medium text-gray-900">
                {college.placement.placement_rate}%
              </div>
            </div>
          </div>

          {/* Placement Info */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Placement Highlights</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Average Package: {formatCurrency(college.placement.average_package)}</div>
              <div>Highest Package: {formatCurrency(college.placement.highest_package)}</div>
            </div>
          </div>

          {/* Accepted Exams */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Accepted Exams</h4>
            <div className="flex flex-wrap gap-1">
              {college.accepted_exams.map((exam, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {exam}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(college.website, '_blank')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink size={16} className="mr-2" />
              Visit Website
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && colleges.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream College 🎓
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover colleges based on your exam scores or browse through our comprehensive database
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSearchMode('browse')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  searchMode === 'browse'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse Colleges
              </button>
              <button
                onClick={() => setSearchMode('rank')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  searchMode === 'rank'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Find by Rank/Score
              </button>
            </div>
          </div>

          {searchMode === 'browse' ? (
            /* Browse Mode Filters */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search colleges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {collegeTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            /* Rank-based Search */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Exam
                  </label>
                  <Select value={examName} onValueChange={setExamName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map(exam => (
                        <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rank
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your rank"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Percentile (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter percentile"
                    value={percentile}
                    onChange={(e) => setPercentile(e.target.value)}
                    step="0.01"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleRankSearch}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Colleges...
                    </>
                  ) : (
                    'Find My Colleges'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {searchMode === 'browse' ? (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredColleges.length} of {colleges.length} colleges
              </p>
            </div>

            {/* College Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>

            {/* No Results */}
            {filteredColleges.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    College Recommendations for You
                  </h2>
                  <p className="text-gray-600">
                    Based on your {examName} performance, here are {recommendations.length} colleges you can consider:
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendations.map((college) => (
                    <CollegeCard key={college.id} college={college} showEligibility={true} />
                  ))}
                </div>
              </>
            )}

            {/* No Recommendations */}
            {searchMode === 'rank' && recommendations.length === 0 && !loading && examName && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
                <p className="text-gray-600">
                  Try adjusting your rank/percentile or select a different exam
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollegeFinder;


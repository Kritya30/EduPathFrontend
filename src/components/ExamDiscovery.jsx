import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { examsAPI } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Calendar, Users, ExternalLink, Bookmark, BookmarkCheck, Loader2, AlertCircle } from 'lucide-react';

const ExamDiscovery = () => {
  const { isAuthenticated } = useAuth();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [bookmarkedExams, setBookmarkedExams] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(new Set());

  const streams = ['all', 'Engineering', 'Medical', 'Management', 'Law', 'University'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchExams();
    if (isAuthenticated) {
      fetchBookmarkedExams();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterExams();
  }, [exams, searchTerm, selectedStream, selectedDifficulty]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await examsAPI.getAllExams();
      setExams(response.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to load exams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarkedExams = async () => {
    try {
      const response = await examsAPI.getBookmarkedExams();
      const bookmarkedIds = new Set(response.bookmarked_exams?.map(exam => exam.id) || []);
      setBookmarkedExams(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarked exams:', error);
    }
  };

  const filterExams = () => {
    let filtered = exams;

    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStream !== 'all') {
      filtered = filtered.filter(exam => exam.stream === selectedStream);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exam => exam.difficulty === selectedDifficulty);
    }

    setFilteredExams(filtered);
  };

  const handleBookmark = async (examId) => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark exams');
      return;
    }

    setBookmarkLoading(prev => new Set(prev).add(examId));

    try {
      const isBookmarked = bookmarkedExams.has(examId);
      
      if (isBookmarked) {
        await examsAPI.removeBookmark(examId);
        setBookmarkedExams(prev => {
          const newSet = new Set(prev);
          newSet.delete(examId);
          return newSet;
        });
      } else {
        await examsAPI.bookmarkExam(examId);
        setBookmarkedExams(prev => new Set(prev).add(examId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(examId);
        return newSet;
      });
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { text: 'Deadline Passed', color: 'bg-gray-500' };
    if (days <= 7) return { text: `${days} days left`, color: 'bg-red-500' };
    if (days <= 30) return { text: `${days} days left`, color: 'bg-orange-500' };
    return { text: `${days} days left`, color: 'bg-green-500' };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchExams} className="bg-blue-600 hover:bg-blue-700 text-white">
            Try Again
          </Button>
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
            Explore Entrance Exams 📚
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all major Indian entrance exams with deadlines, eligibility criteria, and application links
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={selectedStream} onValueChange={setSelectedStream}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Stream" />
                </SelectTrigger>
                <SelectContent>
                  {streams.map(stream => (
                    <SelectItem key={stream} value={stream}>
                      {stream === 'all' ? 'All Streams' : stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredExams.length} of {exams.length} exams
          </p>
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const deadlineStatus = getDeadlineStatus(exam.application_deadline);
            const isBookmarked = bookmarkedExams.has(exam.id);
            const isBookmarkLoading = bookmarkLoading.has(exam.id);

            return (
              <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{exam.name}</h3>
                      <p className="text-sm text-gray-600">{exam.full_name}</p>
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleBookmark(exam.id)}
                        disabled={isBookmarkLoading}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {isBookmarkLoading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : isBookmarked ? (
                          <BookmarkCheck size={20} className="text-blue-600" />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-800">{exam.stream}</Badge>
                    <Badge className={getDifficultyColor(exam.difficulty)}>{exam.difficulty}</Badge>
                    <Badge className={`text-white ${deadlineStatus.color}`}>
                      {deadlineStatus.text}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exam.description}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>Exam Date: {new Date(exam.exam_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2" />
                      <span>Applicants: {exam.applicants_count?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">Eligibility:</h4>
                    <p className="text-sm text-gray-600">{exam.eligibility}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(exam.official_website, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredExams.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDiscovery;


import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { communityAPI } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock,
  User,
  CheckCircle,
  Award,
  Loader2,
  AlertCircle,
  X,
  Send
} from 'lucide-react';

const Community = () => {
  const { isAuthenticated, user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Categories
  const [categories, setCategories] = useState([]);
  
  // New question modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionData, setQuestionData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [questionLoading, setQuestionLoading] = useState(false);
  
  // Answer modal
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  
  // Question details
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState([]);

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'unanswered', label: 'Unanswered' },
    { value: 'answered', label: 'Answered' }
  ];

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortQuestions();
  }, [questions, searchTerm, selectedCategory, sortBy]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await communityAPI.getAllQuestions();
      setQuestions(response.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await communityAPI.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterAndSortQuestions = () => {
    let filtered = questions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(question => question.category === selectedCategory);
    }

    // Sort questions
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'unanswered':
        filtered = filtered.filter(question => question.answers_count === 0);
        break;
      case 'answered':
        filtered = filtered.filter(question => question.answers_count > 0);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredQuestions(filtered);
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to ask a question');
      return;
    }

    if (!questionData.title || !questionData.content || !questionData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setQuestionLoading(true);
      setError('');
      
      const tags = questionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await communityAPI.askQuestion({
        title: questionData.title,
        content: questionData.content,
        category: questionData.category,
        tags: tags
      });

      // Add new question to the list
      setQuestions(prev => [response.question, ...prev]);
      
      // Reset form and close modal
      setQuestionData({ title: '', content: '', category: '', tags: '' });
      setShowQuestionModal(false);
      
    } catch (error) {
      console.error('Error asking question:', error);
      setError('Failed to post question. Please try again.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleVote = async (questionId, voteType) => {
    if (!isAuthenticated) {
      alert('Please log in to vote');
      return;
    }

    try {
      await communityAPI.voteQuestion(questionId, voteType);
      
      // Update the question in the list
      setQuestions(prev => prev.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            upvotes: voteType === 'up' ? question.upvotes + 1 : question.upvotes,
            downvotes: voteType === 'down' ? question.downvotes + 1 : question.downvotes
          };
        }
        return question;
      }));
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleAnswerQuestion = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to answer questions');
      return;
    }

    if (!answerContent.trim()) {
      setError('Please enter your answer');
      return;
    }

    try {
      setAnswerLoading(true);
      setError('');
      
      await communityAPI.answerQuestion(selectedQuestion.id, {
        content: answerContent
      });

      // Update answers count
      setQuestions(prev => prev.map(question => {
        if (question.id === selectedQuestion.id) {
          return { ...question, answers_count: question.answers_count + 1 };
        }
        return question;
      }));
      
      setAnswerContent('');
      setShowAnswerModal(false);
      
    } catch (error) {
      console.error('Error answering question:', error);
      setError('Failed to post answer. Please try again.');
    } finally {
      setAnswerLoading(false);
    }
  };

  const fetchQuestionDetails = async (questionId) => {
    try {
      const response = await communityAPI.getQuestionDetails(questionId);
      setSelectedQuestionDetails(response.question);
      setQuestionAnswers(response.answers || []);
    } catch (error) {
      console.error('Error fetching question details:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getUserBadge = (userType) => {
    switch (userType) {
      case 'verified_student':
        return <Badge className="bg-blue-100 text-blue-800">Student</Badge>;
      case 'alumni':
        return <Badge className="bg-green-100 text-green-800">Alumni</Badge>;
      case 'expert':
        return <Badge className="bg-purple-100 text-purple-800">Expert</Badge>;
      default:
        return null;
    }
  };

  const QuestionModal = () => {
    if (!showQuestionModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowQuestionModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ask a Question</h2>
            <p className="text-gray-600">Get help from the community</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAskQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Title *
              </label>
              <Input
                type="text"
                value={questionData.title}
                onChange={(e) => setQuestionData({...questionData, title: e.target.value})}
                placeholder="What's your question?"
                required
                disabled={questionLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select 
                value={questionData.category} 
                onValueChange={(value) => setQuestionData({...questionData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Details *
              </label>
              <Textarea
                value={questionData.content}
                onChange={(e) => setQuestionData({...questionData, content: e.target.value})}
                placeholder="Provide more details about your question..."
                rows={6}
                required
                disabled={questionLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (Optional)
              </label>
              <Input
                type="text"
                value={questionData.tags}
                onChange={(e) => setQuestionData({...questionData, tags: e.target.value})}
                placeholder="Enter tags separated by commas (e.g., JEE, preparation, tips)"
                disabled={questionLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={questionLoading}
            >
              {questionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Question...
                </>
              ) : (
                'Post Question'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  };

  const AnswerModal = () => {
    if (!showAnswerModal || !selectedQuestion) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
          <button
            onClick={() => setShowAnswerModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Answer Question</h2>
            <p className="text-gray-600 font-medium">{selectedQuestion.title}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAnswerQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Answer
              </label>
              <Textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Share your knowledge and help the community..."
                rows={8}
                required
                disabled={answerLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={answerLoading}
            >
              {answerLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Answer...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Answer
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading community questions...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchQuestions} className="bg-blue-600 hover:bg-blue-700 text-white">
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
            Community Forum 💬
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ask questions, share knowledge, and connect with fellow students and experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => setShowQuestionModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={20} className="mr-2" />
                Ask Question
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredQuestions.length} of {questions.length} questions
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {question.content}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge className="bg-blue-100 text-blue-800">{question.category}</Badge>
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Vote Section */}
                <div className="flex flex-col items-center ml-4">
                  <button
                    onClick={() => handleVote(question.id, 'up')}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    disabled={!isAuthenticated}
                  >
                    <ThumbsUp size={20} />
                  </button>
                  <span className="text-sm font-medium text-gray-900 my-1">
                    {question.upvotes - question.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote(question.id, 'down')}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    disabled={!isAuthenticated}
                  >
                    <ThumbsDown size={20} />
                  </button>
                </div>
              </div>

              {/* Question Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>{question.author_name}</span>
                    {getUserBadge(question.author_type)}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{formatTimeAgo(question.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={16} className="mr-1" />
                    <span>{question.answers_count} answers</span>
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    <span>{question.views} views</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedQuestion(question);
                    setShowAnswerModal(true);
                  }}
                  variant="outline"
                  size="sm"
                  disabled={!isAuthenticated}
                >
                  Answer
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredQuestions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search criteria or filters'
                : 'Be the first to ask a question!'
              }
            </p>
            <Button
              onClick={() => setShowQuestionModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ask the First Question
            </Button>
          </div>
        )}

        {/* Community Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Community Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {questions.reduce((sum, q) => sum + q.answers_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {questions.filter(q => q.answers_count > 0).length}
              </div>
              <div className="text-sm text-gray-600">Solved Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(questions.map(q => q.author_name)).size}
              </div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuestionModal />
      <AnswerModal />
    </div>
  );
};

export default Community;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import PricingSection from './payments/PricingSection';
import { 
  Search, 
  BookOpen, 
  Users, 
  MessageCircle, 
  Star, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to appropriate page based on search query
      window.location.href = `/exams?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Discover Exams',
      description: 'Explore 15+ major entrance exams with deadlines, eligibility, and application links',
      link: '/exams',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Find My College',
      description: 'Get personalized college recommendations based on your exam ranks and preferences',
      link: '/colleges',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Talk to a Mentor',
      description: 'Connect with verified students and alumni from top colleges for guidance',
      link: '/mentors',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Join Community',
      description: 'Ask questions, share knowledge, and connect with fellow aspirants',
      link: '/community',
      color: 'bg-green-100 text-green-600'
    }
  ];

  const trendingExams = [
    { name: 'JEE Main', deadline: '2025-01-31', applicants: '12L+', difficulty: 'Hard' },
    { name: 'NEET UG', deadline: '2025-02-15', applicants: '18L+', difficulty: 'Hard' },
    { name: 'CUET UG', deadline: '2025-02-28', applicants: '15L+', difficulty: 'Medium' },
    { name: 'BITSAT', deadline: '2025-03-15', applicants: '3L+', difficulty: 'Hard' },
    { name: 'CAT', deadline: '2025-09-15', applicants: '2.5L+', difficulty: 'Hard' },
    { name: 'CLAT', deadline: '2025-01-15', applicants: '80K+', difficulty: 'Medium' }
  ];

  const successStories = [
    {
      name: 'Priya Sharma',
      college: 'IIT Delhi',
      exam: 'JEE Advanced',
      rank: 'AIR 156',
      image: '👩‍🎓',
      quote: 'EduPath helped me find the right mentors and stay organized with exam deadlines.'
    },
    {
      name: 'Arjun Patel',
      college: 'AIIMS Delhi',
      exam: 'NEET UG',
      rank: 'AIR 89',
      image: '👨‍⚕️',
      quote: 'The college recommendations were spot-on. I got into my dream medical college!'
    },
    {
      name: 'Sneha Reddy',
      college: 'IIM Bangalore',
      exam: 'CAT',
      rank: '99.8%ile',
      image: '👩‍💼',
      quote: 'The mentorship program gave me insights that no coaching institute could provide.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Students Helped', icon: <Users className="h-6 w-6" /> },
    { number: '15+', label: 'Entrance Exams', icon: <BookOpen className="h-6 w-6" /> },
    { number: '1000+', label: 'Expert Mentors', icon: <Award className="h-6 w-6" /> },
    { number: '95%', label: 'Success Rate', icon: <TrendingUp className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Gateway to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Dream Colleges
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Navigate entrance exams, discover colleges, connect with mentors, and join a community 
              of ambitious students. Your college admission journey starts here! 🚀
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                <Input
                  type="text"
                  placeholder="Search exams, colleges, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Link to="/exams">
                  Discover Exams
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                <Link to="/colleges">
                  Find My College
                  <Target className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for College Admissions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From exam discovery to college selection, we've got you covered at every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`${feature.color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Exams Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Entrance Exams 📈
            </h2>
            <p className="text-gray-600">Stay updated with the most popular exams and their deadlines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingExams.map((exam, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                  <Badge className={`${
                    exam.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exam.difficulty}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Deadline: {new Date(exam.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Applicants: {exam.applicants}
                  </div>
                </div>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Link to={`/exams?search=${exam.name}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/exams">
                View All Exams
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories 🌟
            </h2>
            <p className="text-gray-600">Real students, real results, real dreams achieved</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{story.image}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                  <p className="text-blue-600 font-medium">{story.college}</p>
                  <Badge className="bg-green-100 text-green-800 mt-1">
                    {story.exam} - {story.rank}
                  </Badge>
                </div>
                
                <blockquote className="text-gray-600 text-center italic">
                  "{story.quote}"
                </blockquote>
                
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey? 🎯
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have successfully navigated their college admissions with EduPath
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button
                  asChild
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  <Link to="/signup">
                    Get Started Free
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                >
                  <Link to="/mentors">
                    Talk to a Mentor
                    <Users className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  <Link to="/colleges">
                    Find My College
                    <Target className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                >
                  <Link to="/mentors">
                    Book a Mentor
                    <Users className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Free to start
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              No hidden fees
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


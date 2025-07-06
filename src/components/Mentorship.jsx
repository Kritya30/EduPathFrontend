import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mentorshipAPI } from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  MessageCircle, 
  Video, 
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

const Mentorship = () => {
  const { isAuthenticated, user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Filter options
  const [colleges, setColleges] = useState([]);
  const [expertiseAreas, setExpertiseAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingData, setBookingData] = useState({
    session_date: '',
    session_time: '',
    session_type: 'single',
    message: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchMentors();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, selectedCollege, selectedExpertise, selectedLocation, maxPrice]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mentorshipAPI.getAllMentors();
      setMentors(response.mentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setError('Failed to load mentors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [collegesResponse, categoriesResponse] = await Promise.all([
        mentorshipAPI.getColleges(),
        mentorshipAPI.getCategories()
      ]);
      
      setColleges(collegesResponse.colleges || []);
      setExpertiseAreas(categoriesResponse.categories || []);
      
      // Extract unique locations from mentors
      const uniqueLocations = [...new Set(mentors.map(mentor => mentor.location))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCollege !== 'all') {
      filtered = filtered.filter(mentor => mentor.college.includes(selectedCollege));
    }

    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.expertise.some(exp => exp.toLowerCase().includes(selectedExpertise.toLowerCase()))
      );
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(mentor => mentor.location === selectedLocation);
    }

    if (maxPrice) {
      filtered = filtered.filter(mentor => mentor.pricing.per_session <= parseInt(maxPrice));
    }

    setFilteredMentors(filtered);
  };

  const handleBookSession = (mentor) => {
    if (!isAuthenticated) {
      alert('Please log in to book a session');
      return;
    }
    setSelectedMentor(mentor);
    setShowBookingModal(true);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.session_date || !bookingData.session_time) {
      setError('Please select date and time for the session');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      
      const response = await mentorshipAPI.bookSession(selectedMentor.id, bookingData);
      setBookingSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingData({
          session_date: '',
          session_time: '',
          session_type: 'single',
          message: ''
        });
        setBookingSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error booking session:', error);
      setError('Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const BookingModal = () => {
    if (!showBookingModal || !selectedMentor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
          <button
            onClick={() => setShowBookingModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Session</h2>
            <p className="text-gray-600">with {selectedMentor.name}</p>
          </div>

          {bookingSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Session Booked Successfully!</h3>
              <p className="text-gray-600">You will receive a confirmation email shortly.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Date
                    </label>
                    <Input
                      type="date"
                      value={bookingData.session_date}
                      onChange={(e) => setBookingData({...bookingData, session_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      disabled={bookingLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Time
                    </label>
                    <Select 
                      value={bookingData.session_time} 
                      onValueChange={(value) => setBookingData({...bookingData, session_time: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <Select 
                    value={bookingData.session_type} 
                    onValueChange={(value) => setBookingData({...bookingData, session_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">
                        Single Session - {formatCurrency(selectedMentor.pricing.per_session)}
                      </SelectItem>
                      <SelectItem value="package_5">
                        5 Sessions Package - {formatCurrency(selectedMentor.pricing.package_5)}
                      </SelectItem>
                      <SelectItem value="package_10">
                        10 Sessions Package - {formatCurrency(selectedMentor.pricing.package_10)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <Textarea
                    value={bookingData.message}
                    onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                    placeholder="Tell the mentor what you'd like to discuss..."
                    rows={3}
                    disabled={bookingLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking Session...
                    </>
                  ) : (
                    'Book Session'
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error && mentors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchMentors} className="bg-purple-600 hover:bg-purple-700 text-white">
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
            Connect with Student Mentors 👨‍🎓
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get guidance from current students and alumni from top colleges across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger>
                  <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {colleges.map(college => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                <SelectTrigger>
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  {expertiseAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="number"
                placeholder="Max price per session"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <span className="text-purple-600 font-bold text-lg">
                      {mentor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.college}</p>
                    <p className="text-sm text-gray-500">{mentor.course} • {mentor.year}</p>
                    <div className="flex items-center mt-1">
                      <MapPin size={14} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{mentor.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(mentor.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {mentor.rating} ({mentor.reviews_count} reviews)
                    </span>
                  </div>
                  {mentor.is_verified && (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  )}
                </div>

                {/* Expertise */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{mentor.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sessions:</span>
                    <span className="font-medium ml-1">{mentor.sessions_completed}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Success Stories:</span>
                    <span className="font-medium ml-1">{mentor.success_stories}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Starting from</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(mentor.pricing.per_session)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Response time: {mentor.response_time}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBookSession(mentor)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!mentor.is_available}
                  >
                    <Calendar size={16} className="mr-2" />
                    {mentor.is_available ? 'Book Session' : 'Unavailable'}
                  </Button>
                </div>

                {/* Contact Options */}
                <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <button className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                    <Video size={16} className="mr-1" />
                    Video Call
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                    <Phone size={16} className="mr-1" />
                    Voice Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMentors.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal />
    </div>
  );
};

export default Mentorship;


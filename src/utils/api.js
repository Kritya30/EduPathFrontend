// API utility functions for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session management
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  signup: (userData) => apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => apiRequest('/api/auth/logout', {
    method: 'POST',
  }),

  getCurrentUser: () => apiRequest('/api/auth/me'),

  getProfile: () => apiRequest('/api/auth/profile'),

  updateProfile: (profileData) => apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  changePassword: (passwordData) => apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }),
};

// Exams API calls
export const examsAPI = {
  getAllExams: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/exams${queryParams ? `?${queryParams}` : ''}`);
  },

  getExamDetails: (examId) => apiRequest(`/api/exams/${examId}`),

  getExamStreams: () => apiRequest('/api/exams/streams'),

  getUpcomingExams: () => apiRequest('/api/exams/upcoming'),

  getExamDeadlines: () => apiRequest('/api/exams/deadlines'),

  bookmarkExam: (examId) => apiRequest('/api/exams/bookmark', {
    method: 'POST',
    body: JSON.stringify({ exam_id: examId }),
  }),

  removeBookmark: (examId) => apiRequest('/api/exams/bookmark', {
    method: 'DELETE',
    body: JSON.stringify({ exam_id: examId }),
  }),

  getBookmarkedExams: () => apiRequest('/api/exams/bookmarks'),

  getRecommendations: () => apiRequest('/api/exams/recommendations'),
};

// Colleges API calls
export const collegesAPI = {
  getAllColleges: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/colleges${queryParams ? `?${queryParams}` : ''}`);
  },

  getCollegeDetails: (collegeId) => apiRequest(`/api/colleges/${collegeId}`),

  getRecommendations: (criteria) => apiRequest('/api/colleges/recommendations', {
    method: 'POST',
    body: JSON.stringify(criteria),
  }),

  compareColleges: (collegeIds) => apiRequest('/api/colleges/compare', {
    method: 'POST',
    body: JSON.stringify({ college_ids: collegeIds }),
  }),

  getCategories: () => apiRequest('/api/colleges/categories'),

  getStates: () => apiRequest('/api/colleges/states'),

  addToShortlist: (collegeId) => apiRequest('/api/colleges/shortlist', {
    method: 'POST',
    body: JSON.stringify({ college_id: collegeId }),
  }),

  getShortlist: () => apiRequest('/api/colleges/shortlist'),

  removeFromShortlist: (collegeId) => apiRequest(`/api/colleges/shortlist/${collegeId}`, {
    method: 'DELETE',
  }),
};

// Mentorship API calls
export const mentorshipAPI = {
  getAllMentors: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/mentors${queryParams ? `?${queryParams}` : ''}`);
  },

  getMentorDetails: (mentorId) => apiRequest(`/api/mentors/${mentorId}`),

  searchMentors: (criteria) => apiRequest('/api/mentors/search', {
    method: 'POST',
    body: JSON.stringify(criteria),
  }),

  bookSession: (mentorId, sessionData) => apiRequest(`/api/mentors/${mentorId}/book`, {
    method: 'POST',
    body: JSON.stringify({ mentor_id: mentorId, ...sessionData }),
  }),

  getMentorAvailability: (mentorId) => apiRequest(`/api/mentors/${mentorId}/availability`),

  getUserBookings: () => apiRequest('/api/bookings'),

  cancelBooking: (bookingId) => apiRequest(`/api/bookings/${bookingId}/cancel`, {
    method: 'POST',
  }),

  getMentorReviews: (mentorId) => apiRequest(`/api/mentors/${mentorId}/reviews`),

  addMentorReview: (mentorId, reviewData) => apiRequest(`/api/mentors/${mentorId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  getCategories: () => apiRequest('/api/mentors/categories'),

  getColleges: () => apiRequest('/api/mentors/colleges'),
};

// Community API calls
export const communityAPI = {
  getQuestions: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/community/questions${queryParams ? `?${queryParams}` : ''}`);
  },

  getQuestionDetails: (questionId) => apiRequest(`/api/community/questions/${questionId}`),

  askQuestion: (questionData) => apiRequest('/api/community/questions', {
    method: 'POST',
    body: JSON.stringify(questionData),
  }),

  postAnswer: (questionId, answerData) => apiRequest(`/api/community/questions/${questionId}/answers`, {
    method: 'POST',
    body: JSON.stringify(answerData),
  }),

  voteQuestion: (questionId, voteType) => apiRequest(`/api/community/questions/${questionId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ vote_type: voteType }),
  }),

  voteAnswer: (answerId, voteType) => apiRequest(`/api/community/answers/${answerId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ vote_type: voteType }),
  }),

  markBestAnswer: (questionId, answerId) => apiRequest(`/api/community/questions/${questionId}/best-answer/${answerId}`, {
    method: 'POST',
  }),

  getCategories: () => apiRequest('/api/community/categories'),

  getPopularTags: () => apiRequest('/api/community/tags'),

  getMyQuestions: () => apiRequest('/api/community/my-questions'),

  getMyAnswers: () => apiRequest('/api/community/my-answers'),

  getCommunityStats: () => apiRequest('/api/community/stats'),
};

// Payments API calls
export const paymentsAPI = {
  getPlans: () => apiRequest('/api/payments/plans'),

  createPayment: (paymentData) => apiRequest('/api/payments/create-payment', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  simulatePayment: (paymentId, action) => apiRequest(`/api/payments/simulate-gateway/${paymentId}`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  }),

  verifyPayment: (paymentData) => apiRequest('/api/payments/verify-payment', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  getPaymentHistory: () => apiRequest('/api/payments/history'),

  getSubscriptionStatus: () => apiRequest('/api/payments/subscription-status'),

  cancelSubscription: () => apiRequest('/api/payments/cancel-subscription', {
    method: 'POST',
  }),

  requestRefund: (refundData) => apiRequest('/api/payments/refund', {
    method: 'POST',
    body: JSON.stringify(refundData),
  }),
};

// User management API calls
export const userAPI = {
  addToShortlist: (collegeId) => apiRequest('/api/shortlist', {
    method: 'POST',
    body: JSON.stringify({ college_id: collegeId }),
  }),

  removeFromShortlist: (collegeId) => apiRequest('/api/shortlist', {
    method: 'DELETE',
    body: JSON.stringify({ college_id: collegeId }),
  }),

  getShortlist: () => apiRequest('/api/shortlist'),

  saveExamScores: (examName, scoreData) => apiRequest('/api/exam-scores', {
    method: 'POST',
    body: JSON.stringify({ exam_name: examName, score_data: scoreData }),
  }),

  getExamScores: () => apiRequest('/api/exam-scores'),
};

// Health check
export const healthCheck = () => apiRequest('/api/health');


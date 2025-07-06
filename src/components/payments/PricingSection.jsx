import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import PaymentModal from './PaymentModal';
import { 
  Check, 
  Star, 
  Crown, 
  Zap, 
  ArrowRight,
  Users,
  BookOpen,
  MessageCircle,
  Award
} from 'lucide-react';

const PricingSection = () => {
  const { isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 299,
      duration: '1 month',
      description: 'Perfect for getting started with college preparation',
      icon: <Star className="h-8 w-8" />,
      color: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: false,
      features: [
        'Access to 15+ entrance exams database',
        'Basic college recommendations',
        'Community forum access',
        'Email support',
        'Exam deadline notifications',
        'Basic study resources'
      ],
      limitations: [
        'Limited mentor sessions (2/month)',
        'Basic filtering options',
        'Standard support response time'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 799,
      duration: '3 months',
      description: 'Most popular choice for serious aspirants',
      icon: <Crown className="h-8 w-8" />,
      color: 'border-purple-200 ring-2 ring-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: true,
      features: [
        'Everything in Basic plan',
        'Advanced college recommendations with cutoff analysis',
        'Unlimited mentor session bookings',
        'Priority community support',
        'Personalized study plans',
        'Mock test access',
        'Application deadline reminders',
        'Scholarship opportunity alerts',
        'Advanced filtering and search',
        'Priority customer support'
      ],
      limitations: []
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 1499,
      duration: '6 months',
      description: 'Complete guidance for your admission journey',
      icon: <Zap className="h-8 w-8" />,
      color: 'border-orange-200',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      popular: false,
      features: [
        'Everything in Premium plan',
        'Unlimited mentor sessions with top experts',
        '1-on-1 college counseling sessions',
        'Application assistance and review',
        'Scholarship guidance and applications',
        'Career planning and roadmap',
        'Interview preparation sessions',
        'Document verification support',
        'Dedicated success manager',
        '24/7 priority support',
        'Exclusive webinars and workshops',
        'Alumni network access'
      ],
      limitations: []
    }
  ];

  const handleSelectPlan = (planId) => {
    if (!isAuthenticated) {
      alert('Please log in to subscribe to a plan');
      return;
    }
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSavings = (planId) => {
    const plan = plans.find(p => p.id === planId);
    const basicMonthlyRate = 299;
    
    if (planId === 'premium') {
      const monthlyEquivalent = plan.price / 3;
      const savings = ((basicMonthlyRate - monthlyEquivalent) / basicMonthlyRate) * 100;
      return Math.round(savings);
    } else if (planId === 'pro') {
      const monthlyEquivalent = plan.price / 6;
      const savings = ((basicMonthlyRate - monthlyEquivalent) / basicMonthlyRate) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Success Plan 🚀
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your potential with our comprehensive college admission guidance plans. 
            Join thousands of successful students who achieved their dreams with EduPath.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50,000+</div>
              <div className="text-sm text-gray-600">Students Helped</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-600">Entrance Exams</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1000+</div>
              <div className="text-sm text-gray-600">Expert Mentors</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const savings = calculateSavings(plan.id);
            
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg ${plan.color} relative overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    🔥 Most Popular Choice
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${
                        plan.id === 'basic' ? 'bg-blue-100 text-blue-600' :
                        plan.id === 'premium' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {plan.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                    </div>
                    
                    {savings > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        Save {savings}% vs Monthly
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start opacity-60">
                        <div className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <div className="h-1 w-3 bg-gray-400 rounded"></div>
                        </div>
                        <span className="text-gray-600 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${plan.buttonColor} text-white py-3 text-lg font-medium`}
                  >
                    {isAuthenticated ? 'Choose Plan' : 'Sign Up & Choose Plan'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  {plan.id === 'premium' && (
                    <p className="text-center text-xs text-gray-500 mt-3">
                      ⭐ Recommended for most students
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. The price difference will be prorated.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a money-back guarantee?
              </h4>
              <p className="text-gray-600 text-sm">
                We offer a 7-day money-back guarantee if you're not satisfied with our services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How do mentor sessions work?
              </h4>
              <p className="text-gray-600 text-sm">
                Book sessions with verified mentors from top colleges. Sessions are conducted via video call.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit/debit cards, UPI, and net banking for secure payments.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Trusted by students from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-lg font-medium">IIT Delhi</span>
            <span className="text-lg font-medium">AIIMS</span>
            <span className="text-lg font-medium">IIM Ahmedabad</span>
            <span className="text-lg font-medium">NIT Trichy</span>
            <span className="text-lg font-medium">BITS Pilani</span>
            <span className="text-lg font-medium">NLU Delhi</span>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planType={selectedPlan}
      />
    </div>
  );
};

export default PricingSection;


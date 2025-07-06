import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentsAPI } from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  X, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Star,
  Crown,
  Zap
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, planType = 'premium', serviceType = null, serviceData = null }) => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    cardholder_name: '',
    upi_id: ''
  });

  const plans = {
    basic: {
      name: 'Basic Plan',
      price: 299,
      duration: '1 month',
      features: [
        'Access to exam database',
        'Basic college recommendations',
        'Community forum access',
        'Email support'
      ],
      icon: <Star className="h-6 w-6" />,
      color: 'bg-blue-600'
    },
    premium: {
      name: 'Premium Plan',
      price: 799,
      duration: '3 months',
      features: [
        'Everything in Basic',
        'Advanced college recommendations',
        'Mentor session discounts',
        'Priority support',
        'Personalized study plans',
        'Mock test access'
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'bg-purple-600'
    },
    pro: {
      name: 'Pro Plan',
      price: 1499,
      duration: '6 months',
      features: [
        'Everything in Premium',
        'Unlimited mentor sessions',
        '1-on-1 counseling',
        'Application assistance',
        'Scholarship guidance',
        'Career planning'
      ],
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-orange-600'
    }
  };

  const currentPlan = plans[planType] || plans.premium;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to make a payment');
      return;
    }

    // Validate payment data
    if (paymentMethod === 'card') {
      if (!paymentData.card_number || !paymentData.expiry_month || !paymentData.expiry_year || 
          !paymentData.cvv || !paymentData.cardholder_name) {
        setError('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentData.upi_id) {
        setError('Please enter your UPI ID');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      
      const paymentPayload = {
        plan_type: planType,
        payment_method: paymentMethod,
        amount: currentPlan.price,
        ...paymentData
      };

      // If it's a service payment (like mentor session)
      if (serviceType && serviceData) {
        paymentPayload.service_type = serviceType;
        paymentPayload.service_data = serviceData;
      }

      const response = await paymentsAPI.processPayment(paymentPayload);
      
      if (response.success) {
        setSuccess(true);
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setPaymentData({
            card_number: '',
            expiry_month: '',
            expiry_year: '',
            cvv: '',
            cardholder_name: '',
            upi_id: ''
          });
        }, 3000);
      } else {
        setError(response.message || 'Payment failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your {currentPlan.name} subscription has been activated.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
              <p className="text-gray-600">Secure payment powered by EduPath</p>
            </div>

            {/* Plan Summary */}
            <div className={`${currentPlan.color} text-white rounded-lg p-6 mb-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {currentPlan.icon}
                  <div className="ml-3">
                    <h3 className="text-lg font-bold">{currentPlan.name}</h3>
                    <p className="text-sm opacity-90">{currentPlan.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatCurrency(currentPlan.price)}</div>
                  <div className="text-sm opacity-90">One-time payment</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">What's included:</h4>
                <ul className="text-sm space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="mr-2 opacity-80" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Payment Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="mr-2" size={20} />
                    Credit/Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2 text-lg">📱</span>
                    UPI
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <Input
                      type="text"
                      value={paymentData.cardholder_name}
                      onChange={(e) => setPaymentData({...paymentData, cardholder_name: e.target.value})}
                      placeholder="Enter cardholder name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      value={paymentData.card_number}
                      onChange={(e) => setPaymentData({...paymentData, card_number: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <Select 
                        value={paymentData.expiry_month} 
                        onValueChange={(value) => setPaymentData({...paymentData, expiry_month: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <Select 
                        value={paymentData.expiry_year} 
                        onValueChange={(value) => setPaymentData({...paymentData, expiry_year: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                        placeholder="123"
                        maxLength={4}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <Input
                    type="text"
                    value={paymentData.upi_id}
                    onChange={(e) => setPaymentData({...paymentData, upi_id: e.target.value})}
                    placeholder="yourname@paytm"
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="mr-2" size={16} />
                  Your payment information is encrypted and secure. We never store your card details.
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay {formatCurrency(currentPlan.price)}
                  </>
                )}
              </Button>
            </form>

            {/* Terms */}
            <div className="mt-6 text-xs text-gray-500 text-center">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              All payments are processed securely.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;


import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Explore Exams', path: '/exams' },
        { name: 'Find Colleges', path: '/colleges' },
        { name: 'Student Mentors', path: '/mentors' },
        { name: 'Community Forum', path: '/community' },
        { name: 'Success Stories', path: '/stories' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Study Guides', path: '/guides' },
        { name: 'Exam Calendar', path: '/calendar' },
        { name: 'College Rankings', path: '/rankings' },
        { name: 'Scholarship Info', path: '/scholarships' },
        { name: 'Career Guidance', path: '/careers' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQs', path: '/faq' },
        { name: 'Live Chat', path: '/chat' },
        { name: 'Report Issue', path: '/report' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Mission', path: '/mission' },
        { name: 'Team', path: '/team' },
        { name: 'Careers', path: '/jobs' },
        { name: 'Press', path: '/press' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/edupath' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/edupath' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/edupath' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/edupath' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/edupath' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: 'var(--edupath-blue)' }}
              >
                E
              </div>
              <span className="text-xl font-bold">EduPath</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted companion for navigating college admissions and entrance exams. 
              Empowering students to achieve their academic dreams.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3" />
                <span>support@edupath.in</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Get the latest exam notifications, college updates, and study tips delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors duration-200"
                style={{ backgroundColor: 'var(--edupath-blue)' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            
            {/* App Download Badges */}
            <div className="flex space-x-3">
              <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-700 transition-colors">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-700 transition-colors">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-2 md:mb-0">
              © {currentYear} EduPath. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


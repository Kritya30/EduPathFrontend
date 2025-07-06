export const collegesData = [
  // IITs (JEE Advanced)
  {
    id: 1,
    name: 'IIT Delhi',
    fullName: 'Indian Institute of Technology Delhi',
    location: 'New Delhi',
    state: 'Delhi',
    type: 'Government',
    stream: 'Engineering',
    courses: ['B.Tech', 'Dual Degree', 'M.Tech', 'PhD'],
    fees: '₹2.5 Lakh/year',
    ranking: {
      nirf: 2,
      category: 'Engineering'
    },
    acceptedExams: ['JEE Advanced'],
    cutoffs: {
      'JEE Advanced': {
        general: { rank: 150, percentile: null },
        obc: { rank: 300, percentile: null },
        sc: { rank: 800, percentile: null },
        st: { rank: 1200, percentile: null }
      }
    },
    placements: {
      averagePackage: '₹18 LPA',
      highestPackage: '₹1.2 Crore',
      placementRate: '95%'
    },
    logo: '🏛️',
    description: 'Premier engineering institute known for excellence in technology and research.',
    website: 'https://home.iitd.ac.in/'
  },
  {
    id: 2,
    name: 'IIT Bombay',
    fullName: 'Indian Institute of Technology Bombay',
    location: 'Mumbai',
    state: 'Maharashtra',
    type: 'Government',
    stream: 'Engineering',
    courses: ['B.Tech', 'Dual Degree', 'M.Tech', 'PhD'],
    fees: '₹2.5 Lakh/year',
    ranking: {
      nirf: 3,
      category: 'Engineering'
    },
    acceptedExams: ['JEE Advanced'],
    cutoffs: {
      'JEE Advanced': {
        general: { rank: 100, percentile: null },
        obc: { rank: 250, percentile: null },
        sc: { rank: 700, percentile: null },
        st: { rank: 1000, percentile: null }
      }
    },
    placements: {
      averagePackage: '₹20 LPA',
      highestPackage: '₹1.5 Crore',
      placementRate: '96%'
    },
    logo: '🏛️',
    description: 'Top-ranked IIT known for computer science and engineering excellence.',
    website: 'https://www.iitb.ac.in/'
  },
  {
    id: 3,
    name: 'IIT Madras',
    fullName: 'Indian Institute of Technology Madras',
    location: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Government',
    stream: 'Engineering',
    courses: ['B.Tech', 'Dual Degree', 'M.Tech', 'PhD'],
    fees: '₹2.5 Lakh/year',
    ranking: {
      nirf: 1,
      category: 'Engineering'
    },
    acceptedExams: ['JEE Advanced'],
    cutoffs: {
      'JEE Advanced': {
        general: { rank: 80, percentile: null },
        obc: { rank: 200, percentile: null },
        sc: { rank: 600, percentile: null },
        st: { rank: 900, percentile: null }
      }
    },
    placements: {
      averagePackage: '₹22 LPA',
      highestPackage: '₹1.8 Crore',
      placementRate: '97%'
    },
    logo: '🏛️',
    description: 'India\'s top engineering institute with world-class research facilities.',
    website: 'https://www.iitm.ac.in/'
  },

  // NITs (JEE Main)
  {
    id: 4,
    name: 'NIT Trichy',
    fullName: 'National Institute of Technology Tiruchirappalli',
    location: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    type: 'Government',
    stream: 'Engineering',
    courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
    fees: '₹1.5 Lakh/year',
    ranking: {
      nirf: 9,
      category: 'Engineering'
    },
    acceptedExams: ['JEE Main'],
    cutoffs: {
      'JEE Main': {
        general: { rank: 2000, percentile: 99.5 },
        obc: { rank: 4000, percentile: 99.0 },
        sc: { rank: 8000, percentile: 97.0 },
        st: { rank: 12000, percentile: 95.0 }
      }
    },
    placements: {
      averagePackage: '₹12 LPA',
      highestPackage: '₹45 LPA',
      placementRate: '92%'
    },
    logo: '🏫',
    description: 'Premier NIT known for excellent engineering education and placements.',
    website: 'https://www.nitt.edu/'
  },
  {
    id: 5,
    name: 'NIT Warangal',
    fullName: 'National Institute of Technology Warangal',
    location: 'Warangal',
    state: 'Telangana',
    type: 'Government',
    stream: 'Engineering',
    courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
    fees: '₹1.5 Lakh/year',
    ranking: {
      nirf: 19,
      category: 'Engineering'
    },
    acceptedExams: ['JEE Main'],
    cutoffs: {
      'JEE Main': {
        general: { rank: 2500, percentile: 99.4 },
        obc: { rank: 5000, percentile: 98.8 },
        sc: { rank: 10000, percentile: 96.5 },
        st: { rank: 15000, percentile: 94.0 }
      }
    },
    placements: {
      averagePackage: '₹11 LPA',
      highestPackage: '₹42 LPA',
      placementRate: '90%'
    },
    logo: '🏫',
    description: 'Top NIT with strong industry connections and research programs.',
    website: 'https://www.nitw.ac.in/'
  },

  // BITS (BITSAT)
  {
    id: 6,
    name: 'BITS Pilani',
    fullName: 'Birla Institute of Technology and Science Pilani',
    location: 'Pilani',
    state: 'Rajasthan',
    type: 'Private',
    stream: 'Engineering',
    courses: ['B.E.', 'M.Sc.', 'MBA', 'PhD'],
    fees: '₹4.5 Lakh/year',
    ranking: {
      nirf: 25,
      category: 'Engineering'
    },
    acceptedExams: ['BITSAT'],
    cutoffs: {
      'BITSAT': {
        general: { rank: null, percentile: 95.0 },
        obc: { rank: null, percentile: 93.0 },
        sc: { rank: null, percentile: 90.0 },
        st: { rank: null, percentile: 88.0 }
      }
    },
    placements: {
      averagePackage: '₹15 LPA',
      highestPackage: '₹60 LPA',
      placementRate: '94%'
    },
    logo: '⭐',
    description: 'Premier private engineering institute with excellent industry exposure.',
    website: 'https://www.bits-pilani.ac.in/'
  },

  // Medical Colleges (NEET)
  {
    id: 7,
    name: 'AIIMS Delhi',
    fullName: 'All India Institute of Medical Sciences Delhi',
    location: 'New Delhi',
    state: 'Delhi',
    type: 'Government',
    stream: 'Medical',
    courses: ['MBBS', 'MD', 'MS', 'DM', 'MCh'],
    fees: '₹1,500/year',
    ranking: {
      nirf: 1,
      category: 'Medical'
    },
    acceptedExams: ['NEET UG'],
    cutoffs: {
      'NEET UG': {
        general: { rank: 50, percentile: 99.99 },
        obc: { rank: 150, percentile: 99.95 },
        sc: { rank: 500, percentile: 99.8 },
        st: { rank: 800, percentile: 99.5 }
      }
    },
    placements: {
      averagePackage: 'Government Service',
      highestPackage: 'Super Specialty',
      placementRate: '100%'
    },
    logo: '🏥',
    description: 'India\'s premier medical institute with world-class healthcare education.',
    website: 'https://www.aiims.edu/'
  },
  {
    id: 8,
    name: 'CMC Vellore',
    fullName: 'Christian Medical College Vellore',
    location: 'Vellore',
    state: 'Tamil Nadu',
    type: 'Private',
    stream: 'Medical',
    courses: ['MBBS', 'MD', 'MS', 'DM', 'MCh'],
    fees: '₹4.5 Lakh/year',
    ranking: {
      nirf: 3,
      category: 'Medical'
    },
    acceptedExams: ['NEET UG'],
    cutoffs: {
      'NEET UG': {
        general: { rank: 200, percentile: 99.9 },
        obc: { rank: 400, percentile: 99.7 },
        sc: { rank: 800, percentile: 99.3 },
        st: { rank: 1200, percentile: 98.8 }
      }
    },
    placements: {
      averagePackage: 'Hospital Residency',
      highestPackage: 'International Opportunities',
      placementRate: '98%'
    },
    logo: '⛪',
    description: 'Top private medical college known for clinical excellence and research.',
    website: 'https://www.cmch-vellore.edu/'
  },

  // Management (CAT)
  {
    id: 9,
    name: 'IIM Ahmedabad',
    fullName: 'Indian Institute of Management Ahmedabad',
    location: 'Ahmedabad',
    state: 'Gujarat',
    type: 'Government',
    stream: 'Management',
    courses: ['MBA', 'PGPX', 'PhD', 'FPM'],
    fees: '₹25 Lakh (2 years)',
    ranking: {
      nirf: 1,
      category: 'Management'
    },
    acceptedExams: ['CAT'],
    cutoffs: {
      'CAT': {
        general: { rank: null, percentile: 99.5 },
        obc: { rank: null, percentile: 97.0 },
        sc: { rank: null, percentile: 85.0 },
        st: { rank: null, percentile: 78.0 }
      }
    },
    placements: {
      averagePackage: '₹34 LPA',
      highestPackage: '₹1.15 Crore',
      placementRate: '100%'
    },
    logo: '🏢',
    description: 'India\'s top business school with global recognition.',
    website: 'https://www.iima.ac.in/'
  },
  {
    id: 10,
    name: 'IIM Bangalore',
    fullName: 'Indian Institute of Management Bangalore',
    location: 'Bangalore',
    state: 'Karnataka',
    type: 'Government',
    stream: 'Management',
    courses: ['MBA', 'EPGP', 'PhD', 'FPM'],
    fees: '₹24 Lakh (2 years)',
    ranking: {
      nirf: 2,
      category: 'Management'
    },
    acceptedExams: ['CAT'],
    cutoffs: {
      'CAT': {
        general: { rank: null, percentile: 99.0 },
        obc: { rank: null, percentile: 96.0 },
        sc: { rank: null, percentile: 82.0 },
        st: { rank: null, percentile: 75.0 }
      }
    },
    placements: {
      averagePackage: '₹31 LPA',
      highestPackage: '₹89 LPA',
      placementRate: '100%'
    },
    logo: '🏢',
    description: 'Premier management institute known for innovation and entrepreneurship.',
    website: 'https://www.iimb.ac.in/'
  },

  // Law (CLAT)
  {
    id: 11,
    name: 'NLSIU Bangalore',
    fullName: 'National Law School of India University',
    location: 'Bangalore',
    state: 'Karnataka',
    type: 'Government',
    stream: 'Law',
    courses: ['BA LLB', 'LLM', 'PhD'],
    fees: '₹2.5 Lakh/year',
    ranking: {
      nirf: 1,
      category: 'Law'
    },
    acceptedExams: ['CLAT UG'],
    cutoffs: {
      'CLAT UG': {
        general: { rank: 50, percentile: null },
        obc: { rank: 100, percentile: null },
        sc: { rank: 200, percentile: null },
        st: { rank: 300, percentile: null }
      }
    },
    placements: {
      averagePackage: '₹15 LPA',
      highestPackage: '₹35 LPA',
      placementRate: '95%'
    },
    logo: '⚖️',
    description: 'India\'s premier law school with excellent legal education.',
    website: 'https://www.nls.ac.in/'
  },
  {
    id: 12,
    name: 'NALSAR Hyderabad',
    fullName: 'NALSAR University of Law',
    location: 'Hyderabad',
    state: 'Telangana',
    type: 'Government',
    stream: 'Law',
    courses: ['BA LLB', 'BBA LLB', 'LLM', 'PhD'],
    fees: '₹2.8 Lakh/year',
    ranking: {
      nirf: 2,
      category: 'Law'
    },
    acceptedExams: ['CLAT UG'],
    cutoffs: {
      'CLAT UG': {
        general: { rank: 80, percentile: null },
        obc: { rank: 150, percentile: null },
        sc: { rank: 300, percentile: null },
        st: { rank: 450, percentile: null }
      }
    },
    placements: {
      averagePackage: '₹12 LPA',
      highestPackage: '₹28 LPA',
      placementRate: '92%'
    },
    logo: '⚖️',
    description: 'Top law university known for corporate law and litigation.',
    website: 'https://www.nalsar.ac.in/'
  },

  // Central Universities (CUET)
  {
    id: 13,
    name: 'JNU Delhi',
    fullName: 'Jawaharlal Nehru University',
    location: 'New Delhi',
    state: 'Delhi',
    type: 'Government',
    stream: 'University',
    courses: ['BA', 'MA', 'MSc', 'PhD', 'MPhil'],
    fees: '₹50,000/year',
    ranking: {
      nirf: 2,
      category: 'University'
    },
    acceptedExams: ['CUET UG'],
    cutoffs: {
      'CUET UG': {
        general: { rank: null, percentile: 98.0 },
        obc: { rank: null, percentile: 95.0 },
        sc: { rank: null, percentile: 90.0 },
        st: { rank: null, percentile: 85.0 }
      }
    },
    placements: {
      averagePackage: '₹8 LPA',
      highestPackage: '₹25 LPA',
      placementRate: '85%'
    },
    logo: '🎓',
    description: 'Premier central university known for social sciences and research.',
    website: 'https://www.jnu.ac.in/'
  },
  {
    id: 14,
    name: 'BHU Varanasi',
    fullName: 'Banaras Hindu University',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'Government',
    stream: 'University',
    courses: ['BA', 'BSc', 'BTech', 'MA', 'MSc', 'MTech'],
    fees: '₹75,000/year',
    ranking: {
      nirf: 12,
      category: 'University'
    },
    acceptedExams: ['CUET UG', 'JEE Main'],
    cutoffs: {
      'CUET UG': {
        general: { rank: null, percentile: 95.0 },
        obc: { rank: null, percentile: 92.0 },
        sc: { rank: null, percentile: 87.0 },
        st: { rank: null, percentile: 82.0 }
      },
      'JEE Main': {
        general: { rank: 15000, percentile: 95.0 },
        obc: { rank: 25000, percentile: 92.0 },
        sc: { rank: 40000, percentile: 85.0 },
        st: { rank: 60000, percentile: 80.0 }
      }
    },
    placements: {
      averagePackage: '₹7 LPA',
      highestPackage: '₹22 LPA',
      placementRate: '80%'
    },
    logo: '🕉️',
    description: 'Historic central university with diverse academic programs.',
    website: 'https://www.bhu.ac.in/'
  },

  // State Engineering Colleges
  {
    id: 15,
    name: 'Anna University',
    fullName: 'Anna University Chennai',
    location: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Government',
    stream: 'Engineering',
    courses: ['BE', 'BTech', 'ME', 'MTech', 'PhD'],
    fees: '₹1 Lakh/year',
    ranking: {
      nirf: 45,
      category: 'Engineering'
    },
    acceptedExams: ['JEE Main', 'TNEA'],
    cutoffs: {
      'JEE Main': {
        general: { rank: 25000, percentile: 92.0 },
        obc: { rank: 35000, percentile: 88.0 },
        sc: { rank: 50000, percentile: 82.0 },
        st: { rank: 70000, percentile: 75.0 }
      }
    },
    placements: {
      averagePackage: '₹6 LPA',
      highestPackage: '₹18 LPA',
      placementRate: '75%'
    },
    logo: '🏫',
    description: 'Leading state university for engineering and technology.',
    website: 'https://www.annauniv.edu/'
  }
]

export const getCollegesByExam = (examName) => {
  return collegesData.filter(college => 
    college.acceptedExams.includes(examName)
  )
}

export const getCollegesByRank = (examName, rank, category = 'general') => {
  return collegesData.filter(college => {
    if (!college.acceptedExams.includes(examName)) return false
    
    const cutoff = college.cutoffs[examName]?.[category]
    if (!cutoff) return false
    
    if (cutoff.rank) {
      return rank <= cutoff.rank
    }
    
    return false
  }).sort((a, b) => {
    const aRank = a.cutoffs[examName]?.[category]?.rank || Infinity
    const bRank = b.cutoffs[examName]?.[category]?.rank || Infinity
    return aRank - bRank
  })
}

export const getCollegesByPercentile = (examName, percentile, category = 'general') => {
  return collegesData.filter(college => {
    if (!college.acceptedExams.includes(examName)) return false
    
    const cutoff = college.cutoffs[examName]?.[category]
    if (!cutoff) return false
    
    if (cutoff.percentile) {
      return percentile >= cutoff.percentile
    }
    
    return false
  }).sort((a, b) => {
    const aPercentile = a.cutoffs[examName]?.[category]?.percentile || 0
    const bPercentile = b.cutoffs[examName]?.[category]?.percentile || 0
    return bPercentile - aPercentile
  })
}


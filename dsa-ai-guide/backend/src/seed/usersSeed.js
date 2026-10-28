/**
 * Demo Users and Profiles Seed Definition
 * 1 Admin, 2 Instructors, 15 Students across Beginner, Intermediate, and Advanced tiers.
 * Plus default backward-compatible demo accounts.
 */

const demoUsers = [
  // ==========================================
  // ADMIN USERS
  // ==========================================
  {
    email: 'admin@dsa-ai-guide.edu',
    name: 'Dr. Ramesh Rao (Platform Admin)',
    rawPassword: 'AdminPass123!',
    role: 'admin',
    xp: 2400,
    level: 7,
    streakCurrent: 28,
    streakLongest: 45,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions, Mathura',
      degree: 'Ph.D. Computer Science',
      branch: 'Computer Science & Engineering',
      graduationYear: 2012,
      currentDsaLevel: 'Expert',
      targetGoal: 'Academic & Platform Administration',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 60,
      targetCompanies: ['Google', 'Microsoft', 'Amazon'],
      codingExperience: '10+ years'
    }
  },
  {
    email: 'admin@dsa-ai.guide',
    name: 'DSA Platform Admin (Default)',
    rawPassword: 'AdminSecret123!',
    role: 'admin',
    xp: 2000,
    level: 6,
    streakCurrent: 21,
    streakLongest: 35,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'M.Tech',
      branch: 'CSE',
      graduationYear: 2018,
      currentDsaLevel: 'Expert',
      targetGoal: 'Platform Management',
      preferredLanguage: 'python',
      dailyStudyMinutes: 45,
      targetCompanies: ['Google', 'Meta'],
      codingExperience: '5-10 years'
    }
  },

  // ==========================================
  // INSTRUCTORS (2 Demo Instructors)
  // ==========================================
  {
    email: 'dr.sharma@dsa-ai-guide.edu',
    name: 'Dr. Ananya Sharma',
    rawPassword: 'InstructorPass123!',
    role: 'instructor',
    xp: 1850,
    level: 6,
    streakCurrent: 19,
    streakLongest: 30,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions, Mathura',
      degree: 'Ph.D. Algorithms & Optimization',
      branch: 'Computer Science & Engineering',
      graduationYear: 2015,
      currentDsaLevel: 'Expert',
      targetGoal: 'Curriculum & Research Leadership',
      preferredLanguage: 'python',
      dailyStudyMinutes: 90,
      targetCompanies: ['Google Research', 'Microsoft Research'],
      codingExperience: '8+ years'
    }
  },
  {
    email: 'prof.verma@dsa-ai-guide.edu',
    name: 'Prof. Rajesh Verma',
    rawPassword: 'InstructorPass123!',
    role: 'instructor',
    xp: 1650,
    level: 5,
    streakCurrent: 14,
    streakLongest: 25,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions, Mathura',
      degree: 'M.Tech Computer Science',
      branch: 'Information Technology',
      graduationYear: 2016,
      currentDsaLevel: 'Expert',
      targetGoal: 'Competitive Programming Mentorship',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 90,
      targetCompanies: ['Amazon', 'Adobe', 'Uber'],
      codingExperience: '6-8 years'
    }
  },

  // ==========================================
  // 15 DEMO STUDENTS
  // ==========================================
  // Tier 1: Beginners (5 Students)
  {
    email: 'aarav.sharma@student.dsa.edu',
    name: 'Aarav Sharma',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'beginner',
    xp: 320,
    level: 2,
    streakCurrent: 3,
    streakLongest: 5,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2028,
      currentDsaLevel: 'Beginner',
      targetGoal: 'Campus Placement Fundamentals',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 45,
      targetCompanies: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
      codingExperience: '< 1 year'
    }
  },
  {
    email: 'ananya.gupta@student.dsa.edu',
    name: 'Ananya Gupta',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'beginner',
    xp: 380,
    level: 2,
    streakCurrent: 4,
    streakLongest: 6,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Information Technology',
      graduationYear: 2028,
      currentDsaLevel: 'Beginner',
      targetGoal: 'Building Strong Data Structure Basics',
      preferredLanguage: 'python',
      dailyStudyMinutes: 60,
      targetCompanies: ['Accenture', 'Capgemini', 'HCL'],
      codingExperience: '< 1 year'
    }
  },
  {
    email: 'rohan.mehta@student.dsa.edu',
    name: 'Rohan Mehta',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'beginner',
    xp: 290,
    level: 2,
    streakCurrent: 2,
    streakLongest: 4,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science (AI & ML)',
      graduationYear: 2027,
      currentDsaLevel: 'Beginner',
      targetGoal: 'Internship Preparation',
      preferredLanguage: 'java',
      dailyStudyMinutes: 45,
      targetCompanies: ['Tech Mahindra', 'LTIMindtree'],
      codingExperience: '< 1 year'
    }
  },
  {
    email: 'ishaan.verma@student.dsa.edu',
    name: 'Ishaan Verma',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'beginner',
    xp: 240,
    level: 2,
    streakCurrent: 1,
    streakLongest: 3,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Electronics & Communication Engineering',
      graduationYear: 2028,
      currentDsaLevel: 'Beginner',
      targetGoal: 'Transition to Software Engineering',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 30,
      targetCompanies: ['Zoho', 'Deloitte'],
      codingExperience: '< 1 year'
    }
  },
  {
    email: 'diya.patel@student.dsa.edu',
    name: 'Diya Patel',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'beginner',
    xp: 410,
    level: 2,
    streakCurrent: 5,
    streakLongest: 7,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2027,
      currentDsaLevel: 'Beginner',
      targetGoal: 'Mastering Linear Structures',
      preferredLanguage: 'javascript',
      dailyStudyMinutes: 60,
      targetCompanies: ['IBM', 'Oracle Financial Services'],
      codingExperience: '1 year'
    }
  },

  // Tier 2: Intermediate (5 Students)
  {
    email: 'vikram.malhotra@student.dsa.edu',
    name: 'Vikram Malhotra',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'intermediate',
    xp: 920,
    level: 4,
    streakCurrent: 8,
    streakLongest: 14,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Product Company Campus Placements',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 90,
      targetCompanies: ['Amazon', 'Samsung', 'Cisco'],
      codingExperience: '1-2 years'
    }
  },
  {
    email: 'sneha.reddy@student.dsa.edu',
    name: 'Sneha Reddy',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'intermediate',
    xp: 1050,
    level: 4,
    streakCurrent: 10,
    streakLongest: 16,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Information Technology',
      graduationYear: 2026,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Cracking SDE-1 Coding Rounds',
      preferredLanguage: 'java',
      dailyStudyMinutes: 90,
      targetCompanies: ['Microsoft', 'Goldman Sachs', 'Morgan Stanley'],
      codingExperience: '2 years'
    }
  },
  {
    email: 'aditya.joshi@student.dsa.edu',
    name: 'Aditya Joshi',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'intermediate',
    xp: 880,
    level: 4,
    streakCurrent: 6,
    streakLongest: 12,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Interview Problem-Solving Speed',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 75,
      targetCompanies: ['Adobe', 'Paytm', 'Swiggy'],
      codingExperience: '1-2 years'
    }
  },
  {
    email: 'meera.nair@student.dsa.edu',
    name: 'Meera Nair',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'intermediate',
    xp: 1120,
    level: 4,
    streakCurrent: 12,
    streakLongest: 18,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science (Data Science)',
      graduationYear: 2026,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Binary Search & Tree Mastery',
      preferredLanguage: 'python',
      dailyStudyMinutes: 90,
      targetCompanies: ['Walmart Global Tech', 'Flipkart', 'Intuit'],
      codingExperience: '2 years'
    }
  },
  {
    email: 'kabir.das@student.dsa.edu',
    name: 'Kabir Das',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'intermediate',
    xp: 790,
    level: 3,
    streakCurrent: 7,
    streakLongest: 11,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Information Technology',
      graduationYear: 2027,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Algorithmic Confidence',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 60,
      targetCompanies: ['JPMorgan Chase', 'Oracle', 'Optum'],
      codingExperience: '1-2 years'
    }
  },

  // Tier 3: Advanced (5 Students)
  {
    email: 'priya.venkatesh@student.dsa.edu',
    name: 'Priya Venkatesh',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'advanced',
    xp: 2250,
    level: 6,
    streakCurrent: 25,
    streakLongest: 42,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2025,
      currentDsaLevel: 'Advanced',
      targetGoal: 'FAANG / Tier-1 Product Engineering',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 120,
      targetCompanies: ['Google', 'Meta', 'Apple', 'Uber'],
      codingExperience: '3-4 years'
    }
  },
  {
    email: 'arjun.kapoor@student.dsa.edu',
    name: 'Arjun Kapoor',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'advanced',
    xp: 2100,
    level: 6,
    streakCurrent: 22,
    streakLongest: 38,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2025,
      currentDsaLevel: 'Advanced',
      targetGoal: 'Competitive Programming (Candidate Master)',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 120,
      targetCompanies: ['Tower Research', 'DE Shaw', 'Google'],
      codingExperience: '3+ years'
    }
  },
  {
    email: 'neha.singhal@student.dsa.edu',
    name: 'Neha Singhal',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'advanced',
    xp: 1950,
    level: 6,
    streakCurrent: 18,
    streakLongest: 30,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Information Technology',
      graduationYear: 2025,
      currentDsaLevel: 'Advanced',
      targetGoal: 'Graph & Dynamic Programming Specialization',
      preferredLanguage: 'java',
      dailyStudyMinutes: 100,
      targetCompanies: ['Amazon', 'Microsoft', 'Atlassian'],
      codingExperience: '3 years'
    }
  },
  {
    email: 'siddharth.rao@student.dsa.edu',
    name: 'Siddharth Rao',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'advanced',
    xp: 1820,
    level: 5,
    streakCurrent: 16,
    streakLongest: 28,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2025,
      currentDsaLevel: 'Advanced',
      targetGoal: 'Hard Problem Solving & System Algorithms',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 90,
      targetCompanies: ['Directi', 'Salesforce', 'Stripe'],
      codingExperience: '3 years'
    }
  },
  {
    email: 'tanvi.bhatia@student.dsa.edu',
    name: 'Tanvi Bhatia',
    rawPassword: 'StudentPass123!',
    role: 'student',
    tier: 'advanced',
    xp: 1740,
    level: 5,
    streakCurrent: 15,
    streakLongest: 24,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2025,
      currentDsaLevel: 'Advanced',
      targetGoal: 'High-Performance Algorithmic Engineering',
      preferredLanguage: 'python',
      dailyStudyMinutes: 90,
      targetCompanies: ['Google', 'LinkedIn', 'Zomato'],
      codingExperience: '2-3 years'
    }
  },

  // Default demo student
  {
    email: 'student@dsa-ai.guide',
    name: 'Demo Student (Default)',
    rawPassword: 'Password123!',
    role: 'student',
    tier: 'intermediate',
    xp: 850,
    level: 4,
    streakCurrent: 7,
    streakLongest: 14,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Placement Preparation',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 90,
      targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Uber'],
      codingExperience: '1-2 years'
    }
  }
];

module.exports = demoUsers;

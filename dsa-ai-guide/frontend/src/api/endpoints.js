import axiosClient from './axiosClient';

export const authAPI = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  getMe: () => axiosClient.get('/auth/me'),
  getProfile: () => axiosClient.get('/users/profile'),
  updateProfile: (data) => axiosClient.put('/users/profile', data),
  getAchievements: () => axiosClient.get('/users/achievements'),
};

export const assessmentAPI = {
  getQuestions: () => axiosClient.get('/assessment/questions'),
  submit: (data) => axiosClient.post('/assessment/submit', data),
  getResult: () => axiosClient.get('/assessment/result'),
};

export const roadmapAPI = {
  getRoadmap: () => axiosClient.get('/roadmap'),
  regenerate: () => axiosClient.post('/roadmap/regenerate'),
  getMastery: () => axiosClient.get('/roadmap/mastery'),
  getTopicMastery: (topicSlug) => axiosClient.get(`/roadmap/mastery/${topicSlug}`),
};

export const problemsAPI = {
  getTopics: () => axiosClient.get('/problems/topics'),
  getPatterns: () => axiosClient.get('/problems/patterns'),
  getProblems: (params) => axiosClient.get('/problems', { params }),
  getBySlug: (slug) => axiosClient.get(`/problems/${slug}`),
  runCode: (slug, data) => axiosClient.post(`/submissions/${slug}/run`, data),
  submit: (slug, data) => axiosClient.post(`/submissions/${slug}/submit`, data),
  getMySubmissions: (params) => axiosClient.get('/submissions/my', { params }),
  getByProblem: (slug) => axiosClient.get(`/submissions/problem/${slug}`),
  getById: (id) => axiosClient.get(`/submissions/${id}`),
};

export const aiAPI = {
  chat: (data) => axiosClient.post('/ai/chat', data),
  getConversations: () => axiosClient.get('/ai/conversations'),
  getConversationById: (id) => axiosClient.get(`/ai/conversations/${id}`),
  getHint: (slug, data) => axiosClient.post(`/ai/hint/${slug}`, data),
  analyzeComplexity: (data) => axiosClient.post('/ai/complexity', data),
};

export const recommendationAPI = {
  getRecommendations: (limit = 5) => axiosClient.get(`/recommendations?limit=${limit}`),
  getDailyPlan: () => axiosClient.get('/recommendations/daily-plan'),
};

export const revisionAPI = {
  getDue: () => axiosClient.get('/revision'),
  submit: (data) => axiosClient.post('/revision/submit', data),
};

export const interviewAPI = {
  start: (data) => axiosClient.post('/interview/start', data),
  respond: (id, data) => axiosClient.post(`/interview/${id}/respond`, data),
  getById: (id) => axiosClient.get(`/interview/${id}`),
};

export const contestAPI = {
  getContests: () => axiosClient.get('/contest'),
  getBySlug: (slug) => axiosClient.get(`/contest/${slug}`),
  submit: (slug, data) => axiosClient.post(`/contest/${slug}/submit`, data),
};

export const analyticsAPI = {
  getDashboard: () => axiosClient.get('/analytics/dashboard'),
  getWeeklyReport: () => axiosClient.get('/analytics/weekly-report'),
};

export const adminAPI = {
  getStats: () => axiosClient.get('/admin/stats'),
  getUsers: () => axiosClient.get('/admin/users'),
  createProblem: (data) => axiosClient.post('/admin/problems', data),
  updateProblem: (slug, data) => axiosClient.put(`/admin/problems/${slug}`, data),
  deleteProblem: (slug) => axiosClient.delete(`/admin/problems/${slug}`),
};

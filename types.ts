
export enum ComplaintStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export enum UserRole {
  CITIZEN = 'citizen',
  OFFICIAL = 'official',
  GUEST = 'guest'
}

export interface User {
  id?: string;
  type: UserRole;
  email?: string;
  department?: string;
}

export interface Location {
  lat?: number;
  lng?: number;
  address: string;
}

export interface AIAnalysis {
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  department: string;
  actionPlan: string[];
}

export interface Complaint {
  id: string;
  language: 'english' | 'hindi' | 'telugu';
  description: string;
  imageBase64?: string;
  location: Location;
  category: string;
  priority: string;
  status: ComplaintStatus;
  department: string;
  createdAt: string;
  resolvedAt: string | null;
  rating: number | null;
  feedback?: string;
  aiAnalysis?: AIAnalysis;
  userId?: string;
}

export interface TranslationSet {
  heroTitle: string;
  heroSubtitle: string;
  reportButton: string;
  trackButton: string;
  formTitle: string;
  languageLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  imageLabel: string;
  locationLabel: string;
  detectLocationButton: string;
  manualAddressPlaceholder: string;
  submitButton: string;
  successMessage: string;
  complaintIdLabel: string;
  trackTitle: string;
  searchPlaceholder: string;
  filterStatus: string;
  filterCategory: string;
  noComplaints: string;
  viewDetails: string;
  rateButton: string;
  statusNew: string;
  statusInProgress: string;
  statusResolved: string;
  loading: string;
  error: string;
  back: string;
  close: string;
  submit: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  totalReports: string;
  activeIssues: string;
  resolved: string;
  recentReports: string;
  viewAll: string;
  nearbyServices: string;
  recyclingHubs: string;
  envAuthorities: string;
  didYouKnow: string;
  learnMoreTips: string;
  poweredBy: string;
  aiDesc: string;
  assignTeam: string;
  escalateReport: string;
  updateStatus: string;
  confirmUpdate: string;
  currentProgress: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  catSolidWaste: string;
  catWaterPollution: string;
  catAirQuality: string;
  catSewage: string;
  catIllegalDumping: string;
  catTreeCutting: string;
  catNoisePollution: string;
}


import { Complaint, ComplaintStatus } from '../types';
import {
  getComplaintsFromSupabase,
  saveComplaintToSupabase,
  updateComplaintInSupabase,
  getComplaintByIdFromSupabase,
  deleteComplaintInSupabase
} from '../services/supabaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const STORAGE_KEY = 'eco_guard_complaints';

// Local storage fallback functions
const getLocalComplaints = (): Complaint[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalComplaint = (complaint: Complaint) => {
  const complaints = getLocalComplaints();
  complaints.push(complaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
};

const updateLocalComplaint = (updated: Complaint) => {
  const complaints = getLocalComplaints();
  const index = complaints.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    complaints[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }
};

const deleteLocalComplaint = (id: string) => {
  let complaints = getLocalComplaints();
  complaints = complaints.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
};

const getLocalComplaintById = (id: string): Complaint | undefined => {
  return getLocalComplaints().find(c => c.id === id);
};

// Main exported functions - use Supabase with localStorage fallback
export const getComplaints = async (userId?: string): Promise<Complaint[]> => {
  if (isSupabaseConfigured) {
    try {
      return await getComplaintsFromSupabase(userId);
    } catch (error) {
      console.error('Supabase fetch failed, using localStorage:', error);
      return getLocalComplaints();
    }
  }
  return getLocalComplaints();
};

export const saveComplaint = async (complaint: Complaint): Promise<void> => {
  // Always save to localStorage as backup
  saveLocalComplaint(complaint);

  if (isSupabaseConfigured) {
    try {
      await saveComplaintToSupabase(complaint);
    } catch (error) {
      console.error('Supabase save failed:', error);
    }
  }
};

export const updateComplaint = async (updated: Complaint): Promise<void> => {
  // Always update localStorage as backup
  updateLocalComplaint(updated);

  if (isSupabaseConfigured) {
    try {
      await updateComplaintInSupabase(updated);
    } catch (error) {
      console.error('Supabase update failed:', error);
    }
  }
};

export const getComplaintById = async (id: string): Promise<Complaint | undefined> => {
  if (isSupabaseConfigured) {
    try {
      const complaint = await getComplaintByIdFromSupabase(id);
      return complaint || undefined;
    } catch (error) {
      console.error('Supabase fetch failed, using localStorage:', error);
      return getLocalComplaintById(id);
    }
  }
  return getLocalComplaintById(id);
  return getLocalComplaintById(id);
};

export const deleteComplaint = async (id: string): Promise<void> => {
  // Always delete from localStorage as backup/sync
  deleteLocalComplaint(id);

  if (isSupabaseConfigured) {
    try {
      await deleteComplaintInSupabase(id);
    } catch (error) {
      console.error('Supabase delete failed:', error);
    }
  }
};

// Synchronous versions for backwards compatibility (use localStorage only)
export const getComplaintsSync = (): Complaint[] => getLocalComplaints();
export const saveComplaintSync = (complaint: Complaint) => saveLocalComplaint(complaint);
export const updateComplaintSync = (updated: Complaint) => updateLocalComplaint(updated);
export const getComplaintByIdSync = (id: string): Complaint | undefined => getLocalComplaintById(id);

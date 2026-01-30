import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Complaint, ComplaintStatus } from '../types';

// Database row type (snake_case)
interface ComplaintRow {
    id: string;
    language: string;
    description: string;
    image_base64: string | null;
    location_address: string;
    location_lat: number | null;
    location_lng: number | null;
    category: string;
    priority: string;
    status: string;
    department: string;
    created_at: string;
    resolved_at: string | null;
    rating: number | null;
    feedback: string | null;
    ai_category: string | null;
    ai_priority: string | null;
    ai_department: string | null;
    ai_action_plan: string[] | null;
    user_id: string | null;
}

// Convert database row to frontend Complaint type
const rowToComplaint = (row: ComplaintRow): Complaint => ({
    id: row.id,
    language: row.language as 'english' | 'hindi' | 'telugu',
    description: row.description,
    imageBase64: row.image_base64 || undefined,
    location: {
        address: row.location_address,
        lat: row.location_lat || undefined,
        lng: row.location_lng || undefined,
    },
    category: row.category,
    priority: row.priority,
    status: row.status as ComplaintStatus,
    department: row.department,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    rating: row.rating,
    feedback: row.feedback || undefined,
    aiAnalysis: row.ai_category ? {
        category: row.ai_category,
        priority: row.ai_priority as 'Low' | 'Medium' | 'High',
        department: row.ai_department || '',
        actionPlan: row.ai_action_plan || [],
    } : undefined,
});

// Convert frontend Complaint to database row
const complaintToRow = (complaint: Complaint): ComplaintRow => ({
    id: complaint.id,
    language: complaint.language,
    description: complaint.description,
    image_base64: complaint.imageBase64 || null,
    location_address: complaint.location.address,
    location_lat: complaint.location.lat || null,
    location_lng: complaint.location.lng || null,
    category: complaint.category,
    priority: complaint.priority,
    status: complaint.status,
    department: complaint.department,
    created_at: complaint.createdAt,
    resolved_at: complaint.resolvedAt,
    rating: complaint.rating,
    feedback: complaint.feedback || null,
    ai_category: complaint.aiAnalysis?.category || null,
    ai_priority: complaint.aiAnalysis?.priority || null,
    ai_department: complaint.aiAnalysis?.department || null,
    ai_action_plan: complaint.aiAnalysis?.actionPlan || null,
    user_id: complaint.userId || null,
});

export const getComplaintsFromSupabase = async (userId?: string): Promise<Complaint[]> => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured');
        return [];
    }

    let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

    // If userId is provided, filter by it
    if (userId) {
        query = query.eq('user_id', userId);
    } else {
        // Fallback: try to get current user from session if no ID provided separately
        // This handles cases where we might want auto-detection
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            query = query.eq('user_id', user.id);
        }
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching complaints:', error);
        throw error;
    }

    return (data || []).map(rowToComplaint);
};

export const saveComplaintToSupabase = async (complaint: Complaint): Promise<void> => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured');
        return;
    }

    const row = complaintToRow(complaint);

    const { error } = await supabase
        .from('complaints')
        .insert(row);

    if (error) {
        console.error('Error saving complaint:', error);
        throw error;
    }
};

export const updateComplaintInSupabase = async (complaint: Complaint): Promise<void> => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured');
        return;
    }

    const row = complaintToRow(complaint);

    const { error } = await supabase
        .from('complaints')
        .update(row)
        .eq('id', complaint.id);

    if (error) {
        console.error('Error updating complaint:', error);
        throw error;
    }
};

export const getComplaintByIdFromSupabase = async (id: string): Promise<Complaint | null> => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured');
        return null;
    }

    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        console.error('Error fetching complaint:', error);
        throw error;
    }

    return data ? rowToComplaint(data) : null;
};

export const deleteComplaintInSupabase = async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured');
        return;
    }

    const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting complaint:', error);
        throw error;
    }
};

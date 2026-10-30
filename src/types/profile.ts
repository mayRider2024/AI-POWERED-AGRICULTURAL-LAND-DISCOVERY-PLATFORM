export interface UserProfile {
  id: string;
  full_name: string | null;
  preferred_language: 'en' | 'mr' | 'hi';
  preferred_district: 'Raigad' | 'Palghar' | null;
  user_role: 'land_seeker' | 'farmer' | 'investor' | 'agent' | 'researcher';
  created_at: string;
  updated_at: string;
}

export interface SavedPropertyRecord {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

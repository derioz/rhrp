export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  location?: string;
  tags: string[];
  photographer: string;
}

export interface StaffMember {
  id: string;
  name: string;
  avatarUrl: string;
  color: string; // Hex code for border/accent
  order: number;
  bio?: string; // Short bio
  category: 'Management' | 'Staff' | 'Developer' | 'Head of Administration'; // Strict scaffolding
  discord?: string; // Discord username
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Rule {
  id: string;
  category: string;
  content: string;
}

export type AuthState = {
  user: any | null; // Using any for Firebase user to avoid strict type deps in this file
  isAdmin: boolean;
  loading: boolean;
};

export interface HeroSettings {
  videoUrl: string;
  videoTitle: string;
  isVisible: boolean;
}

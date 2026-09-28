export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          headline: string | null;
          bio: string | null;
          profile_image: string | null;
          location: string | null;
          email: string | null;
          phone: string | null;
          resume_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          headline?: string | null;
          bio?: string | null;
          profile_image?: string | null;
          location?: string | null;
          email?: string | null;
          phone?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          headline?: string | null;
          bio?: string | null;
          profile_image?: string | null;
          location?: string | null;
          email?: string | null;
          phone?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category: 'frontend' | 'backend' | 'database' | 'tools';
          icon: string | null;
          display_order: number;
          visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'frontend' | 'backend' | 'database' | 'tools';
          icon?: string | null;
          display_order?: number;
          visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'frontend' | 'backend' | 'database' | 'tools';
          icon?: string | null;
          display_order?: number;
          visible?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          category: 'web' | 'ai' | 'data' | 'other';
          role: string | null;
          team: string | null;
          features: string[];
          challenges: string | null;
          solutions: string | null;
          results: string | null;
          start_date: string | null;
          end_date: string | null;
          github_url: string | null;
          demo_url: string | null;
          cover_image: string | null;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          category?: 'web' | 'ai' | 'data' | 'other';
          role?: string | null;
          team?: string | null;
          features?: string[];
          challenges?: string | null;
          solutions?: string | null;
          results?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          github_url?: string | null;
          demo_url?: string | null;
          cover_image?: string | null;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          category?: 'web' | 'ai' | 'data' | 'other';
          role?: string | null;
          team?: string | null;
          features?: string[];
          challenges?: string | null;
          solutions?: string | null;
          results?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          github_url?: string | null;
          demo_url?: string | null;
          cover_image?: string | null;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_technologies: {
        Row: {
          id: string;
          project_id: string;
          technology_id: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          technology_id: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          technology_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_technologies_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_technologies_technology_id_fkey';
            columns: ['technology_id'];
            referencedRelation: 'technologies';
            referencedColumns: ['id'];
          },
        ];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          caption: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      experiences: {
        Row: {
          id: string;
          company: string;
          position: string;
          location: string | null;
          employment_type: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          company_logo: string | null;
          current: boolean;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position: string;
          location?: string | null;
          employment_type?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          company_logo?: string | null;
          current?: boolean;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          position?: string;
          location?: string | null;
          employment_type?: string | null;
          start_date?: string;
          end_date?: string | null;
          description?: string | null;
          company_logo?: string | null;
          current?: boolean;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string | null;
          credential_id: string | null;
          credential_url: string | null;
          certificate_image: string | null;
          certificate_file: string | null;
          description: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          issue_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          certificate_image?: string | null;
          certificate_file?: string | null;
          description?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          certificate_image?: string | null;
          certificate_file?: string | null;
          description?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string | null;
          field: string | null;
          start_date: string | null;
          end_date: string | null;
          description: string | null;
          logo: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree?: string | null;
          field?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          logo?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string | null;
          field?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          logo?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          organization: string | null;
          date: string | null;
          description: string | null;
          image: string | null;
          url: string | null;
          display_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization?: string | null;
          date?: string | null;
          description?: string | null;
          image?: string | null;
          url?: string | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization?: string | null;
          date?: string | null;
          description?: string | null;
          image?: string | null;
          url?: string | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string | null;
          display_order: number;
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon?: string | null;
          display_order?: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          icon?: string | null;
          display_order?: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          site_title: string | null;
          site_description: string | null;
          og_image: string | null;
          resume_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_title?: string | null;
          site_description?: string | null;
          og_image?: string | null;
          resume_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_title?: string | null;
          site_description?: string | null;
          og_image?: string | null;
          resume_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

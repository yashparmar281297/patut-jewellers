// Generated from the Supabase schema (public). Regenerate after schema changes.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          diamond_carat: number | null;
          id: string;
          images: string[];
          is_bestseller: boolean;
          is_new: boolean;
          is_published: boolean;
          metal: string;
          name: string;
          purity: string;
          slug: string;
          sort_order: number;
          updated_at: string;
          weight: number;
        };
        Insert: {
          category: string;
          created_at?: string;
          description?: string;
          diamond_carat?: number | null;
          id?: string;
          images?: string[];
          is_bestseller?: boolean;
          is_new?: boolean;
          is_published?: boolean;
          metal: string;
          name: string;
          purity?: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
          weight: number;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          diamond_carat?: number | null;
          id?: string;
          images?: string[];
          is_bestseller?: boolean;
          is_new?: boolean;
          is_published?: boolean;
          metal?: string;
          name?: string;
          purity?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
          weight?: number;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          badge: string;
          created_at: string;
          description: string;
          id: string;
          image: string | null;
          is_active: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
          valid_until: string | null;
        };
        Insert: {
          badge?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
          valid_until?: string | null;
        };
        Update: {
          badge?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
          valid_until?: string | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          created_at: string;
          customer_name: string;
          id: string;
          is_published: boolean;
          location: string;
          message: string;
          photo: string | null;
          rating: number;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          customer_name: string;
          id?: string;
          is_published?: boolean;
          location?: string;
          message: string;
          photo?: string | null;
          rating?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          customer_name?: string;
          id?: string;
          is_published?: boolean;
          location?: string;
          message?: string;
          photo?: string | null;
          rating?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type OfferRow = Database["public"]["Tables"]["offers"]["Row"];
export type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          booking_reference: string | null
          cancelled_at: string | null
          completed_at: string | null
          consultation_mode: Database["public"]["Enums"]["consultation_mode"]
          created_at: string
          duration_minutes: number
          end_time: string
          id: string
          notes: string | null
          patient_profile_id: string
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          therapist_profile_id: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          booking_reference?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          consultation_mode: Database["public"]["Enums"]["consultation_mode"]
          created_at?: string
          duration_minutes: number
          end_time: string
          id?: string
          notes?: string | null
          patient_profile_id: string
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          therapist_profile_id: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          booking_reference?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          consultation_mode?: Database["public"]["Enums"]["consultation_mode"]
          created_at?: string
          duration_minutes?: number
          end_time?: string
          id?: string
          notes?: string | null
          patient_profile_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          therapist_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_profile_id_fkey"
            columns: ["patient_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          deleted_at: string | null
          email: string
          email_verified: boolean
          emergency_contact: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_active: boolean
          phone: string | null
          phone_verified: boolean
          role_id: string
          state: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          email: string
          email_verified?: boolean
          emergency_contact?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_active?: boolean
          phone?: string | null
          phone_verified?: boolean
          role_id: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          email?: string
          email_verified?: boolean
          emergency_contact?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_active?: boolean
          phone?: string | null
          phone_verified?: boolean
          role_id?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string
          comment: string | null
          created_at: string
          id: string
          patient_profile_id: string
          rating: number
          therapist_profile_id: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          comment?: string | null
          created_at?: string
          id?: string
          patient_profile_id: string
          rating: number
          therapist_profile_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          patient_profile_id?: string
          rating?: number
          therapist_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_patient_profile_id_fkey"
            columns: ["patient_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      slot_locks: {
        Row: {
          appointment_date: string
          expires_at: string
          id: string
          locked_at: string
          patient_id: string
          start_time: string
          therapist_profile_id: string
        }
        Insert: {
          appointment_date: string
          expires_at?: string
          id?: string
          locked_at?: string
          patient_id: string
          start_time: string
          therapist_profile_id: string
        }
        Update: {
          appointment_date?: string
          expires_at?: string
          id?: string
          locked_at?: string
          patient_id?: string
          start_time?: string
          therapist_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slot_locks_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      specializations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      therapist_availability: {
        Row: {
          buffer_after_minutes: number
          created_at: string
          end_time: string
          id: string
          is_active: boolean
          slot_duration_minutes: number
          start_time: string
          therapist_profile_id: string
          updated_at: string
          weekday: number
        }
        Insert: {
          buffer_after_minutes?: number
          created_at?: string
          end_time: string
          id?: string
          is_active?: boolean
          slot_duration_minutes?: number
          start_time: string
          therapist_profile_id: string
          updated_at?: string
          weekday: number
        }
        Update: {
          buffer_after_minutes?: number
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean
          slot_duration_minutes?: number
          start_time?: string
          therapist_profile_id?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "therapist_availability_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_blocked_periods: {
        Row: {
          created_at: string
          end_datetime: string
          id: string
          reason: string | null
          start_datetime: string
          therapist_profile_id: string
        }
        Insert: {
          created_at?: string
          end_datetime: string
          id?: string
          reason?: string | null
          start_datetime: string
          therapist_profile_id: string
        }
        Update: {
          created_at?: string
          end_datetime?: string
          id?: string
          reason?: string | null
          start_datetime?: string
          therapist_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_blocked_periods_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_languages: {
        Row: {
          language_id: string
          therapist_profile_id: string
        }
        Insert: {
          language_id: string
          therapist_profile_id: string
        }
        Update: {
          language_id?: string
          therapist_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapist_languages_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_profiles: {
        Row: {
          average_rating: number | null
          biography: string | null
          consultation_fee: number
          consultation_mode:
            | Database["public"]["Enums"]["consultation_mode"]
            | null
          created_at: string
          id: string
          is_featured: boolean | null
          license_number: string | null
          professional_title: string | null
          profile_id: string
          total_reviews: number | null
          total_sessions: number | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          biography?: string | null
          consultation_fee: number
          consultation_mode?:
            | Database["public"]["Enums"]["consultation_mode"]
            | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          license_number?: string | null
          professional_title?: string | null
          profile_id: string
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          biography?: string | null
          consultation_fee?: number
          consultation_mode?:
            | Database["public"]["Enums"]["consultation_mode"]
            | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          license_number?: string | null
          professional_title?: string | null
          profile_id?: string
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_specializations: {
        Row: {
          specialization_id: string
          therapist_profile_id: string
        }
        Insert: {
          specialization_id: string
          therapist_profile_id: string
        }
        Update: {
          specialization_id?: string
          therapist_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_specializations_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specializations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapist_specializations_therapist_profile_id_fkey"
            columns: ["therapist_profile_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "patient" | "therapist" | "admin"
      appointment_status:
        | "payment_pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "rescheduled"
        | "no_show"
        | "refunded"
      consultation_mode: "online" | "offline" | "both"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      verification_status:
        | "draft"
        | "submitted"
        | "pending"
        | "approved"
        | "rejected"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["patient", "therapist", "admin"],
      appointment_status: [
        "payment_pending",
        "confirmed",
        "cancelled",
        "completed",
        "rescheduled",
        "no_show",
        "refunded",
      ],
      consultation_mode: ["online", "offline", "both"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      verification_status: [
        "draft",
        "submitted",
        "pending",
        "approved",
        "rejected",
        "expired",
      ],
    },
  },
} as const

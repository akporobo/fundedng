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
  public: {
    Tables: {
      account_snapshots: {
        Row: {
          balance: number
          drawdown_percent: number
          equity: number
          id: string
          profit: number
          snapshot_time: string
          trader_account_id: string
        }
        Insert: {
          balance: number
          drawdown_percent?: number
          equity: number
          id?: string
          profit?: number
          snapshot_time?: string
          trader_account_id: string
        }
        Update: {
          balance?: number
          drawdown_percent?: number
          equity?: number
          id?: string
          profit?: number
          snapshot_time?: string
          trader_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_snapshots_trader_account_id_fkey"
            columns: ["trader_account_id"]
            isOneToOne: false
            referencedRelation: "trader_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          account_size: number
          certificate_number: string
          challenge_name: string
          created_at: string
          full_name: string
          id: string
          issued_at: string
          kind: Database["public"]["Enums"]["certificate_kind"]
          mt5_login: string
          payout_amount: number | null
          payout_id: string | null
          trader_account_id: string
          user_id: string
        }
        Insert: {
          account_size: number
          certificate_number: string
          challenge_name: string
          created_at?: string
          full_name: string
          id?: string
          issued_at?: string
          kind: Database["public"]["Enums"]["certificate_kind"]
          mt5_login: string
          payout_amount?: number | null
          payout_id?: string | null
          trader_account_id: string
          user_id: string
        }
        Update: {
          account_size?: number
          certificate_number?: string
          challenge_name?: string
          created_at?: string
          full_name?: string
          id?: string
          issued_at?: string
          kind?: Database["public"]["Enums"]["certificate_kind"]
          mt5_login?: string
          payout_amount?: number | null
          payout_id?: string | null
          trader_account_id?: string
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          account_size: number
          created_at: string
          id: string
          is_active: boolean
          max_drawdown_percent: number
          min_trading_days: number
          name: string
          phases: number
          price_naira: number
          profit_target_percent: number
        }
        Insert: {
          account_size: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_drawdown_percent?: number
          min_trading_days?: number
          name: string
          phases?: number
          price_naira: number
          profit_target_percent?: number
        }
        Update: {
          account_size?: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_drawdown_percent?: number
          min_trading_days?: number
          name?: string
          phases?: number
          price_naira?: number
          profit_target_percent?: number
        }
        Relationships: []
      }
      community_groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reads: {
        Row: {
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          edited_at: string | null
          group_id: string
          id: string
          image_url: string | null
          reply_to_id: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          edited_at?: string | null
          group_id: string
          id?: string
          image_url?: string | null
          reply_to_id?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          edited_at?: string | null
          group_id?: string
          id?: string
          image_url?: string | null
          reply_to_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_paid: number
          challenge_id: string
          created_at: string
          id: string
          paystack_reference: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid: number
          challenge_id: string
          created_at?: string
          id?: string
          paystack_reference?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          challenge_id?: string
          created_at?: string
          id?: string
          paystack_reference?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          admin_note: string | null
          amount_naira: number
          bank_details: Json | null
          created_at: string
          id: string
          payment_method: Database["public"]["Enums"]["payout_method"]
          processed_at: string | null
          profit_percent: number | null
          status: Database["public"]["Enums"]["payout_status"]
          trader_account_id: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          admin_note?: string | null
          amount_naira: number
          bank_details?: Json | null
          created_at?: string
          id?: string
          payment_method: Database["public"]["Enums"]["payout_method"]
          processed_at?: string | null
          profit_percent?: number | null
          status?: Database["public"]["Enums"]["payout_status"]
          trader_account_id: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          admin_note?: string | null
          amount_naira?: number
          bank_details?: Json | null
          created_at?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payout_method"]
          processed_at?: string | null
          profit_percent?: number | null
          status?: Database["public"]["Enums"]["payout_status"]
          trader_account_id?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_trader_account_id_fkey"
            columns: ["trader_account_id"]
            isOneToOne: false
            referencedRelation: "trader_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          created_at: string
          full_name: string
          id: string
          kyc_verified: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          full_name?: string
          id: string
          kyc_verified?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          full_name?: string
          id?: string
          kyc_verified?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trader_accounts: {
        Row: {
          breach_reason: string | null
          challenge_id: string
          created_at: string
          current_equity: number | null
          current_phase: number
          funded_at: string | null
          id: string
          mt5_login: string
          mt5_password: string
          mt5_server: string
          order_id: string
          phase1_passed_at: string | null
          phase2_passed_at: string | null
          starting_balance: number
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          breach_reason?: string | null
          challenge_id: string
          created_at?: string
          current_equity?: number | null
          current_phase?: number
          funded_at?: string | null
          id?: string
          mt5_login: string
          mt5_password: string
          mt5_server?: string
          order_id: string
          phase1_passed_at?: string | null
          phase2_passed_at?: string | null
          starting_balance: number
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          breach_reason?: string | null
          challenge_id?: string
          created_at?: string
          current_equity?: number | null
          current_phase?: number
          funded_at?: string | null
          id?: string
          mt5_login?: string
          mt5_password?: string
          mt5_server?: string
          order_id?: string
          phase1_passed_at?: string | null
          phase2_passed_at?: string | null
          starting_balance?: number
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trader_accounts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trader_accounts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_status: {
        Row: {
          group_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "typing_status_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin_if_unclaimed: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      seed_demo_data: { Args: never; Returns: Json }
    }
    Enums: {
      account_status: "active" | "breached" | "passed" | "funded"
      app_role: "admin" | "trader"
      certificate_kind: "funded" | "payout"
      order_status:
        | "pending"
        | "paid"
        | "delivered"
        | "manual_pending"
        | "failed"
      payout_method: "usdt" | "bank_transfer"
      payout_status: "pending" | "approved" | "paid" | "rejected"
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
  public: {
    Enums: {
      account_status: ["active", "breached", "passed", "funded"],
      app_role: ["admin", "trader"],
      certificate_kind: ["funded", "payout"],
      order_status: [
        "pending",
        "paid",
        "delivered",
        "manual_pending",
        "failed",
      ],
      payout_method: ["usdt", "bank_transfer"],
      payout_status: ["pending", "approved", "paid", "rejected"],
    },
  },
} as const

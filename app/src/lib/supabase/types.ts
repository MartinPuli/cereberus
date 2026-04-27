export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      asset_runs: {
        Row: { asset_id: string; run_id: string }
        Insert: { asset_id: string; run_id: string }
        Update: { asset_id?: string; run_id?: string }
        Relationships: [
          { foreignKeyName: "asset_runs_asset_id_fkey"; columns: ["asset_id"]; isOneToOne: false; referencedRelation: "assets"; referencedColumns: ["id"] },
          { foreignKeyName: "asset_runs_run_id_fkey"; columns: ["run_id"]; isOneToOne: false; referencedRelation: "runs"; referencedColumns: ["id"] },
        ]
      }
      assets: {
        Row: { category: string | null; id: string; mime_type: string | null; name: string; size: number | null; tags: string[] | null; uploaded_at: string; url: string; user_id: string }
        Insert: { category?: string | null; id?: string; mime_type?: string | null; name: string; size?: number | null; tags?: string[] | null; uploaded_at?: string; url: string; user_id: string }
        Update: { category?: string | null; id?: string; mime_type?: string | null; name?: string; size?: number | null; tags?: string[] | null; uploaded_at?: string; url?: string; user_id?: string }
        Relationships: []
      }
      custom_agents: {
        Row: { created_at: string; default_tier: string | null; description: string | null; github_url: string | null; handle: string | null; id: string; metrics: Json | null; name: string; owner_id: string; quality: number | null; skills: string[] | null }
        Insert: { created_at?: string; default_tier?: string | null; description?: string | null; github_url?: string | null; handle?: string | null; id?: string; metrics?: Json | null; name: string; owner_id: string; quality?: number | null; skills?: string[] | null }
        Update: { created_at?: string; default_tier?: string | null; description?: string | null; github_url?: string | null; handle?: string | null; id?: string; metrics?: Json | null; name?: string; owner_id?: string; quality?: number | null; skills?: string[] | null }
        Relationships: []
      }
      custom_teams: {
        Row: { created_at: string; description: string | null; id: string; lead_agent_id: string | null; member_ids: string[] | null; name: string; owner_id: string; slug: string; tagline: string | null; vertical: string | null }
        Insert: { created_at?: string; description?: string | null; id?: string; lead_agent_id?: string | null; member_ids?: string[] | null; name: string; owner_id: string; slug: string; tagline?: string | null; vertical?: string | null }
        Update: { created_at?: string; description?: string | null; id?: string; lead_agent_id?: string | null; member_ids?: string[] | null; name?: string; owner_id?: string; slug?: string; tagline?: string | null; vertical?: string | null }
        Relationships: []
      }
      profiles: {
        Row: { avatar_url: string | null; created_at: string; display_name: string | null; github_username: string | null; id: string; updated_at: string; wallet_address: string | null }
        Insert: { avatar_url?: string | null; created_at?: string; display_name?: string | null; github_username?: string | null; id: string; updated_at?: string; wallet_address?: string | null }
        Update: { avatar_url?: string | null; created_at?: string; display_name?: string | null; github_username?: string | null; id?: string; updated_at?: string; wallet_address?: string | null }
        Relationships: []
      }
      runs: {
        Row: { created_at: string; goal: string; id: string; saved_pct: number | null; status: string; team_id: string | null; total_actual_eth: number | null; total_naive_eth: number | null; user_id: string | null }
        Insert: { created_at?: string; goal: string; id?: string; saved_pct?: number | null; status: string; team_id?: string | null; total_actual_eth?: number | null; total_naive_eth?: number | null; user_id?: string | null }
        Update: { created_at?: string; goal?: string; id?: string; saved_pct?: number | null; status?: string; team_id?: string | null; total_actual_eth?: number | null; total_naive_eth?: number | null; user_id?: string | null }
        Relationships: []
      }
      subtasks: {
        Row: { actual_tokens: number | null; agent_id: string | null; classification: Json | null; cost_eth: number | null; created_at: string; description: string; id: string; model: string; output: Json | null; run_id: string; status: string; tier: string }
        Insert: { actual_tokens?: number | null; agent_id?: string | null; classification?: Json | null; cost_eth?: number | null; created_at?: string; description: string; id?: string; model: string; output?: Json | null; run_id: string; status: string; tier: string }
        Update: { actual_tokens?: number | null; agent_id?: string | null; classification?: Json | null; cost_eth?: number | null; created_at?: string; description?: string; id?: string; model?: string; output?: Json | null; run_id?: string; status?: string; tier?: string }
        Relationships: [
          { foreignKeyName: "subtasks_run_id_fkey"; columns: ["run_id"]; isOneToOne: false; referencedRelation: "runs"; referencedColumns: ["id"] },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: { Enums: {} },
} as const

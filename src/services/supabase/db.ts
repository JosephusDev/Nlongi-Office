export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Aluno: {
        Row: {
          createdat: string
          deletedat: string | null
          email: string
          id: string
          nome: string
          turmaid: string
          updatedat: string
        }
        Insert: {
          createdat?: string
          deletedat?: string | null
          email: string
          id: string
          nome: string
          turmaid: string
          updatedat?: string
        }
        Update: {
          createdat?: string
          deletedat?: string | null
          email?: string
          id?: string
          nome?: string
          turmaid?: string
          updatedat?: string
        }
        Relationships: [
          {
            foreignKeyName: "Aluno_turmaid_fkey"
            columns: ["turmaid"]
            isOneToOne: false
            referencedRelation: "Turma"
            referencedColumns: ["id"]
          },
        ]
      }
      Disciplina: {
        Row: {
          createdat: string
          deletedat: string | null
          email: string
          id: string
          nome: string
          updatedat: string
        }
        Insert: {
          createdat?: string
          deletedat?: string | null
          email: string
          id: string
          nome: string
          updatedat?: string
        }
        Update: {
          createdat?: string
          deletedat?: string | null
          email?: string
          id?: string
          nome?: string
          updatedat?: string
        }
        Relationships: []
      }
      Nota: {
        Row: {
          alunoid: string
          createdat: string
          deletedat: string | null
          disciplinaid: string
          email: string
          id: number
          periodo: string
          tipo: string
          updatedat: string
          valor: number
        }
        Insert: {
          alunoid: string
          createdat?: string
          deletedat?: string | null
          disciplinaid: string
          email: string
          id?: number
          periodo: string
          tipo: string
          updatedat?: string
          valor: number
        }
        Update: {
          alunoid?: string
          createdat?: string
          deletedat?: string | null
          disciplinaid?: string
          email?: string
          id?: number
          periodo?: string
          tipo?: string
          updatedat?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "Nota_alunoid_fkey"
            columns: ["alunoid"]
            isOneToOne: false
            referencedRelation: "Aluno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Nota_disciplinaid_fkey"
            columns: ["disciplinaid"]
            isOneToOne: false
            referencedRelation: "Disciplina"
            referencedColumns: ["id"]
          },
        ]
      }
      Turma: {
        Row: {
          createdat: string
          deletedat: string | null
          email: string
          id: string
          nome: string
          updatedat: string
        }
        Insert: {
          createdat?: string
          deletedat?: string | null
          email: string
          id: string
          nome: string
          updatedat?: string
        }
        Update: {
          createdat?: string
          deletedat?: string | null
          email?: string
          id?: string
          nome?: string
          updatedat?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

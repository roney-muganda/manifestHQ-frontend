// src/types/index.ts

export type MilestoneStage = 1 | 2 | 3 | 4 | 5;

export type ShipmentStatus = 'active' | 'completed' | 'cancelled';

export type DemurrageStatus = 'not_started' | 'ok' | 'warning' | 'critical';

export type PortOfEntry = 'mombasa' | 'jkia' | 'other';

export type AgentRole = 'owner' | 'staff' | 'viewer';

export type PlanTier = 'starter' | 'professional' | 'business';

export interface Agent {
  id: string;
  business_name: string;
  plan_tier: PlanTier;
  is_verified: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string; // Aligned with our AuthStore
  role: AgentRole;
  agent?: Agent;
}

export interface Demurrage {
  status: DemurrageStatus;
  free_ends_at: string | null;
  days_in_demurrage: number;
  total_cost_kes: number;
  daily_rate_kes: number;
  hours_until_free_ends?: number;
}

export interface Milestone {
  stage: MilestoneStage;
  notes: string | null;
  duty_amount_kes: number | null; // Changed to number for frontend math
  document_url: string | null;
  created_at: string;
}

export interface MerchantAllocation {
  id: string;
  phone: string;
  name: string | null;
  allocation_description: string | null;
  declared_value_usd: number | null; // Changed to number for frontend math
}

export interface Shipment {
  id: string;
  reference_no: string;
  port_of_entry: PortOfEntry;
  product_category: string;
  current_milestone: number; // Enforced as number for the MilestoneTracker math
  status: ShipmentStatus;
  is_lcl: boolean;
  estimated_arrival: string | null;
  cargo_discharged_at: string | null;
  free_period_days: number;
  daily_demurrage_rate: number; // Enforced as number for DemurrageTimer math
  demurrage?: Demurrage;
  demurrage_status?: DemurrageStatus;
  merchant_count: number;
  merchants?: MerchantAllocation[];
  milestones: Milestone[];
  created_at: string;
  updated_at: string;
}

export interface SMSLogEntry {
  id: string;
  event_type: string;
  message_body: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  recipient_phone: string;
  created_at: string;
}

export interface DashboardStats {
  active: number;
  in_demurrage: number;
  completed_month: number;
  sms_sent_month: number;
}

export interface DashboardData {
  stats: DashboardStats;
  shipments: Shipment[];
}

export interface CalculatorResult {
  cif_usd: number;
  exchange_rate_used: number;
  cif_value_kes: number;
  import_duty_rate_pct: number;
  import_duty_kes: number;
  excise_duty_rate_pct: number;
  excise_duty_kes: number;
  idf_levy_kes: number;
  rdl_levy_kes: number;
  vat_kes: number;
  kpa_handling_estimate_kes: number;
  total_landed_cost_kes: number;
  effective_total_rate_pct: number;
  disclaimer: string;
}
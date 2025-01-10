export type Role = 'worker' | 'business-owner' | 'farmer' | 'banker' | 'government';

export interface RoleConfig {
  title: string;
  monthlyIncome: number;
  startingMoney: number;
  description: string;
  energyDrain: number; // Amount of energy lost per month
}

export interface Resource {
  id: string;
  name: string;
  basePrice: number;
  isRequired: boolean;
  category: 'food' | 'housing' | 'utilities' | 'goods';
  energyBoost?: number; // Amount of energy gained when purchased
}

export interface InflationEvent {
  title: string;
  description: string;
  effects: {
    category?: string;
    multiplier: number;
  }[];
}

export interface MonthlyRecord {
  month: number;
  costs: number;
  income: number;
}
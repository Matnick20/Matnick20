import { RoleConfig, Resource, InflationEvent } from '../types';

export const ROLES: Record<string, RoleConfig> = {
  worker: {
    title: 'Factory Worker',
    monthlyIncome: 3000,
    startingMoney: 5000,
    description: 'A steady job with fixed income, but vulnerable to rising costs.',
    energyDrain: 100
  },
  'business-owner': {
    title: 'Small Business Owner',
    monthlyIncome: 5000,
    startingMoney: 15000,
    description: 'Higher potential income but also higher risks and expenses.',
    energyDrain: 150
  },
  farmer: {
    title: 'Farmer',
    monthlyIncome: 4000,
    startingMoney: 10000,
    description: 'Can produce food but dependent on weather and market prices.',
    energyDrain: 120
  },
  banker: {
    title: 'Banker',
    monthlyIncome: 7000,
    startingMoney: 20000,
    description: 'Benefits from high interest rates but faces market risks.',
    energyDrain: 80
  },
  government: {
    title: 'Government Official',
    monthlyIncome: 6000,
    startingMoney: 12000,
    description: 'Stable income but responsible for economic policies.',
    energyDrain: 90
  }
};

export const RESOURCES: Resource[] = [
  { id: 'bread', name: 'Bread', basePrice: 10, isRequired: true, category: 'food' },
  { id: 'milk', name: 'Milk', basePrice: 8, isRequired: true, category: 'food' },
  { id: 'rent', name: 'Rent', basePrice: 1000, isRequired: true, category: 'housing' },
  { id: 'electricity', name: 'Electricity', basePrice: 150, isRequired: true, category: 'utilities' },
  { id: 'water', name: 'Water', basePrice: 80, isRequired: true, category: 'utilities' },
  { id: 'clothing', name: 'Clothing', basePrice: 200, isRequired: false, category: 'goods', energyBoost: 150 },
  { id: 'entertainment', name: 'Entertainment', basePrice: 100, isRequired: false, category: 'goods', energyBoost: 200 }
];

export const INFLATION_EVENTS: InflationEvent[] = [
  {
    title: 'Oil Crisis',
    description: 'Global oil prices surge, affecting transportation and production costs.',
    effects: [
      { multiplier: 1.2 } // 20% increase across all categories
    ]
  },
  {
    title: 'Supply Chain Disruption',
    description: 'Major supply chain issues cause shortages and price increases.',
    effects: [
      { category: 'food', multiplier: 1.3 },
      { category: 'goods', multiplier: 1.25 }
    ]
  },
  {
    title: 'Housing Bubble',
    description: 'Real estate prices soar due to speculation.',
    effects: [
      { category: 'housing', multiplier: 1.4 }
    ]
  },
  {
    title: 'Utility Cost Spike',
    description: 'Energy costs increase due to infrastructure problems.',
    effects: [
      { category: 'utilities', multiplier: 1.35 }
    ]
  }
];
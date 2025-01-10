import React from 'react';
import { Role, RoleConfig } from '../types';
import { ROLES } from '../data/gameConfig';
import { Briefcase, Store, Wheat, Building2, LandmarkIcon } from 'lucide-react';

const roleIcons = {
  worker: Briefcase,
  'business-owner': Store,
  farmer: Wheat,
  banker: Building2,
  government: LandmarkIcon,
};

interface RoleSelectionProps {
  onSelectRole: (role: Role) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Role</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(ROLES).map(([key, role]) => {
          const Icon = roleIcons[key as Role];
          return (
            <button
              key={key}
              onClick={() => onSelectRole(key as Role)}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-semibold">{role.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{role.description}</p>
              <div className="space-y-2 text-sm">
                <p>Starting Money: ${role.startingMoney.toLocaleString()}</p>
                <p>Monthly Income: ${role.monthlyIncome.toLocaleString()}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
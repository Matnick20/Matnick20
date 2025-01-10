import React, { useState, useEffect } from 'react';
import { Role, Resource, InflationEvent, MonthlyRecord } from '../types';
import { ROLES, RESOURCES, INFLATION_EVENTS } from '../data/gameConfig';
import { Calendar, DollarSign, ShoppingCart, AlertTriangle, TrendingUp, Battery, History, ToggleLeft } from 'lucide-react';

interface GameBoardProps {
  role: Role;
}

interface PriceWithChange extends Resource {
  previousPrice?: number;
  percentageChange?: number;
}

const PriceDisplay = ({ resource }: { resource: PriceWithChange }) => {
  const hasChanged = resource.percentageChange && resource.percentageChange > 0;
  
  return (
    <div className="flex justify-between items-center p-3 rounded-lg transition-colors duration-300" style={{
      backgroundColor: hasChanged ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
    }}>
      <div className="flex items-center gap-2">
        <span>{resource.name}</span>
        {hasChanged && (
          <TrendingUp className="w-4 h-4 text-red-500" />
        )}
        {resource.energyBoost && (
          <span className="text-xs text-blue-600">+{resource.energyBoost} energy</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {hasChanged && (
          <span className="text-sm text-red-500">
            +{resource.percentageChange}%
          </span>
        )}
        <span className={`font-semibold ${hasChanged ? 'text-red-600' : ''}`}>
          ${resource.basePrice}
        </span>
      </div>
    </div>
  );
};

export function GameBoard({ role }: GameBoardProps) {
  const [month, setMonth] = useState(1);
  const [money, setMoney] = useState(ROLES[role].startingMoney);
  const [prices, setPrices] = useState<PriceWithChange[]>(RESOURCES);
  const [currentEvent, setCurrentEvent] = useState<InflationEvent | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [energy, setEnergy] = useState(1000);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);
  const [optionalsEnabled, setOptionalsEnabled] = useState(true);

  const drawInflationEvent = () => {
    const event = INFLATION_EVENTS[Math.floor(Math.random() * INFLATION_EVENTS.length)];
    setCurrentEvent(event);
    
    setPrices(currentPrices => 
      currentPrices.map(resource => {
        const effect = event.effects.find(e => !e.category || e.category === resource.category);
        const previousPrice = resource.basePrice;
        const newPrice = effect ? Math.round(resource.basePrice * effect.multiplier) : resource.basePrice;
        const percentageChange = effect ? Math.round((effect.multiplier - 1) * 100) : 0;
        
        return {
          ...resource,
          basePrice: newPrice,
          previousPrice,
          percentageChange
        };
      })
    );
  };

  const nextMonth = () => {
    const requiredExpenses = prices
      .filter(r => r.isRequired)
      .reduce((sum, r) => sum + r.basePrice, 0);

    if (money < requiredExpenses) {
      setGameOverReason("You can no longer afford basic necessities!");
      setGameOver(true);
      return;
    }

    // Deduct energy
    const newEnergy = energy - ROLES[role].energyDrain;
    if (newEnergy <= 0) {
      setGameOverReason("Your energy has been depleted!");
      setGameOver(true);
      return;
    }

    setEnergy(newEnergy);
    setMoney(current => current - requiredExpenses + ROLES[role].monthlyIncome);
    setMonth(m => m + 1);
    setMonthlyRecords(records => [...records, {
      month,
      costs: requiredExpenses,
      income: ROLES[role].monthlyIncome
    }]);
    drawInflationEvent();
  };

  const handleOptionalPurchase = (resource: Resource) => {
    if (!optionalsEnabled || money < resource.basePrice) return;

    setMoney(current => current - resource.basePrice);
    if (resource.energyBoost) {
      setEnergy(current => Math.min(1000, current + resource.energyBoost));
    }
  };

  useEffect(() => {
    drawInflationEvent();
  }, []);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-red-700 mb-4">Game Over</h2>
        <p className="text-xl text-gray-700 mb-8">{gameOverReason}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6" />
          <span className="text-xl">Month {month}</span>
        </div>
        <div className="flex items-center gap-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <span className="text-xl">${money.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-4">
          <Battery className="w-6 h-6 text-blue-600" />
          <div className="flex-1 bg-gray-200 rounded-full h-6">
            <div 
              className="bg-blue-600 rounded-full h-6 transition-all duration-500"
              style={{ width: `${(energy / 1000) * 100}%` }}
            >
              <span className="px-2 text-white text-sm">{energy}</span>
            </div>
          </div>
        </div>
      </div>

      {currentEvent && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2">{currentEvent.title}</h3>
          <p className="text-gray-700">{currentEvent.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Required Expenses
          </h3>
          <div className="space-y-2">
            {prices.filter(r => r.isRequired).map(resource => (
              <PriceDisplay key={resource.id} resource={resource} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Optional Expenses</h3>
            <button 
              onClick={() => setOptionalsEnabled(!optionalsEnabled)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <ToggleLeft className={`w-6 h-6 ${optionalsEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
              {optionalsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          {optionalsEnabled && (
            <>
              <p className="text-sm text-gray-600 mb-4">Click items to purchase and gain energy</p>
              <div className="space-y-2">
                {prices.filter(r => !r.isRequired).map(resource => (
                  <div key={resource.id} onClick={() => handleOptionalPurchase(resource)} className="cursor-pointer">
                    <PriceDisplay resource={resource} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <History className="w-5 h-5" />
            Monthly History
          </h3>
          <button
            onClick={nextMonth}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Month
          </button>
        </div>
        <div className="space-y-2">
          {[...monthlyRecords].reverse().map((record) => (
            <div key={record.month} className="flex justify-between items-center p-2 border-b">
              <span>Month {record.month}</span>
              <div className="flex gap-4">
                <span className="text-green-600">Income: ${record.income}</span>
                <span className="text-red-600">Costs: ${record.costs}</span>
                <span className={record.income - record.costs >= 0 ? 'text-green-600' : 'text-red-600'}>
                  Net: ${record.income - record.costs}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
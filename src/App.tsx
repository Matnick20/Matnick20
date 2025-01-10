import React, { useState } from 'react';
import { Role } from './types';
import { RoleSelection } from './components/RoleSelection';
import { GameBoard } from './components/GameBoard';

function App() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm py-8 mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">Inflation Chaos</h1>
          <p className="text-center text-gray-600 mt-2">Experience the impact of inflation on society</p>
        </header>
        <RoleSelection onSelectRole={setSelectedRole} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameBoard role={selectedRole} />
    </div>
  );
}

export default App;
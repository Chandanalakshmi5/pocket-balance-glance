
import React from 'react';
import { CircleDollarSign } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground w-full py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CircleDollarSign className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Finance Tracker</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

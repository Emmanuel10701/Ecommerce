import React from 'react';

interface CardProps {
  title: string;
  content: string;
  bgColor: string;  // Background color
  icon: React.ReactNode; // Icon to be displayed in the card
}

const Datacard: React.FC<CardProps> = ({ title, content, bgColor, icon }) => {
  // Apply background color directly
  const bgColorClass = `bg-${bgColor}`;

  return (
    <div className={`text-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-start justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out w-full sm:w-[200px] lg:w-[220px] h-[180px] sm:h-[200px] lg:h-[220px] ${bgColorClass} mb-4 sm:mb-5 lg:mb-6`}>
      <header className="flex items-center mb-2">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </header>
      <main className="text-sm flex-1">
        <p>{content}</p>
      </main>
      <footer className="w-full text-start mt-2">
        <button className="text-slate-100 text-md font-bold">$50,000</button>
      </footer>
    </div>
  );
};

export default Datacard;

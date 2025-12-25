import React from 'react';

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

const PlaceholderPage: React.FC<Props> = ({ title, description, actions, children }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="card p-4">
        {children ?? <p className="text-gray-600 text-sm">This screen is scaffolded and ready for API wiring.</p>}
      </div>
    </div>
  );
};

export default PlaceholderPage;


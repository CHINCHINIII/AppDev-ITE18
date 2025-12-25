import React from 'react';
import MessagingModal from '../components/MessagingModal';

const MessagesPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <p className="text-sm text-gray-600">Messaging UI scaffolded. Hook to backend when endpoints are available.</p>
      <MessagingModal open onClose={() => {}} />
    </div>
  );
};

export default MessagesPage;


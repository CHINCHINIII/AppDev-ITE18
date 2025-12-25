import React from 'react';
import VoucherCard from '../components/VoucherCard';

const VouchersPage: React.FC = () => {
  const mock = [
    { id: '1', title: '₱100 off', description: 'Min spend ₱500', code: 'SAVE100' },
    { id: '2', title: 'Free Shipping', description: 'On campus deliveries', code: 'SHIPFREE' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
      <h1 className="text-2xl font-semibold">Vouchers & Deals</h1>
      <div className="space-y-3">
        {mock.map((v) => (
          <VoucherCard key={v.id} title={v.title} description={v.description} code={v.code} onCollect={() => {}} />
        ))}
        {!mock.length && <div className="text-sm text-gray-500">No vouchers right now.</div>}
      </div>
      <div className="text-xs text-gray-500">
        Vouchers are mocked until backend endpoints are provided.
      </div>
    </div>
  );
};

export default VouchersPage;


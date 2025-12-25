import React from 'react';

type Props = {
  title: string;
  description: string;
  code?: string;
  onCollect?: () => void;
  collected?: boolean;
};

const VoucherCard: React.FC<Props> = ({ title, description, code, onCollect, collected }) => {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold text-ink">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
        {code && <div className="mt-1 text-xs text-primary">Code: {code}</div>}
      </div>
      <button className="btn-primary" onClick={onCollect} disabled={collected}>
        {collected ? 'Collected' : 'Collect'}
      </button>
    </div>
  );
};

export default VoucherCard;


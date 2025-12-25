import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

type Step = {
  label: string;
  done: boolean;
  timestamp?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  steps: Step[];
  trackingNumber?: string;
  courier?: string;
  eta?: string;
};

const OrderTrackingModal: React.FC<Props> = ({ open, onClose, steps, trackingNumber, courier, eta }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center px-4">
      <div className="card w-full max-w-xl p-6 relative">
        <button className="absolute right-3 top-3 text-gray-400 hover:text-primary" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">Track Order</h3>
        <div className="text-sm text-gray-600 mb-3">
          Tracking #: {trackingNumber ?? 'TBD'} {courier ? `• ${courier}` : ''}
        </div>
        {eta && <div className="text-sm text-primary mb-4">Estimated delivery: {eta}</div>}
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-start gap-3">
              {step.done ? (
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              )}
              <div>
                <div className="font-medium">{step.label}</div>
                {step.timestamp && <div className="text-xs text-gray-500">{step.timestamp}</div>}
                {idx < steps.length - 1 && <div className="h-4 border-l border-gray-200 ml-2 mt-1" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;


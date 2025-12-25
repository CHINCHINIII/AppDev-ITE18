import React from 'react';
import { Star } from 'lucide-react';

type Props = {
  value: number;
  onChange?: (val: number) => void;
  size?: number;
};

const StarRating: React.FC<Props> = ({ value, onChange, size = 20 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          className="text-amber-500"
          aria-label={`Rate ${i} star`}
        >
          <Star
            style={{ width: size, height: size }}
            fill={i <= value ? '#f59e0b' : 'transparent'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;


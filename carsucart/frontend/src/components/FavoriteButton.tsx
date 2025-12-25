import React from 'react';
import { Heart } from 'lucide-react';

type Props = {
  active: boolean;
  onToggle: () => void;
};

const FavoriteButton: React.FC<Props> = ({ active, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-2 py-2 transition ${active ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
      aria-label="toggle wishlist"
    >
      <Heart className="h-4 w-4" fill={active ? '#fff' : 'transparent'} />
    </button>
  );
};

export default FavoriteButton;


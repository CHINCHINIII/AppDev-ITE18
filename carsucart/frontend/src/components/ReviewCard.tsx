import React from 'react';
import { ThumbsUp } from 'lucide-react';
import StarRating from './StarRating';
import type { Review } from '../types';

type Props = {
  review: Review;
  onHelpful?: (id: string) => void;
};

const ReviewCard: React.FC<Props> = ({ review, onHelpful }) => {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{review.userName}</div>
          <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
        </div>
        <StarRating value={review.rating} />
      </div>
      <p className="mt-3 text-sm text-gray-700">{review.comment}</p>
      <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
        <button type="button" className="inline-flex items-center gap-1 hover:text-primary" onClick={() => onHelpful?.(review.id)}>
          <ThumbsUp className="h-4 w-4" />
          Helpful ({review.helpful ?? 0})
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;


import React, { useState } from 'react';
import StarRating from './StarRating';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { rating: number; comment: string; photos: File[] }) => void;
};

const ReviewModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  if (!open) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const submit = () => {
    onSubmit({ rating, comment, photos });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center px-4">
      <div className="card w-full max-w-lg p-6 relative">
        <button className="absolute right-3 top-3 text-gray-400 hover:text-primary" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">Leave a review</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Rating</div>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Your review</div>
            <textarea
              className="w-full rounded-lg border border-gray-200 p-3"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
            />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Photos (optional)</div>
            <input type="file" accept="image/*" multiple onChange={handleFiles} />
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={submit}>
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;



import { useState } from "react";
import Modal from "./Modal";
import { Star } from "lucide-react";

export default function RatingModal({ open, onClose, onSubmit, booking }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    onSubmit({ rating, comment, bookingId: booking._id });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="rating-modal-title">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h2 id="rating-modal-title" className="text-2xl font-bold text-slate-800 mb-4">
          Rate Your Ride
        </h2>
        <div className="mb-6">
          <p className="text-slate-600">
            How was your ride with {booking?.driver?.name}?
          </p>
          <div className="flex justify-center my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 cursor-pointer ${
                  rating >= star ? "text-yellow-400" : "text-slate-300"
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Add a comment (optional)
          </label>
          <textarea
            id="comment"
            rows="4"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0}
            className="px-6 py-2 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg disabled:bg-yellow-300 disabled:cursor-not-allowed transition"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </Modal>
  );
}

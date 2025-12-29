import { motion } from "framer-motion";
import { Trash2, Calendar, Gift } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function calculateAge(birthdayStr) {
  const birthday = new Date(birthdayStr);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

function calculateDaysUntilBirthday(birthdayStr) {
  const birthday = new Date(birthdayStr);
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  return daysUntil;
}

export default function KidCard({ kid, index, onDelete, onClick }) {
  const [deleting, setDeleting] = useState(false);
  const age = calculateAge(kid.birthday);
  const daysUntil = calculateDaysUntilBirthday(kid.birthday);
  const birthdayMonth = new Date(kid.birthday).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete ${kid.name}?`)) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`${API}/kids/${kid.id}`);
      toast.success(`${kid.name} deleted successfully`);
      onDelete(kid.id);
    } catch (error) {
      toast.error("Failed to delete kid");
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="bg-white border-2 border-black rounded-lg p-4 shadow-hard hover:shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer relative"
      data-testid={`kid-card-${kid.id}`}
    >
      <div className="flex items-center gap-4">
        {/* Compact Photo */}
        <div className="w-16 h-16 rounded-lg border-2 border-black overflow-hidden flex-shrink-0 bg-secondary/20">
          {kid.photo ? (
            <img src={kid.photo} alt={kid.name} className="w-full h-full object-cover" data-testid={`kid-photo-${kid.id}`} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🎈
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate mb-1" data-testid={`kid-name-${kid.id}`}>{kid.name}</h3>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-foreground/70">
              <Calendar size={14} />
              <span data-testid={`kid-birthday-${kid.id}`}>{birthdayMonth}</span>
            </div>
            <span className="px-2 py-0.5 bg-accent text-white rounded-full text-xs font-bold border border-black" data-testid={`kid-age-${kid.id}`}>
              Age {age}
            </span>
            {daysUntil <= 30 && (
              <span className="px-2 py-0.5 bg-warning text-black rounded-full text-xs font-bold border border-black">
                {daysUntil === 0 ? '🎂 Today!' : `${daysUntil}d`}
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 bg-primary text-white rounded-full border-2 border-black shadow-button hover:translate-y-1 hover:shadow-none transition-all flex-shrink-0"
          data-testid={`delete-kid-${kid.id}`}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
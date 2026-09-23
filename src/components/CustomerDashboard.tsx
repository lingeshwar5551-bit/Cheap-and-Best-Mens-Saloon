import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Calendar,
  Trophy,
  Heart,
  MessageSquare,
  LogOut,
  Edit2,
  Check,
  Star,
  Clock,
  Sparkles,
  Scissors,
  Store,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSalonConfig } from '../context/SalonConfigContext';
import {
  getUserBookings,
  getUserGameScores,
  getUserFavorites,
  cancelBooking,
  submitFeedback,
  BookingRecord,
  GameScoreRecord,
  FavoriteRecord
} from '../services/firestore';

interface CustomerDashboardProps {
  onOpenBooking: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onOpenBooking }) => {
  const { user, profile, isDashboardOpen, closeDashboard, logout, updateProfileData } = useAuth();
  const { config, openEditModal } = useSalonConfig();
  const [activeTab, setActiveTab] = useState<'bookings' | 'scores' | 'favorites' | 'feedback'>('bookings');
  
  // Data states
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [gameScores, setGameScores] = useState<GameScoreRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Feedback form states
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || user?.displayName || '');
      setEditPhone(profile.phone || '');
    }
  }, [profile, user]);

  const loadCustomerData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [b, g, f] = await Promise.all([
        getUserBookings(user.uid),
        getUserGameScores(user.uid),
        getUserFavorites(user.uid),
      ]);
      setBookings(b || []);
      setGameScores(g || []);
      setFavorites(f || []);
    } catch (err) {
      console.error('Failed to load customer records:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isDashboardOpen && user) {
      loadCustomerData();
    }
  }, [isDashboardOpen, user]);

  if (!isDashboardOpen || !user) return null;

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfileData({ name: editName, phone: editPhone });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment reservation?')) return;
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setSubmittingFeedback(true);
    try {
      await submitFeedback({
        userId: user.uid,
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        category: 'Customer Experience',
        timestamp: new Date().toISOString(),
      });
      setFeedbackComment('');
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0d1015] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Element */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4ff32]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d4ff32]/20 border border-[#d4ff32]/40 flex items-center justify-center text-lg font-bold text-[#d4ff32] font-mono">
              {(profile?.name || user.displayName || user.email || 'G')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white font-display">
                  {profile?.name || user.displayName || 'Valued Guest'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#d4ff32]/10 text-[#d4ff32] text-[10px] font-mono font-bold uppercase">
                  Verified Member
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openEditModal}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-[#d4ff32]/20 text-slate-300 hover:text-[#d4ff32] text-xs font-mono flex items-center gap-1.5 transition-colors border border-white/10 hover:border-[#d4ff32]/30"
              title="Edit Shop Name & Details"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d4ff32]" />
              <span className="hidden sm:inline">Edit Shop Name</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-mono flex items-center gap-1.5 transition-colors border border-red-500/20"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={closeDashboard}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto bg-black/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'bookings'
                ? 'border-[#d4ff32] text-[#d4ff32] bg-[#d4ff32]/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>MY APPOINTMENTS ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'scores'
                ? 'border-[#d4ff32] text-[#d4ff32] bg-[#d4ff32]/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>BARBER SCORES ({gameScores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'favorites'
                ? 'border-[#d4ff32] text-[#d4ff32] bg-[#d4ff32]/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>FAVOURITES ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'feedback'
                ? 'border-[#d4ff32] text-[#d4ff32] bg-[#d4ff32]/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>GIVE FEEDBACK</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Profile Overview / Edit */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Contact & Notifications</div>
              {isEditing ? (
                <div className="mt-2 flex flex-wrap gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Full Name"
                    className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white"
                  />
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Mobile Number"
                    className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white"
                  />
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="px-3 py-1.5 rounded-lg bg-[#d4ff32] text-black font-bold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Save</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs font-mono mt-1 text-slate-300">
                  Phone: <strong className="text-white">{profile?.phone || 'Not provided'}</strong> · Desk Notifications: Active
                </div>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Upcoming & Past Appointments
                </h3>
                <button
                  onClick={() => { closeDashboard(); onOpenBooking(); }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(212,255,50,0.3)]"
                >
                  <Scissors className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reserve New Chair</span>
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm text-slate-400">You don't have any appointments booked yet.</div>
                  <button
                    onClick={() => { closeDashboard(); onOpenBooking(); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4ff32] text-black font-bold text-xs uppercase"
                  >
                    <span>Book Your First Slot</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((b) => (
                    <div
                      key={b.bookingId}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#d4ff32] font-bold uppercase tracking-wider">
                            {b.bookingId}
                          </span>
                          <h4 className="text-base font-bold text-white">{b.service}</h4>
                          <div className="text-xs text-slate-400">Stylist: {b.stylist || 'Senior Barber'}</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : b.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-[#d4ff32]" />
                          <span>{b.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-[#d4ff32]" />
                          <span>{b.timeSlot}</span>
                        </div>
                      </div>

                      {b.status !== 'cancelled' && (
                        <div className="pt-1 flex justify-end">
                          <button
                            onClick={() => handleCancelBooking(b.bookingId)}
                            className="text-xs font-mono text-red-400 hover:text-red-300 underline"
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GAME SCORES */}
          {activeTab === 'scores' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Barber Game Simulator Records
                  </h3>
                  <p className="text-xs text-slate-400">Your precision haircut ratings & high scores stored on Firestore.</p>
                </div>
              </div>

              {gameScores.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm text-slate-400">No game scores recorded yet!</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Scroll down to the 3D Barber Simulator on the homepage, trim the mannequin hair, and finish styling to save your score.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gameScores.map((score, idx) => (
                    <div
                      key={score.scoreId || idx}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#d4ff32]/10 border border-[#d4ff32]/30 flex items-center justify-center font-mono font-extrabold text-[#d4ff32]">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-white flex items-center gap-2">
                            <span>Score: {score.score} pts</span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                              {score.haircutQuality}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-slate-400">
                            Completed: {score.completionPercentage}% · Tools: {score.selectedTools?.join(', ') || 'Scissors & Clippers'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        {new Date(score.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Saved Favorite Services
              </h3>

              {favorites.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm text-slate-400">No favorite services saved yet.</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click the heart icon on any haircut or grooming package in the Services section to save it here for fast booking!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((fav) => (
                    <div
                      key={fav.favoriteId}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                          <Heart className="w-4 h-4 fill-pink-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{fav.serviceTitle}</div>
                          <div className="text-[11px] font-mono text-slate-400">Budget Friendly & Premium</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { closeDashboard(); onOpenBooking(); }}
                        className="px-3 py-1.5 rounded-xl bg-[#d4ff32] text-black font-bold text-xs uppercase"
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white font-display uppercase">
                  Rate Your Experience at {config.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Your feedback goes directly to our {config.branch || 'salon'} desk to maintain {config.rating}-star quality.
                </p>
              </div>

              {feedbackSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center">
                  ✨ Thank you! Your feedback has been received and saved.
                </div>
              )}

              <form onSubmit={handleSubmitFeedback} className="space-y-4 bg-white/[0.02] p-5 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= feedbackRating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-mono text-[#d4ff32] font-bold">
                      {feedbackRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Your Review / Comments
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us about your haircut, stylist attention, hygiene, or comfort..."
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4ff32] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-3 rounded-xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(212,255,50,0.3)] disabled:opacity-50"
                >
                  {submittingFeedback ? 'SUBMITTING...' : 'SUBMIT SALON FEEDBACK'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

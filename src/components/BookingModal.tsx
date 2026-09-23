import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle, ArrowRight, Scissors } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingFormState } from '../types';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/firestore';
import { useSalonConfig } from '../context/SalonConfigContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService = 'Haircut'
}) => {
  const { user, profile } = useAuth();
  const { config } = useSalonConfig();
  const [form, setForm] = useState<BookingFormState>({
    fullName: '',
    phone: '',
    service: preselectedService,
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    barberPreference: 'Any Available Master Barber',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || profile?.name || user.displayName || '',
        phone: prev.phone || profile?.phone || '',
      }));
    }
  }, [user, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#d4ff32', '#ffffff', '#22c55e']
    });

    if (user) {
      createBooking({
        userId: user.uid,
        userName: form.fullName || user.displayName || 'Valued Guest',
        userEmail: user.email || '',
        userPhone: form.phone,
        service: form.service,
        stylist: form.barberPreference,
        date: form.date,
        timeSlot: form.time,
        notes: form.notes,
        status: 'confirmed',
      }).catch((err) => console.error('Booking persistence error:', err));
    }
  };

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM',
    '08:30 PM', '09:15 PM'
  ];

  const serviceOptions = [
    'Haircut',
    'Hairstyling',
    'Hair Colouring',
    "Children's Cuts",
    'Hair Highlighting',
    'Hair Straightening',
    'Keratin Treatments',
    'Make-up Services',
    'Shampoo & Conditioning',
    'Shaving'
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-neon border border-[#d4ff32]/30 p-6 sm:p-8 my-8 shadow-2xl bg-[#0d1015]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close booking modal"
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-mono tracking-wider uppercase text-[#d4ff32] font-semibold flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" /> Direct Salon Reservation
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight mt-1">
                RESERVE YOUR CHAIR
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {config.name} — {config.address}. Open daily until 10 PM.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. S. Ramanathan"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#d4ff32] focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 073059 53594"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#d4ff32] focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Select Service *
                </label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141820] border border-white/15 focus:border-[#d4ff32] focus:outline-none text-white text-sm"
                >
                  {serviceOptions.map((s) => (
                    <option key={s} value={s} className="bg-[#141820] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#d4ff32] focus:outline-none text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#141820] border border-white/15 focus:border-[#d4ff32] focus:outline-none text-white text-sm"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t} className="bg-[#141820] text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(212,255,50,0.35)] flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>CONFIRM RESERVATION</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Phone Backup Link */}
              <div className="text-center text-xs text-slate-400 pt-2 font-mono">
                Need urgent assistance? Call{' '}
                <a href="tel:07305953594" className="text-[#d4ff32] hover:underline font-bold">
                  073059 53594
                </a>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#d4ff32]/20 border border-[#d4ff32]/50 text-[#d4ff32] mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(212,255,50,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold font-display text-white uppercase">
              CHAIR RESERVED!
            </h3>

            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Thank you, <strong className="text-white">{form.fullName}</strong>. Your chair for{' '}
              <strong className="text-[#d4ff32]">{form.service}</strong> is reserved on{' '}
              <strong className="text-white">{form.date}</strong> at <strong className="text-white">{form.time}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-left space-y-1.5 max-w-sm mx-auto">
              <div className="text-slate-400">Location: {config.name}</div>
              <div className="text-white font-semibold">{config.address}</div>
              <div className="text-[#d4ff32]">Desk: {config.phone} · Closes 10 PM</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setIsSubmitted(false); onClose(); }}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase"
              >
                DONE
              </button>
              <a
                href={`tel:${config.phoneFormatted}`}
                className="w-full py-3 rounded-xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>CALL DESK</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

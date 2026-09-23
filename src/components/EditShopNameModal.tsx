import React, { useState, useEffect } from 'react';
import { X, Store, Check, RotateCcw, MapPin, Phone, Sparkles } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export const EditShopNameModal: React.FC = () => {
  const { config, updateSalonInfo, resetToDefault, isEditModalOpen, closeEditModal } = useSalonConfig();

  const [name, setName] = useState(config.name);
  const [shortName, setShortName] = useState(config.shortName);
  const [branch, setBranch] = useState(config.branch);
  const [phone, setPhone] = useState(config.phone);
  const [address, setAddress] = useState(config.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(config.name);
    setShortName(config.shortName);
    setBranch(config.branch);
    setPhone(config.phone);
    setAddress(config.address);
  }, [config, isEditModalOpen]);

  if (!isEditModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonInfo({
      name: name.trim() || config.name,
      shortName: shortName.trim() || name.trim().toUpperCase(),
      branch: branch.trim(),
      phone: phone.trim(),
      phoneFormatted: phone.replace(/\s+/g, ''),
      address: address.trim(),
      fullAddress: address.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeEditModal();
    }, 1000);
  };

  const handleReset = () => {
    resetToDefault();
    closeEditModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0d1015] border border-[#d4ff32]/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#d4ff32]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeEditModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4ff32]/10 border border-[#d4ff32]/30 text-[11px] font-mono font-bold text-[#d4ff32] tracking-wider uppercase mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>CUSTOMIZE SALON BRANDING</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
            Update Shop Name & Details
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Change the shop name, branch, contact, or location. Updates appear live across all website sections, navbar, hero, booking forms, and AI concierge.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Shop branding updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Full Shop Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!shortName || shortName === name.toUpperCase()) {
                  setShortName(e.target.value.toUpperCase());
                }
              }}
              placeholder="e.g. Cheap & Best Men's Salon"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4ff32] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Short Brand Wordmark
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. CHEAP & BEST"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff32] transition-colors uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Branch / Area
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Mogappair"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff32] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="073059 53594"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff32] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Address / Street
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="2, VOC Street, Road, Mogappair"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff32] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(212,255,50,0.3)] flex items-center justify-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>SAVE & APPLY LIVE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

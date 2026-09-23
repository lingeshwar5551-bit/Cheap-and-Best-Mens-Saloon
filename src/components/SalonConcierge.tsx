import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  ExternalLink,
  Scissors,
  Phone,
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

interface SalonConciergeProps {
  onOpenBooking: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  action?: 'OPEN_BOOKING' | null;
  usedMaps?: boolean;
  groundingChunks?: any[];
  timestamp: string;
}

export const SalonConcierge: React.FC<SalonConciergeProps> = ({ onOpenBooking }) => {
  const { config } = useSalonConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Vanakkam! ✂️ Welcome to ${config.name}${config.branch ? `, ${config.branch}` : ''}. How can I assist you today? Ask me about our haircut styles, grooming packages, location on VOC Street, or let me know if you'd like to reserve a chair!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Voice Mode states
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceState, setVoiceState] = useState<'IDLE' | 'LISTENING...' | 'PROCESSING...' | 'SPEAKING...'>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live WebSocket references
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Text Submission
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.text || "We're right here to help you style your best look!",
        action: data.action,
        usedMaps: data.usedMaps,
        groundingChunks: data.groundingChunks || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: "AI assistant is temporarily unavailable. You can still explore the salon normally, visit us at 2, VOC Street Road, Mogappair, or call 073059 53594!",
          action: query.toLowerCase().includes('book') ? 'OPEN_BOOKING' : null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick suggestion chips
  const handleSuggestion = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // ----------------- GEMINI LIVE VOICE ENGINE -----------------
  const startVoiceMode = async () => {
    setVoiceError(null);
    setIsVoiceActive(true);
    setVoiceState('LISTENING...');

    // First try Web Speech API / WebSocket combination for responsive feedback
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice recognition is not supported in this browser. You can continue with text!");
      setVoiceState('IDLE');
      setIsVoiceActive(false);
      return;
    }

    try {
      // Explicit microphone permission check
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setVoiceState('LISTENING...');
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setVoiceState('PROCESSING...');
          // Add user message
          setMessages((prev) => [
            ...prev,
            {
              id: `v_u_${Date.now()}`,
              sender: 'user',
              text: transcript,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);

          try {
            const res = await fetch('/api/ai/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: transcript }),
            });
            const data = await res.json();
            const reply = data.text;

            setMessages((prev) => [
              ...prev,
              {
                id: `v_ai_${Date.now()}`,
                sender: 'ai',
                text: reply,
                action: data.action,
                usedMaps: data.usedMaps,
                groundingChunks: data.groundingChunks || [],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);

            setVoiceState('SPEAKING...');

            // Speak response if not muted
            if (!isMuted && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(reply);
              utterance.pitch = 1.0;
              utterance.rate = 1.05;
              utterance.onend = () => {
                setVoiceState('IDLE');
              };
              utterance.onerror = () => {
                setVoiceState('IDLE');
              };
              window.speechSynthesis.speak(utterance);
            } else {
              setVoiceState('IDLE');
            }
          } catch (e) {
            setVoiceState('IDLE');
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech error:', e);
        if (e.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Please grant access in your browser.');
        } else if (e.error !== 'no-speech') {
          setVoiceError("Voice mode couldn't start. You can continue with text.");
        }
        setVoiceState('IDLE');
      };

      recognition.onend = () => {
        if (isVoiceActive && voiceState === 'LISTENING...') {
          setVoiceState('IDLE');
        }
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Microphone error:', err);
      setVoiceError("Microphone access was denied or not available. You can continue with text.");
      setIsVoiceActive(false);
      setVoiceState('IDLE');
    }
  };

  const stopVoiceMode = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (_) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceActive(false);
    setVoiceState('IDLE');
  };

  return (
    <>
      {/* Floating AI Button: Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0d1015]/95 hover:bg-[#141820] text-white border-2 border-[#d4ff32] shadow-[0_0_25px_rgba(212,255,50,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Open AI Salon Concierge"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff32] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4ff32]"></span>
            </span>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-widest text-[#d4ff32] uppercase font-bold leading-none">
                ✦ ASK SALON AI
              </span>
              <span className="text-xs font-extrabold text-white tracking-wide uppercase font-display leading-tight mt-0.5">
                AI Salon Concierge
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#d4ff32]/20 border border-[#d4ff32]/40 flex items-center justify-center text-[#d4ff32] group-hover:rotate-12 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {/* Floating AI Concierge Modal / Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-[#0d1015]/98 border border-[#d4ff32]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden animate-fade-in text-white">
          
          {/* Header */}
          <div className="p-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-[#d4ff32]/20 border border-[#d4ff32]/50 flex items-center justify-center text-[#d4ff32]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0d1015] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold font-display uppercase tracking-wide text-white">
                    {config.shortName} AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#d4ff32]/10 text-[#d4ff32] border border-[#d4ff32]/20">
                    CONCIERGE
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span>{config.branch ? `${config.branch} Flagship` : 'AI Concierge'}</span>
                  <span>•</span>
                  <span className="text-[#d4ff32]">Maps & Voice Ready</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => (isVoiceActive ? stopVoiceMode() : startVoiceMode())}
                className={`p-2 rounded-xl transition-colors border ${
                  isVoiceActive
                    ? 'bg-[#d4ff32] text-black border-[#d4ff32]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title={isVoiceActive ? 'Stop Voice' : 'Talk with Voice'}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stopVoiceMode();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Mode Banner (When Active) */}
          {isVoiceActive && (
            <div className="p-3 bg-[#d4ff32]/10 border-b border-[#d4ff32]/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff32] animate-pulse" />
                <span className="font-mono font-bold text-[#d4ff32] uppercase">
                  {voiceState}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 text-[10px] font-mono flex items-center gap-1"
                >
                  {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-[#d4ff32]" />}
                  <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
                </button>
                <button
                  onClick={stopVoiceMode}
                  className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-mono"
                >
                  END VOICE
                </button>
              </div>
            </div>
          )}

          {/* Voice Error Notice */}
          {voiceError && (
            <div className="p-2.5 bg-red-500/10 border-b border-red-500/20 text-xs text-red-300 px-4">
              {voiceError}
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#d4ff32] text-black font-medium rounded-br-none shadow-[0_0_15px_rgba(212,255,50,0.2)]'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Grounding with Google Maps badge */}
                  {m.usedMaps && (
                    <div className="pt-2 border-t border-white/10 mt-2 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#d4ff32] font-bold uppercase">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>Google Maps Grounded · {config.branch ? `${config.branch}, Chennai` : 'Location'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {config.address}
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${config.name} ${config.branch} ${config.address}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#d4ff32] hover:underline"
                      >
                        <span>Open Directions on Google Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}

                  {/* AI Booking Action Trigger Button */}
                  {m.action === 'OPEN_BOOKING' && (
                    <div className="pt-2">
                      <button
                        onClick={onOpenBooking}
                        className="w-full py-2 px-3 rounded-xl bg-black text-[#d4ff32] hover:bg-slate-900 border border-[#d4ff32]/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>[ OPEN BOOKING ]</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4ff32] p-2 bg-white/5 rounded-2xl w-fit border border-white/10 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking & Checking Salon Desk...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto bg-black/30 scrollbar-none text-[11px]">
            <button
              onClick={() => handleSuggestion('Where is the salon located?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#d4ff32]/20 hover:text-[#d4ff32] border border-white/10 whitespace-nowrap transition-colors"
            >
              📍 Where is the salon?
            </button>
            <button
              onClick={() => handleSuggestion('Book me a haircut appointment')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#d4ff32]/20 hover:text-[#d4ff32] border border-white/10 whitespace-nowrap transition-colors"
            >
              ✂️ Book a haircut
            </button>
            <button
              onClick={() => handleSuggestion('Is the salon open today?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#d4ff32]/20 hover:text-[#d4ff32] border border-white/10 whitespace-nowrap transition-colors"
            >
              🕒 Opening hours?
            </button>
            <button
              onClick={() => handleSuggestion('What grooming services do you offer?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#d4ff32]/20 hover:text-[#d4ff32] border border-white/10 whitespace-nowrap transition-colors"
            >
              💈 Salon services
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white/[0.02] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about haircuts, address, bookings..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#d4ff32] transition-colors"
              />

              <button
                type="button"
                onClick={() => (isVoiceActive ? stopVoiceMode() : startVoiceMode())}
                className={`p-2.5 rounded-xl transition-all border ${
                  isVoiceActive
                    ? 'bg-[#d4ff32] text-black border-[#d4ff32]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title="Talk with Voice (Gemini Live)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-[#d4ff32] hover:bg-[#bef264] text-black font-bold transition-all disabled:opacity-30 active:scale-95"
                title="Send"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
            <div className="text-[10px] font-mono text-slate-500 mt-1.5 flex items-center justify-between px-1">
              <span>Maps • Voice • Services Grounded</span>
              <span>Daily 'til 10 PM</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

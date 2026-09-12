import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, Calendar, Clock, Video, UserCheck, Key, CheckCircle2 } from 'lucide-react';

export const ScheduleTourModal: React.FC = () => {
  const { touringProperty, setTouringProperty, addToast } = useApp();

  const [tourType, setTourType] = useState<'IN_PERSON' | 'VIDEO_CALL' | 'SELF_GUIDED'>('IN_PERSON');
  const [date, setDate] = useState<string>('2026-09-22');
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM - 11:30 AM');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!touringProperty) return null;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.scheduleTour({
        propertyId: touringProperty.id,
        propertyTitle: touringProperty.title,
        applicantName: name || 'Interested Tenant',
        applicantEmail: email || 'tenant@example.com',
        applicantPhone: phone || '+1 (555) 432-1100',
        tourType,
        date,
        timeSlot,
      });

      addToast('Tour Scheduled!', `Your ${tourType.replace('_', ' ').toLowerCase()} tour is confirmed for ${date} at ${timeSlot}.`, 'success');
      setTouringProperty(null);
    } catch (err) {
      console.error('Failed to schedule tour:', err);
      addToast('Error', 'Unable to book tour slot. Please try again.', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slots = [
    '10:00 AM - 10:30 AM',
    '11:00 AM - 11:30 AM',
    '01:00 PM - 01:30 PM',
    '02:30 PM - 03:00 PM',
    '04:00 PM - 04:30 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Schedule Property Tour
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-white truncate max-w-sm">
              {touringProperty.title}
            </h3>
          </div>
          <button
            onClick={() => setTouringProperty(null)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSchedule} className="space-y-4 text-xs">
          {/* Tour Type Selector */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Choose Tour Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTourType('IN_PERSON')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  tourType === 'IN_PERSON'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-bold shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-600 dark:text-stone-300'
                }`}
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                <span className="block text-[11px]">In-Person</span>
              </button>

              <button
                type="button"
                onClick={() => setTourType('VIDEO_CALL')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  tourType === 'VIDEO_CALL'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-bold shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Video className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                <span className="block text-[11px]">Live Video</span>
              </button>

              <button
                type="button"
                onClick={() => setTourType('SELF_GUIDED')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  tourType === 'SELF_GUIDED'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-bold shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Key className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                <span className="block text-[11px]">Smart Lock</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Tour Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Hayes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="jordan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Tour Booking</span>
          </button>
        </form>
      </div>
    </div>
  );
};

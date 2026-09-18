import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, MessageSquare, ShieldCheck, Building2, User } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { 
    isChatModalOpen, 
    setChatModalOpen, 
    chatMessages, 
    sendChatMessage, 
    currentUser, 
    activeChatApp,
    properties,
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');

  if (!isChatModalOpen) return null;

  const relevantProperty = activeChatApp 
    ? properties.find(p => p.id === activeChatApp.propertyId)
    : properties[0];

  const filteredMessages = activeChatApp 
    ? chatMessages.filter(m => m.applicationId === activeChatApp.id)
    : chatMessages;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    sendChatMessage(
      activeChatApp?.id || 'app-general',
      relevantProperty?.id || 'prop-general',
      relevantProperty?.title || 'General Inquiries',
      inputMsg
    );
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  Direct In-App Messenger
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[260px]">
                {relevantProperty ? relevantProperty.title : 'Direct Tenant-Landlord Channel'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setChatModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/40 dark:bg-stone-950/40">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No previous messages. Start the conversation below!
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id || (currentUser?.role === 'TENANT' && msg.senderRole === 'TENANT');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-stone-400">
                    <span className="font-bold text-stone-600 dark:text-stone-300">
                      {msg.senderName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-[9px] uppercase font-bold text-stone-600 dark:text-stone-300">
                      {msg.senderRole}
                    </span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message (e.g. tour availability, lease terms)..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl shadow transition flex items-center justify-center text-xs font-bold gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

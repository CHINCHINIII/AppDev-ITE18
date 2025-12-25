import React, { useState } from 'react';
import { Send } from 'lucide-react';

type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  createdAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  counterpartName?: string;
  onSend?: (text: string) => void;
  messages?: Message[];
};

const MessagingModal: React.FC<Props> = ({ open, onClose, counterpartName = 'Seller', onSend, messages = [] }) => {
  const [text, setText] = useState('');

  if (!open) return null;

  const submit = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText('');
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center px-4">
      <div className="card w-full max-w-3xl p-0 relative">
        <button className="absolute right-3 top-3 text-gray-400 hover:text-primary" onClick={onClose}>
          ✕
        </button>
        <div className="border-b border-gray-100 px-4 py-3 font-semibold">{counterpartName}</div>
        <div className="grid grid-cols-3 h-[420px]">
          <div className="border-r border-gray-100 p-3 text-sm text-gray-500">
            Conversations (mock)
            <div className="mt-3 space-y-2 text-ink">
              <div className="rounded-lg border border-gray-200 p-2">Current chat</div>
              <div className="rounded-lg border border-gray-200 p-2 opacity-60">Future chat</div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                    msg.from === 'me'
                      ? 'ml-auto bg-primary text-white'
                      : 'bg-gray-100 text-ink'
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="text-[11px] opacity-70 mt-1">{msg.createdAt}</div>
                </div>
              ))}
              {!messages.length && <div className="text-sm text-gray-500">No messages yet.</div>}
            </div>
            <div className="border-t border-gray-100 p-3 flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2"
                placeholder="Type a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <button className="btn-primary" onClick={submit}>
                <Send className="h-4 w-4 mr-1" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModal;


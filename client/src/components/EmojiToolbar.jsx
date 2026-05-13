import { EMOJIS } from '../utils/constants';
import { useState } from 'react';

export default function EmojiToolbar({ onInsert }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost text-lg px-3 py-1.5 rounded-lg"
        title="Insert Emoji"
      >
        😊
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 z-20 bg-white rounded-xl shadow-2xl border border-linkedin-border p-3 animate-bounce-in">
            <div className="grid grid-cols-8 gap-1 w-[280px]">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onInsert(emoji);
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg rounded-lg
                             hover:bg-linkedin-bg transition-colors cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

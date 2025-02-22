// Message.js
import React from 'react';

function Message({ text, sender }) {
  return (
    <div className={`message-input flex items-center w-full ${sender === 'bot' ? 'justify-start' : 'justify-end'} gap-2 p-2`}>
      <div
        className={`message break-all ${sender === 'bot' ? 'bg-fit-orange text-white rounded-r-lg' : 'bg-[#F6F5F5] rounded-bl-lg'} p-3 rounded-t-lg w-fit max-w-xs ${sender === 'bot' ? 'self-start' : 'self-end'}`}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Message;

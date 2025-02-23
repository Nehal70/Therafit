// Message.js
import React from 'react';
import { HiOutlineLightBulb } from "react-icons/hi";

function Message({ text, sender }) {
  return (
    <>
      {sender == 'exercise' ? (
        <>
          <div className="my-3 p-4 bg-[#F6F5F5] border border-gray-300 rounded-lg max-w-xs">
            <div className="font-medium text-sm mb-2 flex items-center gap-1 text-fit-orange">
              <HiOutlineLightBulb /> <h3>RECOMMENDED WORKOUT</h3>
            </div>
            <p className='mb-2 text-base/[0.99]'>
              <strong>{text.name.replace(/^\*+/, '').trim()}</strong> <br /><span className='text-sm'>{text.duration} seconds</span>
            </p>
            <p className='text-[13px] text-fit-gray'><em>
            {text.description.replace(/^\*+/, '').trim() || "No description provided."}
            </em></p>
            <p>
            </p>
            <button className='bg-fit-orange hover:bg-fit-orange-hover rounded-[100px] text-white  hover:text-white-hover py-1 px-4 mt-3'>Start Exercise</button>
          </div>
        </>
      ) :
        (<div className={`message-input flex items-center w-full ${sender === 'bot' ? 'justify-start' : 'justify-end'} gap-2 p-2`}>
          <div
            className={`message ${sender === 'bot' ? 'bg-fit-orange text-white rounded-r-lg' : 'bg-[#F6F5F5] rounded-bl-lg'} p-3 rounded-t-lg w-fit max-w-xs ${sender === 'bot' ? 'self-start' : 'self-end'}`}
          >
            <p>{text}</p>
          </div>
        </div>)
      }
    </>
  );
}

export default Message;

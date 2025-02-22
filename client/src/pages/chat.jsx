import React, { useState, useEffect, useRef } from 'react';
import BotIcon from '../assets/bot_icon.svg';
import Message from '../components/message';
import { BiSend } from "react-icons/bi";

function Chat() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Let me know your ideal workout!', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const chatWindowRef = useRef(null);  // Create a reference for the chat window

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    // Handle sending a new message
    const sendMessage = (text) => {
        const newMessage = { id: Date.now(), text, sender: 'user' };

        // Update state with the user's message
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Simulate a bot response
        setTimeout(() => {
            const botResponse = { id: Date.now(), text: 'I am here to help!', sender: 'bot' };

            // Add only the bot's response
            setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSend();  // Trigger the send message when Enter is pressed
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className='flex'>
                <div className='flex flex-col max-w-[1100px] m-auto py-10 items-start'>
                    <h1 className='font-bold text-4xl mb-3'>Hi, Jane!</h1>
                    <h3 className='text-lg mb-3'>Let&rsquo;s create a workout that supports your recovery and goals!</h3>
                    <p className='mb-2'>To get started, tell me:</p>
                    <p className='mb-3'>
                        ✅ What injury (or injuries) are you currently dealing with?<br />
                        ✅ How severe is it? (Mild discomfort, moderate pain, or severe?)<br />
                        ✅ What&rsquo;s your goal today? (Strength, mobility, flexibility, pain relief, etc.)<br />
                        ✅ Any movements or exercises you know you need to avoid?
                    </p>
                </div>

                <div className="chatbot bg-white p-4 max-w-2xl mx-auto mt-10 rounded-xl shadow-lg">
                    <div
                        className="chat-window h-[67vh] overflow-y-auto px-4"
                        ref={chatWindowRef}  // Attach the ref to the chat window
                    >
                        <div>
                            <div className='bg-fit-orange max-w-[90px] p-5 rounded-full mx-auto mb-3'>
                                <img className='w-full' src={BotIcon} />
                            </div>
                            <h4 className='text-center font-bold text-xl mb-3'>Hi, I’m FitBot!</h4>
                            <p className='text-center text-lg mb-4'>Tell me what you need, and I’ll craft the perfect workout for you.</p>
                        </div>
                        {messages.map((message) => (
                            <Message
                                key={message.id}
                                id={message.id}
                                text={message.text}
                                sender={message.sender}
                            />
                        ))}
                    </div>
                    <div className="message-input flex items-center gap-2 p-2">
                        <input
                            type="text"
                            className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}  // Add onKeyDown listener
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={handleSend}
                            className="bg-fit-orange text-white px-4 py-2 rounded-lg hover:bg-fit-orange-hover"
                        >
                            <BiSend size={27} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;

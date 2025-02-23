import React, { useState, useEffect, useRef } from "react";
import BotIcon from "../assets/bot_icon.svg";
import Message from "../components/message";
import { BiSend } from "react-icons/bi";

function Chat({ sessionId }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Let me know your ideal workout!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [exercise, setExercise] = useState(null); // 🟢 Store workout info
  const chatWindowRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  // 🟢 Archive Conversation Function
  const handleArchiveConversation = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/sessions/archive-conversation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId }),
        }
      );

      const data = await response.json();
      console.log("✅ Archive Response:", data.message);

      setMessages([
        {
          id: Date.now(),
          text: "Chat history cleared and archived!",
          sender: "bot",
        },
      ]);
      setExercise(null); // 🟢 Clear exercise when chat is cleared
    } catch (error) {
      console.error("❌ Error archiving conversation:", error.message);
    }
  };

  // 🟢 Send Message and Process AI + Workout
  const sendMessage = async (text) => {
    const newMessage = { id: Date.now(), text, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch(
        "http://localhost:5001/api/sessions/message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            sender: "user",
            text: text,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      console.log("📝 User Message Saved:", data.userMessage);
      console.log("🤖 AI Response Saved:", data.botMessage);
      console.log("💪 Exercise Saved to MongoDB:", data.exercise);

      // 🟢 Display User Message
      if (data.userMessage) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: data.userMessage.text, sender: "user" },
        ]);
      }

      // 🟢 Display Bot Message
      if (data.botMessage) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: data.botMessage.text, sender: "bot" },
        ]);
      }

      // 🟢 Display Exercise if Valid (not N/A)
      if (data.exercise && data.exercise.name && data.exercise.name !== "N/A") {
        setExercise(data.exercise); // Store exercise info
      } else {
        setExercise(null); // Reset if invalid
      }
    } catch (error) {
      console.error("❌ Error sending message:", error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="flex">
        <div className="flex flex-col max-w-[1100px] m-auto py-10 items-start">
          <h1 className="font-bold text-4xl mb-3">Hi, Jane!</h1>
          <h3 className="text-lg mb-3">
            Let&rsquo;s create a workout that supports your recovery and goals!
          </h3>
          <p className="mb-2">To get started, tell me:</p>
          <p className="mb-3">
            ✅ What injury (or injuries) are you currently dealing with?
            <br />
            ✅ How severe is it? (Mild discomfort, moderate pain, or severe?)
            <br />
            ✅ What&rsquo;s your goal today? (Strength, mobility, flexibility,
            pain relief, etc.)
            <br />✅ Any movements or exercises you know you need to avoid?
          </p>

          {/* 🔴 Archive Conversation Button */}
          <button
            onClick={handleArchiveConversation}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Clear Chat
          </button>

          {/* 🟢 Display Workout Info (if name not N/A) */}
          {exercise && (
            <div className="mt-4 p-3 bg-gray-100 border rounded-lg">
              <h3 className="font-bold text-xl mb-2">
                🏋️ Recommended Workout:
              </h3>
              <p>
                <strong>Name:</strong> {exercise.name}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {exercise.description || "No description provided."}
              </p>
              <p>
                <strong>Duration:</strong> {exercise.duration} seconds
              </p>
            </div>
          )}
        </div>

        <div className="chatbot bg-white p-4 max-w-2xl mx-auto mt-10 rounded-xl shadow-lg">
          <div
            className="chat-window h-[67vh] overflow-y-auto px-4"
            ref={chatWindowRef}
          >
            <div>
              <div className="bg-fit-orange max-w-[90px] p-5 rounded-full mx-auto mb-3">
                <img className="w-full" src={BotIcon} alt="Bot Icon" />
              </div>
              <h4 className="text-center font-bold text-xl mb-3">
                Hi, I’m FitBot!
              </h4>
              <p className="text-center text-lg mb-4">
                Tell me what you need, and I’ll craft the perfect workout for
                you.
              </p>
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
              onKeyDown={handleKeyDown}
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

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

  //

  function removeExerciseDetails(text) {
    const firstIdx = text.indexOf("**");
    const lastIdx = text.lastIndexOf("**");

    if (firstIdx === -1 || lastIdx === -1 || firstIdx === lastIdx) {
      return text; // Return original text if there aren't at least two `**`
    }

    // Find the position two tokens after the last `**`
    const afterLast = text.slice(lastIdx + 2).trim().split(/\s+/).slice(2).join(" ");

    // Keep everything before the first `**` and after the adjusted last part
    return text.slice(0, firstIdx).trim() + " " + afterLast;
  }

  //

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





      // 🟢 Display Exercise if Valid (not N/A)
      if (data.exercise && data.exercise.name && data.exercise.name !== "N/A") {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: removeExerciseDetails(data.botMessage.text), sender: "bot" },
        ]);
        ////
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: data.exercise, sender: "exercise" },
        ]);
        ////
      } else {
        // 🟢 Display Bot Message
        if (data.botMessage) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: data.botMessage.text, sender: "bot" },
          ]);
        } else {
          // 🟢 Display User Message
          if (data.userMessage) {
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), text: data.userMessage.text, sender: "user" },
            ]);
          }
        }
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

  // Scroll to bottom when messages change
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <>

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

      <div className='flex'>
        <div className="chatbot bg-white w-full mx-auto rounded-xl shadow-lg">
          <div
            className="chat-window pt-10 pb-20 overflow-y-auto px-[15%]"
            ref={chatWindowRef}  // Attach the ref to the chat window
          >
            <div>
              <div className='bg-fit-orange max-w-[90px] p-5 rounded-full mx-auto mb-3'>
                <img className='w-full' src={BotIcon} />
              </div>
              <h4 className='text-center font-bold text-xl mb-3'>Hi, I’m FitBot!</h4>

              <div className='flex flex-col max-w-xl m-auto pb-10 items-center'>

                <h3 className='text-md mb-3'>Let&rsquo;s create a workout that supports your recovery and goals!</h3>

                <p className='text-sm mb-3 text-center w-full text-fit-gray'><em>
                  What injury (or injuries) are you currently dealing with?<br />
                  How severe is it? (Mild discomfort, moderate pain, or severe?)<br />
                  What&rsquo;s your goal today? (Strength, mobility, flexibility, pain relief, etc.)<br />
                  Any movements or exercises you know you need to avoid?</em>
                </p>
              </div>
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
          <div className="bg-white fixed bottom-0 w-full message-input flex items-center gap-2 pt-4 pb-5 px-[15%]">
            <input
              type="text"
              className="py-2 px-4 w-full bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}  // Add onKeyDown listener
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-fit-orange text-white px-4 py-2 rounded-full hover:bg-fit-orange-hover"
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

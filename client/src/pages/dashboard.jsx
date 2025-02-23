import { useState, useEffect } from "react";
import { PiHandWaving } from "react-icons/pi";
import ProgramBlock from "../components/programBlock";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../services/userService";
import { getUserSessions } from "../services/sessionService";
import { useNavigate } from "react-router-dom";
import Chat from "./chat";
import { FaPlus } from "react-icons/fa6";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [sessions, setSessions] = useState(null);
  const [sessionId, setSessionId] = useState(null); // Store session ID when started
  const [showChat, setShowChat] = useState(false); // Control chat visibility

  // Fetch user's profile when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        if (userId) {
          getUserProfile(userId, token)
            .then((user) => {
              setUserName(user.firstName);
            })
            .catch((error) => {
              console.error("Error fetching user profile:", error);
              setUserName("User");
            });
          getUserSessions(userId, token)
            .then((data) => {
              setSessions(data);
              console.log(data);
            })
            .catch((error) => {
              console.error("Error fetching user profile:", error);
              setUserName("User");
            });
        } else {
          setUserName("User no userID");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserName("User");
      }
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Function to start a new session
  const startSession = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    const userEmail = decoded.email;

    try {
      const response = await fetch("http://localhost:5001/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: userEmail }), // Pass email here
      });

      if (!response.ok)
        throw new Error(`Failed with status ${response.status}`);

      const data = await response.json();
      alert(`✅ Session started! Session ID: ${data.sessionId}`);
      setSessionId(data.sessionId); // Store session ID
      setShowChat(true); // Show chat after session starts
    } catch (error) {
      console.error("❌ Error starting session:", error);
      alert("Failed to start session. Please try again.");
      console.error(" Error starting session:", error);
    }
  };

  // Fake JSON data for past workouts
  const workoutData = [
    {
      date: "2/19/2025",
      workoutName: "Upper Body Workout",
      duration: "1 hour",
    },
    { date: "2/20/2025", workoutName: "Arm Workout", duration: "30 minutes" },
    {
      date: "2/22/2025",
      workoutName: "Lower Body Workout",
      duration: "45 minutes",
    },
  ];


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long', // full month name
      day: 'numeric', // day of the month
      year: 'numeric', // full year
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    
    // Format the time using toLocaleTimeString
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // This ensures it uses 12-hour format
    };
  
    const time = date.toLocaleTimeString('en-US', options);
  
    // Convert time to the desired format (e.g., 3:55 p.m. instead of 03:55 PM)
    const formattedTime = time.replace(/(\d{1,2}):(\d{2}) (AM|PM)/, (match, p1, p2, p3) => {
      const hour = p1.startsWith('0') ? p1[1] : p1; // Remove leading zero from hours (if needed)
      const amPm = p3.toLowerCase(); // Convert AM/PM to lowercase
      return `${hour}:${p2} ${amPm}`;
    });
  
    return formattedTime;
  };

  return (
    <>{/* Show Chat if session started */}
      {showChat && sessionId ? (
        <Chat sessionId={sessionId} />
      ) : (
        <div className="flex flex-col max-w-[1100px] m-auto py-10 items-start">
          <h1 className="flex items-center justify-center font-bold text-4xl mb-3 text-fit-black">
            Hi, {userName}!&nbsp;
            <PiHandWaving />
          </h1>
          <h3 className="text-lg mb-3 text-fit-gray">
            Let&rsquo;s continue your fitness journey.
          </h3>


          <>
            <h2 className="font-bold text-fit-black mb-3 mt-3 text-xl">
              My Current Programs
            </h2>
            <div className="grid w-full grid-cols-3 gap-4">
                {sessions && [...sessions].reverse().map((session) => (
                    <ProgramBlock key={session._id}
                    title={formatDate(session.sessionStart)} desc={formatTime(session.sessionStart)}
                  />
                  ))}
              <div onClick={startSession} className='cursor-pointer text-[#737373] hover:text-[#615e5e] border-dashed border-4 gap-4 rounded-lg border-[#ADADAD] hover:border-[#615e5e] p-6 w-full items-center flex justify-center flex-col'>
                              <h1 className=''><FaPlus size={90}/></h1>
              
                              <div>
                                  <h1 className='font-bold text-center text-lg'>Add new workout program</h1>
                                  
                              </div>
                          </div>
            </div>

        

            {/* Past Workouts Section */}
            {/* <h2 className="font-bold text-fit-black mt-6 mb-3 text-xl">
              Past Workouts
            </h2>
            <div className="border rounded-lg border-gray-300 text-left w-full p-3">
              <table className="rounded-lg text-left w-full">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="p-3">Date</th>
                    <th className="p-3">Workout Name</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions && sessions.map((session, index) => (
                    <tr key={index}>
                      <td className="p-3">{formatDate(session.sessionStart)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </>

        </div>
      )}
    </>
  );
}

export default Dashboard;

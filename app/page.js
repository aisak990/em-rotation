"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    fetchData();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (data.users) {
        setUsers(data.users);

        // Initialize password state
        const initialPasswords = {};
        data.users.forEach((user) => {
          initialPasswords[user.id] = "";
        });
        setPasswords(initialPasswords);

        // Separate active and inactive users
        const active = data.users.filter((user) => user.active);
        const inactive = data.users.filter((user) => !user.active);

        setActiveUsers(active);
        setInactiveUsers(inactive);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const formatTimeDifference = (timestamp) => {
    if (!timestamp) return "0h 0m 0s ago";

    const now = currentTime;
    const callTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - callTime) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s ago`;
  };

  const formatTimeAsNext = (timestamp, startTime) => {
    if (!timestamp || !startTime) return "0h 0m 0s";

    const now = currentTime;
    const nextTime = new Date(timestamp);
    const startTimeDate = new Date(startTime);

    // Calculate elapsed time since becoming next
    const elapsedInSeconds = Math.floor((now - startTimeDate) / 1000);

    const hours = Math.floor(elapsedInSeconds / 3600);
    const minutes = Math.floor((elapsedInSeconds % 3600) / 60);
    const seconds = elapsedInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handlePasswordChange = (userId, value) => {
    setPasswords((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handleTakeCall = async (userId) => {
    if (!passwords[userId]) {
      alert("Please enter your password");
      return;
    }

    try {
      const response = await fetch("/api/take-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password: passwords[userId],
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Open Google Form in a new window
        // window.open(
        //   "https://docs.google.com/forms/d/e/1FAIpQLScTq0QypO9is1tY_rLnrZiYXoEQxXR9EYcAkDMyEGV5RZtzdw/viewform?usp=send_form",
        //   "_blank"
        // );

        const link = document.createElement("a");
      link.href =
        "https://docs.google.com/forms/d/e/1FAIpQLScTq0QypO9is1tY_rLnrZiYXoEQxXR9EYcAkDMyEGV5RZtzdw/viewform?usp=send_form";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);


        // Reset password field
        setPasswords((prev) => ({
          ...prev,
          [userId]: "",
        }));

        // Refresh data

        fetchData();
      } else {
        alert(data.message || "Invalid password");
      }
    } catch (error) {
      console.error("Error taking call:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const nextUpUser = activeUsers.length > 0 ? activeUsers[0] : null;

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-center border-b">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="text-blue-500 mr-2">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="css-i6dzq1"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <h1 className="text-xl font-medium">K Observers Rotation</h1>
          </div>
        </div>
      </header>

      {/* Next Up Section */}
      {nextUpUser && (
        <div className="p-4">
          <div className="border-2 border-green-500 rounded-lg p-4 bg-white">
            <div className="text-center text-green-500 font-medium mb-2">
              NEXT UP
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-2">
                <div className="absolute inset-0 rounded-full border-4 border-green-500"></div>
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={nextUpUser.imagePath || "/placeholder.svg"}
                    alt={nextUpUser.id}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="text-xl font-medium">{nextUpUser.id}</div>
              <div className="text-sm text-gray-600 mb-1">
                Calls: {nextUpUser.calls}
              </div>
              <div className="text-[10px] text-gray-600 mb-1">
                Last call: {formatTimeDifference(nextUpUser.lastCallTimestamp)}
              </div>

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-md p-2 mb-3"
                value={passwords[nextUpUser.id] || ""}
                onChange={(e) =>
                  handlePasswordChange(nextUpUser.id, e.target.value)
                }
              />

              <button
                className="w-full bg-green-500 text-white py-2 rounded-md"
                onClick={() => handleTakeCall(nextUpUser.id)}
              >
                I took a call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Users - Single Row that fits within screen width */}
      <div className="px-1">
        <div className="flex justify-between w-full">
          {activeUsers.slice(1).map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg p-1 flex flex-col items-center w-[24%] mx-0.5"
            >
              <div className="w-11 h-11 mb-1 relative rounded-full overflow-hidden">
                <Image
                  src={user.imagePath || "/placeholder.svg"}
                  alt={user.id}
                  width={44}
                  height={44}
                  className="object-cover w-full h-full border-2 border-blue-300"
                />
              </div>
              <div className="text-sm font-medium">{user.id}</div>
              <div className="text-[10px] text-gray-600">
                Calls: {user.calls}
              </div>
              <div className="text-[10px] text-gray-600 mb-1">
                Last call: {formatTimeDifference(user.lastCallTimestamp)}
              </div>

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-md p-1 mb-1 text-[10px] h-7"
                value={passwords[user.id] || ""}
                onChange={(e) => handlePasswordChange(user.id, e.target.value)}
              />

              <button
                className="w-full bg-blue-500 text-white py-1 rounded-md text-[10px] h-7"
                onClick={() => handleTakeCall(user.id)}
              >
                I took a call
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Section */}
      {inactiveUsers.length > 0 && (
        <>
          <div className="mt-6 mb-4 px-4">
            <div className="border-t border-gray-300 relative">
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-4 text-gray-500">
                Inactive
              </span>
            </div>
          </div>

          <div className="px-4 grid grid-cols-2 gap-4">
            {inactiveUsers.map((user) => (
              // <div
              //   key={user.id}
              //   className="bg-white rounded-lg p-4 flex flex-col items-center"
              // >
              //   <div className="w-16 h-16 mb-2 relative rounded-full overflow-hidden">
              //     <Image
              //       src={user.imagePath || "/placeholder.svg"}
              //       alt={user.id}
              //       width={64}
              //       height={64}
              //       className="object-cover w-full h-full border-2 border-gray-300"
              //     />
              //   </div>
              //   <div className="text-lg font-medium">{user.id}</div>
              //   {/* <div className="text-xs text-gray-600 mb-1">
              //     Calls: {user.calls}
              //   </div>
              //   <div className="text-xs text-gray-600 mb-2">
              //     Last call: {formatTimeDifference(user.lastCallTimestamp)}
              //   </div> */}
              // </div>

              <div
              key={user.id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                width: "200px",
                opacity: "0.6",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={user.imagePath || "/placeholder.svg"}
                alt={user.name}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #9ca3af",
                  filter: "grayscale(0.7)",
                }}
              />
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginTop: "12px",
                  color: "#1f2937",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#374151",
                  marginTop: "5px",
                }}
              >
                Calls:
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "3px",
                }}
              >
                Last call: 
              </div>
            </div>

            ))}
          </div>
        </>
      )}
    </div>
  );
}

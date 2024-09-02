import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";
import CreateQuiz from "./Sidebar/quiz/CreateQuiz";
import Analytics from "./Analytics/Analytics";

const Dashboard = () => {
  const [isQuizModalOpen, setQuizModalOpen] = useState(false);
  const [isMainContentOpen, setMainContentOpen] = useState(true);
  const [isAnalyticsOpen, setAnalyticsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleQuizModal = () => {
    setQuizModalOpen(!isQuizModalOpen);
  };

  const setMainContent = () => {
    setAnalyticsOpen(false);
    setMainContentOpen(true);
  };

  const setAnalytics = () => {
    setMainContentOpen(false);
    setAnalyticsOpen(true);
  };

  // Fetch user data and handle authentication
  useEffect(() => {
    const fetchData = async () => {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        try {
          const response = await axios.get(
            "http://localhost:3000/user/profile",
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          console.log(response.data);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);

          // Redirect to login if there's an error or token is invalid
          navigate("/");
        } finally {
          setLoading(false);
        }
      } else {
        // Redirect to login if no token is found
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        toggleQuiz={toggleQuizModal}
        setAnalytics={setAnalytics}
        setMainContent={setMainContent}
        isMainContentOpen={isMainContentOpen}
        isAnalyticsOpen={isAnalyticsOpen}
        isQuizModalOpen={isQuizModalOpen}
      />
      {isMainContentOpen && <MainContent userData={userData} />}
      {isAnalyticsOpen && <Analytics userData={userData}/>}
      {isQuizModalOpen && (
        <div className="quiz-modal">
          <CreateQuiz
            closeModal={toggleQuizModal}
            userData ={userData}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

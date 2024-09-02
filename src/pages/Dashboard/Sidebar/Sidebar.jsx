
import React, { useState } from 'react';
import './Sidebar.css'; // Add styles for Sidebar
import { useNavigate } from "react-router-dom";

const Sidebar = ({toggleQuiz, setAnalytics, setMainContent, isAnalyticsOpen, isMainContentOpen, isQuizModalOpen}) => {
    // const navigate = useNavigate(); // Use useNavigate instead of useHistory

    // const goToAnalytics = () => {
    //   navigate('/analytics'); // Use navigate instead of history.push
    // };
    const navigate = useNavigate();
    // Function to toggle the quiz modal
    const logoutUser = ()=>{
        localStorage.setItem("userToken", null);
        navigate("/");
    }

    return (
        <div className="sidebar">
            <h1>QUIZZIE</h1>
            <ul>
                <li className={isMainContentOpen ? "active" : ""} onClick={setMainContent}>Dashboard</li>
                <li className={isAnalyticsOpen ? "active" : ""} onClick={setAnalytics}>Analytics</li>
                <li className={isQuizModalOpen ? "active" : ""} onClick={toggleQuiz}>Create Quiz</li>
            </ul>
            <span>━━━━━━━━━━</span>
            <button className="logout-button" onClick={logoutUser}>LOGOUT</button> 
        </div>
    );
};

export default Sidebar;

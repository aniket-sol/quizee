import React from "react";
import "./SuccessPopup.css"; // Add your styling here
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuccessPopup = ({ quizLink, onClose }) => {
  const showToastMessage = () => {
    toast.success("Quiz link copied to clipboard!");
  };

  const handleShare = () => {
    // Copy the link to the clipboard
    navigator.clipboard.writeText(quizLink);
    showToastMessage(); // Show toast message after copying the link
  };

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <p className="congrats-text">Congrats! Your quiz is Published.</p>

        <div className="quiz-link">
          <input
            type="text"
            value={quizLink}
            readOnly
            placeholder="Your link is here"
          />
          <button onClick={handleShare}>Share</button>
        </div>
      </div>
      {/* Add ToastContainer here */}
      <ToastContainer />
    </div>
  );
};

export default SuccessPopup;

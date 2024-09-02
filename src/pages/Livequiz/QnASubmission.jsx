import React from 'react';
import './QnASubmission.css';
import Trophy from '../../assets/images/Trophy.png'

const Submission = ({ score, totalQuestions, quizType }) => {
  return (
    
    <div className='container'>
      {quizType === 'Q&A' ? (
        <div className="submission-container">
          <h1 className="congrats-text">Congrats, the quiz is completed!</h1>
          <img
            src={Trophy} // Replace with your actual logo URL
            alt="Quiz Logo"
            className="logo"
          />
          <p className="score-text">
            Your Score is <span className='green'>{score}/{totalQuestions}</span>
          </p>
        </div>
      ) : (
        <div className='poll-container'>
          <p>Thank you for participating in the Poll</p>
        </div>
      )}
    </div>
  );
};

export default Submission;

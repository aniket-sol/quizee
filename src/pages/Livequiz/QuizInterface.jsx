import React, { useState, useEffect } from "react";
import "./QuizInterface.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import QnASubmission from "./QnASubmission.jsx";

const Quiz = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [questions, setCurrentQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(-1);
  const [quizType, setQuizType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/${id}`);
        setCurrentQuestions(response.data.questions);
        setTotalQuestions(response.data.questions.length);
        setQuizType(response.data.quizType);

        // Initialize timer for the first question
        const initialTimer = response.data.questions[0]?.timer;
        setTimeLeft(initialTimer === 0 ? -1 : parseInt(initialTimer, 10));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      if (currentQuestion === questions.length - 1) {
        handleSubmitQuiz();
      } else {
        handleNextClick();
      }
    }
  }, [timeLeft, currentQuestion, questions.length]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleNextClick = () => {
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      selectedOption !== null ? selectedOption : -1,
    ]);

    if (currentQuestion === questions.length - 1) {
      setTimeout(handleSubmitQuiz, 0); // Delay to ensure state update
      return;
    }

    const nextQuestionTimer = questions[currentQuestion + 1]?.timer;
    setCurrentQuestion(currentQuestion + 1);
    setSelectedOption(null);
    setTimeLeft(nextQuestionTimer === 0 ? -1 : parseInt(nextQuestionTimer, 10));
  };

  const handleSubmitQuiz = async () => {
    try {
      const finalAnswers = [
        ...answers,
        selectedOption !== null ? selectedOption : -1,
      ];
      console.log(finalAnswers);
      const response = await axios.post(
        `http://localhost:3000/quiz/${id}/take`,
        { answers: finalAnswers }
      );
      setScore(response.data.score);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (isSubmitted) {
    return (
      <QnASubmission
        score={score}
        totalQuestions={totalQuestions}
        quizType={quizType}
      />
    );
  }

  return (
    <div className="container">
      <div className="quiz-container">
        <div className="quiz-header">
          <span>{`${currentQuestion + 1}/${questions.length}`}</span>
          {/* Properly handle timer display */}
          {timeLeft == -1 ? (
            <span></span>
          ) : (
            <span className="timer">
              {`00:${timeLeft <= 10 ? `0${timeLeft}` : timeLeft}s`}
            </span>
          )}
        </div>
        <div className="question-text">{questions[currentQuestion]?.text}</div>
        <div className="options-container">
          {questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              className={`option ${selectedOption === index ? "selected" : ""}`}
              onClick={() => handleOptionClick(index)}
            >
              {option.optionText}
              {option.optionUrl && (
                <img src={option.optionUrl} alt="" width="60px" />
              )}
            </button>
          ))}
        </div>
        <button
          className="next-button"
          onClick={handleNextClick}
          disabled={selectedOption === null && timeLeft !== 0}
        >
          {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;

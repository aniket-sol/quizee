import React, { useState, useEffect } from "react";
import "./CreateQuiz.css"; // Import the CSS for styling
import Vector from "../../../assets/images/Vector.png";
import SuccessPopup from "../Sidebar/quiz/SuccessPopup.jsx";
import axios from "axios";

const EditQuiz = ({ closeModal, quizId, userData }) => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [step, setStep] = useState(1);

  const [quizData, setQuizData] = useState({
    questions: [],
    quizName: "",
    quizType: "",
    pollQuestion: "",
    optionType: "Text",
    correctOption: -1,
  });

  const [questions, setQuestions] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/quiz/${quizId}`
        );
        const data = response.data;
        setQuizName(data.quizName);
        setQuizType(data.quizType);
        setQuestions(data.questions);
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleContinue = () => {
    if (quizName && quizType) {
      setStep(2);
    } else {
      alert("Please enter a quiz name and select a quiz type.");
    }
  };

  const handleCancel = () => {
    setQuizName("");
    setQuizType("");
    setStep(1);
    closeModal();
  };

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          text: "",
          type: "Text",
          options: [
            { text: "", url: "" },
            { text: "", url: "" },
            { text: "", url: "" },
            { text: "", url: "" },
          ],
          correctOption: -1,
          optionType: "Text",
          timer: "Off",
        },
      ]);
      setCurrentQuestionIndex(questions.length);
    }
  };

  const removeQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions.map((q, index) => ({ ...q, id: index + 1 })));
    setCurrentQuestionIndex(0);
  };

  const handleQuestionChange = (field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].correctOption = index;
    setQuestions(updatedQuestions);
  };

  const addOption = () => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[currentQuestionIndex].options.length < 4) {
      updatedQuestions[currentQuestionIndex].options.push({
        text: "",
        url: "",
      });
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (index) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[currentQuestionIndex].options.length > 2) {
      const newOptions = updatedQuestions[currentQuestionIndex].options.filter(
        (_, i) => i !== index
      );
      updatedQuestions[currentQuestionIndex].options = newOptions;
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[currentQuestionIndex].options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    updatedQuestions[currentQuestionIndex].options = updatedOptions;
    setQuestions(updatedQuestions);
  };

  const handleTimerChange = (value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].timer = value;
    setQuestions(updatedQuestions);
  };

  const onQuizUpdate = async (updatedQuizData) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/quiz/update/${quizId}`,
        {
          quizData: updatedQuizData,
        }
      );
      const quizId = response.data._id;
      const generatedQuizLink = `http://localhost:5173/quiz-interface/${quizId}`;
      setQuizLink(generatedQuizLink);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("There was an error updating the quiz. Please try again.");
    }
  };

  const handleUpdateQuiz = () => {
    const updatedQuizData = {
      ...quizData,
      creatorId: userData.id,
      quizName: quizName,
      quizType: quizType,
      questions: questions.map((question) => ({
        ...question,
        answer: question.correctOption,
        timer:
          question.timer === "Off" ? 0 : question.timer === "5 sec" ? 5 : 10,
        options: question.options.map((option, index) => ({
          ...option,
          optionText: option.text,
          optionUrl: option.url,
          isCorrect: index === question.correctOption,
        })),
      })),
    };
    onQuizUpdate(updatedQuizData);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    handleCancel();
  };

  return (
    <div className="quiz-builder-overlay">
      <div
        className={`quiz-builder-modal ${
          step === 2 ? "quiz-builder-modal-step-2" : ""
        }`}
      >
        {step === 1 && (
          <div className="quiz-builder">
            <div className="quiz-name-type">
              <input
                type="text"
                placeholder="Quiz Name"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
              <div className="quiz-type">
                <p>Quiz type</p>
                <button
                  className={`quiz-type-button ${
                    quizType === "Q&A" ? "selected" : ""
                  }`}
                  onClick={() => setQuizType("Q&A")}
                >
                  Q & A
                </button>
                <button
                  className={`quiz-type-button ${
                    quizType === "Poll" ? "selected" : ""
                  }`}
                  onClick={() => setQuizType("Poll")}
                >
                  Poll Type
                </button>
              </div>
              <div className="action-buttons">
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="continue-button" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && quizType === "Q&A" && (
          <div className="quiz-configuration">
            <div className="question-row">
              {questions.map((question) => (
                <div key={question.id} className="question-item">
                  <div className="question-space">
                    <span>{question.id}</span>
                  </div>
                  <button onClick={() => removeQuestion(question.id)}>×</button>
                </div>
              ))}
              {questions.length < 5 && (
                <button className="add-question-button" onClick={addQuestion}>
                  +
                </button>
              )}
              <h3 className="max-questions-text">Max 5 questions</h3>
            </div>

            <div className="poll-question-field">
              <input
                type="text"
                placeholder="Poll Question"
                value={questions[currentQuestionIndex].text}
                onChange={(e) => handleQuestionChange("text", e.target.value)}
              />
            </div>

            <div className="option-type">
              <p>Option Type</p>
              <label className="option-type-label">
                <input
                  type="radio"
                  name="optionType"
                  value="Text"
                  checked={
                    questions[currentQuestionIndex].optionType === "Text"
                  }
                  onChange={(e) =>
                    handleQuestionChange("optionType", e.target.value)
                  }
                />
                Text
              </label>
              <label className="option-type-label">
                <input
                  type="radio"
                  name="optionType"
                  value="URL"
                  checked={questions[currentQuestionIndex].optionType === "URL"}
                  onChange={(e) =>
                    handleQuestionChange("optionType", e.target.value)
                  }
                />
                URL
              </label>
            </div>

            <div className="options-list">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type={
                      questions[currentQuestionIndex].optionType === "Text"
                        ? "text"
                        : "url"
                    }
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(index, "text", e.target.value)
                    }
                  />
                  <button
                    className="remove-option-button"
                    onClick={() => removeOption(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {questions[currentQuestionIndex].options.length < 4 && (
                <button className="add-option-button" onClick={addOption}>
                  +
                </button>
              )}
            </div>

            <div className="correct-option">
              <p>Correct Option</p>
              {questions[currentQuestionIndex].options.map((_, index) => (
                <button
                  key={index}
                  className={`correct-option-button ${
                    questions[currentQuestionIndex].correctOption === index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleCorrectOptionChange(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="timer-settings">
              <p>Timer</p>
              <label>
                <input
                  type="radio"
                  name="timer"
                  value="Off"
                  checked={questions[currentQuestionIndex].timer === "Off"}
                  onChange={() => handleTimerChange("Off")}
                />
                Off
              </label>
              <label>
                <input
                  type="radio"
                  name="timer"
                  value="5 sec"
                  checked={questions[currentQuestionIndex].timer === "5 sec"}
                  onChange={() => handleTimerChange("5 sec")}
                />
                5 sec
              </label>
              <label>
                <input
                  type="radio"
                  name="timer"
                  value="10 sec"
                  checked={questions[currentQuestionIndex].timer === "10 sec"}
                  onChange={() => handleTimerChange("10 sec")}
                />
                10 sec
              </label>
            </div>

            <div className="actions">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="update-button" onClick={handleUpdateQuiz}>
                Update
              </button>
            </div>
          </div>
        )}

        {step === 2 && quizType === "Poll" && (
          <div className="poll-configuration">
            <input
              type="text"
              placeholder="Poll Question"
              value={quizData.pollQuestion}
              onChange={(e) =>
                setQuizData({ ...quizData, pollQuestion: e.target.value })
              }
            />
            {/* Add similar functionality for Poll type */}
          </div>
        )}

        {showSuccessPopup && (
          <SuccessPopup
            onClose={closeSuccessPopup}
            message={`Quiz updated successfully! Here is your link: ${quizLink}`}
          />
        )}

        <img
          src={Vector}
          alt="Close"
          className="close-icon"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditQuiz;

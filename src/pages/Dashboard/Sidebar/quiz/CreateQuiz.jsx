import React, { useState } from 'react';
import './CreateQuiz.css'; // Import the CSS for styling
import Vector from '../../../../assets/images/Vector.png';
import SuccessPopup from './SuccessPopup.jsx';
import axios from 'axios';

const CreateQuiz = ({ closeModal, userData }) => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [step, setStep] = useState(1);

  const [quizData, setQuizData] = useState({
    questions: [],
    quizName: "",
    quizType: "", // Default type or change as needed
    pollQuestion: "",
    optionType: "Text",
    correctOption: -1,
  });


  // Initialize state with a default question structure
  const [questions, setQuestions] = useState([
    {
      id: 1,
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

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [quizLink, setQuizLink] = useState(""); // Placeholder for the quiz link
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to manage SuccessPopup

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
    closeModal(); // Closes the modal if needed
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
      setCurrentQuestionIndex(questions.length); // Set to the new question's index
    }
  };

  const removeQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions.map((q, index) => ({ ...q, id: index + 1 })));
    setCurrentQuestionIndex(0); // Reset to the first question
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
  
  const onQuizCreate = async (updatedQuizData) =>{

    console.log(updatedQuizData);
    try {
      const response = await axios.post('http://localhost:3000/quiz/create', {
        // creatorId: userData.id, // Include userID in the request
        quizData: updatedQuizData
      });
      console.log(response);
      const quizId = response.data._id;

      const generatedQuizLink = `http://localhost:5173/quiz-interface/${quizId}`;
      setQuizLink(generatedQuizLink);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("There was an error creating the quiz. Please try again.");
    }

    // const generatedQuizLink = `https://yourapp.com/quiz/${quizName
    //   .replace(/\s+/g, "-")
    //   .toLowerCase()}`;
    // setQuizLink(generatedQuizLink);
    // setShowSuccessPopup(true);
  }
  const handleCreateQuiz = () => {
    // Generate or fetch the quiz link here
    // if(quizData.correctOption == -1 && quizType == 'Q&A'){
    //   alert('select an option')
    //   return;
    // }
    const updatedQuizData = {
      ...quizData,
      creatorId: userData.id,
      quizName: quizName,
      quizType: quizType,
      questions: questions.map((question) => ({
        ...question,
        answer: question.correctOption,
        timer : question.timer=="Off"?0:question.timer=="5 sec"?5:10,
        options: question.options.map((option, index) => ({
          ...option,
          optionText: option.text,
          optionUrl: option.url,
          isCorrect: index === question.correctOption,
        })),
      })),
    };
    onQuizCreate(updatedQuizData);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    handleCancel(); // Close the QuizBuilder modal after success
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
                  onClick={() =>{ 
                    setQuizType("Q&A");
                    console.log(quizType);
                  }}
                >
                  Q & A
                </button>
                <button
                  className={`quiz-type-button ${
                    quizType === "Poll" ? "selected" : ""
                  }`}
                  onClick={() =>{ 
                    setQuizType("Poll");
                    console.log(quizType);
                  }}
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

        {/* ---------------------------------Q&A--------------------------------- */}

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
                  value="Image URL"
                  checked={
                    questions[currentQuestionIndex].optionType === "Image URL"
                  }
                  onChange={(e) =>
                    handleQuestionChange("optionType", e.target.value)
                  }
                />
                Image URL
              </label>
              <label className="option-type-label">
                <input
                  type="radio"
                  name="optionType"
                  value="Text & Image URL"
                  checked={
                    questions[currentQuestionIndex].optionType ===
                    "Text & Image URL"
                  }
                  onChange={(e) =>
                    handleQuestionChange("optionType", e.target.value)
                  }
                />
                Text & Image URL
              </label>
            </div>

            {/* Text Option Type */}
            {questions[currentQuestionIndex].optionType === "Text" && (
              <div className="options-field">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} className="option-item">
                      <input
                        className="Mark"
                        type="radio"
                        name="correctOption"
                        checked={
                          questions[currentQuestionIndex].correctOption ===
                          index
                        }
                        onChange={() => handleCorrectOptionChange(index)}
                      />
                      <input
                        className="options_style"
                        type="text"
                        placeholder="Text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, "text", e.target.value)
                        }
                      />
                      {questions[currentQuestionIndex].options.length > 2 &&
                        ((questions[currentQuestionIndex].options.length ===
                          4 &&
                          (index === 2 || index === 3)) ||
                          (questions[currentQuestionIndex].options.length ===
                            3 &&
                            index === 2)) && (
                          <button
                            className="delete-option-button"
                            onClick={() => removeOption(index)}
                          >
                            <img src={Vector} alt="Delete" />
                          </button>
                        )}
                    </div>
                  )
                )}
                {questions[currentQuestionIndex].options.length < 4 && (
                  <button className="add-option-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>
            )}

            {/* Image URL Option Type */}
            {questions[currentQuestionIndex].optionType === "Image URL" && (
              <div className="option-configuration">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} className="option-item">
                      <input
                        className="Mark"
                        type="radio"
                        name="correctOption"
                        checked={
                          questions[currentQuestionIndex].correctOption ===
                          index
                        }
                        onChange={() => handleCorrectOptionChange(index)}
                      />
                      <input
                        className="options_style"
                        type="text"
                        placeholder="Image URL"
                        value={option.url}
                        onChange={(e) =>
                          handleOptionChange(index, "url", e.target.value)
                        }
                      />
                      {questions[currentQuestionIndex].options.length > 2 &&
                        ((questions[currentQuestionIndex].options.length ===
                          4 &&
                          (index === 2 || index === 3)) ||
                          (questions[currentQuestionIndex].options.length ===
                            3 &&
                            index === 2)) && (
                          <button
                            className="delete-option-button"
                            onClick={() => removeOption(index)}
                          >
                            <img src={Vector} alt="Delete" />
                          </button>
                        )}
                    </div>
                  )
                )}
                {questions[currentQuestionIndex].options.length < 4 && (
                  <button className="add-option-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>
            )}

            {/* Text & Image URL Option Type */}
            {questions[currentQuestionIndex].optionType ===
              "Text & Image URL" && (
              <div className="option-configuration">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} className="option-item">
                      <input
                        className="Mark"
                        type="radio"
                        name="correctOption"
                        checked={
                          questions[currentQuestionIndex].correctOption ===
                          index
                        }
                        onChange={() =>
                          handleQuestionChange("correctOption", index)
                        }
                      />
                      <input
                        className="options_style"
                        type="text"
                        placeholder="Text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, "text", e.target.value)
                        }
                      />
                      <input
                        className="options_style"
                        type="url"
                        placeholder="Image URL"
                        value={option.url}
                        onChange={(e) =>
                          handleOptionChange(index, "url", e.target.value)
                        }
                      />
                      {questions[currentQuestionIndex].options.length > 2 &&
                        ((questions[currentQuestionIndex].options.length ===
                          4 &&
                          (index === 2 || index === 3)) ||
                          (questions[currentQuestionIndex].options.length ===
                            3 &&
                            index === 2)) && (
                          <button
                            className="delete-option-button"
                            onClick={() => removeOption(index)}
                          >
                            <img src={Vector} alt="Delete" />
                          </button>
                        )}
                    </div>
                  )
                )}
                {questions[currentQuestionIndex].options.length < 4 && (
                  <button className="add-option-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>
            )}

            {quizType === "Q&A" && (
              <div className="timer">
                <p>Timer</p>
                <button
                  className={`timer-button ${
                    questions[currentQuestionIndex].timer === "Off"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleTimerChange("Off")}
                >
                  OFF
                </button>
                <button
                  className={`timer-button ${
                    questions[currentQuestionIndex].timer === "5 sec"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleTimerChange("5 sec")}
                >
                  5 sec
                </button>
                <button
                  className={`timer-button ${
                    questions[currentQuestionIndex].timer === "10 sec"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleTimerChange("10 sec")}
                >
                  10 sec
                </button>
              </div>
            )}

            <div className="action-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="continue-button" onClick={handleCreateQuiz}>
                Create Quiz
              </button>
            </div>
          </div>
        )}

        {/* --------------------------POLL------------------------ */}

        {step === 2 && quizType === "Poll" && (
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
                  value="Image URL"
                  checked={
                    questions[currentQuestionIndex].optionType === "Image URL"
                  }
                  onChange={(e) =>
                    handleQuestionChange("optionType", e.target.value)
                  }
                />
                Image URL
              </label>
              <label className="option-type-label">
                <input
                  type="radio"
                  name="optionType"
                  value="Text & Image URL"
                  checked={
                    questions[currentQuestionIndex].optionType ===
                    "Text & Image URL"
                  }
                  onChange={(e) =>
                    handleQuestionChange("optionType", e.target.value)
                  }
                />
                Text & Image URL
              </label>
            </div>

            {questions[currentQuestionIndex].optionType === "Text" && (
              <div className="options-field">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} className="option-item">
                      <input
                        className="options_style"
                        type="text"
                        placeholder="Text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, "text", e.target.value)
                        }
                      />
                      {questions[currentQuestionIndex].options.length > 2 &&
                        ((questions[currentQuestionIndex].options.length ===
                          4 &&
                          (index === 2 || index === 3)) ||
                          (questions[currentQuestionIndex].options.length ===
                            3 &&
                            index === 2)) && (
                          <button
                            className="delete-option-button"
                            onClick={() => removeOption(index)}
                          >
                            <img src={Vector} alt="Delete" />
                          </button>
                        )}
                    </div>
                  )
                )}
                {questions[currentQuestionIndex].options.length < 4 && (
                  <button className="add-option-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>
            )}

            {questions[currentQuestionIndex].optionType === "Image URL" && (
              <div className="option-configuration">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} className="option-item">
                      <input
                        className="options_style"
                        type="text"
                        placeholder="Image URL"
                        value={option.url}
                        onChange={(e) =>
                          handleOptionChange(index, "url", e.target.value)
                        }
                      />
                      {questions[currentQuestionIndex].options.length > 2 &&
                        ((questions[currentQuestionIndex].options.length ===
                          4 &&
                          (index === 2 || index === 3)) ||
                          (questions[currentQuestionIndex].options.length ===
                            3 &&
                            index === 2)) && (
                          <button
                            className="delete-option-button"
                            onClick={() => removeOption(index)}
                          >
                            <img src={Vector} alt="Delete" />
                          </button>
                        )}
                    </div>
                  )
                )}
                {questions[currentQuestionIndex].options.length < 4 && (
                  <button className="add-option-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>
            )}

            {questions[currentQuestionIndex].optionType ===
              "Text & Image URL" && (
              <div className="option-configuration">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div key={index} className="option-item">
                      <input
                        className="options_style"
                        type="text"
                        placeholder="Text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, "text", e.target.value)
                        }
                      />
                      <input
                        className="options_style"
                        type="url"
                        placeholder="Image URL"
                        value={option.url}
                        onChange={(e) =>
                          handleOptionChange(index, "url", e.target.value)
                        }
                      />
                      {questions[currentQuestionIndex].options.length > 2 &&
                        ((questions[currentQuestionIndex].options.length ===
                          4 &&
                          (index === 2 || index === 3)) ||
                          (questions[currentQuestionIndex].options.length ===
                            3 &&
                            index === 2)) && (
                          <button
                            className="delete-option-button"
                            onClick={() => removeOption(index)}
                          >
                            <img src={Vector} alt="Delete" />
                          </button>
                        )}
                    </div>
                  )
                )}
                {questions[currentQuestionIndex].options.length < 4 && (
                  <button className="add-option-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>
            )}

            <div className="action-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="continue-button" onClick={handleCreateQuiz}>
                Create Quiz
              </button>
            </div>
          </div>
        )}
        {showSuccessPopup && (
          <SuccessPopup quizLink={quizLink} onClose={closeSuccessPopup} />
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;








// https://youtube.com/shorts/zuh7CoGFRfk?si=OD56LD8zws7KSalv

import React, { useState, useEffect } from "react";
import "./Analytics.css"; // Assuming you will have some CSS for styling
import edit from "../../../assets/images/edit.png";
import Vector from "../../../assets/images/Vector.png";
import Share from "../../../assets/images/Share.png";
import QuestionAnalytics from "../Question Analytics/QuestionAnalytics";
// import EditQuiz from ".EditQuiz"; // Import EditQuiz component
import EditQuiz from "./EditQuiz";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Analytics = ({ userData }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [questionAnalyticsVisible, setQuestionAnalyticsVisible] =
    useState(false);
  const [editQuizVisible, setEditQuizVisible] = useState(false); // New state for edit mode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const showToastMessage = (message) => {
    toast.success(message);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/${userData.id}/analytics`
        );
        setQuizzes(response.data.quizzes);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDeleteClick = (id) => {
    setQuizToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/quiz/${quizToDelete}`);
      const response = await axios.get(
        `http://localhost:3000/user/${userData.id}/analytics`
      );
      setQuizzes(response.data.quizzes);
      showToastMessage("Quiz deleted successfully!");
    } catch (err) {
      setError(err);
    } finally {
      setDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setQuizToDelete(null);
  };

  const handleQuestionWiseAnalysisClick = (quizId) => {
    setSelectedQuiz(quizId);
    setQuestionAnalyticsVisible(true);
  };

  const handleShareClick = (quizId) => {
    const quizLink = `http://localhost:5173/quiz-interface/${quizId}`;
    navigator.clipboard
      .writeText(quizLink)
      .then(() => {
        showToastMessage("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleEditClick = (quizId) => {
    setSelectedQuiz(quizId);
    setEditQuizVisible(true); // Show the edit quiz modal
  };

  const closeEditQuizModal = () => {
    setEditQuizVisible(false);
    setSelectedQuiz(null);
  };

  return (
    <div>
      {questionAnalyticsVisible ? (
        <QuestionAnalytics quizId={selectedQuiz} />
      ) : editQuizVisible ? (
        <EditQuiz
          closeModal={closeEditQuizModal}
          quizId={selectedQuiz}
          userData={userData}
        />
      ) : (
        <div className="quiz-analytics">
          <h1>Quiz Analytics</h1>
          <div className="table-container">
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Quiz Name</th>
                  <th>Created On</th>
                  <th>Impressions</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz._id}>
                    <td>{index + 1}</td>
                    <td>{quiz.quizName}</td>
                    <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                    <td>{quiz.impressions}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(quiz._id)}
                      >
                        <img src={edit} alt="edit" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(quiz._id)}
                      >
                        <img src={Vector} alt="Delete" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="share-btn"
                        onClick={() => handleShareClick(quiz._id)}
                      >
                        <img src={Share} alt="Share" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="analysis-btn"
                        onClick={() =>
                          handleQuestionWiseAnalysisClick(quiz._id)
                        }
                      >
                        Question Wise Analysis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {deleteModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h2>
                    Are you sure you <br />
                    want to delete?
                  </h2>
                  <div className="modal-actions">
                    <button
                      className="confirm-delete-btn"
                      onClick={confirmDelete}
                    >
                      Confirm Delete
                    </button>
                    <button className="cancel-btn" onClick={closeDeleteModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Analytics;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateQuiz from './pages/Dashboard/Sidebar/quiz/CreateQuiz.jsx'; // Assuming CreateQuiz has its own page
import Analytics from './pages/Dashboard/Analytics/Analytics'; // Assuming Analytics has its own page
import Form from './pages/Form/Form.jsx';
import QuizInterface from './pages/Livequiz/QuizInterface';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* <Route path='/quiz-Interface/' element={<QuizInterface />} /> */}
        <Route path='/quiz-Interface/:id' element={<QuizInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

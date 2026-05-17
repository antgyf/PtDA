import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

// Context
import AuthProvider from "./hooks/AuthContext";
import AlertProvider from "./hooks/AlertContext";
import FormProvider from "./hooks/FormContext";

// Components
import "./App.css";
import LoginPage from "./components/auth/LoginPage";
import SignUpForm from "./components/auth/SignUpPage";
import HomePage from "./components/HomePage/HomePage";
import FormPage from "./components/FormPage/FormPage";
import PrioritiesPage from "./components/FormPage/PrioritiesPage";
import AnalysisPage from "./components/AnalysisPage/AnalysisPage";

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <FormProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/priorities" element={<PrioritiesPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              {/* Default route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </FormProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;

// client/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import CompleteProfile from "./pages/CompleteProfile";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import TestList from "./pages/TestList";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import CoursePage from "./pages/CoursePage";
import SubjectPage from "./pages/SubjectPage";
import ReattemptPage from "./pages/ReattemptPage";
import PracticeResultPage from "./pages/PracticeResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/complete-profile"
          element={
            <PrivateRoute>
              <CompleteProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <PrivateRoute>
              <CoursePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/subject/:subjectId"
          element={
            <PrivateRoute>
              <SubjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <PrivateRoute>
              <TestList />
            </PrivateRoute>
          }
        />
        <Route
          path="/test/:testId"
          element={
            <PrivateRoute>
              <TestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/result/:attemptId"
          element={
            <PrivateRoute>
              <ResultPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reattempt/:testId"
          element={
            <PrivateRoute>
              <ReattemptPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/practice-result/:testId"
          element={
            <PrivateRoute>
              <PracticeResultPage />
            </PrivateRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1>Admin Panel</h1>
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

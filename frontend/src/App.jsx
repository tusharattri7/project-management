import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { PublicRoute } from "./routes/PublicRoute.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { ProjectDetails } from "./pages/ProjectDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

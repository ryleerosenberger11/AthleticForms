import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { ADDashboard } from "./components/ADDashboard";
import { CoachDashboard } from "./components/CoachDashboard";
import { AthleteDashboard } from "./components/AthleteDashboard";
import { mockForms, mockSubmissions, Form, FormSubmission } from "./lib/mockData";

export type UserRole = "ad" | "coach" | "athlete";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamId?: string; // For coaches and athletes
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [forms, setForms] = useState<Form[]>(mockForms);
  const [submissions, setSubmissions] = useState<FormSubmission[]>(mockSubmissions);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === "ad" && (
        <ADDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          forms={forms}
          setForms={setForms}
          submissions={submissions}
          setSubmissions={setSubmissions}
        />
      )}
      {currentUser.role === "coach" && (
        <CoachDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          forms={forms}
          submissions={submissions}
        />
      )}
      {currentUser.role === "athlete" && (
        <AthleteDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          forms={forms}
          submissions={submissions}
          setSubmissions={setSubmissions}
        />
      )}
    </div>
  );
}

export default App;
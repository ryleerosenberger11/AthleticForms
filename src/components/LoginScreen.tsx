import { useState } from "react";
import { User, UserRole } from "../App";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Clipboard } from "lucide-react";

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("athlete");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Mock users for demo
  const mockUsers: User[] = [
    { id: "ad1", name: "Sarah Johnson", role: "ad" },
    { id: "coach1", name: "Mike Williams", role: "coach", teamId: "team1" },
    { id: "coach2", name: "Lisa Chen", role: "coach", teamId: "team2" },
    { id: "athlete1", name: "Alex Martinez", role: "athlete", teamId: "team1" },
    { id: "athlete2", name: "Jordan Smith", role: "athlete", teamId: "team1" },
    { id: "athlete3", name: "Taylor Brown", role: "athlete", teamId: "team2" },
    { id: "athlete4", name: "Casey Davis", role: "athlete", teamId: "team2" },
  ];

  const filteredUsers = mockUsers.filter(user => user.role === selectedRole);

  const handleLogin = () => {
    const user = mockUsers.find(u => u.id === selectedUserId);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Clipboard className="size-12 text-indigo-600" />
        </div>
        <h1 className="text-center mb-8">Athletic Management System</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Select Role</Label>
            <Select value={selectedRole} onValueChange={(value) => {
              setSelectedRole(value as UserRole);
              setSelectedUserId("");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ad">Athletic Director</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="athlete">Athlete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            onClick={handleLogin}
            disabled={!selectedUserId}
          >
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
}

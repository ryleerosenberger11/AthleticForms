import { useState } from "react";
import { User } from "../App";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { LogOut, Users, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, User as UserIcon, Search } from "lucide-react";
import { mockAthletes, mockTeams, Form, FormSubmission } from "../lib/mockData";

interface CoachDashboardProps {
  user: User;
  onLogout: () => void;
  forms: Form[];
  submissions: FormSubmission[];
}

export function CoachDashboard({ user, onLogout, forms, submissions }: CoachDashboardProps) {
  const [expandedAthletes, setExpandedAthletes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const team = mockTeams.find(t => t.id === user.teamId);
  const teamAthletes = mockAthletes.filter(a => a.teamId === user.teamId);

  const toggleAthlete = (athleteId: string) => {
    const newExpanded = new Set(expandedAthletes);
    if (newExpanded.has(athleteId)) {
      newExpanded.delete(athleteId);
    } else {
      newExpanded.add(athleteId);
    }
    setExpandedAthletes(newExpanded);
  };

  const getSubmissionStatus = (athleteId: string, formId: string) => {
    const submission = submissions.find(
      s => s.athleteId === athleteId && s.formId === formId
    );
    return submission?.status || "not_submitted";
  };

  const getCompletionStats = (athleteId: string) => {
    const total = forms.length;
    const approved = forms.filter(
      f => getSubmissionStatus(athleteId, f.id) === "approved"
    ).length;
    
    return { total, approved };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="size-5 text-green-600" />;
      case "pending":
        return <Clock className="size-5 text-orange-500" />;
      default:
        return <XCircle className="size-5 text-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      default:
        return "Not Submitted";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}>
                <Users className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Forms Overview</h1>
                <p className="text-sm" style={{ color: '#64748b' }}>{user.name} • {team?.name}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#e6f2ff' }}>
              <Users className="size-5" style={{ color: '#006aff' }} />
            </div>
            <h2>Team Roster & Form Status</h2>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          {teamAthletes
            .filter(athlete => athlete.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(athlete => {
            const stats = getCompletionStats(athlete.id);
            const progressPercent = Math.round((stats.approved / stats.total) * 100);
            const isExpanded = expandedAthletes.has(athlete.id);
            
            return (
              <div key={athlete.id}>
                <button
                  onClick={() => toggleAthlete(athlete.id)}
                  className="w-full p-5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserIcon className="size-5 text-gray-400" />
                      <span className="text-gray-900">{athlete.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={
                          progressPercent === 100
                            ? "bg-green-100 text-green-700 border-green-300"
                            : progressPercent > 0
                            ? "bg-orange-100 text-orange-700 border-orange-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }
                      >
                        {stats.approved}/{stats.total} Complete
                      </Badge>
                      
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="ml-8 mt-2 space-y-2">
                    {forms.map(form => {
                      const status = getSubmissionStatus(athlete.id, form.id);
                      
                      return (
                        <div
                          key={form.id}
                          className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50"
                        >
                          <span className="text-sm text-gray-700">{form.title}</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span className="text-sm text-gray-600">{getStatusText(status)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
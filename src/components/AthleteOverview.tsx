import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { mockAthletes, mockTeams, Form, FormSubmission } from "../lib/mockData";
import { CheckCircle, Clock, XCircle, User, ChevronDown, ChevronUp, Eye, FileText, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface AthleteOverviewProps {
  forms: Form[];
  submissions: FormSubmission[];
}

export function AthleteOverview({ forms, submissions }: AthleteOverviewProps) {
  const [expandedAthletes, setExpandedAthletes] = useState<Set<string>>(new Set());
  const [viewingSubmissionId, setViewingSubmissionId] = useState<string | null>(null);

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

  const getSubmission = (athleteId: string, formId: string) => {
    return submissions.find(
      s => s.athleteId === athleteId && s.formId === formId
    );
  };

  const getCompletionStats = (athleteId: string) => {
    const total = forms.length;
    const approved = forms.filter(
      f => getSubmissionStatus(athleteId, f.id) === "approved"
    ).length;
    const pending = forms.filter(
      f => getSubmissionStatus(athleteId, f.id) === "pending"
    ).length;
    const notSubmitted = total - approved - pending;
    
    return { total, approved, pending, notSubmitted };
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

  const viewingSubmission = submissions.find(s => s.id === viewingSubmissionId);
  const viewingForm = viewingSubmission ? forms.find(f => f.id === viewingSubmission.formId) : null;
  const viewingAthlete = viewingSubmission ? mockAthletes.find(a => a.id === viewingSubmission.athleteId) : null;

  return (
    <>
      <div className="bg-white rounded-2xl">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#e6f2ff' }}>
              <User className="size-5" style={{ color: '#006aff' }} />
            </div>
            <h2>All Athletes</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {mockTeams.map(team => {
              const teamAthletes = mockAthletes.filter(a => a.teamId === team.id);
              
              return (
                <div key={team.id}>
                  <h3 className="mb-4 px-4" style={{ color: '#006aff' }}>{team.name}</h3>
                  
                  <div className="space-y-2">
                    {teamAthletes.map(athlete => {
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
                                <User className="size-5 text-gray-400" />
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
                                const submission = getSubmission(athlete.id, form.id);
                                
                                return (
                                  <div
                                    key={form.id}
                                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50"
                                  >
                                    <span className="text-sm text-gray-700">{form.title}</span>
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(status)}
                                        <span className="text-sm text-gray-600">{getStatusText(status)}</span>
                                      </div>
                                      {(status === "pending" || status === "approved") && submission && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingSubmissionId(submission.id);
                                          }}
                                          className="rounded-lg"
                                        >
                                          <Eye className="size-4 mr-1" />
                                          View Submission
                                        </Button>
                                      )}
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={!!viewingSubmissionId} onOpenChange={() => setViewingSubmissionId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>View Submission</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Form</p>
              <p>{viewingForm?.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Athlete</p>
              <p>{viewingAthlete?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              {viewingSubmission?.status === "approved" && (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  <CheckCircle className="size-3 mr-1" />
                  Approved
                </Badge>
              )}
              {viewingSubmission?.status === "pending" && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  <Clock className="size-3 mr-1" />
                  Pending Review
                </Badge>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Submitted</p>
              <p>{viewingSubmission?.submittedAt.toLocaleDateString()}</p>
            </div>

            {viewingSubmission?.documentUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Submitted Document</p>
                <a
                  href={viewingSubmission.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 hover:shadow-md transition-all"
                  style={{ backgroundColor: '#e6f2ff', borderColor: '#006aff', color: '#006aff' }}
                >
                  <FileText className="size-4" />
                  View Submitted Form
                  <ExternalLink className="size-4" />
                </a>
              </div>
            )}

            {viewingSubmission?.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Athlete Notes</p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{viewingSubmission.notes}</p>
                </div>
              </div>
            )}

            {viewingSubmission?.reviewNotes && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Review Notes from AD</p>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#e6f2ff' }}>
                  <p className="text-sm">{viewingSubmission.reviewNotes}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button onClick={() => setViewingSubmissionId(null)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

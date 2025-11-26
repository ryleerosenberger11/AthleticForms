import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockTeams, Form, FormSubmission } from "../lib/mockData";
import { CheckCircle, Clock, FileText, User, ExternalLink } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface ReviewQueueProps {
  submissions: FormSubmission[];
  setSubmissions: (submissions: FormSubmission[]) => void;
  forms: Form[];
}

export function ReviewQueue({ submissions, setSubmissions, forms }: ReviewQueueProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Filter to only show pending submissions, sorted by date
  const pendingSubmissions = submissions
    .filter(s => s.status === "pending")
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

  const handleApprove = (submissionId: string) => {
    setSubmissions(
      submissions.map(sub =>
        sub.id === submissionId
          ? { ...sub, status: "approved" as const, reviewNotes: reviewNotes }
          : sub
      )
    );
    setSelectedSubmission(null);
    setReviewNotes("");
  };

  const selectedSub = submissions.find(s => s.id === selectedSubmission);
  const selectedForm = selectedSub ? forms.find(f => f.id === selectedSub.formId) : null;

  return (
    <>
      <div className="bg-white rounded-2xl">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#e6f2ff' }}>
              <Clock className="size-5" style={{ color: '#006aff' }} />
            </div>
            <h2>Review Queue</h2>
          </div>
        </div>
        
        <div className="p-8">
          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No submissions to review
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map(submission => {
                const form = forms.find(f => f.id === submission.formId);
                const team = mockTeams.find(t => t.id === submission.teamId);
                
                return (
                  <div
                    key={submission.id}
                    className="p-5 rounded-xl border-2 transition-colors bg-white hover:shadow-sm"
                   style={{ borderColor: '#e5e7eb' }} // gray-300
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="size-5 text-gray-600" />
                          <h3 className="text-gray-900">{form?.title}</h3>
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                            <Clock className="size-3 mr-1" />
                            Pending Review
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                          <span className="flex items-center gap-1">
                            <User className="size-4" />
                            {submission.athleteName}
                          </span>
                          <span>•</span>
                          <span>{team?.name}</span>
                          <span>•</span>
                          <span>Submitted {submission.submittedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => setSelectedSubmission(submission.id)}
                        className="rounded-xl ml-4"
                        style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}
                      >
                        Review & Approve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Form</p>
              <p>{selectedForm?.title}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Athlete</p>
              <p>{selectedSub?.athleteName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Submitted</p>
              <p>{selectedSub?.submittedAt.toLocaleDateString()}</p>
            </div>

            {selectedSub?.documentUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Submitted Document</p>
                <a
                  href={selectedSub.documentUrl}
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

            <div>
              <p className="text-sm text-gray-500 mb-2">Review Notes (Optional)</p>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any notes about this submission..."
                rows={3}
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelectedSubmission(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={() => selectedSubmission && handleApprove(selectedSubmission)}
              className="rounded-xl"
              style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}
            >
              <CheckCircle className="size-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
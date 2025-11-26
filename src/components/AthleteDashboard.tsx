import { useState } from "react";
import { User } from "../App";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { LogOut, FileText, CheckCircle, Clock, Circle, Upload, ExternalLink, Search, Eye } from "lucide-react";
import { mockTeams, Form, FormSubmission } from "../lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface AthleteDashboardProps {
  user: User;
  onLogout: () => void;
  forms: Form[];
  submissions: FormSubmission[];
  setSubmissions: (submissions: FormSubmission[]) => void;
}

export function AthleteDashboard({ user, onLogout, forms, submissions, setSubmissions }: AthleteDashboardProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSubmissionId, setViewingSubmissionId] = useState<string | null>(null);
  
  const team = mockTeams.find(t => t.id === user.teamId);

  const getFormStatus = (formId: string) => {
    const submission = submissions.find(
      s => s.athleteId === user.id && s.formId === formId
    );
    return submission?.status || "not_submitted";
  };

  const getFormSubmission = (formId: string) => {
    return submissions.find(
      s => s.athleteId === user.id && s.formId === formId
    );
  };

  const handleSubmit = () => {
    if (!selectedFormId) return;

    const newSubmission = {
      id: `sub${submissions.length + 1}`,
      formId: selectedFormId,
      athleteId: user.id,
      athleteName: user.name,
      teamId: user.teamId!,
      submittedAt: new Date(),
      status: "pending" as const,
      notes: submissionNotes,
      documentUrl: selectedFile ? `https://example.com/${selectedFile.name}` : undefined,
    };

    setSubmissions([...submissions, newSubmission]);
    setSelectedFormId(null);
    setSubmissionNotes("");
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const selectedForm = forms.find(f => f.id === selectedFormId);
  const viewingSubmission = submissions.find(s => s.id === viewingSubmissionId);
  const viewingForm = viewingSubmission ? forms.find(f => f.id === viewingSubmission.formId) : null;

  const completedCount = forms.filter(f => getFormStatus(f.id) === "approved").length;
  const pendingCount = forms.filter(f => getFormStatus(f.id) === "pending").length;
  const totalCount = forms.length;

  // Sort forms: not_submitted, pending, approved
  const sortedForms = [...forms].sort((a, b) => {
    const statusA = getFormStatus(a.id);
    const statusB = getFormStatus(b.id);
    const order = { "not_submitted": 0, "pending": 1, "approved": 2 };
    return order[statusA] - order[statusB];
  });

  // Filter forms by search query
  const filteredForms = sortedForms.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: '#006aff' }}>
                  <FileText className="size-6 text-white" />
                </div>
                <div>
                  <h1 className="text-gray-900">My Forms</h1>
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div 
                    className="size-24 rounded-full flex items-center justify-center"
                    style={{ 
                      background: '#006aff'
                    }}
                  >
                    <div className="text-white text-center">
                      <div className="text-2xl">{completedCount}/{totalCount}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="mb-1">Your Progress</h2>
                  <p className="text-sm text-gray-600">
                    {completedCount === totalCount 
                      ? 'All forms completed!' 
                      : `${totalCount - completedCount} form${totalCount - completedCount === 1 ? '' : 's'} remaining`}
                  </p>
                </div>
              </div>
              {pendingCount > 0 && (
                <Badge 
                  variant="outline" 
                  className="bg-orange-100 text-orange-700 border-orange-300 px-4 py-2"
                >
                  {pendingCount} Pending Review
                </Badge>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#e6f2ff' }}>
                  <FileText className="size-5" style={{ color: '#006aff' }} />
                </div>
                <h2>Required Forms</h2>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredForms.map(form => {
              const status = getFormStatus(form.id);
              const submission = getFormSubmission(form.id);
              
              return (
                <div 
                  key={form.id} 
                  className="p-5 border rounded-xl hover:border-gray-300 transition-colors"
                  style={{ 
                    borderColor: status === 'approved' ? '#10b981' : status === 'pending' ? '#f97316' : '#e5e7eb'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {status === "not_submitted" && (
                          <Circle className="size-6 text-gray-300" />
                        )}
                        {status === "pending" && (
                          <div className="relative">
                            <Clock className="size-6 text-orange-500" />
                            <div className="absolute -top-1 -right-1 size-3 rounded-full bg-orange-500 animate-pulse" />
                          </div>
                        )}
                        {status === "approved" && (
                          <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="size-5 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="mb-1">{form.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                        
                        {form.documentUrl && (
                          <a
                            href={form.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm flex items-center gap-1 hover:underline"
                            style={{ color: '#006aff' }}
                          >
                            View Form Template
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      {status === "not_submitted" && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedFormId(form.id)}
                          className="rounded-xl"
                          style={{ background: '#006aff' }}
                        >
                          Submit Form
                        </Button>
                      )}
                      {status === "pending" && (
                        <>
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 px-3 py-1">
                            Pending Review
                          </Badge>
                          {submission && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingSubmissionId(submission.id)}
                              className="rounded-xl"
                            >
                              <Eye className="size-4 mr-1" />
                              View
                            </Button>
                          )}
                        </>
                      )}
                      {status === "approved" && (
                        <>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 px-3 py-1">
                            <CheckCircle className="size-3 mr-1" />
                            Approved
                          </Badge>
                          {submission && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingSubmissionId(submission.id)}
                              className="rounded-xl"
                            >
                              <Eye className="size-4 mr-1" />
                              View
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Dialog open={!!selectedFormId} onOpenChange={() => setSelectedFormId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Submit Form</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Form</p>
              <p>{selectedForm?.title}</p>
            </div>

            {selectedForm?.documentUrl && (
              <div className="p-4 rounded-xl border-2" style={{ backgroundColor: '#e6f2ff', borderColor: '#006aff' }}>
                <p className="text-sm text-gray-700 mb-3">Form Template Available</p>
                <a
                  href={selectedForm.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                  style={{ color: '#006aff' }}
                >
                  <FileText className="size-4" />
                  Download Form Template
                  <ExternalLink className="size-3" />
                </a>
              </div>
            )}

            <div>
              <Label htmlFor="upload" className="mb-2 block">Upload Completed Document</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-2 hover:border-[#006aff] transition-colors"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="size-4 mr-2" />
                  {selectedFile ? selectedFile.name : 'Choose File'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Upload your completed form (PDF, JPG, or PNG)
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="mb-2 block">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Add any notes for the Athletic Director..."
                rows={3}
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelectedFormId(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="rounded-xl"
              style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}
            >
              Submit Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <p className="text-sm text-gray-500 mb-2">Your Notes</p>
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

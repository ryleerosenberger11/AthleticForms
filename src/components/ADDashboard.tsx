import { useState } from "react";
import { User } from "../App";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LogOut, Upload, FileText, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { FormsManagement } from "./FormsManagement";
import { ReviewQueue } from "./ReviewQueue";
import { AthleteOverview } from "./AthleteOverview";
import { Form, FormSubmission } from "../lib/mockData";

interface ADDashboardProps {
  user: User;
  onLogout: () => void;
  forms: Form[];
  setForms: (forms: Form[]) => void;
  submissions: FormSubmission[];
  setSubmissions: (submissions: FormSubmission[]) => void;
}

export function ADDashboard({ user, onLogout, forms, setForms, submissions, setSubmissions }: ADDashboardProps) {
  const [activeTab, setActiveTab] = useState("review");
  
  const pendingCount = submissions.filter(s => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}>
                <FileText className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Forms Management</h1>
                <p className="text-sm" style={{ color: '#64748b' }}>{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
         <TabsList className="inline-flex bg-gray-50 p-1 rounded-xl border border-gray-200 space-x-4 py-2">
            <TabsTrigger
              value="review" 
              className="relative rounded-xl data-[state=active]:bg-[#006aff] data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-4 flex items-center gap-2"
              >
              Review Queue
              {pendingCount > 0 && (
                <Badge 
                  className="ml-2" 
                  style={{ backgroundColor: activeTab === 'review' ? 'rgba(255,255,255,0.25)' : '#006aff', color: activeTab === 'review' ? 'white' : 'white' }}
                >
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="forms"
              className="relative rounded-xl data-[state=active]:bg-[#006aff] data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-4 flex items-center gap-2"
            >
              <Upload className="size-4 mr-2" />
              Forms
            </TabsTrigger>
            <TabsTrigger
              value="athletes"
              className="relative rounded-xl data-[state=active]:bg-[#006aff] data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-4 flex items-center gap-2"
              >
              <Users className="size-4 mr-2" />
              Athletes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="mt-6">
            <ReviewQueue submissions={submissions} setSubmissions={setSubmissions} forms={forms} />
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <FormsManagement forms={forms} setForms={setForms} />
          </TabsContent>

          <TabsContent value="athletes" className="mt-6">
            <AthleteOverview forms={forms} submissions={submissions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
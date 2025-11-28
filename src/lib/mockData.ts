export interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  documentUrl?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  athleteId: string;
  athleteName: string;
  teamId: string;
  submittedAt: Date;
  status: "not_submitted" | "pending" | "approved";
  documentUrl?: string;
  notes?: string;
  reviewNotes?: string;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
}

export interface Athlete {
  id: string;
  name: string;
  teamId: string;
  email: string;
}

// Mock data
export const mockTeams: Team[] = [
  { id: "team1", name: "Varsity Basketball", sport: "Basketball" },
  { id: "team2", name: "Varsity Soccer", sport: "Soccer" },
];

export const mockAthletes: Athlete[] = [
  { id: "athlete1", name: "Abby Ryan", teamId: "team1", email: "alex@school.edu" },
  { id: "athlete2", name: "Jordan Smith", teamId: "team1", email: "jordan@school.edu" },
  { id: "athlete3", name: "Taylor Brown", teamId: "team2", email: "taylor@school.edu" },
  { id: "athlete4", name: "Casey Davis", teamId: "team2", email: "casey@school.edu" },
];

export const mockForms: Form[] = [
  {
    id: "form1",
    title: "Medical Clearance Form",
    description: "Annual medical examination and clearance for athletic participation",
    createdAt: new Date("2025-01-15"),
    documentUrl: "https://example.com/medical-form.pdf",
  },
  {
    id: "form2",
    title: "Emergency Contact Information",
    description: "Emergency contact details and medical information",
    createdAt: new Date("2025-01-18"),
    documentUrl: "https://example.com/emergency-form.pdf",
  },
  {
    id: "form3",
    title: "Athlete Code of Conduct",
    description: "Acknowledgment of athletic department rules and expectations",
    createdAt: new Date("2025-02-01"),
  },
  {
    id: "form4",
    title: "Insurance Waiver",
    description: "Proof of insurance or waiver documentation",
    createdAt: new Date("2025-02-05"),
  },
];

export const mockSubmissions: FormSubmission[] = [
  // Alex Martinez submissions
  {
    id: "sub1",
    formId: "form1",
    athleteId: "athlete1",
    athleteName: "Abby Ryan",
    teamId: "team1",
    submittedAt: new Date("2025-02-10"),
    status: "pending",
    documentUrl: "https://example.com/alex-medical-form.pdf",
  },
  {
    id: "sub2",
    formId: "form2",
    athleteId: "athlete1",
    athleteName: "Abby Ryan",
    teamId: "team1",
    submittedAt: new Date("2025-02-12"),
    status: "approved",
    documentUrl: "https://example.com/alex-emergency-form.pdf",
  },
  // Jordan Smith submissions
  {
    id: "sub3",
    formId: "form1",
    athleteId: "athlete2",
    athleteName: "Jordan Smith",
    teamId: "team1",
    submittedAt: new Date("2025-02-08"),
    status: "approved",
    documentUrl: "https://example.com/jordan-medical-form.pdf",
  },
  {
    id: "sub4",
    formId: "form2",
    athleteId: "athlete2",
    athleteName: "Jordan Smith",
    teamId: "team1",
    submittedAt: new Date("2025-02-14"),
    status: "pending",
    documentUrl: "https://example.com/jordan-emergency-form.pdf",
  },
  {
    id: "sub5",
    formId: "form3",
    athleteId: "athlete2",
    athleteName: "Jordan Smith",
    teamId: "team1",
    submittedAt: new Date("2025-02-15"),
    status: "pending",
    documentUrl: "https://example.com/jordan-conduct-form.pdf",
  },
  // Taylor Brown submissions
  {
    id: "sub6",
    formId: "form1",
    athleteId: "athlete3",
    athleteName: "Taylor Brown",
    teamId: "team2",
    submittedAt: new Date("2025-02-09"),
    status: "approved",
    documentUrl: "https://example.com/taylor-medical-form.pdf",
  },
  // Casey Davis - no submissions yet
];
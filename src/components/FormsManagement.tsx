import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Form } from "../lib/mockData";
import { Plus, FileText, Upload, ExternalLink, Pencil, Trash2, Search } from "lucide-react";

interface FormsManagementProps {
  forms: Form[];
  setForms: (forms: Form[]) => void;
}

export function FormsManagement({ forms, setForms }: FormsManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<string | null>(null);
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    documentUrl: "",
  });

  const handleCreateForm = () => {
    const form = {
      id: `form${forms.length + 1}`,
      title: newForm.title,
      description: newForm.description,
      documentUrl: newForm.documentUrl || undefined,
      createdAt: new Date(),
    };
    
    setForms([...forms, form]);
    setIsDialogOpen(false);
    setNewForm({ title: "", description: "", documentUrl: "" });
    setEditingForm(null);
  };

  const handleEditForm = (id: string) => {
    const form = forms.find(f => f.id === id);
    if (form) {
      setEditingForm(id);
      setNewForm({
        title: form.title,
        description: form.description,
        documentUrl: form.documentUrl || "",
      });
      setIsDialogOpen(true);
    }
  };

  const handleUpdateForm = () => {
    const updatedForms = forms.map(form => {
      if (form.id === editingForm) {
        return {
          ...form,
          title: newForm.title,
          description: newForm.description,
          documentUrl: newForm.documentUrl || undefined,
        };
      }
      return form;
    });
    setForms(updatedForms);
    setIsDialogOpen(false);
    setEditingForm(null);
    setNewForm({ title: "", description: "", documentUrl: "" });
  };

  const handleDeleteForm = (id: string) => {
    setDeleteFormId(id);
  };

  const confirmDeleteForm = () => {
    if (deleteFormId) {
      const updatedForms = forms.filter(form => form.id !== deleteFormId);
      setForms(updatedForms);
      setDeleteFormId(null);
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-2xl">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e6f2ff' }}>
                <FileText className="size-5" style={{ color: '#006aff' }} />
              </div>
              <h2>Forms Management</h2>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="rounded-xl"
              style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}
            >
              <Plus className="size-4 mr-2" />
              Create New Form
            </Button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredForms.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(form => (
              <div key={form.id} className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg mt-1" style={{ backgroundColor: '#e6f2ff' }}>
                    <FileText className="size-5" style={{ color: '#006aff' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{form.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Created {form.createdAt.toLocaleDateString()}</span>
                      {form.documentUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={form.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline"
                            style={{ color: '#006aff' }}
                          >
                            View Document
                            <ExternalLink className="size-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditForm(form.id)}
                    className="rounded-lg hover:bg-gray-50"
                  >
                    <Pencil className="size-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteForm(form.id)}
                    className="rounded-lg text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingForm ? "Edit Form" : "Create New Form"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="mb-2 block">Form Title</Label>
              <Input
                id="title"
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="e.g. Medical Clearance Form"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">Description</Label>
              <Textarea
                id="description"
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="Brief description of this form..."
                rows={3}
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="document" className="mb-2 block">Document URL (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="document"
                  value={newForm.documentUrl}
                  onChange={(e) => setNewForm({ ...newForm, documentUrl: e.target.value })}
                  placeholder="https://example.com/form.pdf"
                  className="rounded-xl"
                />
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Upload className="size-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload a document or provide a URL to the form template
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={editingForm ? handleUpdateForm : handleCreateForm}
              disabled={!newForm.title || !newForm.description}
              className="rounded-xl"
              style={{ background: 'linear-gradient(135deg, #006aff 0%, #0052cc 100%)' }}
            >
              {editingForm ? "Update Form" : "Create Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteFormId !== null} onOpenChange={setDeleteFormId}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteForm}
              className="rounded-xl"
              style={{ background: 'linear-gradient(135deg, #d4183d 0%, #b01530 100%)' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
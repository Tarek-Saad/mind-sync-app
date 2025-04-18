"use client"

import { useState } from "react"
import { Plus, Trash2, AlertCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skill } from "@/components/portfolio-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { addSkill, deleteSkill, editSkill } from "@/services/skills-service"

interface SkillsListProps {
  skills: Skill[]
  isLoading: boolean
  selectedPortfolio: string
  getDbUriForPortfolio: (portfolioId: string) => string
  onSkillAdded: (skill: Skill) => void
  onSkillDeleted: (skillId: string) => void
  onSkillEdited: (skill: Skill) => void
}

export function SkillsList({ 
  skills, 
  isLoading, 
  selectedPortfolio, 
  getDbUriForPortfolio,
  onSkillAdded,
  onSkillDeleted,
  onSkillEdited
}: SkillsListProps) {
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [isEditSkillDialogOpen, setIsEditSkillDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "other",
    iconType: "none",
    iconName: ""
  })
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editSkillData, setEditSkillData] = useState({
    name: "",
    category: "other",
    iconType: "none",
    iconName: ""
  })
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [isEditingSkill, setIsEditingSkill] = useState(false)
  const [addSkillError, setAddSkillError] = useState<string | null>(null)
  const [editSkillError, setEditSkillError] = useState<string | null>(null)
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null)
  const [isDeletingSkill, setIsDeletingSkill] = useState(false)
  const [deleteSkillError, setDeleteSkillError] = useState<string | null>(null)

  // Function to handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      setAddSkillError("Skill name is required");
      return;
    }

    setIsAddingSkill(true);
    setAddSkillError(null);

    try {
      const dbUri = getDbUriForPortfolio(selectedPortfolio);
      if (!dbUri) {
        throw new Error("No database URI found for the selected portfolio");
      }

      const addedSkill = await addSkill(dbUri, selectedPortfolio, newSkill);
      console.log("Skill added:", addedSkill);

      // Notify parent component
      onSkillAdded(addedSkill);

      // Reset the form and close the dialog
      setNewSkill({
        name: "",
        category: "other",
        iconType: "none",
        iconName: ""
      });
      setIsAddSkillDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding skill:", error);
      setAddSkillError(error.message);
    } finally {
      setIsAddingSkill(false);
    }
  };

  // Function to open edit dialog and set initial values
  const handleOpenEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setEditSkillData({
      name: skill.name,
      category: skill.category,
      iconType: skill.iconType,
      iconName: skill.iconName
    });
    setIsEditSkillDialogOpen(true);
  };

  // Function to handle editing a skill
  const handleEditSkill = async () => {
    if (!editingSkill) return;
    if (!editSkillData.name.trim()) {
      setEditSkillError("Skill name is required");
      return;
    }

    setIsEditingSkill(true);
    setEditSkillError(null);

    try {
      const dbUri = getDbUriForPortfolio(selectedPortfolio);
      if (!dbUri) {
        throw new Error("No database URI found for the selected portfolio");
      }

      const updatedSkill = await editSkill(dbUri, selectedPortfolio, editingSkill._id, editSkillData);
      console.log("Skill updated:", updatedSkill);

      // Notify parent component
      onSkillEdited(updatedSkill);

      // Reset the form and close the dialog
      setEditingSkill(null);
      setEditSkillData({
        name: "",
        category: "other",
        iconType: "none",
        iconName: ""
      });
      setIsEditSkillDialogOpen(false);
    } catch (error: any) {
      console.error("Error editing skill:", error);
      setEditSkillError(error.message);
    } finally {
      setIsEditingSkill(false);
    }
  };

  // Function to handle deleting a skill
  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;

    setIsDeletingSkill(true);
    setDeleteSkillError(null);

    try {
      const dbUri = getDbUriForPortfolio(selectedPortfolio);
      if (!dbUri) {
        throw new Error("No database URI found for the selected portfolio");
      }

      const result = await deleteSkill(dbUri, selectedPortfolio, skillToDelete._id);
      console.log("Skill deleted:", result);

      // Notify parent component
      onSkillDeleted(skillToDelete._id);

      // Reset the state
      setSkillToDelete(null);
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      setDeleteSkillError(error.message);
    } finally {
      setIsDeletingSkill(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <Button onClick={() => setIsAddSkillDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : skills.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleOpenEditDialog(skill)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setSkillToDelete(skill)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{skill.category}</p>
                </div>
                {skill.iconType !== 'none' && (
                  <div className="h-10 w-10 flex items-center justify-center">
                    {skill.iconType === 'react-icon' ? (
                      <div className="bg-blue-100 text-blue-600 h-full w-full rounded-full flex items-center justify-center">
                        {skill.iconName ? skill.iconName.substring(0, 1) : ''}
                      </div>
                    ) : skill.iconType === 'custom-svg' ? (
                      <div className="bg-green-100 text-green-600 h-full w-full rounded-full flex items-center justify-center">
                        {skill.iconName ? skill.iconName.substring(0, 1) : ''}
                      </div>
                    ) : (
                      <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center">
                        {skill.name.substring(0, 1)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No skills found for this portfolio. Add your first skill to get started.
        </div>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-name" className="text-right">
                Name
              </Label>
              <Input
                id="skill-name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="col-span-3"
                placeholder="React.js"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-category" className="text-right">
                Category
              </Label>
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
              >
                <SelectTrigger id="skill-category" className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="framework">Framework</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-icon-type" className="text-right">
                Icon Type
              </Label>
              <Select
                value={newSkill.iconType}
                onValueChange={(value) => setNewSkill({ ...newSkill, iconType: value })}
              >
                <SelectTrigger id="skill-icon-type" className="col-span-3">
                  <SelectValue placeholder="Select an icon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react-icon">React Icon</SelectItem>
                  <SelectItem value="custom-svg">Custom SVG</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newSkill.iconType !== 'none' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skill-icon-name" className="text-right">
                  Icon Name
                </Label>
                <Input
                  id="skill-icon-name"
                  value={newSkill.iconName}
                  onChange={(e) => setNewSkill({ ...newSkill, iconName: e.target.value })}
                  className="col-span-3"
                  placeholder={newSkill.iconType === 'react-icon' ? "FaReact" : "path/to/icon.svg"}
                />
              </div>
            )}
            {addSkillError && (
              <div className="text-red-500 text-sm mt-2">{addSkillError}</div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddSkill} disabled={isAddingSkill}>
              {isAddingSkill ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditSkillDialogOpen} onOpenChange={setIsEditSkillDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-skill-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-skill-name"
                value={editSkillData.name}
                onChange={(e) => setEditSkillData({ ...editSkillData, name: e.target.value })}
                className="col-span-3"
                placeholder="React.js"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-skill-category" className="text-right">
                Category
              </Label>
              <Select
                value={editSkillData.category}
                onValueChange={(value) => setEditSkillData({ ...editSkillData, category: value })}
              >
                <SelectTrigger id="edit-skill-category" className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="framework">Framework</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-skill-icon-type" className="text-right">
                Icon Type
              </Label>
              <Select
                value={editSkillData.iconType}
                onValueChange={(value) => setEditSkillData({ ...editSkillData, iconType: value })}
              >
                <SelectTrigger id="edit-skill-icon-type" className="col-span-3">
                  <SelectValue placeholder="Select an icon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react-icon">React Icon</SelectItem>
                  <SelectItem value="custom-svg">Custom SVG</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editSkillData.iconType !== 'none' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-skill-icon-name" className="text-right">
                  Icon Name
                </Label>
                <Input
                  id="edit-skill-icon-name"
                  value={editSkillData.iconName}
                  onChange={(e) => setEditSkillData({ ...editSkillData, iconName: e.target.value })}
                  className="col-span-3"
                  placeholder={editSkillData.iconType === 'react-icon' ? "FaReact" : "path/to/icon.svg"}
                />
              </div>
            )}
            {editSkillError && (
              <div className="text-red-500 text-sm mt-2">{editSkillError}</div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSkill} disabled={isEditingSkill}>
              {isEditingSkill ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Skill Confirmation Dialog */}
      <AlertDialog open={!!skillToDelete} onOpenChange={(open) => !open && setSkillToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the skill "{skillToDelete?.name}" from your portfolio.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteSkillError && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              {deleteSkillError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSkill}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSkill} 
              disabled={isDeletingSkill}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeletingSkill ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
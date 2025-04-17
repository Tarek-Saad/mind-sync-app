"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { Project } from "@/components/portfolio-selector"
import { useToast } from "@/components/ui/use-toast"

interface ProjectFormProps {
  selectedPortfolio: string;
  projects: Project[];
  onProjectAdded: (project: Project) => void;
}

export function ProjectForm({ selectedPortfolio, projects, onProjectAdded }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    imgPath: "/Assets/Projects/default.png",
    imagePaths: [],
    ghLink: "",
    demoLink: "",
    skills: [],
    technologies: [],
    tools: [],
    keyFeatures: [],
    date: new Date().toISOString().split('T')[0],
    views: 0
  })
  const { toast } = useToast()
  
  // State for array input fields
  const [newImagePath, setNewImagePath] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newTechnology, setNewTechnology] = useState("")
  const [newTool, setNewTool] = useState("")
  const [newKeyFeature, setNewKeyFeature] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  }

  // Handlers for array fields
  const handleAddImagePath = () => {
    if (newImagePath.trim()) {
      setNewProject(prev => ({
        ...prev,
        imagePaths: [...(prev.imagePaths || []), newImagePath.trim()]
      }));
      setNewImagePath("");
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setNewProject(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill("");
    }
  }

  const handleAddTechnology = () => {
    if (newTechnology.trim()) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()]
      }));
      setNewTechnology("");
    }
  }

  const handleAddTool = () => {
    if (newTool.trim()) {
      setNewProject(prev => ({
        ...prev,
        tools: [...(prev.tools || []), newTool.trim()]
      }));
      setNewTool("");
    }
  }

  const handleAddKeyFeature = () => {
    if (newKeyFeature.trim()) {
      setNewProject(prev => ({
        ...prev,
        keyFeatures: [...(prev.keyFeatures || []), `🔹 ${newKeyFeature.trim()}`]
      }));
      setNewKeyFeature("");
    }
  }

  // Handlers to remove items from arrays
  const handleRemoveItem = (array: string, index: number) => {
    setNewProject(prev => {
      const updatedArray = [...(prev[array as keyof typeof prev] as string[] || [])];
      updatedArray.splice(index, 1);
      return { ...prev, [array]: updatedArray };
    });
  }

  const handleAddProject = async (e: React.FormEvent, closeDialog: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the database URI for the selected portfolio
      const portfolios = [  
        { 
          id: "fullstack", 
          name: "Full Stack Portfolio", 
          dbUri: "mongodb+srv://Tarek:SAad1976t@cluster0.cqa4kwi.mongodb.net/portofolio?retryWrites=true&w=majority&appName=Cluster0" 
        },
        { 
          id: "graphics", 
          name: "Graphic Design Portfolio", 
          dbUri: "mongodb+srv://Tarek:SAad1976t@cluster0.cqa4kwi.mongodb.net/portofolio-graphic-design?retryWrites=true&w=majority&appName=Cluster0" 
        },
        { id: "professional", name: "Professional Portfolio", dbUri: "mongodb+srv://Tarek:SAad1976t@cluster0.cqa4kwi.mongodb.net/" },
        { id: "creative", name: "Creative Portfolio", dbUri: "" },
        { id: "technical", name: "Technical Portfolio", dbUri: "" },
      ];
      
      const portfolio = portfolios.find(p => p.id === selectedPortfolio);
      const dbUri = portfolio?.dbUri || "";
      
      if (!dbUri) {
        toast({
          title: "Error",
          description: "No database URI found for the selected portfolio",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a new ID (highest ID + 1)
      const newId = projects.length > 0 
        ? Math.max(...projects.map(p => p.id)) + 1 
        : 1;
      
      // Create the complete project object
      const projectToAdd: Project = {
        ...newProject as any,
        id: newId,
      };
      
      // Submit to API
      const response = await fetch('/api/projects/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          project: projectToAdd,
          dbUri 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Call the callback to update parent state
      onProjectAdded(result.project);
      
      // Reset form
      setNewProject({
        title: "",
        description: "",
        imgPath: "/Assets/Projects/default.png",
        imagePaths: [],
        ghLink: "",
        demoLink: "",
        skills: [],
        technologies: [],
        tools: [],
        keyFeatures: [],
        date: new Date().toISOString().split('T')[0],
        views: 0
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Project added successfully",
      });
      
      // Close the dialog
      closeDialog();
      
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description: `Failed to add project: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddProject(e, () => {
            const closeButton = document.querySelector('[data-dialog-close]');
            if (closeButton instanceof HTMLElement) {
              closeButton.click();
            }
          });
        }}>
          <div className="grid gap-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newProject.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imgPath" className="text-right">
                Main Image Path
              </Label>
              <Input
                id="imgPath"
                name="imgPath"
                value={newProject.imgPath}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Image Paths */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Additional Images
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newImagePath}
                    onChange={(e) => setNewImagePath(e.target.value)}
                    placeholder="Add image path"
                  />
                  <Button type="button" onClick={handleAddImagePath} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.imagePaths?.map((path, index) => (
                    <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm">
                      {path.split('/').pop()}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => handleRemoveItem('imagePaths', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Links */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ghLink" className="text-right">
                GitHub Link
              </Label>
              <Input
                id="ghLink"
                name="ghLink"
                value={newProject.ghLink}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="demoLink" className="text-right">
                Demo Link
              </Label>
              <Input
                id="demoLink"
                name="demoLink"
                value={newProject.demoLink || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            {/* Skills */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Skills
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill"
                  />
                  <Button type="button" onClick={handleAddSkill} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm">
                      {skill}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => handleRemoveItem('skills', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Technologies */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Technologies
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add technology"
                  />
                  <Button type="button" onClick={handleAddTechnology} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.technologies?.map((tech, index) => (
                    <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm">
                      {tech}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => handleRemoveItem('technologies', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tools */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Tools
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="Add tool"
                  />
                  <Button type="button" onClick={handleAddTool} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.tools?.map((tool, index) => (
                    <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm">
                      {tool}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => handleRemoveItem('tools', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Key Features */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Key Features
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newKeyFeature}
                    onChange={(e) => setNewKeyFeature(e.target.value)}
                    placeholder="Add key feature"
                  />
                  <Button type="button" onClick={handleAddKeyFeature} size="sm">Add</Button>
                </div>
                <div className="space-y-2">
                  {newProject.keyFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 bg-secondary text-secondary-foreground p-2 rounded-md text-sm">
                      <div className="flex-1">{feature}</div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={() => handleRemoveItem('keyFeatures', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newProject.date}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
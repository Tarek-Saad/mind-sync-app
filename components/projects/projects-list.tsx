"use client"

import { useState } from "react"
import { Project } from "@/components/portfolio-selector"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { ProjectForm } from "./project-form"
import { useToast } from "@/components/ui/use-toast"

interface ProjectsListProps {
  projects: Project[];
  selectedPortfolio: string;
  onProjectAdded: (project: Project) => void;
}

export function ProjectsList({ projects, selectedPortfolio, onProjectAdded }: ProjectsListProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const { toast } = useToast();

  // Function to handle project updates
  const handleProjectUpdated = (updatedProject: Project) => {
    setProjectsList(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    
    // Also update the parent component's state
    onProjectAdded(updatedProject);
    
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <ProjectForm 
          selectedPortfolio={selectedPortfolio} 
          projects={projectsList} 
          onProjectAdded={(newProject) => {
            setProjectsList(prev => [...prev, newProject]);
            onProjectAdded(newProject);
          }} 
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projectsList.length > 0 ? (
          projectsList.map((project) => (
            <ProjectCard
              key={project.id.toString()}
              project={project}
              selectedPortfolio={selectedPortfolio}
              onProjectUpdated={handleProjectUpdated}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  )
}

// Updated Card component to display individual project information
function ProjectCard({ 
  project, 
  selectedPortfolio,
  onProjectUpdated
}: { 
  project: Project; 
  selectedPortfolio: string;
  onProjectUpdated: (project: Project) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {project.skills && project.skills.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Skills:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.skills.map((skill, index) => (
                <span key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <ProjectForm
          selectedPortfolio={selectedPortfolio}
          projects={[project]}
          onProjectAdded={() => {}}
          onProjectUpdated={onProjectUpdated}
          projectToEdit={project}
          isEditMode={true}
          trigger={
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          }
        />
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
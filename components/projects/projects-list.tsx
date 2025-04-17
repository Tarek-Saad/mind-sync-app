"use client"

import { Project } from "@/components/portfolio-selector"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { ProjectForm } from "./project-form"

interface ProjectsListProps {
  projects: Project[];
  selectedPortfolio: string;
  onProjectAdded: (project: Project) => void;
}

export function ProjectsList({ projects, selectedPortfolio, onProjectAdded }: ProjectsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <ProjectForm 
          selectedPortfolio={selectedPortfolio} 
          projects={projects} 
          onProjectAdded={onProjectAdded} 
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id.toString()}
              title={project.title}
              description={project.description}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  )
}

// Card component to display individual project information
function ProjectCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
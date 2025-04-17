"use client"  // This line indicates that this component runs on the client side in Next.js

import { useState } from "react"  // Importing useState from React to manage state
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react"  // Importing icons from the lucide-react library
import Link from "next/link"  // Importing Link from Next.js for navigation between pages
import { Button } from "@/components/ui/button"  // Importing the Button component from the UI library
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"  // Importing card components from the UI library
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  // Importing Tabs components to create tabs for different sections
import PortfolioSelector, { Project } from "@/components/portfolio-selector"  // Importing the PortfolioSelector component to select a portfolio

export default function PortfolioCluster() {
  const [selectedPortfolio, setSelectedPortfolio] = useState("")  // Defining a state to store the selected portfolio , initialized as empty
  const [projects, setProjects] = useState<Project[]>([])  // State to store the projects data

  const handlePortfolioChange = ({value}:{value:string}) => {  // Function to update the selected portfolio
    setSelectedPortfolio(value)  // Updating the selected portfolio state with the provided value
  }

  // Function to handle projects loaded from the PortfolioSelector
  const handleProjectsLoaded = (loadedProjects: Project[]) => {
    setProjects(loadedProjects);
  }

  return (
    <div className="container mx-auto px-4 py-8">  {/* Main container for layout */}
      
      {/* Header section with a back button */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />  {/* Back button icon */}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Cluster</h1>  {/* Main title */}
          <p className="text-muted-foreground">Manage your portfolios and projects</p>  {/* Subtitle */}
        </div>
      </div>

      {/* Portfolio selection dropdown */}
      <div className="mb-8">
        <PortfolioSelector 
          onChange={(value) => handlePortfolioChange({ value })} 
          value={selectedPortfolio} 
          onProjectsLoaded={handleProjectsLoaded}
        />  {/* Portfolio selector component with projects callback */}
      </div>

      {/* Displaying tabs only if a portfolio is selected */}
      {selectedPortfolio && (
        <Tabs defaultValue="projects" className="w-full">  {/* Default tab is "projects" */}
          <TabsList className="grid grid-cols-4 mb-8">
            {/* Tabs for different sections: Projects, Skills, Experience, Certifications */}
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* Content for the "Projects" tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Projects</h2>  {/* Section title */}
              <Button> {/* TODO : add api here that add a new project */}
                <Plus className="h-4 w-4 mr-2" />  {/* Icon for adding a project */}
                Add Project
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">  {/* Grid layout for projects */}
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id.toString()} // Add a unique key prop using project.id
                    title={project.title}
                    description={project.description}
                  />
                ))
              ) : (
                // Add keys to these static cards as well
                <>
                  <p>No projects found.</p>
                </>
              )}
            </div>
          </TabsContent>

          {/* Content for the "Skills" tab */}
          <TabsContent value="skills">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Skills</h2>  {/* Section title */}
              <Button>
                <Plus className="h-4 w-4 mr-2" />  {/* Icon for adding a skill */}
                Add Skill
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Skill cards would go here */}</div>
          </TabsContent>

          {/* Content for the "Experience" tab */}
          <TabsContent value="experience">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Experience</h2>  {/* Section title */}
              <Button>
                <Plus className="h-4 w-4 mr-2" />  {/* Icon for adding experience */}
                Add Experience
              </Button>
            </div>
            {/* Experience items would go here */}
          </TabsContent>

          {/* Content for the "Certifications" tab */}
          <TabsContent value="certifications">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Certifications</h2>  {/* Section title */}
              <Button>
                <Plus className="h-4 w-4 mr-2" />  {/* Icon for adding certification */}
                Add Certification
              </Button>
            </div>
            {/* Certification items would go here */}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Card component to display individual project information
function ProjectCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>  {/* Project title */}
        <CardDescription>{description}</CardDescription>  {/* Project description */}
      </CardHeader>
      <CardContent>{/* Project details could go here */}</CardContent>
      <CardFooter className="flex justify-between">
        {/* Edit and Delete buttons for each project */}
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />  {/* Edit icon */}
        </Button>
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4" />  {/* Trash (delete) icon */}
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioSelector, { Project } from "@/components/portfolio-selector"
import { ProjectsList } from "@/components/projects/projects-list"

export default function PortfolioCluster() {
  const [selectedPortfolio, setSelectedPortfolio] = useState("")
  const [projects, setProjects] = useState<Project[]>([])

  const handlePortfolioChange = ({value}:{value:string}) => {
    setSelectedPortfolio(value)
  }

  const handleProjectsLoaded = (loadedProjects: Project[]) => {
    setProjects(loadedProjects);
  }

  const handleProjectAdded = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header section with a back button */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Cluster</h1>
          <p className="text-muted-foreground">Manage your portfolios and projects</p>
        </div>
      </div>

      {/* Portfolio selection dropdown */}
      <div className="mb-8">
        <PortfolioSelector 
          onChange={(value) => handlePortfolioChange({ value })} 
          value={selectedPortfolio} 
          onProjectsLoaded={handleProjectsLoaded}
        />
      </div>

      {/* Displaying tabs only if a portfolio is selected */}
      {selectedPortfolio && (
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* Content for the "Projects" tab */}
          <TabsContent value="projects">
            <ProjectsList 
              projects={projects} 
              selectedPortfolio={selectedPortfolio} 
              onProjectAdded={handleProjectAdded} 
            />
          </TabsContent>

          {/* Content for the "Skills" tab */}
          <TabsContent value="skills">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Skills</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
          </TabsContent>

          {/* Content for the "Experience" tab */}
          <TabsContent value="experience">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Experience</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </TabsContent>

          {/* Content for the "Certifications" tab */}
          <TabsContent value="certifications">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Certifications</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

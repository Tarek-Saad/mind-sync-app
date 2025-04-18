"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioSelector, { Project, Skill } from "@/components/portfolio-selector"
import { ProjectsList } from "@/components/projects/projects-list"

export default function PortfolioCluster() {
  const [selectedPortfolio, setSelectedPortfolio] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const [currentTab, setCurrentTab] = useState("projects")

  const handlePortfolioChange = ({value}:{value:string}) => {
    // Reset states when portfolio changes
    setSelectedPortfolio(value)
    setProjects([])
    setSkills([])
    setIsLoadingProjects(true)
    setIsLoadingSkills(true)
  }

  const handleProjectsLoaded = (loadedProjects: Project[]) => {
    console.log("Projects loaded in page component:", loadedProjects.length)
    setProjects(loadedProjects)
    setIsLoadingProjects(false)
  }

  const handleSkillsLoaded = (loadedSkills: Skill[]) => {
    console.log("Skills loaded in page component:", loadedSkills.length)
    setSkills(loadedSkills)
    setIsLoadingSkills(false)
  }

  const handleProjectAdded = (newProject: Project) => {
    setProjects(prev => [...prev, newProject])
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentTab(value)
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
          onSkillsLoaded={handleSkillsLoaded}
        />
      </div>

      {/* Displaying tabs only if a portfolio is selected */}
      {selectedPortfolio && (
        <Tabs defaultValue="projects" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* Content for the "Projects" tab */}
          <TabsContent value="projects">
            {isLoadingProjects ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ProjectsList 
                projects={projects} 
                selectedPortfolio={selectedPortfolio} 
                onProjectAdded={handleProjectAdded} 
              />
            )}
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
            
            {isLoadingSkills ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : skills.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <div key={skill._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{skill.category}</p>
                      </div>
                      {skill.iconType !== 'none' && (
                        <div className="h-8 w-8 flex items-center justify-center">
                          <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center">
                            {skill.iconName ? skill.iconName.substring(0, 1) : ''}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No skills found. Add your first skill to get started.
              </div>
            )}
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

"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioSelector, { Project, Skill, Portfolio } from "@/components/portfolio-selector"
import { ProjectsList } from "@/components/projects/projects-list"
import { SkillsList } from "@/components/skills/skills-list"

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

  const handleSkillAdded = (newSkill: Skill) => {
    setSkills(prev => [...prev, newSkill])
  }

  const handleSkillDeleted = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill._id !== skillId))
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentTab(value)
  }

  // Function to get the database URI for the selected portfolio
  const getDbUriForPortfolio = (portfolioId: string): string => {
    const portfolios: Portfolio[] = [  
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
      { 
        id: "video", 
        name: "Video Editing Portfolio", 
        dbUri: "mongodb+srv://Tarek:SAad1976t@cluster0.cqa4kwi.mongodb.net/portofolio-video-editing?retryWrites=true&w=majority&appName=Cluster0" 
      },
      { id: "creative", name: "Creative Portfolio", dbUri: "" },
      { id: "technical", name: "Technical Portfolio", dbUri: "" },
    ];
    
    const portfolio = portfolios.find(p => p.id === portfolioId);
    return portfolio?.dbUri || "";
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
            <SkillsList
              onSkillEdited={(editedSkill) => {
                setSkills(prev => prev.map(skill => 
                  skill._id === editedSkill._id ? editedSkill : skill
                ))
              }}
              skills={skills}
              isLoading={isLoadingSkills}
              selectedPortfolio={selectedPortfolio}
              getDbUriForPortfolio={getDbUriForPortfolio}
              onSkillAdded={handleSkillAdded}
              onSkillDeleted={handleSkillDeleted}
            />
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

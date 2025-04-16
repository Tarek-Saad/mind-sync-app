"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioSelector from "@/components/portfolio-selector"

export default function PortfolioCluster() {
  const [selectedPortfolio, setSelectedPortfolio] = useState("")

  const handlePortfolioChange = (value) => {
    setSelectedPortfolio(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="mb-8">
        <PortfolioSelector onChange={handlePortfolioChange} value={selectedPortfolio} />
      </div>

      {selectedPortfolio && (
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Projects</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="E-commerce Website"
                description="A full-stack e-commerce platform built with Next.js and Stripe"
              />
              <ProjectCard
                title="Portfolio Website"
                description="Personal portfolio website showcasing skills and projects"
              />
              <ProjectCard title="Mobile App" description="React Native mobile application for task management" />
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Skills</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Skill cards would go here */}</div>
          </TabsContent>

          <TabsContent value="experience">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Experience</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            {/* Experience items would go here */}
          </TabsContent>

          <TabsContent value="certifications">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Certifications</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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

function ProjectCard({ title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{/* Project details could go here */}</CardContent>
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

"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

// Define the Portfolio type
export interface Portfolio {
  id: string;
  name: string;
  dbUri: string;
}

// Define Project interface
export interface Project {
  id: number;
  title: string;
  description: string;
  imgPath: string;
  imagePaths?: string[];
  ghLink: string;
  demoLink?: string;
  skills?: string[];
  technologies?: string[];
  tools?: string[];
  keyFeatures?: string[];
  date: string;
  views?: number;
}

export default function PortfolioSelector({ 
  onChange, 
  value,
  onProjectsLoaded
}: { 
  onChange: (value: string) => void;
  value: string;
  onProjectsLoaded?: (projects: Project[]) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Array of portfolio objects with title and database URI
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
  ]

  // Function to get the database URI for the selected portfolio
  const getDbUriForPortfolio = (portfolioId: string): string => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    console.log(portfolio?.dbUri)
    return portfolio?.dbUri || "";
  }

  // Use an API route instead of direct Mongoose connection
  const fetchProjects = async (portfolioId: string) => {
    console.log(portfolioId)
    try {
      setLoading(true);
      setError(null);
      
      const dbUri = getDbUriForPortfolio(portfolioId);
      console.log(dbUri)
      if (!dbUri) {
        setError("No database URI found for the selected portfolio");
        return [];
      }
      
      // Use an API route instead of direct database access
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dbUri }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data)
      setProjects(data);
      
      // Pass the projects data to the parent component
      if (onProjectsLoaded) {
        onProjectsLoaded(data);
      }
      
      return data;
    } catch (error: any) {
      setError(`Error fetching projects: ${error.message}`);
      console.error("Error fetching projects:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Fetch projects when the selected portfolio changes
  useEffect(() => {
    let isMounted = true;
    
    if (value) {
      fetchProjects(value).then(data => {
        if (isMounted && onProjectsLoaded) {
          // Only call onProjectsLoaded once with the fetched data
          onProjectsLoaded(data);
        }
      });
    }
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [value]); // Remove onProjectsLoaded from dependency array

  return (
    <div className="flex flex-col space-y-2">
      
      <label htmlFor="portfolio-select" className="text-sm font-medium">
        Select Portfolio
      </label>

      <Select value={value} onValueChange={onChange}>
        
        <SelectTrigger id="portfolio-select" className="w-full md:w-[300px]">
          <SelectValue placeholder="Select a portfolio" />
        </SelectTrigger>

        <SelectContent>
          {portfolios.map((portfolio) => (
            <SelectItem key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {loading && <p className="text-sm text-gray-500">Loading projects...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

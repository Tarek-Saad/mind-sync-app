"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PortfolioSelector({ onChange, value }) {
  // This would typically fetch from an API or database
  const portfolios = [
    { id: "professional", name: "Professional Portfolio" },
    { id: "creative", name: "Creative Portfolio" },
    { id: "technical", name: "Technical Portfolio" },
  ]

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
    </div>
  )
}

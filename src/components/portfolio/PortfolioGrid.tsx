"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import PortfolioItem from "./PortfolioItem"
import { Database } from "@/types/database.types"

type Project = Database["public"]["Tables"]["projects"]["Row"]

interface PortfolioGridProps {
  initialProjects?: Project[]
  className?: string
}

export default function PortfolioGrid({ 
  initialProjects = [], 
  className = "" 
}: PortfolioGridProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [loading, setLoading] = useState(!initialProjects.length)
  const supabase = createClient()

  useEffect(() => {
    if (!initialProjects.length) {
      fetchProjects()
    }
  }, [initialProjects.length])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        return
      }

      setProjects(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {projects.map((project) => (
        <PortfolioItem key={project.id} project={project} />
      ))}
    </div>
  )
} 
import Image from "next/image"
import Link from "next/link"
import { PortfolioProject } from "@/types/crm"

type PortfolioItemProps = {
  project: Partial<PortfolioProject>
}

export default function PortfolioItem({ project }: PortfolioItemProps) {
  // Get the first "after" image as the main display image
  const mainImage = project.after_images?.[0] || "/placeholder-image.jpg"
  
  return (
    <div className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        <Image
          src={mainImage}
          alt={project.title || "Furniture transformation"}
          width={500}
          height={500}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-200">
            {project.brief_description}
          </p>
          
          {project.techniques && project.techniques.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.techniques.slice(0, 3).map((technique) => (
                <span 
                  key={technique} 
                  className="inline-block rounded-full bg-primary-600/40 px-2 py-0.5 text-xs"
                >
                  {technique}
                </span>
              ))}
            </div>
          )}
          
          <Link 
            href={`/portfolio/${project.id}`} 
            className="mt-3 inline-block rounded-lg border border-white px-4 py-1 text-sm font-medium text-white hover:bg-white hover:text-primary-700 transition-colors"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  )
} 
// Project data for the featured projects section
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: "vintage-dresser",
    title: "Vintage Dresser Restoration",
    description: "A beautiful mid-century dresser restored to its original glory with careful attention to detail.",
    category: "Restoration",
    image: "/images/portfolio/dresser.png"
  },
  {
    id: "cabinet-makeover",
    title: "Midcentury Cabinet Makeover",
    description: "This cabinet was transformed with a fresh coat of paint and new hardware for a modern look.",
    category: "Modern",
    image: "/images/portfolio/cabinet.png"
  },
  {
    id: "bookcase",
    title: "Elegant Bookcase Transformation",
    description: "A plain bookcase reimagined with custom painting techniques and decorative elements.",
    category: "Custom Painting",
    image: "/images/portfolio/bookcase.png"
  }
]; 
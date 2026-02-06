export interface Project {
  id: string
  number: string
  title: string
  category: string
  year: string
  featured: boolean
  direction?: "left" | "right"
}

export const projects: Project[] = [
  {
    id: "kinetic-typography",
    number: "01",
    title: "Kinetic Typography",
    category: "Interactive Experience",
    year: "2024",
    featured: true,
    direction: "left",
  },
  {
    id: "generative-patterns",
    number: "02",
    title: "Generative Patterns",
    category: "Visual System",
    year: "2024",
    featured: true,
    direction: "right",
  },
  {
    id: "spatial-interface",
    number: "03",
    title: "Spatial Interface",
    category: "3D Navigation",
    year: "2023",
    featured: true,
    direction: "left",
  },
  // Add more projects below - set featured: true for the ones you want to showcase
  {
    id: "project-name",
    number: "04",
    title: "Project Title",
    category: "Project Category",
    year: "2024",
    featured: true,
    direction: "right",
  },
]

// Helper function to get only featured projects
export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}

// Helper function to get all projects
export function getAllProjects(): Project[] {
  return projects
}

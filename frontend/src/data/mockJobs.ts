import { Job } from "@/components/JobCard";

export const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    skills: ["React", "TypeScript", "Tailwind CSS", "GraphQL", "Jest"],
    postedAt: "2 days ago",
    description: "We're looking for a Senior Frontend Developer to lead our web development initiatives. You'll work with cutting-edge technologies and mentor junior developers while building scalable applications."
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    skills: ["Node.js", "React", "PostgreSQL", "Docker", "AWS"],
    postedAt: "1 week ago",
    description: "Join our fast-growing startup as a Full Stack Engineer. You'll have the opportunity to work on diverse projects and make a significant impact on our product development."
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "New York, NY",
    type: "Contract",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    postedAt: "3 days ago",
    description: "We need a creative UI/UX Designer to craft beautiful and intuitive user experiences. You'll collaborate closely with product and engineering teams."
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataDriven Co.",
    location: "Boston, MA",
    type: "Full-time",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
    postedAt: "5 days ago",
    description: "Looking for a Data Scientist to help us derive insights from complex datasets and build predictive models that drive business decisions."
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Seattle, WA",
    type: "Full-time",
    skills: ["Kubernetes", "Terraform", "CI/CD", "AWS", "Linux"],
    postedAt: "1 day ago",
    description: "Join our infrastructure team to build and maintain scalable cloud solutions. Experience with container orchestration and infrastructure as code is essential."
  },
  {
    id: 6,
    title: "Product Manager",
    company: "InnovateTech",
    location: "Austin, TX",
    type: "Full-time",
    skills: ["Agile", "Product Strategy", "User Stories", "Analytics", "Stakeholder Management"],
    postedAt: "4 days ago",
    description: "We're seeking a Product Manager to drive product vision and roadmap. You'll work with cross-functional teams to deliver features that delight our customers."
  }
];

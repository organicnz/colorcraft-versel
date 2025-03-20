"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div 
      className="group overflow-hidden h-96 relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">{project.category}</span>
          <h3 className="text-white text-2xl font-light mt-2">{project.title}</h3>
          <p className="text-white/80 mt-2 line-clamp-3">{project.description}</p>
        </div>
      </div>
    </motion.div>
  );
} 
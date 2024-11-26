import React from 'react'
import { Project } from '@/utils/types'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  projects: Project[];
}

const ProjectSection = ({ projects }: Props) => {
  return (
    <section className="w-full space-y-8 bg-orange-500 px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-lg font-medium uppercase tracking-wider text-black">
          FEATURED PROJECTS
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden bg-zinc-900 border-none shadow-lg flex flex-col justify-between">
              <div className="relative aspect-video">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-zinc-400">
                  {project.description.length > 200 
                    ? `${project.description.substring(0, 200)}...` 
                    : project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tools?.split(',').map((tool, toolIndex) => (
                    <Badge key={toolIndex} className="bg-zinc-800 text-zinc-300">
                      {tool}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {project.images?.split(',').slice(0, 3).map((image, imageIndex) => (
                    <div key={imageIndex} className="relative aspect-video">
                      <Image
                        src={image}
                        alt={`${project.title} screenshot ${imageIndex + 1}`}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  asChild
                  variant="link" 
                  className="group p-0 text-orange-500 hover:no-underline"
                >
                  <Link href={project.url} target="_blank" rel="noopener noreferrer">
                    View Project
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectSection

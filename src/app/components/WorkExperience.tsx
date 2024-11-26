import React from 'react'
import { Work } from "@/utils/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'

interface Props {
  workExperience: Work[]
}

const WorkExperience = ({ workExperience }: Props) => {
  return (
    <section className="w-full space-y-8 bg-white px-4 py-12 dark:bg-zinc-950 md:px-6 lg:py-16 border-t border-zinc-200 mt-12 md:mt-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-lg font-medium uppercase tracking-wider text-zinc-400">
          WORK EXPERIENCE
        </h2>
        
        <div className="space-y-6">
          {workExperience.map((work, index) => (
            <Card key={index} className="border-none bg-black shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {work.company}
                      </h3>
                      <p className="text-lg text-zinc-400">
                        {work.role}
                      </p>
                    </div>
                    {work.is_active && (
                      <Badge 
                        variant="outline" 
                        className="border-orange-500 bg-orange-500/10 text-orange-500"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <ReactMarkdown className="text-zinc-300 leading-loose">
                    {work.summary}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkExperience


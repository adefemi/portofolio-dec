import React from 'react'
import { Blog } from '@/utils/types'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  blogs: Blog[];
}

const BlogSection = ({ blogs }: Props) => {
  return (
    <section className="w-full space-y-8 bg-zinc-950 px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-lg font-medium uppercase tracking-wider text-zinc-400">
          RECENT POSTS
        </h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <Card key={index} className="overflow-hidden bg-zinc-900/50 border-none shadow-lg flex flex-col justify-between">
              <div>
              <div className="relative aspect-video">
                <Image
                  src={blog.cover}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">
                  {blog.title}
                </h3>
                <p className="text-zinc-400">
                  {blog.brief.length > 200 
                    ? `${blog.brief.substring(0, 200)}...` 
                    : blog.brief}
                </p>
              </CardContent>
              </div>
              <CardFooter className="p-6 pt-0">
                <Button 
                  asChild
                  variant="link" 
                  className="group p-0 text-orange-500 hover:no-underline"
                >
                  <Link href={blog.url} target="_blank" rel="noopener noreferrer">
                    Read More
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

export default BlogSection

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BasicInfo, Social } from "@/utils/types";
import Image from "next/image";
import { Github, Linkedin, Mail, Twitter, Youtube } from 'lucide-react';
import Link from "next/link";

interface Props {
  basicInfo: BasicInfo;
  socials: Social[];
}

const InfoSection = ({ basicInfo, socials }: Props) => {
  const socialIcons = {
    linkedin: Linkedin,
    x: Twitter,
    youtube: Youtube,
    mail: Mail,
    github: Github,
  };

  return (
    <>
      <section className="w-full mx-auto space-y-12 bg-zinc-950 px-4 py-12 md:px-6 lg:py-20">
        {/* Hero Section */}
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-6 flex flex-col items-center">
            <Badge
              variant="outline"
              className="border-orange-500 text-orange-500"
            >
              HELLO, I&apos;M
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl text-center">
              {basicInfo.fullname}
            </h1>
            <h2 className="text-3xl font-semibold text-white/90 sm:text-4xl text-center">
              {basicInfo.title}
            </h2>
            <div className="flex space-x-4 mt-6">
              {socials.map((social) => {
                const IconComponent = socialIcons[social.type];
                const href = social.type === 'mail' ? `mailto:${social.url}` : social.url;
                return (
                  <Button
                    key={social.type}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Link href={href} target="_blank" rel="noopener noreferrer">
                      <IconComponent className="h-5 w-5" />
                      <span className="sr-only">{social.type}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="px-4">
        {/* About Section */}
        <div className="mx-auto max-w-6xl mt-12 md:mt-20">
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <div className="flex flex-col items-center md:justify-between">
              <h3 className="text-lg font-medium uppercase tracking-wider text-zinc-400 mb-10 md:mb-0">
                ABOUT ME
              </h3>
              <div className="relative aspect-square w-48 overflow-hidden rounded-full bg-orange-500 border-2 border-orange-500">
                {basicInfo.avatar && (
                  <Image
                    src={basicInfo.avatar}
                    alt={basicInfo.fullname}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
            <div
              className="text-lg leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: basicInfo.about }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;

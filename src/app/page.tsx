import { setup } from "@/utils/setup";
import InfoSection from "./components/InfoSection";
import WorkExperience from "./components/WorkExperience";
import BlogSection from "./components/BlogSection";
import ProjectSection from "./components/ProjectSection";

export default async function Home() {
  try {
    const { basicInfo, workExperience, blogs, projects, socials } = await setup();
    return (
      <main>
        <InfoSection basicInfo={basicInfo} socials={socials} />
        <WorkExperience workExperience={workExperience} />
        <ProjectSection projects={projects} />
        <BlogSection blogs={blogs} />
        <footer className="flex justify-center items-center p-4">
          <p>Made with ❤️ by Adefemigreat</p>
        </footer>
      </main>
    );
  } catch (error) {
    return (
      <div>
        <p>Unable to load data. Please try again later: {error?.toString()}</p>
      </div>
    );
  }
}

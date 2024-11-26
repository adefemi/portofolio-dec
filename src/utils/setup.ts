import { getProjects, getBasicInfo, getWorkExperience, getBlogs, getSocials } from './api';
import { Project, BasicInfo, Work, Blog, Social } from './types';

export async function setup(): Promise<{
  projects: Project[];
  basicInfo: BasicInfo;
  workExperience: Work[];
  blogs: Blog[];
  socials: Social[];
}> {
  try {
    const [projects, basicInfo, workExperience, blogs, socials] = await Promise.all([
      getProjects(),
      getBasicInfo(),
      getWorkExperience(),
      getBlogs(),
      getSocials(),
    ]);
    
    return {
      projects,
      basicInfo: Array.isArray(basicInfo) ? basicInfo[0] : basicInfo,
      workExperience,
      blogs,
      socials,
    };
  } catch (error) {
    throw error;
  }
} 
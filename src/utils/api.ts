import { BasicInfo, Blog, Project, Social, Work } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${apiUrl}/my_portfolio/project`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getBasicInfo(): Promise<BasicInfo[]> {
  const response = await fetch(`${apiUrl}/my_portfolio/basicinfo`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getWorkExperience(): Promise<Work[]> {
  const response = await fetch(`${apiUrl}/my_portfolio/work`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getBlogs(): Promise<Blog[]> {
  const response = await fetch(`${apiUrl}/my_portfolio/blogs`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getSocials(): Promise<Social[]> {
  const response = await fetch(`${apiUrl}/my_portfolio/socials`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}
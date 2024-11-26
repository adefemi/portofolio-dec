export interface BasicInfo {
    "fullname": string;
    "about": string;
    "title": string;
    "avatar"?: string;
}

export interface Project {
    "title": string;
    "description": string;
    "url": string;
    "cover": string;
    "tools": string;
    "images": string;
}

export interface Work {
    "company": string;
    "role": string;
    "is_active": boolean;
    "summary": string
}

export interface Blog {
    "title": string;
    "brief": string;
    "url": string;
    "cover": string;
}

export interface Social {
    "type": "linkedin" | "x" | "youtube" | "mail" | "github";
    "url": string;
}
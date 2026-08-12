import { atom } from 'nanostores';

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string; // The markdown prompt/content of the skill
  isActive: boolean;
  createdAt: number;
}

const isBrowser = typeof window !== 'undefined';
const SKILLS_STORAGE_KEY = 'falbor_skills_library';

const getInitialSkills = (): Skill[] => {
  if (!isBrowser) return [];
  try {
    const saved = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to parse skills from local storage:', err);
  }
  return [];
};

export const skillsStore = atom<Skill[]>(getInitialSkills());

export const fetchSkillsFromServer = async () => {
  if (!isBrowser) return;
  try {
    const response = await fetch('/api/skills');
    if (response.ok) {
      const data = await response.json();
      if (data.skills) {
        // Map from DB format to our local Skill interface
        const fetchedSkills: Skill[] = data.skills.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt).getTime(),
        }));
        skillsStore.set(fetchedSkills);
        localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(fetchedSkills));
      }
    }
  } catch (err) {
    console.error('Failed to fetch skills from server:', err);
  }
};

// Initialize fetch
fetchSkillsFromServer();

export const addSkill = async (skill: Omit<Skill, 'id' | 'createdAt' | 'isActive'>) => {
  const newSkill: Skill = {
    ...skill,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
    isActive: false,
  };
  
  // Optimistic update
  const updatedSkills = [...skillsStore.get(), newSkill];
  skillsStore.set(updatedSkills);
  
  if (isBrowser) {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updatedSkills));
    
    // Sync with server
    fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkill),
    }).catch(console.error);
  }
  
  return newSkill;
};

export const updateSkill = async (id: string, updates: Partial<Skill>) => {
  // Optimistic update
  const updatedSkills = skillsStore.get().map(skill => 
    skill.id === id ? { ...skill, ...updates } : skill
  );
  
  skillsStore.set(updatedSkills);
  
  if (isBrowser) {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updatedSkills));
    
    const updatedSkill = updatedSkills.find(s => s.id === id);
    if (updatedSkill) {
      // Sync with server
      fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSkill),
      }).catch(console.error);
    }
  }
};

export const toggleSkillActive = (id: string) => {
  const currentSkill = skillsStore.get().find(s => s.id === id);
  if (currentSkill) {
    updateSkill(id, { isActive: !currentSkill.isActive });
  }
};

export const deleteSkill = async (id: string) => {
  // Optimistic update
  const updatedSkills = skillsStore.get().filter(skill => skill.id !== id);
  skillsStore.set(updatedSkills);
  
  if (isBrowser) {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updatedSkills));
    
    // Sync with server
    fetch(`/api/skills?id=${id}`, {
      method: 'DELETE',
    }).catch(console.error);
  }
};

import { atom } from 'nanostores';

export interface Profile {
  username: string;
  bio: string;
  avatar: string;
}

const storedProfile = typeof window !== 'undefined' ? localStorage.getItem('bolt_profile') : null;
const initialProfile: Profile = storedProfile
  ? JSON.parse(storedProfile)
  : {
      username: '',
      bio: '',
      avatar: '',
    };

export const profileStore = atom<Profile>(initialProfile);

export const updateProfile = (updates: Partial<Profile>) => {
  profileStore.set({ ...profileStore.get(), ...updates });
  if (typeof window !== 'undefined') {
    localStorage.setItem('bolt_profile', JSON.stringify(profileStore.get()));
  }
};

export const loadProfileFromServer = async () => {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) return;
    const serverProfile = (await res.json()) as Profile;
    if (serverProfile.username || serverProfile.avatar || serverProfile.bio) {
      profileStore.set(serverProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bolt_profile', JSON.stringify(serverProfile));
      }
    }
  } catch {
    // ignore
  }
};

export const saveProfileToServer = async (profile: Profile) => {
  try {
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch {
    // ignore
  }
};

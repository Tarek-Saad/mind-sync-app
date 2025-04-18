import { Experience } from "@/types/experience";

export async function fetchExperiences(dbUri: string, portfolioId: string): Promise<Experience[]> {
  try {
    const response = await fetch('/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
}

export async function addExperience(
  dbUri: string, 
  portfolioId: string, 
  experienceData: Omit<Experience, '_id'>
): Promise<Experience> {
  try {
    const response = await fetch('/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'add',
        experienceData
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding experience:", error);
    throw error;
  }
}

export async function editExperience(
  dbUri: string, 
  portfolioId: string, 
  experienceId: string,
  experienceData: Omit<Experience, '_id'>
): Promise<Experience> {
  try {
    const response = await fetch('/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'edit',
        experienceId,
        experienceData
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error editing experience:", error);
    throw error;
  }
}

export async function deleteExperience(
  dbUri: string, 
  portfolioId: string, 
  experienceId: string
): Promise<{ success: boolean; deletedId: string }> {
  try {
    const response = await fetch('/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'delete',
        experienceId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}
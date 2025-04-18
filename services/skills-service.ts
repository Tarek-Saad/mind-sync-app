import { Skill } from "@/components/portfolio-selector";

export async function fetchSkills(dbUri: string, portfolioId: string): Promise<Skill[]> {
  try {
    const response = await fetch('/api/skills', {
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
    console.error("Error fetching skills:", error);
    throw error;
  }
}

export async function addSkill(
  dbUri: string, 
  portfolioId: string, 
  skillData: { name: string; category: string; iconType: string; iconName: string; }
): Promise<Skill> {
  try {
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'add',
        skillData
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding skill:", error);
    throw error;
  }
}

export async function editSkill(
  dbUri: string, 
  portfolioId: string, 
  skillId: string,
  skillData: { name: string; category: string; iconType: string; iconName: string; }
): Promise<Skill> {
  try {
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'edit',
        skillId,
        skillData
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error editing skill:", error);
    throw error;
  }
}

export async function deleteSkill(dbUri: string, portfolioId: string, skillId: string): Promise<{ success: boolean; deletedId: string }> {
  try {
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'delete',
        skillId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error deleting skill:", error);
    throw error;
  }
}
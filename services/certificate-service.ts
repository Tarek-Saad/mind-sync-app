import { Certificate } from "@/types/certificate";

export async function fetchCertificates(dbUri: string, portfolioId: string): Promise<Certificate[]> {
  try {
    const response = await fetch('/api/certificates', {
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
    console.error("Error fetching certificates:", error);
    throw error;
  }
}

export async function addCertificate(
  dbUri: string, 
  portfolioId: string, 
  certificateData: Omit<Certificate, '_id'>
): Promise<Certificate> {
  try {
    const response = await fetch('/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'add',
        certificateData
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding certificate:", error);
    throw error;
  }
}

export async function editCertificate(
  dbUri: string, 
  portfolioId: string, 
  certificateId: string,
  certificateData: Omit<Certificate, '_id'>
): Promise<Certificate> {
  try {
    const response = await fetch('/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'edit',
        certificateId,
        certificateData
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error editing certificate:", error);
    throw error;
  }
}

export async function deleteCertificate(
  dbUri: string, 
  portfolioId: string, 
  certificateId: string
): Promise<{ success: boolean; deletedId: string }> {
  try {
    const response = await fetch('/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUri,
        portfolioId,
        action: 'delete',
        certificateId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error deleting certificate:", error);
    throw error;
  }
}
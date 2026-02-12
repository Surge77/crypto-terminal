'use server';

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

export interface FearGreedResponse {
  data: FearGreedData[];
}

export async function fetchFearGreedIndex(): Promise<FearGreedResponse | null> {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=7', {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

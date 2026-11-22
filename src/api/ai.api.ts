import { apiClient } from './client'

/**
 * POST /ai/draft/:ticketId — ask the AI for a new draft reply (operators only).
 * It can take a few seconds: the UI should show a loading state.
 */
export async function regenerateDraft(ticketId: string): Promise<string> {
  const { data } = await apiClient.post<{ draft: string }>(
    `/ai/draft/${encodeURIComponent(ticketId)}`,
  )
  return data.draft
}

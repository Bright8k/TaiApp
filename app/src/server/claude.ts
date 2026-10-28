import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { z } from 'zod';

export const MODEL = 'claude-opus-5-5';

let client: Anthropic | null = null;

/** Returns null when no API key is configured so routes can fall back to rule-based logic. */
export function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

type ParseOptions<T extends z.ZodType> = {
  schema: T;
  system: string;
  content: Anthropic.Beta.BetaContentBlockParam[];
  effort: 'low' | 'medium' | 'high';
};

/**
 * One structured-output call. Server-side fallbacks re-run the request on another model if the
 * primary one declines, so a false-positive refusal doesn't surface as an error in the app.
 */
export async function parseStructured<T extends z.ZodType>(
  anthropic: Anthropic,
  { schema, system, content, effort }: ParseOptions<T>,
): Promise<z.infer<T>> {
  const response = await anthropic.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system,
    output_config: { effort, format: betaZodOutputFormat(schema) },
    messages: [{ role: 'user', content }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('The model declined this request.');
  }
  if (response.parsed_output == null) {
    throw new Error(`No structured output (stop_reason: ${response.stop_reason}).`);
  }
  return response.parsed_output;
}

export function errorResponse(error: unknown, status = 500) {
  if (error instanceof Anthropic.RateLimitError) {
    return Response.json({ error: 'AI is busy, try again in a moment.' }, { status: 429 });
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return Response.json({ error: 'Server API key is invalid.' }, { status: 500 });
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  return Response.json({ error: message }, { status });
}

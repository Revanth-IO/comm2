import { vi } from 'vitest';

const mockChainable = {
  then: vi.fn(),
  select: vi.fn(function() { return this; }),
  order: vi.fn(function() { return this; }),
  insert: vi.fn(function() { return this; }),
  update: vi.fn(function() { return this; }),
  eq: vi.fn(function() { return this; }),
};

const mockSupabaseClient = {
  from: vi.fn(() => mockChainable),
};

vi.mock('./lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

export { mockSupabaseClient };
/**
 * Shapes mirroring the Supabase schema in supabase/schema.sql.
 * `Event` is the joined read model the UI consumes; the raw table rows are
 * `EventRow` / `CategoryRow`.
 */

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  description: string;
  images: string[];
  event_date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = CategoryRow;

/** An event with its categories resolved through the join table. */
export type Event = EventRow & {
  categories: Category[];
};

export type EventFormValues = {
  title: string;
  description: string;
  images: string[];
  event_date: string;
  published: boolean;
  categoryIds: string[];
};

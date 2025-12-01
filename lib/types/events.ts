export type GridEvent = {
  id: string;
  title: string;
  col: number;
  startRow: number;
  endRow: number;
};

export type CalendarEvent = {
  id: string; // uuid
  link_id: string | null;
  provider: string;
  external_id: string;
  calendar_id: string | null;

  title: string | null;
  description: string | null;
  location: string | null;

  start_time: string; // timestamptz (ISO string)
  end_time: string; // timestamptz (ISO string)
  timezone: string | null;

  is_all_day: boolean | null;
  is_recurring: boolean | null;
  recurrence_rule: string | null;
  recurring_event_id: string | null;

  status: string | null;
  visibility: string | null;

  raw: unknown | null;

  source_last_synced: string | null;
  created_at: string | null;
  updated_at: string | null;
};

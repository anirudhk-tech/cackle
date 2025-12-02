export type GridEvent = {
  id: string;
  title: string;
  col: number;
  startRow: number;
  endRow: number;
};

export type CalendarEvent = {
  id?: string; // uuid, if null, id is auto created in db
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

export type IcalEvent = {
  startDate: {
    toJSDate: () => Date;
    isDate?: boolean;
    zone?: { tzid?: string | null } | null;
  };
  endDate: {
    toJSDate: () => Date;
  };
  uid: string;
  summary?: string | null;
  description?: string | null;
  location?: string | null;
  status?: string | null;
  component: {
    getFirstPropertyValue?: (name: string) => unknown;
  };
};

import IcalExpander from "ical-expander";
import { CalendarEvent, GridEvent, IcalEvent } from "./types/events";

export const expandIcsForRange = (
  icsText: string,
  rangeStart: Date,
  rangeEnd: Date,
  linkId: string,
): CalendarEvent[] => {
  const icalExpander = new IcalExpander({
    ics: icsText,
    maxIterations: 1000,
  });

  const results = icalExpander.between(rangeStart, rangeEnd);

  // Helper: best-effort timezone from ICAL.Time
  const getTimezoneFromIcalTime = (t: {
    toJSDate: () => Date;
    isDate?: boolean;
    zone?: { tzid?: string | null } | null;
  }): string | null => {
    return t?.zone?.tzid || null;
  };

  const mapIcalEventToCalendarEvent = (e: IcalEvent): CalendarEvent => {
    const jsStart = e.startDate.toJSDate();
    const jsEnd = e.endDate.toJSDate();
    const timezone = getTimezoneFromIcalTime(e.startDate);

    const isAllDay =
      e.startDate.isDate ||
      (jsStart.getUTCHours() === 0 &&
        jsStart.getUTCMinutes() === 0 &&
        jsEnd.getUTCHours() === 0 &&
        jsEnd.getUTCMinutes() === 0);

    const uid = e.uid;

    return {
      link_id: linkId,
      provider: "ics",
      external_id: uid,
      calendar_id: null,

      title: e.summary || null,
      description: e.description || null,
      location: e.location || null,

      start_time: jsStart.toISOString(),
      end_time: jsEnd.toISOString(),
      timezone,

      is_all_day: isAllDay,
      is_recurring: !!e.component.getFirstPropertyValue?.("rrule"),
      recurrence_rule:
        (e.component.getFirstPropertyValue?.("rrule") as string) || null,
      recurring_event_id: null,

      status: e.status || "confirmed",
      visibility: "public",

      raw: e,
      source_last_synced: new Date().toISOString(),
      created_at: null,
      updated_at: null,
    };
  };

  const baseEvents: CalendarEvent[] = results.events.map(
    mapIcalEventToCalendarEvent,
  );

  const recurringEvents: CalendarEvent[] = results.occurrences.map(
    (o, index: number) => {
      const jsStart = o.startDate.toJSDate();
      const jsEnd = o.endDate.toJSDate();
      const timezone = getTimezoneFromIcalTime(o.startDate);

      const isAllDay =
        o.startDate.isDate ||
        (jsStart.getUTCHours() === 0 &&
          jsStart.getUTCMinutes() === 0 &&
          jsEnd.getUTCHours() === 0 &&
          jsEnd.getUTCMinutes() === 0);

      const baseUid = o.item.uid;
      const uid = `${baseUid}-${o.recurrenceId?.toString() || index}`;

      return {
        link_id: linkId,
        provider: "ics",
        external_id: uid,
        calendar_id: null,

        title: o.item.summary || null,
        description: o.item.description || null,
        location: o.item.location || null,

        start_time: jsStart.toISOString(),
        end_time: jsEnd.toISOString(),
        timezone,

        is_all_day: isAllDay,
        is_recurring: true,
        recurrence_rule:
          o.item.component.getFirstPropertyValue?.("rrule") || null,
        recurring_event_id: baseUid,

        status: o.item.status || "confirmed",
        visibility: "public",

        raw: o,
        source_last_synced: new Date().toISOString(),
        created_at: null,
        updated_at: null,
      };
    },
  );

  return [...baseEvents, ...recurringEvents];
};

export const generateTimeSlots = (slotsCount: number) => {
  const times = [];
  for (let i = 0; i < slotsCount; i++) {
    const hour = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    times.push(
      `${formattedHour}:${minutes.toString().padStart(2, "0")} ${ampm}`,
    );
  }
  return times;
};

export const getNext7Days = () => {
  const today = new Date();
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  return days;
};

export const formatDayLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

export const getDayCol = (date: Date, weekStart: Date) => {
  const start = new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate(),
  );

  const diffMs = date.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getDaySlot = (date: Date) => {
  const minutes = date.getHours() * 60 + date.getMinutes();
  const slot = Math.floor(minutes / 15);
  return slot;
};

export const normalizeEventsForGrid = (
  rawEvents: CalendarEvent[],
  weekStart: Date,
): GridEvent[] =>
  rawEvents
    .map((ev) => {
      const start = new Date(ev.start_time);
      const end = new Date(ev.end_time);

      const col = getDayCol(start, weekStart);
      if (col < 0 || col > 6) return null;

      const startRow = getDaySlot(start);
      const endRow = Math.max(startRow + 1, getDaySlot(end));

      return {
        id: ev.id,
        title: ev.title || "",
        col,
        startRow,
        endRow,
      };
    })
    .filter(Boolean) as GridEvent[];

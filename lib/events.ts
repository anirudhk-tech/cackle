import IcalExpander from "ical-expander";
import { CalendarEvent, GridEvent } from "./types/events";

export const expandIcsForRange = (
  icsText: string,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] => {
  const icalExpander = new IcalExpander({
    ics: icsText,
    maxIterations: 1000,
  });

  const results = icalExpander.between(rangeStart, rangeEnd);

  const baseEvents: CalendarEvent[] = results.events.map((e) => ({
    uid: e.uid,
    startDate: e.startDate.toJSDate(),
    endDate: e.endDate.toJSDate(),
    summary: e.summary,
  }));

  const reccurringEvents: CalendarEvent[] = results.occurrences.map((o) => ({
    uid: `${o.item.uid}-${o.recurrenceId?.toString()}`,
    startDate: o.startDate.toJSDate(),
    endDate: o.endDate.toJSDate(),
    summary: o.item.summary,
  }));

  return [...baseEvents, ...reccurringEvents];
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

export type GridEvent = {
  id: string;
  title: string;
  col: number;
  startRow: number;
  endRow: number;
};

export type CalendarEvent = {
  uid: string;
  startDate: Date;
  endDate: Date;
  summary?: string;
};

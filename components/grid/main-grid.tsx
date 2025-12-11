import { formatDayLabel, generateTimeSlots, getNext7Days } from "@/lib/events";
import { MainState } from "@/lib/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { tailwindColors } from "@/lib/colors/colors";

const days = getNext7Days();
const timeSlots = generateTimeSlots(96);

const pageBg = `h-screen w-full overflow-hidden ${tailwindColors.backgroundLight} dark:bg-slate-900 flex items-center justify-center`;
const shell =
  "relative h-[99%] w-full max-w-5xl bg-white dark:bg-slate-900 " +
  "shadow-lg ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden";

// subtle background grid pattern behind everything
const shellGridBg =
  "pointer-events-none absolute inset-0 -z-10 " +
  "bg-[linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.25)_1px,transparent_1px)] " +
  "bg-[size:40px_40px] opacity-60 dark:opacity-40";

const scrollArea = "h-full overflow-auto";

const headerRow =
  "grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-20 " +
  "bg-white/95 dark:bg-slate-900/95 backdrop-blur " +
  "border-b border-slate-200 dark:border-slate-700";

const headerCell =
  "px-3 py-3 text-center text-sm font-semibold " +
  "text-slate-900 dark:text-slate-100 " +
  "border-l border-slate-200 dark:border-slate-700 first:border-l-0";

const timeCol =
  "border-r border-b border-slate-200 dark:border-slate-700 " +
  "px-2 py-1 text-[11px] text-slate-500 dark:text-slate-400 " +
  "bg-slate-50 dark:bg-slate-800 font-mono select-none";

const gridRow =
  "grid grid-cols-[80px_repeat(7,1fr)] [grid-template-rows:repeat(96,40px)]";

const cellBase =
  "border-b border-l border-slate-100 dark:border-slate-800 " +
  "bg-white/60 dark:bg-slate-900/60 " +
  `${tailwindColors.primaryAccent} dark:hover:bg-slate-800 ` +
  "transition-colors cursor-pointer group relative";

const eventContainer = "h-full flex -space-x-px";

const eventBlock =
  "flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 " +
  "hover:from-blue-600 hover:to-indigo-600 " +
  "shadow-sm border border-white/60 dark:border-slate-700/60 " +
  "transition-transform duration-150 flex items-center px-2 " +
  "text-[11px] font-medium text-white truncate group-hover:scale-[1.01] origin-left";

const MainGrid = () => {
  const events = useSelector((state: MainState) => state.grid.events);

  return (
    <div className={pageBg}>
      <div className={shell}>
        <div className={shellGridBg} />
        <div className={scrollArea}>
          {/* Header Row */}
          <div className={headerRow}>
            <div className="border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            {days.map((date) => (
              <div key={date.toISOString()} className={headerCell}>
                {formatDayLabel(date)}
              </div>
            ))}
          </div>

          {/* Time slots rows */}
          <div className={gridRow}>
            {timeSlots.map((time, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Time label */}
                <div className={timeCol}>{time}</div>

                {days.map((_, colIndex) => {
                  const colEvents = events.filter((ev) => ev.col === colIndex);
                  const cellEvents = colEvents.filter(
                    (ev) => rowIndex >= ev.startRow && rowIndex < ev.endRow,
                  );

                  return (
                    <div key={colIndex} className={cellBase}>
                      {cellEvents.length > 0 && (
                        <div className={eventContainer}>
                          {cellEvents.map((ev, idx) => (
                            <div
                              key={idx}
                              className={eventBlock}
                              style={{ zIndex: cellEvents.length - idx }}
                            >
                              {rowIndex === ev.startRow ? ev.title : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGrid;

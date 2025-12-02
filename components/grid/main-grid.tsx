import { formatDayLabel, generateTimeSlots, getNext7Days } from "@/lib/events";
import { MainState } from "@/lib/store/store";
import React from "react";
import { useSelector } from "react-redux";

const days = getNext7Days();
const timeSlots = generateTimeSlots(96);

const MainGrid = () => {
  const events = useSelector((state: MainState) => state.grid.events);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "scroll",
        border: "1px solid #ccc",
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(7, 1fr)",
          borderBottom: "1px solid #ccc",
          position: "sticky",
          top: 0,
          backgroundColor: "#f0f0f0",
          zIndex: 1,
        }}
      >
        <div></div>
        {days.map((date) => (
          <div
            key={date.toISOString()}
            style={{ padding: "8px", textAlign: "center", fontWeight: "bold" }}
          >
            {formatDayLabel(date)}
          </div>
        ))}
      </div>

      {/* Time slots rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(7, 1fr)",
          gridAutoRows: "40px",
        }}
      >
        {timeSlots.map((time, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Time label */}
            <div
              style={{
                border: "1px solid #ccc",
                padding: "4px",
                fontSize: "12px",
                backgroundColor: "#fafafa",
              }}
            >
              {time}
            </div>
            {days.map((_, colIndex) => {
              const colEvents = events.filter((ev) => ev.col === colIndex);
              const cellEvents = colEvents.filter(
                (ev) => rowIndex >= ev.startRow && rowIndex < ev.endRow,
              );

              return (
                <div
                  key={colIndex}
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "white",
                    cursor: "pointer",
                    padding: "0",
                  }}
                >
                  {cellEvents.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                      }}
                    >
                      {cellEvents.map((ev, idx) => (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            backgroundColor: "#cce4ff",
                            fontSize: "5px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            padding: "5px",
                            gap: 0,
                          }}
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
  );
};

export default MainGrid;

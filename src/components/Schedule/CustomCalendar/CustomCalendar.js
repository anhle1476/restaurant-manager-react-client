import React, { useState } from "react";

import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import EditScheduleModal from "../EditScheduleModal/EditScheduleModal";

import scheduleApi from "../../../api/scheduleApi";
import { toastError } from "../../../utils/toastUtils";

const CustomCalendar = () => {
  const [events, setEvents] = useState([]);
  const [editDate, setEditDate] = useState("");
  const [eventMap, setEventMap] = useState({});

  const onMonthChange = async (e) => {
    console.log(e);
    try {
      const res = await scheduleApi.getAllByMonth(e.start);
      updateCalendarEvents(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
  };

  const updateCalendarEvents = (mapData) => {
    setEventMap(mapData);
    setEvents(
      Object.keys(mapData).map((day) => parseScheduleToEvent(day, mapData[day]))
    );
  };

  const renderSidebar = () => {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>All Events ({events.length})</h2>
          <ul>{events.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  };

  const handleDateSelect = (selectInfo) => {
    toggleShowEdit(selectInfo.startStr);
  };

  const handleEventClick = (clickInfo) => {
    toggleShowEdit(clickInfo.event._def.publicId);
  };

  const toggleShowEdit = (date = "") => {
    setEditDate(date);
  };

  return (
    <>
      <div className="calendar">
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
            headerToolbar={{
              right: "today prev,next",
              left: "title",
            }}
            themeSystem="bootstrap"
            views={{
              dayGridMonth: {
                titleFormat: {
                  year: "numeric",
                  month: "numeric",
                },
                showNonCurrentDates: false,
              },
            }}
            initialView="dayGridMonth"
            //editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            events={events}
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            //eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            datesSet={onMonthChange}
            // you can update a remote database when these fire:
            // eventAdd={function (e) {}}
            // eventChange={function (e) {}}
            // eventRemove={function (e) {}}
          />
        </div>
      </div>

      {renderSidebar()}
      <EditScheduleModal
        show={Boolean(editDate)}
        toggle={toggleShowEdit}
        date={editDate}
        schedules={eventMap[editDate]}
      />
    </>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

function parseScheduleToEvent(date, schedules) {
  return {
    id: date,
    title: schedules.map((s) => s.shift.name).join(", "),
    start: date,
  };
}

export default CustomCalendar;

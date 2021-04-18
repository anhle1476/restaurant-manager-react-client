import React, { useState } from "react";

import FullCalendar from "@fullcalendar/react";
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

  const handleDateSelect = (selectInfo) => {
    toggleShowEdit(selectInfo.startStr);
  };

  const handleEventClick = (clickInfo) => {
    toggleShowEdit(clickInfo.event._def.publicId);
  };

  const toggleShowEdit = (date = "") => {
    setEditDate(date);
  };

  const handleEditSchedule = (schedule) => {
    const scheduleDate = schedule.date;
    const oldScheduleArr = eventMap[scheduleDate];
    let newEventMap = { ...eventMap };
    if (!oldScheduleArr) {
      newEventMap[scheduleDate] = [schedule];
    } else if (
      eventMap[scheduleDate].some((oldSch) => oldSch.id === schedule.id)
    ) {
      newEventMap[scheduleDate] = oldScheduleArr.map((oldSch) =>
        oldSch.id === schedule.id ? schedule : oldSch
      );
    } else {
      newEventMap[scheduleDate] = [...oldScheduleArr, schedule];
    }
    updateCalendarEvents(newEventMap);
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
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            datesSet={onMonthChange}
          />
        </div>
      </div>

      <EditScheduleModal
        show={Boolean(editDate)}
        toggle={toggleShowEdit}
        date={editDate}
        schedules={eventMap[editDate]}
        handleEditSchedule={handleEditSchedule}
      />
    </>
  );
};

function renderEventContent(eventInfo) {
  console.log(eventInfo);
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function parseScheduleToEvent(date, schedules = []) {
  return {
    id: date,
    title: schedules.map((s) => s.shift.name).join(", "),
    start: date,
  };
}

export default CustomCalendar;

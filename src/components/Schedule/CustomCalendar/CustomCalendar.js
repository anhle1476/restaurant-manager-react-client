import React, { useState, useEffect } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import EditScheduleModal from "../EditScheduleModal/EditScheduleModal";

import scheduleApi from "../../../api/scheduleApi";
import { toastError } from "../../../utils/toastUtils";
import { isBeforeThisMonth } from "../../../utils/dateUtils";

import "./CustomCalendar.scss";
import { connect } from "react-redux";

const CustomCalendar = ({ shifts, isNotAdmin }) => {
  const [editDate, setEditDate] = useState("");
  const [eventMap, setEventMap] = useState({});
  const [disabledEdit, setDisabledEdit] = useState(false);

  useEffect(() => {
    if (!shifts.length) return;
    setEventMap((prevMap) => updateEventMapWithNewShiftsData(prevMap, shifts));
  }, [shifts]);

  const onMonthChange = async (e) => {
    setDisabledEdit(isNotAdmin || isBeforeThisMonth(e.start));
    try {
      const res = await scheduleApi.getAllByMonth(e.start);
      setEventMap(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
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
    setEventMap(newEventMap);
  };

  const handleDeleteSchedule = (schedule) => {
    const scheduleDate = schedule.date;
    let newEventMap = {
      ...eventMap,
    };
    const deleteResult = eventMap[scheduleDate].filter(
      (oldSch) => oldSch.id !== schedule.id
    );
    if (!deleteResult.length) {
      delete newEventMap[scheduleDate];
    } else {
      newEventMap[scheduleDate] = deleteResult;
    }
    setEventMap(newEventMap);
  };

  const availableShifts = shifts.filter((shift) => !shift.deleted);

  const events = Object.keys(eventMap).map((day) =>
    parseScheduleToEvent(day, eventMap[day])
  );

  return (
    <>
      <div className="calendar">
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
            headerToolbar={{
              right: "prevYear,prev,today,next,nextYear",
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
            eventColor="#5eef3b"
            eventTextColor="#000000"
            eventDisplay="auto"
          />
        </div>
      </div>

      <EditScheduleModal
        show={Boolean(editDate)}
        toggle={toggleShowEdit}
        date={editDate}
        disabledEdit={disabledEdit}
        shifts={availableShifts}
        schedules={eventMap[editDate]}
        handleEditSchedule={handleEditSchedule}
        handleDeleteSchedule={handleDeleteSchedule}
      />
    </>
  );
};

function renderEventContent(eventInfo) {
  return (
    <ul className="text-center mb-0">
      {eventInfo.event.title.split(", ").map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function parseScheduleToEvent(date, schedules = []) {
  return {
    id: date,
    title: schedules.map((s) => s.shift.name).join(", "),
    start: date,
  };
}

function updateEventMapWithNewShiftsData(eventMap, shifts) {
  console.log("update");
  if (!Object.keys(eventMap).length) return eventMap;

  const shiftLookupMap = {};
  shifts.forEach((shift) => (shiftLookupMap[shift.id] = shift));

  const updatedEventMap = {};
  for (let day of Object.keys(eventMap)) {
    const dayEvents = eventMap[day].map((event) => {
      const updatedShift = shiftLookupMap[event.shift.id];
      return updatedShift ? { ...event, shift: updatedShift } : event;
    });
    updatedEventMap[day] = dayEvents;
  }
  return updatedEventMap;
}

function mapStateToProps(store) {
  return {
    isNotAdmin: store.auth.role !== "ADMIN",
  };
}

export default connect(mapStateToProps)(CustomCalendar);

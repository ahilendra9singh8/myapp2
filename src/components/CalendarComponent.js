// import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import moment from "moment";
// import axios from "axios";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// import { getallevents, createevent, updateevent, deleteevent, timezoneandlocation } from '../config';

// const localizer = momentLocalizer(moment);
// const DragAndDropCalendar = withDragAndDrop(Calendar);

// const CalendarComponent = () => {
//     const [events, setEvents] = useState([]);
//     const [date, setDate] = useState(new Date());
//     const [view, setView] = useState(
//         localStorage.getItem("calendarView") || "month"
//     );
//     // const [ip, setIp] = useState("Fetching...");
//     const [timezone, setTimezone] = useState("UTC");
//     const [location, setLocation] = useState("Fetching location...");

//     useEffect(() => {
//         axios
//             .get(timezoneandlocation)
//             .then((response) => {
//                 if (response.data.status === "success") {
//                     setTimezone(response.data.timezone);
//                     setLocation(
//                         `${response.data.city}, ${response.data.regionName}, ${response.data.country}`
//                     );
//                 } else {
//                     console.error("Failed to fetch location");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching IP location:", error);
//             });
//     }, []);

//     // useEffect(() => {
//     //   fetch("http://ip-api.com/json/")
//     //     .then((response) => response.json())
//     //     .then((data) => setIp(data.query))
//     //     .catch((error) => console.error("Error fetching IP:", error));
//     // }, []);

//     useEffect(() => {
//         axios
//             .get(getallevents)
//             .then((response) => {
//                 const formattedEvents = response.data.map((event) => ({
//                     ...event,
//                     start: new Date(event.start),
//                     end: new Date(event.end),
//                 }));
//                 setEvents(formattedEvents);
//             })
//             .catch((error) => {
//                 console.error("Error fetching events:", error);
//             });
//     }, [timezone]);

//     const createEvents = async ({ start }) => {
//         const title = window.prompt("Enter Event Title:");
//         if (title) {
//             const newEvent = {
//                 title,
//                 start: new Date(start),
//                 end: new Date(moment(start).add(1, "hour")),
//                 location,
//                 timezone
//             };
//             try {
//                 const response = await axios.post(
//                     createevent,
//                     newEvent
//                 );
//                 setEvents([
//                     ...events,
//                     {
//                         ...response.data,
//                         start: new Date(response.data.start),
//                         end: new Date(response.data.end),
//                     },
//                 ]);
//             } catch (error) {
//                 console.error("Error adding event:", error);
//             }
//         }
//     };

//     const editEvent = async (event) => {
//         const newTitle = window.prompt("Edit event title:", event.title);
//         if (newTitle) {
//             try {
//                 const updatedEvent = { ...event, title: newTitle };
//                 await axios.put(
//                     `${updateevent}/${event.id}`,
//                     updatedEvent
//                 );
//                 setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
//             } catch (error) {
//                 console.error("Error updating event:", error);
//             }
//         }
//     };

//     const deleteEvent = async (event) => {
//         if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
//             try {
//                 await axios.delete(
//                     `${deleteevent}/${event.id}`
//                 );
//                 setEvents(events.filter((e) => e.id !== event.id));
//             } catch (error) {
//                 console.error("Error deleting event:", error);
//             }
//         }
//     };

//     const dragDropEvent = async ({ event, start, end }) => {
//         try {
//             const updatedEvent = {
//                 ...event,
//                 start: new Date(start),
//                 end: new Date(end),
//             };
//             await axios.put(
//                 `${updateevent}/${event.id}`,
//                 updatedEvent
//             );
//             setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
//         } catch (error) {
//             console.error("Error updating event position:", error);
//         }
//     };

//     const handleViewChange = (newView) => {
//         setView(newView);
//         localStorage.setItem("calendarView", newView);
//     };

//     return (
//         <div className="container mt-4">
//             <h2 className="text-center mb-4">Calendar</h2>
//             {/* <h2>Hello {ip}</h2>  */}
//             <div className="alert alert-info text-center">
//                 <strong>Location:</strong> {location} | <strong>Timezone:</strong> {timezone}
//             </div>
//             <div className="row">
//                 <div className="col-md-9">
//                     <DragAndDropCalendar
//                         localizer={localizer}
//                         events={events}
//                         startAccessor="start"
//                         endAccessor="end"
//                         selectable
//                         resizable
//                         draggableAccessor={() => true}
//                         onSelectSlot={createEvents}
//                         onSelectEvent={editEvent}
//                         onEventDrop={dragDropEvent}
//                         onView={handleViewChange}
//                         view={view}
//                         date={date}
//                         onNavigate={(newDate) => setDate(newDate)}
//                         style={{ height: 500 }}
//                     />
//                 </div>

//                 <div className="col-md-3">
//                     <h4>Events</h4>
//                     <ul className="list-group">
//                         {events.map((event) => (
//                             <li
//                                 key={event.id}
//                                 className="list-group-item d-flex justify-content-between align-items-center"
//                             >
//                                 {event.title} -{" "}
//                                 {moment(event.start).format("DD/MM/YYYY, h:mm A")}
//                                 <div>
//                                     <button
//                                         className="btn btn-sm btn-warning me-2"
//                                         onClick={() => editEvent(event)}
//                                     >
//                                         Edit
//                                     </button>
//                                     <button
//                                         className="btn btn-sm btn-danger"
//                                         onClick={() => deleteEvent(event)}
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CalendarComponent;

// Testing 1

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getallevents,
  createevent,
  updateevent,
  deleteevent,
  timezoneandlocation,
} from "../config";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(
    localStorage.getItem("calendarView") || "month"
  );
  const [timezone, setTimezone] = useState("UTC");
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    axios
      .get(timezoneandlocation)
      .then((response) => {
        if (response.data.status === "success") {
          setTimezone(response.data.timezone);
          setLocation(
            `${response.data.city}, ${response.data.regionName}, ${response.data.country}`
          );
        } else {
          console.error("Failed to fetch location");
        }
      })
      .catch((error) => {
        console.error("Error fetching IP location:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(getallevents)
      .then((response) => {
        const formattedEvents = response.data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [timezone]);

  const createEvents = async ({ start }) => {
    const title = window.prompt("Enter Event Title:");
    if (title) {
      const newEvent = {
        title,
        start: new Date(start),
        end: new Date(moment(start).add(1, "hour")),
        // location,
        // timezone,
      };
      try {
        const response = await axios.post(createevent, newEvent);
        setEvents([
          ...events,
          {
            ...response.data,
            start: new Date(response.data.start),
            end: new Date(response.data.end),
          },
        ]);
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };

  const editEvent = async (event) => {
    const newTitle = window.prompt("Edit event title:", event.title);
    if (newTitle) {
      try {
        const updatedEvent = { ...event, title: newTitle };
        await axios.put(`${updateevent}/${event.id}`, updatedEvent);
        setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  const deleteEvent = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await axios.delete(`${deleteevent}/${event.id}`);
        setEvents(events.filter((e) => e.id !== event.id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const dragDropEvent = async ({ event, start, end }) => {
    try {
      const updatedEvent = {
        ...event,
        start: new Date(start),
        end: new Date(end),
      };
      await axios.put(`${updateevent}/${event.id}`, updatedEvent);
      setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
    } catch (error) {
      console.error("Error updating event position:", error);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("calendarView", newView);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4 text-primary">Calendar</h2>
        <div className="alert alert-info text-center">
          <strong>Location:</strong> {location} | <strong>Timezone:</strong>{" "}
          {timezone}
        </div>
        <div className="row">
          <div className="col-md-9">
            <div className="border rounded shadow p-3 bg-white">
              <DragAndDropCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                resizable
                draggableAccessor={() => true}
                onSelectSlot={createEvents}
                onSelectEvent={editEvent}
                onEventDrop={dragDropEvent}
                onView={handleViewChange}
                view={view}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                style={{ height: 500 }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <h4 className="text-center text-secondary">Events</h4>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <ul className="list-group list-group-flush">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="clo-md-2 text-truncate" style={{ wordBreak: "break-word" }}>
                        <strong>{event.title}</strong>
                        <br />
                        <small className="text-muted">
                          {moment(event.start).format("DD/MM/YYYY, h:mm A")}
                        </small>
                      </div>
                      <div className="d-flex col-md-1 d-flex justify-content-between mt-2 ms-4">
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => editEvent(event)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteEvent(event)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;

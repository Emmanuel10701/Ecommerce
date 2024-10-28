'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Button, IconButton, CircularProgress, Drawer, Badge } from '@mui/material';
import { AiOutlineClose, AiOutlineBell } from 'react-icons/ai';
import Sidebar from '../../components/sidebar/page';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CalendarPage = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEventsDrawerOpen, setIsEventsDrawerOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (session) {
      const fetchEvents = async () => {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
      };
      fetchEvents();
    }
  }, [session]);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
      setNotificationCount(notifications.length);
    }
  }, [notifications]);

  const handleDateClick = (arg) => {
    const today = new Date().toISOString().split('T')[0];
    if (arg.dateStr >= today) {
      setEventDate(arg.dateStr);
      setOpenEventDialog(true);
      setSelectedEventId(null);
    }
  };

  const handleAddEvent = async () => {
    if (eventTitle && eventDate) {
      if (session?.user?.role === 'ADMIN') {
        setLoading(true);
        try {
          const newEvent = { title: eventTitle, date: eventDate, color: 'green', id: Date.now().toString() };
          const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent),
          });
          const data = await response.json();
          setEvents([...events, data]);
          toast.success('Event added successfully!');
          setOpenEventDialog(false);
          setEventTitle('');
          setEventDate('');
        } catch (error) {
          toast.error('Failed to add event.');
        } finally {
          setLoading(false);
        }
      } else {
        setShowAccessDenied(true);
      }
    } else {
      toast.error('Please fill out all fields.');
    }
  };

  const handleUpdateEvent = async () => {
    if (eventTitle && eventDate && selectedEventId) {
      if (session?.user?.role === 'ADMIN') {
        setLoading(true);
        try {
          const updatedEvent = { title: eventTitle, date: eventDate, color: 'green', id: selectedEventId };
          const response = await fetch(`/api/events/${selectedEventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
          });
          const data = await response.json();
          setEvents(events.map(event => event.id === selectedEventId ? data : event));
          toast.success('Event updated successfully!');
          setOpenEventDialog(false);
          setEventTitle('');
          setEventDate('');
          setSelectedEventId(null);
        } catch (error) {
          toast.error('Failed to update event.');
        } finally {
          setLoading(false);
        }
      } else {
        setShowAccessDenied(true);
      }
    } else {
      toast.error('Please fill out all fields.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (session?.user?.role === 'ADMIN') {
      setLoading(true);
      try {
        await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete event.');
      } finally {
        setLoading(false);
      }
    } else {
      setShowAccessDenied(true);
    }
  };

  const handleEventClick = (arg) => {
    const event = events.find(e => e.id === arg.event.id);
    if (event && event.date >= new Date().toISOString().split('T')[0]) {
      setEventTitle(event.title);
      setEventDate(event.date);
      setSelectedEventId(event.id);
      setOpenEventDialog(true);
    }
  };

  const handleNotificationClick = () => {
    setIsEventsDrawerOpen(true);
  };

  const handleAddNotification = () => {
    if (session?.user?.role === 'ADMIN') {
      const newNotification = { id: Date.now().toString(), message: 'New Notification' };
      setNotifications([...notifications, newNotification]);
      setNotificationCount(prev => prev + 1);
      toast.success('Notification created successfully!');
    } else {
      toast.error('Only admins can create notifications.');
    }
  };

  const toggleEventsDrawer = () => {
    setIsEventsDrawerOpen(!isEventsDrawerOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (path === '/account') {
      setNotificationCount(0);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-96">
        <CircularProgress />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-400">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">Please Log In</h2>
          <p className="mb-6 text-gray-600">You need to log in to access this page.</p>
          <button 
            onClick={() => router.push("/login")} 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} className='md:hidden' />

      <main className={`flex-1 p-4 ${isSidebarOpen ? 'ml-[24%] w-[75%]' : 'ml-0 w-full'} bg-blue-400`}>
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Calendar</h1>
          <Button
            onClick={() => handleNavigation("/analytics")}
            className="text-sm text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700"
          >
            Dashboard
          </Button>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={notificationCount} color="error">
              <AiOutlineBell size={32} className="text-white bg-indigo-600 p-2 rounded-full" />
            </Badge>
          </IconButton>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events.map(event => ({
              title: event.title,
              date: event.date,
              id: event.id,
              backgroundColor: event.date < new Date().toISOString().split('T')[0] ? 'gray' : event.color,
              borderColor: event.date < new Date().toISOString().split('T')[0] ? 'lightgray' : event.color,
              textColor: 'white'
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            themeSystem='bootstrap'
            eventContent={({ event }) => (
              <div>
                <b>{event.title}</b>
              </div>
            )}
          />
        </div>

        <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
          <div className="p-4 relative">
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setOpenEventDialog(false)}
              aria-label="close"
              className="absolute right-2 top-2"
            >
              <AiOutlineClose size={24} />
            </IconButton>
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              {selectedEventId ? 'Edit Event' : 'Add Event'}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                disabled={!!selectedEventId}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                disabled={!!selectedEventId}
              />
            </div>
            <div className="mt-4 flex justify-end">
              {selectedEventId ? (
                <Button
                  onClick={handleUpdateEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Event'}
                </Button>
              ) : (
                <Button
                  onClick={handleAddEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Add Event'}
                </Button>
              )}
              <Button
                onClick={() => setOpenEventDialog(false)}
                className="ml-2 bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>

        <Drawer
          anchor="right"
          open={isEventsDrawerOpen}
          onClose={toggleEventsDrawer}
          sx={{
            '.MuiDrawer-paper': {
              width: '50vw',
              maxWidth: '300px',
            },
          }}
        >
          <div className="p-4 h-full bg-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600">All Events</h2>
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleEventsDrawer}
                aria-label="close"
              >
                <AiOutlineClose size={24} />
              </IconButton>
            </div>
            <p className="mb-4 text-gray-700 ">
              Here is the list of all upcoming events. You can also delete events directly from this list.
            </p>
            <ul className="flex-1 overflow-y-auto">
              {events.map(event => (
                <li key={event.id} className="mb-2 flex justify-between items-center">
                  <span style={{ color: event.color }}>
                    {event.title} - {event.date}
                  </span>
                  <Button
                    onClick={() => {
                      handleDeleteEvent(event.id || '');
                      if (events.length === 1) {
                        toggleEventsDrawer();
                      }
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Drawer>

        <Dialog open={showAccessDenied} onClose={() => setShowAccessDenied(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Access Denied</h2>
            <p className="mb-4">You are not permitted to perform this operation.</p>
            <Button
              onClick={() => setShowAccessDenied(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              OK
            </Button>
          </div>
        </Dialog>

        <ToastContainer />
      </main>
    </div>
  );
};

export default CalendarPage;

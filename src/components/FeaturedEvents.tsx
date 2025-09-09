import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { getSupabaseClient } from "../lib/supabase";
import CreateEventModal from "./CreateEventModal";
const supabase = getSupabaseClient();

// Event interface for type safety
interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: string;
  organizer: string;
}

// Mock events data for development/fallback
const mockEvents: EventType[] = [
  {
    id: "1",
    title: "Diwali Festival Celebration",
    description:
      "Join us for the grand Diwali celebration with traditional performances, food, and fireworks. Family-friendly event with activities for all ages.",
    date: "October 28, 2024",
    time: "6:00 PM",
    location: "Newark, DE",
    image:
      "https://images.pexels.com/photos/6664189/pexels-photo-6664189.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "500+",
    organizer: "Indian Cultural Center",
  },
  {
    id: "2",
    title: "Bollywood Dance Workshop",
    description:
      "Learn classical and modern Bollywood dance moves from professional instructors. Suitable for all skill levels.",
    date: "November 5, 2024",
    time: "2:00 PM",
    location: "Jersey City, NJ",
    image:
      "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "50",
    organizer: "Dance Academy",
  },
  {
    id: "3",
    title: "Indian Entrepreneurs Meet",
    description:
      "Network with successful Indian entrepreneurs and share business insights. Panel discussion followed by networking session.",
    date: "November 12, 2024",
    time: "7:00 PM",
    location: "Wilmington, DE",
    image:
      "https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "100",
    organizer: "Business Network",
  },
  {
    id: "4",
    title: "Holi Color Festival",
    description:
      "Celebrate the festival of colors with music, dance, and traditional Holi colors. Bring white clothes to get colorful! Food stalls and cultural performances.",
    date: "March 15, 2025",
    time: "11:00 AM",
    location: "Edison, NJ",
    image:
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "300",
    organizer: "Community Center",
  },
  {
    id: "5",
    title: "Yoga and Meditation Workshop",
    description:
      "Learn traditional yoga and meditation techniques. Suitable for beginners and experienced practitioners. Bring your own yoga mat.",
    date: "November 20, 2024",
    time: "9:00 AM",
    location: "Princeton, NJ",
    image:
      "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "30",
    organizer: "Wellness Center",
  },
  {
    id: "6",
    title: "Indian Classical Music Concert",
    description:
      "Experience the beauty of Indian classical music with renowned artists. Evening of sitar, tabla, and vocal performances.",
    date: "December 10, 2024",
    time: "7:30 PM",
    location: "Philadelphia, PA",
    image:
      "https://images.pexels.com/photos/3428498/pexels-photo-3428498.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "200",
    organizer: "Music Academy",
  },
  {
    id: "7",
    title: "Cooking Workshop - Regional Cuisines",
    description:
      "Learn to cook authentic dishes from different regions of India. Hands-on workshop with professional chefs. All ingredients provided.",
    date: "January 15, 2025",
    time: "3:00 PM",
    location: "Wilmington, DE",
    image:
      "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "25",
    organizer: "Culinary Institute",
  },
  {
    id: "8",
    title: "Community Cricket Tournament",
    description:
      "Annual cricket tournament with teams from across the tri-state area. Registration open for all skill levels. Trophies and prizes for winners.",
    date: "April 20, 2025",
    time: "8:00 AM",
    location: "Jersey City, NJ",
    image:
      "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
    attendees: "150",
    organizer: "Cricket Association",
  },
];

const FeaturedEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .limit(3);

        if (error || !data || data.length === 0) {
          console.log(
            "📅 Using mock events data (Supabase not available or no data)"
          );
          setEvents(mockEvents);
        } else {
          console.log("📅 Using Supabase events data");
          // Transform Supabase data to match our display format
          const transformedEvents = data.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: new Date(event.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time: new Date(`2000-01-01 ${event.event_time}`).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            ),
            location: event.location,
            image:
              event.image_url ||
              "https://images.pexels.com/photos/6664189/pexels-photo-6664189.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
            attendees: event.max_attendees ? `${event.max_attendees}` : "50",
            organizer: event.organizer,
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.log("📅 Error fetching events, using mock data:", error);
        setEvents(mockEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleEventCreated = (newEvent: EventType) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    console.log("✅ New event added:", newEvent.title);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join upcoming celebrations, workshops, and community gatherings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(showAllEvents ? events : events.slice(0, 3)).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {event.attendees}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                  {event.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              {showAllEvents ? "Show Featured Events" : "View All Events"}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              + Add Event
            </button>
          </div>
          {showAllEvents && (
            <p className="text-sm text-gray-600 mt-4">
              Showing all {events.length} events
            </p>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </section>
  );
};

export default FeaturedEvents;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Share2, 
  Clock,
  ArrowLeft,
  CheckCircle,
  Info,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAuthModalStore } from '../store/authModalStore';
import { supabase } from '../lib/supabase';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, parseISO, addMonths, isSameMonth, subMonths } from 'date-fns';

interface Community {
  id: string;
  name: string;
  description: string;
  groupSize: number;
  posts: number;
  category: string;
  image: string;
  longDescription?: string;
  organizer?: string;
  organizerEmail?: string;
  location?: string;
  availableDates?: string[];
  availableTimes?: string[];
  duration?: string;
  price?: number | 'free' | 'varies';
  priceDisplay?: string;
}

const generateSampleDates = (daysOfWeek: number[]): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let week = 0; week < 4; week++) {
    for (const dayOfWeek of daysOfWeek) {
      const date = addDays(today, (week * 7) + (dayOfWeek - today.getDay()));
      if (date >= today) {
        dates.push(format(date, 'yyyy-MM-dd'));
      }
    }
  }
  
  return dates;
};

const communities: Community[] = [
  {
    id: '1',
    name: 'Mindfulness Meditation at Gardens by the Bay',
    description: 'Join us for a peaceful morning meditation session surrounded by nature at Singapore\'s iconic Gardens by the Bay',
    longDescription: 'Welcome to our Mindfulness Meditation sessions at Gardens by the Bay! Experience the tranquility of Singapore\'s most beautiful garden while practicing mindfulness and meditation.\n\nOur sessions are held in the serene outdoor spaces of Gardens by the Bay, where you can connect with nature while developing your meditation practice. Whether you\'re a complete beginner or an experienced meditator, our certified instructors will guide you through various techniques including breath awareness, body scans, and loving-kindness meditation.\n\nEach session includes a gentle warm-up, guided meditation, and time for reflection. We provide yoga mats and cushions, but feel free to bring your own if you prefer. This is a wonderful opportunity to start your weekend with peace and clarity.\n\nPlease arrive 10 minutes early to settle in. Wear comfortable clothing and bring water. Sessions are held rain or shine (we move to covered areas if needed).',
    groupSize: 25,
    posts: 1245,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Mindful Singapore',
    organizerEmail: 'hello@mindfulsg.com',
    location: 'Gardens by the Bay, Bay South Garden',
    availableDates: generateSampleDates([0, 6]),
    availableTimes: ['8:00 AM', '9:30 AM'],
    duration: '1 hour',
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '2',
    name: 'Anxiety Support Circle - Orchard Community Centre',
    description: 'A safe space to share experiences and coping strategies for anxiety with trained facilitators',
    longDescription: 'Our Anxiety Support Circle provides a confidential and supportive environment for individuals dealing with anxiety. Located in the heart of Orchard, this group is facilitated by trained mental health professionals who understand the challenges of living with anxiety.\n\nEach session focuses on different aspects of anxiety management, including cognitive behavioral techniques, breathing exercises, mindfulness practices, and lifestyle modifications. We create a non-judgmental space where participants can share their experiences, learn from others, and develop practical coping strategies.\n\nThe group follows a structured format with check-ins, skill-building activities, and open discussion time. All participants are expected to maintain confidentiality and respect each other\'s experiences.\n\nThis is an ongoing support group with a small fee to cover facility costs and materials. Regular attendance is encouraged to build trust and community within the group.',
    groupSize: 15,
    posts: 892,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Singapore Mental Health Alliance',
    organizerEmail: 'support@smha.org.sg',
    location: 'Orchard Community Centre, Level 3',
    availableDates: generateSampleDates([2, 4]),
    availableTimes: ['7:00 PM', '8:30 PM'],
    duration: '1.5 hours',
    price: 25,
    priceDisplay: 'S$25',
  },
  {
    id: '3',
    name: 'Art Therapy Workshop - National Gallery Singapore',
    description: 'Express yourself through art in this therapeutic workshop led by certified art therapists',
    longDescription: 'Discover the healing power of creative expression at our Art Therapy Workshop held in the inspiring setting of National Gallery Singapore. This workshop is designed for individuals seeking alternative ways to process emotions, reduce stress, and enhance self-awareness through art.\n\nLed by certified art therapists, each session explores different artistic mediums and techniques. No prior art experience is necessary—the focus is on the process of creation rather than the final product. Through guided activities, you\'ll learn how art can be a powerful tool for emotional expression and healing.\n\nAll art materials are provided, including paints, pastels, clay, collage materials, and more. The workshop takes place in a private studio space within the gallery, offering a peaceful and inspiring environment.\n\nParticipants will create their own art pieces to take home and will have opportunities to share their experiences in a supportive group setting. This workshop is particularly beneficial for those dealing with stress, anxiety, depression, or life transitions.',
    groupSize: 20,
    posts: 567,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Creative Healing Arts',
    organizerEmail: 'workshops@creativehealing.sg',
    location: 'National Gallery Singapore, Studio Wing',
    availableDates: generateSampleDates([6]),
    availableTimes: ['2:00 PM', '4:00 PM'],
    duration: '2 hours',
    price: 45,
    priceDisplay: 'S$45',
  },
  {
    id: '4',
    name: 'Depression Warriors Support Group - Toa Payoh',
    description: 'Supporting each other through the journey of managing depression in a confidential setting',
    longDescription: 'Depression Warriors is a peer support community for individuals navigating the challenges of depression. We provide a safe, non-judgmental space where members can share their struggles, celebrate victories, and find strength in community.\n\nOur meetings are facilitated by trained peer supporters who have lived experience with depression. We focus on building resilience, developing healthy coping mechanisms, and supporting each other through difficult times. Topics include behavioral activation, thought challenging, self-care practices, and navigating the healthcare system.\n\nThis is a free support group open to anyone dealing with depression. We meet twice weekly in a comfortable, accessible space in Toa Payoh. Sessions include structured activities, open sharing time, and resources for additional support.\n\nRemember: You are not alone in this journey. Together, we are stronger. Our community is built on empathy, understanding, and the shared experience of working towards better mental health.',
    groupSize: 12,
    posts: 1834,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Toa Payoh Community Mental Health',
    organizerEmail: 'warriors@tpcmh.org.sg',
    location: 'Toa Payoh Community Centre, Room 201',
    availableDates: generateSampleDates([1, 3]),
    availableTimes: ['7:30 PM'],
    duration: '1.5 hours',
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '5',
    name: 'Yoga & Mental Wellness - East Coast Park',
    description: 'Combine physical movement with mental wellness practices by the sea',
    longDescription: 'Join us for Yoga & Mental Wellness sessions at the beautiful East Coast Park. This unique program combines traditional yoga practice with mental wellness education, all while enjoying Singapore\'s stunning coastal scenery.\n\nOur sessions are designed for all levels, from complete beginners to experienced yogis. Each class includes gentle stretching, yoga poses (asanas), breathing exercises (pranayama), and meditation. We focus on the mind-body connection and how physical movement can support mental health.\n\nClasses are held on the beach or in covered pavilions depending on weather. The sound of waves and fresh sea breeze create a naturally calming environment perfect for relaxation and mindfulness practice.\n\nPricing varies based on class type and instructor. Drop-in classes, class packages, and monthly memberships are available. Please check our website or contact us for current pricing. Bring your own mat or rent one on-site for a small fee.',
    groupSize: 30,
    posts: 2156,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Seaside Wellness Collective',
    organizerEmail: 'info@seasidewellness.sg',
    location: 'East Coast Park, Area C Pavilion',
    availableDates: generateSampleDates([0, 3, 6]),
    availableTimes: ['7:00 AM', '6:00 PM'],
    duration: '1 hour',
    price: 'varies',
    priceDisplay: 'Price may vary',
  },
  {
    id: '6',
    name: 'Stress Management Workshop - CBD Wellness Hub',
    description: 'Learn practical strategies for managing workplace stress and achieving work-life balance',
    longDescription: 'The Stress Management Workshop is designed specifically for working professionals dealing with workplace stress and seeking better work-life balance. Located in the CBD for easy access during lunch breaks or after work, this workshop provides practical, evidence-based strategies you can implement immediately.\n\nEach session covers different aspects of stress management including time management techniques, boundary-setting skills, relaxation exercises, and lifestyle modifications. We explore both immediate stress-relief techniques and long-term strategies for building resilience.\n\nThe workshop is interactive and includes hands-on practice, group discussions, and personalized action planning. You\'ll leave with a toolkit of strategies tailored to your specific stressors and lifestyle.\n\nLed by organizational psychologists and wellness coaches, this workshop is perfect for anyone feeling overwhelmed by work demands, struggling with burnout, or seeking to improve their overall well-being. Light refreshments are provided.',
    groupSize: 18,
    posts: 743,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'CBD Wellness Hub',
    organizerEmail: 'workshops@cbdwellness.sg',
    location: 'CBD Wellness Hub, Raffles Place Tower',
    availableDates: generateSampleDates([2, 5]),
    availableTimes: ['12:30 PM', '6:30 PM'],
    duration: '1.5 hours',
    price: 35,
    priceDisplay: 'S$35',
  },
  {
    id: '7',
    name: 'Teen Mental Health Support - Tampines Hub',
    description: 'A supportive space for teenagers to discuss mental health challenges with peers and counselors',
    longDescription: 'Teen Mental Health Support is a free peer support group specifically designed for teenagers aged 13-19. We understand that adolescence can be challenging, and this group provides a safe space for teens to discuss their mental health concerns with peers who understand.\n\nFacilitated by youth counselors and peer mentors, our sessions cover topics relevant to teen mental health including academic stress, social media pressures, identity exploration, family relationships, and emotional regulation. We use age-appropriate activities, discussions, and skill-building exercises.\n\nThe group meets every Saturday afternoon at Tampines Hub, a youth-friendly space with easy access via public transport. Sessions are structured but flexible, allowing teens to bring up topics that matter to them.\n\nParental consent is required for participants under 16. We maintain strict confidentiality (except in cases of safety concerns) and create a judgment-free environment where teens can be themselves and support each other.',
    groupSize: 15,
    posts: 456,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Youth Mental Health Singapore',
    organizerEmail: 'teens@ymhs.org.sg',
    location: 'Tampines Hub, Youth Space Level 4',
    availableDates: generateSampleDates([6]),
    availableTimes: ['3:00 PM'],
    duration: '1.5 hours',
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '8',
    name: 'Mindful Eating Workshop - Chinatown Complex',
    description: 'Explore the connection between food, culture, and mental wellness in Singapore\'s heritage district',
    longDescription: 'Discover the practice of mindful eating in the heart of Singapore\'s food culture! This unique workshop combines mindfulness principles with Singapore\'s rich culinary heritage, exploring how our relationship with food affects our mental and emotional well-being.\n\nHeld in Chinatown Complex, we\'ll explore local hawker culture through a mindfulness lens. Learn to slow down, savor your food, recognize hunger and fullness cues, and develop a healthier relationship with eating. The workshop includes guided mindful eating exercises, discussions about emotional eating, and a mindful food tasting experience.\n\nOur facilitators are registered dietitians and mindfulness practitioners who understand both nutrition and mental health. The workshop is suitable for anyone interested in improving their relationship with food, whether dealing with stress eating, disordered eating patterns, or simply wanting to enjoy food more fully.\n\nThe workshop fee includes all food tastings and materials. We accommodate dietary restrictions—please inform us when booking.',
    groupSize: 20,
    posts: 328,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Mindful Nutrition SG',
    organizerEmail: 'hello@mindfulnutrition.sg',
    location: 'Chinatown Complex, Community Room',
    availableDates: generateSampleDates([0]),
    availableTimes: ['11:00 AM', '2:00 PM'],
    duration: '2 hours',
    price: 50,
    priceDisplay: 'S$50',
  },
  {
    id: '9',
    name: 'LGBTQ+ Mental Health Circle - Pink Dot Community',
    description: 'A safe and affirming space for LGBTQ+ individuals to share experiences and support each other',
    longDescription: 'The LGBTQ+ Mental Health Circle is a free, affirming support group for LGBTQ+ individuals and allies. We recognize that LGBTQ+ people face unique mental health challenges, and this group provides a safe space to discuss these experiences with understanding peers.\n\nFacilitated by LGBTQ+-affirming mental health professionals, our sessions cover topics including coming out, family acceptance, relationship challenges, discrimination, identity exploration, and general mental wellness. We create an inclusive environment where all identities are welcomed and celebrated.\n\nThe group meets weekly in a private, confidential setting. We maintain strict confidentiality and follow community agreements that ensure respect and safety for all participants. Whether you\'re struggling with specific challenges or simply seeking community, you\'re welcome here.\n\nThis is a peer support group, not therapy, but facilitators can provide referrals to LGBTQ+-affirming mental health services when needed. All are welcome regardless of where they are in their journey.',
    groupSize: 12,
    posts: 967,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Pink Dot Mental Health Initiative',
    organizerEmail: 'support@pinkdotmh.sg',
    location: 'Pink Dot Community Centre (Location shared upon registration)',
    availableDates: generateSampleDates([4]),
    availableTimes: ['7:30 PM'],
    duration: '1.5 hours',
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '10',
    name: 'Sound Healing Session - Sentosa Wellness Retreat',
    description: 'Experience the therapeutic power of sound bowls and gongs in a tranquil island setting',
    longDescription: 'Immerse yourself in the healing vibrations of sound at our Sentosa Wellness Retreat. Sound healing is an ancient practice that uses therapeutic sounds to promote relaxation, reduce stress, and support emotional well-being.\n\nOur sessions feature Tibetan singing bowls, crystal bowls, gongs, chimes, and other healing instruments. As you lie comfortably on yoga mats, the sound waves wash over you, helping to quiet the mind and release tension from the body. Many participants report feeling deeply relaxed, experiencing reduced anxiety, and gaining mental clarity.\n\nEach session begins with a brief introduction to sound healing, followed by a guided relaxation and the sound bath experience. We conclude with gentle stretching and time for reflection. The retreat setting on Sentosa provides a peaceful escape from the city.\n\nPricing varies based on session type (group or private) and package options. Please contact us for current rates and availability. All equipment is provided—just bring yourself and an open mind.',
    groupSize: 25,
    posts: 1523,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Sentosa Wellness Retreat',
    organizerEmail: 'bookings@sentosawellness.sg',
    location: 'Sentosa Wellness Retreat, Palawan Beach',
    availableDates: generateSampleDates([6, 0]),
    availableTimes: ['10:00 AM', '4:00 PM', '6:00 PM'],
    duration: '1.5 hours',
    price: 'varies',
    priceDisplay: 'Price may vary',
  },
  {
    id: '11',
    name: 'Parenting & Mental Health - Bishan Community Club',
    description: 'Support group for parents navigating the challenges of raising children while maintaining mental wellness',
    longDescription: 'Parenting & Mental Health is a support group designed for parents who want to prioritize their mental wellness while raising children. We understand that parenting can be both rewarding and challenging, and this group provides a space to share experiences, learn strategies, and support each other.\n\nFacilitated by parent educators and mental health professionals, our sessions cover topics including managing parental stress, setting boundaries, self-care for parents, dealing with guilt, co-parenting challenges, and modeling healthy mental health practices for children.\n\nThe group welcomes parents at all stages—from new parents to those with teenagers. We create a non-judgmental environment where parents can be honest about their struggles and celebrate their successes. Childcare is not provided, but we can share recommendations for nearby services.\n\nA small fee helps cover facility costs and materials. Regular attendance is encouraged to build community, but drop-ins are welcome. Light refreshments are provided.',
    groupSize: 16,
    posts: 634,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Bishan Family Support Network',
    organizerEmail: 'parents@bishanfamily.sg',
    location: 'Bishan Community Club, Family Room',
    availableDates: generateSampleDates([3]),
    availableTimes: ['7:00 PM'],
    duration: '1.5 hours',
    price: 20,
    priceDisplay: 'S$20',
  },
  {
    id: '12',
    name: 'Nature Walk & Talk - MacRitchie Reservoir',
    description: 'Combine the healing power of nature with peer support in Singapore\'s lush rainforest',
    longDescription: 'Nature Walk & Talk combines the therapeutic benefits of nature immersion with peer support and mindful walking. Research shows that spending time in nature can significantly reduce stress, anxiety, and depression while improving overall well-being.\n\nOur guided walks take place on the scenic trails around MacRitchie Reservoir, one of Singapore\'s most beautiful nature reserves. As we walk at a gentle pace, we practice mindful awareness of our surroundings and engage in supportive conversations about mental health and wellness.\n\nThe walks are led by trained nature therapy guides who facilitate discussions and mindfulness exercises along the way. We pause at scenic spots for brief meditation or reflection. The group size is kept small to maintain an intimate, supportive atmosphere.\n\nThis is a free community program open to all fitness levels. The trails are relatively easy, but please wear comfortable walking shoes and bring water. We walk rain or shine (with appropriate safety precautions). It\'s a wonderful way to connect with nature and community.',
    groupSize: 20,
    posts: 1089,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Nature Therapy Singapore',
    organizerEmail: 'walks@naturetherapy.sg',
    location: 'MacRitchie Reservoir, Main Entrance',
    availableDates: generateSampleDates([0]),
    availableTimes: ['8:00 AM', '4:00 PM'],
    duration: '2 hours',
    price: 'free',
    priceDisplay: 'Free',
  },
];

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const { openModal } = useAuthModalStore();
  
  const [event, setEvent] = useState<Community | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const foundEvent = communities.find(c => c.id === eventId);
    setEvent(foundEvent || null);
  }, [eventId]);

  const handleBookEvent = async () => {
    if (!event || !selectedDate || !selectedTime) return;

    if (!isAuthenticated || !user) {
      openModal(`Login to book ${event.name}`);
      return;
    }

    setIsBooking(true);

    try {
      const { error } = await supabase
        .from('event_bookings')
        .insert({
          user_id: user.id,
          event_id: event.id,
          event_name: event.name,
          event_date: selectedDate,
          event_time: selectedTime,
          location: event.location,
          organizer: event.organizer,
          status: 'confirmed',
        });

      if (error) {
        throw error;
      }
      
      alert(`Successfully booked ${event.name} for ${format(parseISO(selectedDate), 'MMMM d, yyyy')} at ${selectedTime}!`);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error: any) {
      alert('Failed to book event. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }).catch(err => {
      alert('Failed to copy URL. Please try again.');
    });
  };

  const getMonthDates = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const dates = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  };

  const isDateAvailable = (date: Date) => {
    if (!event?.availableDates) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return event.availableDates.includes(dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <p className="text-gray-500 text-lg">Event not found</p>
        <button
          onClick={() => navigate('/community')}
          className="mt-4 text-sage-600 hover:text-sage-700 font-semibold"
        >
          ← Back to Community
        </button>
      </div>
    );
  }

  const monthDates = getMonthDates();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/community')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Events
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 shadow-md">
                {event.category}
              </span>
            </div>
            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                event.price === 'free' 
                  ? 'bg-green-500 text-white' 
                  : event.price === 'varies'
                  ? 'bg-amber-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {event.price !== 'free' && event.price !== 'varies' && (
                  <DollarSign className="w-4 h-4" />
                )}
                {event.priceDisplay}
              </span>
            </div>
          </div>

          {/* Event Title & Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
                {event.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-4 py-6 border-y border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Group Size</p>
                  <p className="text-gray-800 font-semibold">Up to {event.groupSize} participants</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-lavender-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-800 font-semibold">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Duration</p>
                  <p className="text-gray-800 font-semibold">{event.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  event.price === 'free' 
                    ? 'bg-green-100' 
                    : event.price === 'varies'
                    ? 'bg-amber-100'
                    : 'bg-blue-100'
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    event.price === 'free' 
                      ? 'text-green-600' 
                      : event.price === 'varies'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Price</p>
                  <p className="text-gray-800 font-semibold">{event.priceDisplay}</p>
                </div>
              </div>
            </div>

            {/* Long Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-800">
                About this event
              </h2>
              <div className="prose prose-gray max-w-none">
                {event.longDescription?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-sage-600" />
                <h3 className="text-lg font-semibold text-gray-800">What to expect</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span>Welcoming and supportive environment</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span>Guided discussions and activities</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span>Opportunity to connect with like-minded individuals</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span>Practical tools and strategies you can use immediately</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Booking Card - Sticky */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 sticky top-6">
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-medium">Organized by</p>
              <p className="text-lg font-semibold text-gray-800">{event.organizer}</p>
              
              {/* Organizer Email */}
              <a
                href={`mailto:${event.organizerEmail}`}
                className="flex items-center gap-2 text-sage-600 hover:text-sage-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{event.organizerEmail}</span>
              </a>

              {/* Price Display */}
              <div className={`mt-4 p-4 rounded-xl ${
                event.price === 'free' 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : event.price === 'varies'
                  ? 'bg-amber-50 border-2 border-amber-200'
                  : 'bg-blue-50 border-2 border-blue-200'
              }`}>
                <div className="flex items-center gap-2">
                  <DollarSign className={`w-5 h-5 ${
                    event.price === 'free' 
                      ? 'text-green-600' 
                      : event.price === 'varies'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`} />
                  <span className={`text-lg font-bold ${
                    event.price === 'free' 
                      ? 'text-green-700' 
                      : event.price === 'varies'
                      ? 'text-amber-700'
                      : 'text-blue-700'
                  }`}>
                    {event.priceDisplay}
                  </span>
                </div>
                {event.price === 'varies' && (
                  <p className="text-xs text-amber-600 mt-1">
                    Contact organizer for pricing details
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h3>
              
              {/* Month Selector */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-lg font-semibold text-gray-800">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Day of week headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isAvailable = isDateAvailable(date);
                    const isSelected = selectedDate === dateStr;
                    const isPast = date < new Date() && !isSameDay(date, new Date());
                    const isCurrentMonth = isSameMonth(date, currentMonth);

                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          if (isAvailable && !isPast) {
                            setSelectedDate(dateStr);
                            setSelectedTime(null);
                          }
                        }}
                        disabled={!isAvailable || isPast}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all
                          ${isSelected 
                            ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white shadow-md scale-105' 
                            : isAvailable && !isPast
                            ? 'bg-sage-50 text-gray-800 hover:bg-sage-100 border border-sage-200 hover:scale-105'
                            : isCurrentMonth
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'text-gray-300 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="flex items-center justify-center h-full">
                          <span className={!isCurrentMonth ? 'opacity-40' : ''}>
                            {format(date, 'd')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Helper text */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  {event.availableDates && event.availableDates.length > 0 
                    ? `${event.availableDates.length} dates available`
                    : 'No dates available'}
                </p>
              </div>

              {/* Time Selector */}
              {selectedDate && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-sm font-medium text-gray-700">Available Times</p>
                  <div className="grid grid-cols-2 gap-2">
                    {event.availableTimes?.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-3 px-4 rounded-xl text-sm font-semibold transition-all
                          ${selectedTime === time
                            ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white shadow-md scale-105'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:scale-105'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Summary */}
              {selectedDate && selectedTime && (
                <div className="mt-4 p-4 bg-gradient-to-br from-sage-50 to-lavender-50 rounded-xl animate-fade-in">
                  <p className="text-sm text-gray-600 mb-1">You selected:</p>
                  <p className="font-semibold text-gray-800">
                    {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="font-semibold text-gray-800">{selectedTime}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleBookEvent}
              disabled={!selectedDate || !selectedTime || isBooking}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2
                ${selectedDate && selectedTime && !isBooking
                  ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isBooking ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="w-6 h-6" />
                  Book Event
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 relative"
            >
              {showCopied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Share Event
                </>
              )}
            </button>
          </div>

          {/* Safety Notice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Safe Space</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              This is a confidential and supportive environment. What is shared in the group stays in the group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

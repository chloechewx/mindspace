import React, { useState } from 'react';
import { Calendar, MapPin, Users, Heart, Filter, DollarSign } from 'lucide-react';

export const ActivitiesDirectory: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const activities = [
    {
      id: '1',
      title: 'Sunrise Yoga in the Park',
      type: 'exercise',
      description: 'Start your day with gentle yoga stretches and breathing exercises in nature.',
      date: new Date('2025-01-25'),
      time: '7:00 AM - 8:30 AM',
      location: 'Central Park',
      address: '123 Park Ave, City',
      capacity: 30,
      registered: 18,
      cost: 0,
      imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: 'Wellness Community',
      tags: ['yoga', 'outdoor', 'beginner-friendly'],
    },
    {
      id: '2',
      title: 'Art Therapy Workshop',
      type: 'arts',
      description: 'Express yourself through painting and creative art activities in a supportive environment.',
      date: new Date('2025-01-26'),
      time: '2:00 PM - 4:00 PM',
      location: 'Community Arts Center',
      address: '456 Creative St, City',
      capacity: 15,
      registered: 12,
      cost: 15,
      imageUrl: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: 'Art Healing Collective',
      tags: ['art', 'therapy', 'creative'],
    },
    {
      id: '3',
      title: 'Mindfulness Meditation Circle',
      type: 'workshop',
      description: 'Learn meditation techniques and practice mindfulness with experienced guides.',
      date: new Date('2025-01-27'),
      time: '6:00 PM - 7:30 PM',
      location: 'Zen Wellness Studio',
      address: '789 Peace Blvd, City',
      capacity: 25,
      registered: 20,
      cost: 10,
      imageUrl: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: 'Mindful Living Center',
      tags: ['meditation', 'mindfulness', 'relaxation'],
    },
    {
      id: '4',
      title: 'Farmers Market Wellness Walk',
      type: 'market',
      description: 'Explore local produce, meet vendors, and enjoy a guided wellness walk through the market.',
      date: new Date('2025-01-28'),
      time: '9:00 AM - 11:00 AM',
      location: 'Downtown Farmers Market',
      address: '321 Market Square, City',
      capacity: 40,
      registered: 15,
      cost: 0,
      imageUrl: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: 'Healthy Living Alliance',
      tags: ['outdoor', 'community', 'wellness'],
    },
  ];

  const activityTypes = [
    { id: 'all', label: 'All Activities', icon: Heart },
    { id: 'exercise', label: 'Exercise', icon: Heart },
    { id: 'arts', label: 'Arts & Crafts', icon: Heart },
    { id: 'workshop', label: 'Workshops', icon: Heart },
    { id: 'market', label: 'Markets', icon: Heart },
  ];

  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(a => a.type === selectedType);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Type Filter */}
      <div className="soft-card p-6">
        <div className="flex flex-wrap gap-3">
          {activityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`
                px-6 py-3 rounded-full font-semibold transition-all duration-300
                ${selectedType === type.id
                  ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white shadow-md'
                  : 'bg-sage-50 text-gray-700 hover:bg-sage-100'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="soft-card overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="relative h-48">
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-serif font-semibold text-white">
                  {activity.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">{activity.description}</p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sage-500" />
                  <span>{formatDate(activity.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sage-500" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sage-500" />
                  <span>{activity.registered}/{activity.capacity} registered</span>
                </div>
                {activity.cost > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-sage-500" />
                    <span>${activity.cost}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-lavender-50 text-lavender-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button className="btn-warm w-full">
                Register for Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

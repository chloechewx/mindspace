import React, { useState } from 'react';
import { MessageSquare, HelpCircle, Book, Mail, Phone, Send } from 'lucide-react';

export const SupportCenter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setMessage('');
      setIsSending(false);
      alert('Message sent! Our support team will respond within 24 hours.');
    }, 1000);
  };

  const faqs = [
    {
      question: 'How do I book a therapy session?',
      answer: 'Navigate to the Therapy page, browse therapists, and click "Book Session" on your preferred therapist\'s profile. Choose a date and time that works for you.',
    },
    {
      question: 'Can I cancel or reschedule a session?',
      answer: 'Yes! Go to your Account page, find the booking under "Upcoming Sessions," and click "Reschedule" or "Cancel." Please note our 24-hour cancellation policy.',
    },
    {
      question: 'Is my journal data private?',
      answer: 'Absolutely. Your journal entries are encrypted and stored securely. You control who can access your data through Privacy Settings.',
    },
    {
      question: 'How does buddy matching work?',
      answer: 'Enable buddy matching in your preferences, and we\'ll connect you with others who share similar wellness goals. All matches are anonymous until you choose to connect.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and HSA/FSA cards. Payment is processed securely through our encrypted payment system.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Support Center
        </h2>
        <p className="text-gray-600">
          We're here to help with any questions or concerns
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="soft-card p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-4">Chat with our support team</p>
          <button className="btn-warm w-full">Start Chat</button>
        </div>

        <div className="soft-card p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Email</h3>
          <p className="text-gray-600 mb-4">support@mindspace.com</p>
          <button className="btn-soft w-full">Send Email</button>
        </div>

        <div className="soft-card p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blush-400 to-blush-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Phone</h3>
          <p className="text-gray-600 mb-4">1-800-MINDSPACE</p>
          <button className="btn-soft w-full">Call Now</button>
        </div>
      </div>

      {/* Send Message */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Send Us a Message</h3>
        </div>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your question or concern..."
          className="w-full h-40 p-4 rounded-2xl border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all resize-none mb-4"
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          className="btn-warm flex items-center gap-2 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {/* FAQs */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Frequently Asked Questions</h3>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-sage-50 rounded-2xl border-2 border-sage-100 overflow-hidden"
            >
              <summary className="p-4 cursor-pointer font-semibold text-gray-800 hover:bg-sage-100 transition-colors list-none flex items-center justify-between">
                <span>{faq.question}</span>
                <HelpCircle className="w-5 h-5 text-sage-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 pt-0 text-gray-700">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blush-400 to-blush-500 rounded-xl flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Help Resources</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button className="btn-soft text-left">
            📖 User Guide
          </button>
          <button className="btn-soft text-left">
            🎥 Video Tutorials
          </button>
          <button className="btn-soft text-left">
            💡 Tips & Best Practices
          </button>
          <button className="btn-soft text-left">
            🔒 Privacy & Security
          </button>
        </div>
      </div>
    </div>
  );
};

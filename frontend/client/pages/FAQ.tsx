import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Bot, Shield, Clock, Users, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const faqData = {
  "AI Health Assistant": [
    {
      question: "How does the AI health assistant work?",
      answer: "Our AI health assistant uses specialized machine learning models trained on medical literature and health data to provide evidence-based responses to your health questions. It can understand context, provide personalized advice based on your health profile, and offer guidance on when to seek professional care.",
      icon: <Bot className="w-5 h-5" />
    },
    {
      question: "Is the AI assistant a replacement for a doctor?",
      answer: "No, our AI assistant is designed to complement, not replace, professional medical care. It provides general health information and guidance, but you should always consult with healthcare professionals for diagnosis, treatment decisions, and urgent medical concerns.",
      icon: <Stethoscope className="w-5 h-5" />
    },
    {
      question: "What makes this AI different from other health chatbots?",
      answer: "Our AI has been specifically trained on health and medical data, includes text-to-speech capabilities for accessibility, and integrates with your personal health profile to provide more personalized recommendations. It's designed with healthcare best practices in mind.",
      icon: <MessageSquare className="w-5 h-5" />
    }
  ],
  "Privacy & Security": [
    {
      question: "How is my data handled?",
      answer: "This is an educational project demonstrating AI capabilities. User data is stored in Firebase for functionality purposes. For real health concerns, please consult healthcare professionals. We recommend not sharing sensitive personal health information.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "Can I delete my account data?",
      answer: "Yes, you can delete your account and associated data through your profile settings. As this is a demonstration platform, we encourage users to use test information rather than real personal health data.",
      icon: <Users className="w-5 h-5" />
    },
    {
      question: "Are my conversations with the AI private?",
      answer: "This is an educational demonstration platform. While conversations are linked to your account, this system is designed for learning purposes. For actual health concerns, please use official healthcare platforms or consult medical professionals directly.",
      icon: <Shield className="w-5 h-5" />
    }
  ],
  "Features & Usage": [
    {
      question: "What is the text-to-speech (TTS) feature?",
      answer: "Our TTS feature allows you to listen to AI responses instead of just reading them. This makes the assistant more accessible and convenient, especially when you're multitasking or have visual impairments. You can enable/disable this feature for each message.",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      question: "How do I update my health profile?",
      answer: "You can update your health profile by visiting the Profile page after logging in. You can add or modify information about medications, allergies, medical conditions, and other health data. Note that some basic information like name and age cannot be edited for security reasons.",
      icon: <Users className="w-5 h-5" />
    },
    {
      question: "Is the service available 24/7?",
      answer: "Yes, our AI health assistant is available 24 hours a day, 7 days a week. You can access health guidance whenever you need it, regardless of time zones or business hours.",
      icon: <Clock className="w-5 h-5" />
    }
  ],
  "Technical Support": [
    {
      question: "What should I do if the AI doesn't understand my question?",
      answer: "Try rephrasing your question with more specific medical terms or provide additional context. The AI works best with clear, detailed questions. If you continue to have issues, you can contact our support team.",
      icon: <Bot className="w-5 h-5" />
    },
    {
      question: "Can I use this on my mobile device?",
      answer: "Yes, our platform is fully responsive and works on all devices including smartphones, tablets, and desktop computers. The interface adapts to your screen size for optimal usability.",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      question: "What browsers are supported?",
      answer: "Our platform works on all modern web browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.",
      icon: <MessageSquare className="w-5 h-5" />
    }
  ]
};

function FAQItem({ question, answer, icon, isOpen, onToggle }: { 
  question: string; 
  answer: string; 
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
            </div>
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500 transition-transform" />
              )}
            </div>
          </div>
        </button>
        
        {isOpen && (
          <div className="px-6 pb-6">
            <div className="pl-14">
              <p className="text-gray-700 leading-relaxed">{answer}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

  const toggleItem = (category: string, index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [category]: prev[category] === index ? null : index
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our AI health assistant, 
            privacy policies, and how to get the most out of your experience.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {Object.entries(faqData).map(([category, items]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category}</h2>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
              </div>
              
              {/* FAQ Items */}
              <div className="space-y-0">
                {items.map((item, index) => (
                  <FAQItem 
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    icon={item.icon}
                    isOpen={openItems[category] === index}
                    onToggle={() => toggleItem(category, index)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-white rounded-xl p-8 text-center shadow-lg">
          <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our AI assistant is ready to help 
            with any health-related questions you might have.
          </p>
          <Button size="lg" className="group">
            <Bot className="w-5 h-5 mr-2" />
            Ask the AI Assistant
            <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

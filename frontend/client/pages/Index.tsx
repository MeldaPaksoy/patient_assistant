import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText,
  Stethoscope,
  Activity,
  ArrowRight,
  CheckCircle,
  Play,
  Volume2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "AI Health Assistant",
      description: "Get instant answers to your health questions with our advanced AI assistant available 24/7.",
      color: "bg-blue-50"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Personalized Care",
      description: "Receive tailored health recommendations based on your medical history and current conditions.",
      color: "bg-red-50"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Educational Focus",
      description: "This platform provides educational health information for learning purposes. Always consult healthcare professionals for medical decisions.",
      color: "bg-green-50"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "24/7 Availability",
      description: "Access healthcare guidance anytime, anywhere - your health doesn't follow business hours.",
      color: "bg-purple-50"
    }
  ];

  const stats = [
    { number: "TTS", label: "Voice Response Feature", icon: <Volume2 className="w-5 h-5" /> },
    { number: "AI", label: "Health-Specialized Model", icon: <Bot className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Activity className="w-5 h-5" /> },
    { number: "24/7", label: "Availability", icon: <Clock className="w-5 h-5" /> }
  ];

  const benefits = [
    "Get educational health information and guidance",
    "Learn about medications and health management",
    "Access health resources from verified datasets",
    "Browse information from reputable health organizations",
    "Practice using AI for health education",
    "Understand health topics through interactive learning"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  AI-Powered Healthcare
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Personal
                  <span className="text-primary block">Health Assistant</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the future of healthcare with our AI-powered assistant. 
                  Get personalized health insights, manage your medical information, 
                  and receive expert guidance whenever you need it.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={isAuthenticated ? "/ai-chat" : "/ai-chat"}>
                  <Button size="lg" className="w-full sm:w-auto group">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Chatting
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                    <Heart className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">AI Health Assistant</div>
                      <div className="text-sm text-gray-500">Online</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <p className="text-sm text-gray-700">
                        Hello! I'm your personal health assistant. How can I help you today?
                      </p>
                    </div>
                    <div className="bg-primary rounded-2xl p-3 ml-6">
                      <p className="text-sm text-white">
                        I'd like to know about managing diabetes with diet.
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <p className="text-sm text-gray-700">
                        Here's some educational information about diabetes dietary management from health datasets. Remember to consult your healthcare provider for personalized advice...
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Health Assistant?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with medical expertise 
              to provide you with the best healthcare experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need for Better Health
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive platform provides all the tools and resources you need 
                to take control of your health and make informed decisions.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Stethoscope className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Educational Content</h3>
                <p className="text-sm text-gray-600">Dataset-driven information</p>
              </Card>
              
              <Card className="p-6 text-center mt-8">
                <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor your health journey</p>
              </Card>
              
              <Card className="p-6 text-center">
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Health Records</h3>
                <p className="text-sm text-gray-600">Secure medical history</p>
              </Card>
              
              <Card className="p-6 text-center mt-8">
                <Activity className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real-time Insights</h3>
                <p className="text-sm text-gray-600">Instant health analysis</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who are already using our AI assistant to improve their health and well-being.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isAuthenticated ? "/ai-chat" : "/ai-chat"}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Your Health Journey
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-white/80 text-sm">
            <p>✓ No credit card required  ✓ Educational platform  ✓ Available 24/7</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, Globe, Award, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Patient Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing healthcare by making medical information accessible, 
            personalized, and available 24/7 through AI-powered assistance.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              To democratize healthcare information and provide every individual with 
              personalized, reliable, and instant access to medical guidance.
            </p>
            <p className="text-lg text-gray-600">
              We believe that everyone deserves to understand their health better 
              and make informed decisions about their wellbeing.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-80 h-80 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-32 h-32 text-primary" />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your health data is sacred. We employ the highest security standards 
                  to protect your personal medical information.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Accessible Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Healthcare guidance should be available to everyone, regardless 
                  of location, time, or economic status.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Data-Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our responses are powered by real health datasets and information 
                  sourced from reputable health organizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Personalized AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our AI provides health information using datasets from trusted 
                  sources and is designed to offer educational guidance, not medical diagnosis.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">24/7 Availability</Badge>
                  <Badge variant="secondary">Instant Responses</Badge>
                  <Badge variant="secondary">Health-Focused Training</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Comprehensive Health Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Keep track of your medications, allergies, medical history, 
                  and vital signs with our intuitive profile management system.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Profile Management</Badge>
                  <Badge variant="secondary">Health Metrics</Badge>
                  <Badge variant="secondary">Medical History</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">TTS</div>
              <div className="text-gray-600">Voice Response Feature</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">AI</div>
              <div className="text-gray-600">Health-Specialized Model</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">NEW</div>
              <div className="text-gray-600">Beta Version</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Built for Healthcare Innovation</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            This project is a demonstration of how AI technology can be applied to healthcare. 
            Our specialized model has been trained specifically for health-related queries 
            and includes advanced features like text-to-speech capabilities.
          </p>
          <div className="bg-primary/5 rounded-xl p-8">
            <p className="text-lg text-gray-700 italic">
              "We're showcasing the potential of AI in health education - providing accessible, 
              informational health resources that encourage consultation with healthcare professionals."
            </p>
            <p className="text-sm text-gray-500 mt-4">- Patient Assistant Development Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}

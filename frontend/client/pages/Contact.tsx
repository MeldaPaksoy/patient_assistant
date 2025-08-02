import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Github, Linkedin, Users, MessageCircle, ExternalLink } from "lucide-react";

const teamMembers = [
  {
    name: "Melda PAKSOY",
    role: "Scrum Master & Data Science",
    github: "https://github.com/MeldaPaksoy",
    linkedin: "https://www.linkedin.com/in/melda-paksoy/"
  },
  {
    name: "İlknur YILMAZ",
    role: "Data Science",
    github: "https://github.com/deliprofesor",
    linkedin: "https://www.linkedin.com/in/ilknuryilmaz0/"
  },
  {
    name: "Yaren FENCİ",
    role: "Artificial Intelligence",
    github: "https://github.com/YarenFenci",
    linkedin: "https://www.linkedin.com/in/yarenfenci/"
  },
  {
    name: "Hacı Bayram AKKURT",
    role: "Artificial Intelligence",
    github: "https://github.com/bayramakkurt",
    linkedin: "https://www.linkedin.com/in/h-bayram-akkurt/"
  },
  {
    name: "Yusuf TÜRKAY",
    role: "Artificial Intelligence",
    github: "https://github.com/yusufturkayy",
    linkedin: "https://www.linkedin.com/in/yusufturkay/"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with the Google Yapay Zeka ve Teknoloji Akademisi Bootcamp team members 
            who developed this AI health assistant platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Team Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Development Team
                </CardTitle>
                <CardDescription>
                  Meet the talented developers behind this AI health assistant, part of Google AI & Technology Academy Bootcamp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{member.name}</h3>
                    <p className="text-blue-700 font-medium mb-4">{member.role}</p>
                    <div className="flex gap-4">
                      <a 
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Project Overview
                </CardTitle>
                <CardDescription>
                  Technical details and features of our AI health assistant platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-2">🎯 Project Mission</p>
                  <p className="text-sm text-purple-800">Developing an AI-powered health information assistant using modern web technologies and machine learning</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">💻 Technology Stack</p>
                  <p className="text-sm text-green-800">Frontend: React, TypeScript, Tailwind CSS<br/>Backend: Python FastAPI, Firebase<br/>AI: Google MedGemma-4b Model</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">🚀 Key Features</p>
                  <p className="text-sm text-blue-800">AI Chat Interface, Text-to-Speech, User Profiles, Secure Authentication, Health Resource Library</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900 mb-2">🎓 Educational Context</p>
                  <p className="text-sm text-orange-800">Built as part of Google AI & Technology Academy Bootcamp - showcasing modern AI development practices</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>About This Project</CardTitle>
              <CardDescription>
                This AI health assistant was developed as part of the Google Yapay Zeka ve Teknoloji Akademisi Bootcamp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Collaborative Development</h3>
                  <p className="text-sm text-gray-600">
                    Built by a team of 5 developers with diverse skills in AI, frontend, backend, and DevOps
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Open Source Spirit</h3>
                  <p className="text-sm text-gray-600">
                    We believe in sharing knowledge and contributing to the developer community
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Future Vision</h3>
                  <p className="text-sm text-gray-600">
                    Exploring the intersection of AI technology and healthcare accessibility
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Activity, Shield } from "lucide-react";

export default function Resources() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Health Resource Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore health information from verified datasets and reputable organizations to help you 
            learn about health topics and make informed decisions about your wellbeing.
          </p>
        </div>

        {/* Health Topics Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Topic</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://www.who.int/health-topics/mental-disorders', '_blank')}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">Mental Health & Wellness</CardTitle>
                <CardDescription>WHO resources on mental health disorders and wellness strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">WHO Resources</Badge>
                  <Button variant="ghost" size="sm">Visit WHO →</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://www.who.int/news-room/fact-sheets/detail/healthy-diet', '_blank')}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">Nutrition & Diet</CardTitle>
                <CardDescription>WHO guidelines on healthy diet and nutrition recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">WHO Guidelines</Badge>
                  <Button variant="ghost" size="sm">Visit WHO →</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://www.who.int/news-room/fact-sheets/detail/physical-activity', '_blank')}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">Exercise & Fitness</CardTitle>
                <CardDescription>WHO recommendations for physical activity and fitness guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">WHO Standards</Badge>
                  <Button variant="ghost" size="sm">Visit WHO →</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://www.cdc.gov/prevention/index.html', '_blank')}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">Preventive Care</CardTitle>
                <CardDescription>CDC resources on disease prevention and health screenings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">CDC Resources</Badge>
                  <Button variant="ghost" size="sm">Visit CDC →</Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Data Sources Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Data Sources</h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Our AI assistant is trained on verified medical datasets and information from reputable health organizations to provide educational health information.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">📊</span>
                  </div>
                  <CardTitle className="text-lg">MedQuAD Dataset</CardTitle>
                </div>
                <CardDescription>Medical Question Answer dataset for AI research containing verified Q&A pairs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Source: Kaggle Research Dataset</p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://www.kaggle.com/datasets/pythonafroz/medquad-medical-question-answer-for-ai-research', '_blank')}>
                  View Dataset →
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">🏥</span>
                  </div>
                  <CardTitle className="text-lg">Clinical Dataset</CardTitle>
                </div>
                <CardDescription>Comprehensive clinical data for medical AI training and research purposes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Source: IMT Kaggle Team</p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://www.kaggle.com/datasets/imtkaggleteam/clinical-dataset', '_blank')}>
                  View Dataset →
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">🇹🇷</span>
                  </div>
                  <CardTitle className="text-lg">Turkish Health Ministry</CardTitle>
                </div>
                <CardDescription>Official health guidelines and public health information from Turkey's Ministry of Health</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Source: saglik.gov.tr</p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://www.saglik.gov.tr/', '_blank')}>
                  Visit Official Site →
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">🌍</span>
                  </div>
                  <CardTitle className="text-lg">World Health Organization</CardTitle>
                </div>
                <CardDescription>Global health data, guidelines, and evidence-based health information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Source: WHO Official</p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://www.who.int/', '_blank')}>
                  Visit WHO →
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">📚</span>
                  </div>
                  <CardTitle className="text-lg">PubMed References</CardTitle>
                </div>
                <CardDescription>Peer-reviewed medical literature and research publications for reference</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Source: NCBI Database</p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://pubmed.ncbi.nlm.nih.gov/', '_blank')}>
                  Browse PubMed →
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-sm">🔬</span>
                  </div>
                  <CardTitle className="text-lg">CDC Health Data</CardTitle>
                </div>
                <CardDescription>Centers for Disease Control prevention guidelines and health statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Source: CDC Official</p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://www.cdc.gov/', '_blank')}>
                  Visit CDC →
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mb-16">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <span className="text-xl">⚠️</span>
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 mb-3">
                <strong>Educational Purpose Only:</strong> This AI assistant is designed for educational and informational purposes. 
                The information provided is based on publicly available datasets and should not be used as a substitute for professional medical advice.
              </p>
              <p className="text-yellow-800">
                <strong>Always Consult Healthcare Professionals:</strong> For any health concerns, symptoms, or medical decisions, 
                please consult qualified healthcare providers or visit official medical institutions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Health Information?
            </h2>
            <p className="text-gray-600 mb-6">
              Our AI assistant provides educational health information using datasets from 
              reputable sources. For medical concerns, consult healthcare professionals.
            </p>
            <Button size="lg" onClick={() => window.location.href = '/ai-chat'}>
              Try AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

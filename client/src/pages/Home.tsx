import { Link } from "wouter";
import { BookOpen, Users, Trophy, Droplets, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useLatestSuccessStories } from "@/hooks/use-success-stories";
import { useDirectorMessage } from "@/hooks/use-director-message";
import { usePageTitle } from "@/hooks/use-page-title";
import { Loader2 } from "lucide-react";

// Trust Strip Component
function TrustStrip() {
  const { data: config } = useSiteConfig();
  
  const stats = [
    { label: "Years of Trust", value: "26+" },
    { label: "Students Mentored", value: "10,000+" },
    { label: "Exams Cracked", value: "IIT-JEE | NEET | CUET" },
  ];

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Announcements Component
function AnnouncementsSection() {
  const { data: announcements, isLoading } = useAnnouncements();

  if (isLoading) return null;
  if (!announcements || announcements.length === 0) return null;

  return (
    <section className="py-8 bg-amber-50 border-b border-amber-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="space-y-4">
          {announcements.slice(0, 3).map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-lg border-l-4 ${
                ann.importance === "critical"
                  ? "bg-red-50 border-red-400"
                  : ann.importance === "high"
                  ? "bg-orange-50 border-orange-400"
                  : "bg-blue-50 border-blue-400"
              } animate-fadeIn`}
            >
              <p className="font-semibold text-slate-900">{ann.title}</p>
              <p className="text-sm text-slate-600 mt-1">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Director's Message & Featured Success Story Component
function DirectorMessageSection() {
  const { data: message, isLoading: messageLoading } = useDirectorMessage();
  const { data: stories, isLoading: storiesLoading } = useLatestSuccessStories(1);
  const featuredStory = stories && stories.length > 0 ? stories[0] : null;

  if (messageLoading || !message) return null;

  return (
    <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Director's Message */}
          <div className="space-y-6 animate-slideUp">
            <div>
              {message.photoUrl && (
                <img
                  src={message.photoUrl}
                  alt={message.directorName}
                  className="w-full h-80 object-cover rounded-2xl shadow-xl mb-6"
                />
              )}
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Director's Message</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">{message.message}</p>
              <div>
                <p className="text-slate-700 font-bold text-lg">{message.directorName}</p>
                <p className="text-sm text-slate-600">Director, H2O Classes</p>
              </div>
            </div>
          </div>

          {/* Featured Success Story */}
          {!storiesLoading && featuredStory && (
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-blue-600">
                {featuredStory.photoUrl && (
                  <div className="relative">
                    <img
                      src={featuredStory.photoUrl}
                      alt={featuredStory.studentName}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                      <Award className="w-5 h-5" />
                      Featured
                    </div>
                  </div>
                )}
                <div className="p-8 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{featuredStory.studentName}</h3>
                    <p className="text-sm text-slate-600 mt-1">Batch of {featuredStory.year}</p>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t-2 border-slate-100">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Exam</p>
                    <p className="text-lg font-bold text-slate-900">{featuredStory.exam}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Achievement</p>
                    <p className="text-3xl font-bold text-green-600">{featuredStory.achievement}</p>
                  </div>

                  {featuredStory.description && (
                    <div className="space-y-2 pt-4 border-t-2 border-slate-100">
                      <p className="text-slate-700 leading-relaxed italic">{featuredStory.description}</p>
                    </div>
                  )}

                  {featuredStory.verified && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold pt-4">
                      <Award className="w-5 h-5" />
                      Verified Achievement
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Success Stories Preview Component
function SuccessStoriesPreview() {
  const { data: stories, isLoading } = useLatestSuccessStories(6);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
          <p className="text-lg text-slate-600">Our students' achievements speak louder than words</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-slate-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-slideUp"
            >
              {story.photoUrl && (
                <img
                  src={story.photoUrl}
                  alt={story.studentName}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{story.studentName}</h3>
                    <p className="text-sm text-slate-600">{story.exam}</p>
                  </div>
                  {story.verified && (
                    <Award className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-lg font-semibold text-blue-600 mb-2">{story.achievement}</p>
                {story.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{story.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-3">Class of {story.year}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/success-stories">
            <Button size="lg" variant="outline">
              View All Success Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle(
    "H2O Classes",
    "IIT-JEE, NEET, CUET, and Board exam coaching in Kashipur, Uttarakhand. 26+ years of academic excellence. In association with Scholar's Academy."
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 pt-20 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center space-y-8">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <Droplets className="w-8 h-8" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
              <span className="text-blue-600">H2O Classes</span>
            </h1>

            {/* Secondary Branding Line */}
            <p className="text-lg text-slate-600">
              Scholar's Academy – In Association with H2O Classes
            </p>
            
            {/* Subheading */}
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Concept-based learning for guaranteed success in Boards and Competitive Exams
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  Book a Free Academic Counseling Session
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Announcements */}
      <AnnouncementsSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">Why Choose H2O Classes?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-10 h-10 text-blue-600" />,
                title: "Concept-Based Learning",
                desc: "We focus on understanding the 'why' and 'how', not just rote memorization. Deep conceptual clarity leads to lasting knowledge."
              },
              {
                icon: <Users className="w-10 h-10 text-cyan-600" />,
                title: "Small Batch Sizes",
                desc: "Limited students per batch ensures personalized attention. Every student gets individual care and guidance."
              },
              {
                icon: <Trophy className="w-10 h-10 text-amber-600" />,
                title: "Result Oriented",
                desc: "Regular testing, performance tracking, and continuous improvement. Our track record speaks for itself."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-block p-3 bg-white rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Director's Message */}
      <DirectorMessageSection />

      {/* Success Stories */}
      <SuccessStoriesPreview />

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-slate-600 mb-10">
            Join thousands of students who have transformed their academic performance with H2O Classes and Scholar's Academy partnership.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Book a Free Academic Counseling Session
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
      {/* Hero Section */}

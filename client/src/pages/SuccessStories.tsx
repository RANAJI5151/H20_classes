import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSuccessStories } from "@/hooks/use-success-stories";
import { usePageTitle } from "@/hooks/use-page-title";
import { Award, ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function SuccessStories() {
  usePageTitle(
    "Success Stories",
    "Real achievements from H2O Classes students. Discover success stories in IIT-JEE, NEET, CUET, and Board exams."
  );
  const { data: stories, isLoading } = useSuccessStories();

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Success Stories
          </h1>
          <p className="text-lg text-slate-600">
            Real achievements from real students. Discover how H2O Classes transformed academic journeys.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : !stories || stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600">No success stories yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-100 animate-slideUp"
                >
                  {story.photoUrl ? (
                    <img
                      src={story.photoUrl}
                      alt={story.studentName}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Award className="w-12 h-12 text-blue-400" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {story.studentName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {story.exam} • {story.year}
                        </p>
                      </div>
                      {story.verified && (
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">Verified</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xl font-bold text-blue-600 mb-3">
                      {story.achievement}
                    </p>

                    {story.description && (
                      <p className="text-slate-600 leading-relaxed">
                        {story.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Create Your Success Story?
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Join our community of achievers and transform your academic journey with H2O Classes.
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

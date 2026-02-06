import { useCourses } from "@/hooks/use-courses";
import { BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Courses() {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Our Courses</h1>
          <p className="text-lg text-slate-600">
            Structured learning programs tailored for different academic stages and goals.
          </p>
        </div>

        <div className="grid gap-8">
          {courses?.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto bg-slate-200 relative">
                {course.imageUrl ? (
                   <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-primary/5">
                     <BookOpen className="w-16 h-16 text-primary/30" />
                   </div>
                )}
                <div className="absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full text-sm font-bold text-primary shadow-sm">
                  {course.grade}
                </div>
              </div>
              <div className="p-8 md:w-2/3 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{course.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{course.description}</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Subjects Covered</span>
                    <span className="font-semibold text-slate-800">{course.subjects}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    {["Expert Faculty", "Doubt Sessions", "Regular Tests"].map(tag => (
                      <span key={tag} className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        <Check className="w-3 h-3 mr-1" /> {tag}
                      </span>
                    ))}
                  </div>
                  <Link href="/contact">
                    <Button>Enquire Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

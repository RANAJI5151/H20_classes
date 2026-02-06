import { useFaculty } from "@/hooks/use-faculty";
import { User, Linkedin, Twitter } from "lucide-react";

export default function Faculty() {
  const { data: facultyMembers, isLoading } = useFaculty();

  if (isLoading) {
    return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Meet Our Mentors</h1>
          <p className="text-lg text-slate-600">
            Highly qualified and experienced educators dedicated to shaping your future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facultyMembers?.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
               <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                 {member.imageUrl ? (
                   <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <User className="w-24 h-24" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <p className="text-sm line-clamp-3">{member.bio}</p>
                    </div>
                 </div>
               </div>
               <div className="p-6">
                 <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                 <div className="text-primary font-medium text-sm mb-2">{member.role}</div>
                 <div className="text-slate-500 text-sm">{member.qualification}</div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

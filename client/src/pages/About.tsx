import { Target, Lightbulb, GraduationCap, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            About H2O Classes
          </h1>
          <p className="text-lg text-slate-600 mb-4">
            26+ Years of Regional Academic Excellence
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Founded with a vision to revolutionize education in Kashipur, Uttarakhand, H2O Classes stands for clarity, purity of concepts, and fluid learning. Now partnering with Scholar's Academy to bring national-level expertise to our students.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
           <div>
             {/* teacher teaching class classroom education */}
             <img 
               src="https://pixabay.com/get/gc9e33e6e83f8cad93b435cd657ea112228e55c847ffe6fc44afc1d4df0dc8e2cd99a8bbdae8d2db406c31c284b8caeb859183f13af1b34cd1aadeaa4a677e631_1280.jpg" 
               alt="Classroom" 
               className="rounded-3xl shadow-xl"
             />
           </div>
           <div className="space-y-6">
             <h2 className="text-3xl font-bold text-slate-900">Our Legacy & Vision</h2>
             <div className="space-y-4">
               <div>
                 <h3 className="font-bold text-blue-600 mb-2">26+ Years of Regional Excellence</h3>
                 <p className="text-slate-600">
                   Kashipur's trusted name in academic coaching. Thousands of students have transformed their careers through our concept-based learning approach.
                 </p>
               </div>
               <div>
                 <h3 className="font-bold text-blue-600 mb-2">National Expertise (Scholar's Academy)</h3>
                 <p className="text-slate-600">
                   In association with Scholar's Academy, New Delhi (led by IIT Delhi alumnus with 18+ years of national-level coaching experience), we now bring world-class standards to Kashipur.
                 </p>
               </div>
               <div>
                 <h3 className="font-bold text-blue-600 mb-2">EdTech Innovation</h3>
                 <p className="text-slate-600">
                   Modern classrooms, competitive testing framework, national benchmarking—all while retaining the personalized attention that makes H2O Classes special.
                 </p>
               </div>
             </div>
           </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl mb-24 border border-blue-100">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">26+</div>
              <div className="text-slate-600">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-slate-600">Students Mentored</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">Tarun Sir</div>
              <div className="text-slate-600">Chemistry Head (Retained)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">IIT Delhi</div>
              <div className="text-slate-600">Alumnus Leadership</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
             {[
               { title: "Discipline", icon: <Target className="w-10 h-10 text-primary" />, desc: "We instill consistency and rigor essential for competitive exam success." },
               { title: "Clarity", icon: <Lightbulb className="w-10 h-10 text-secondary" />, desc: "Concept clarity first—we don't advance until foundations are solid." },
               { title: "Excellence", icon: <GraduationCap className="w-10 h-10 text-accent" />, desc: "Striving for the highest standards in teaching and mentoring." },
               { title: "Trust", icon: <Award className="w-10 h-10 text-blue-500" />, desc: "26+ years of student and parent trust. Results speak louder than words." }
             ].map((val, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-shadow">
                 <div className="mx-auto w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                   {val.icon}
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-slate-900">{val.title}</h3>
                 <p className="text-slate-600 text-sm">{val.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

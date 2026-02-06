import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCareerApplication } from "@/hooks/use-career-applications";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { ArrowLeft, Briefcase, FileText } from "lucide-react";
import { useState } from "react";

export default function Career() {
  usePageTitle(
    "Career - Join H2O Classes",
    "Join our team. We are hiring experienced teachers and educators in Kashipur, Uttarakhand."
  );
  const { mutate: createApplication, isPending } = useCreateCareerApplication();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    experience: "",
    phone: "",
    email: "",
    resumeUrl: "", // In a real app, this would be a file upload
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.subject || !formData.experience || 
        !formData.phone || !formData.email || !formData.resumeUrl) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    createApplication(formData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your application has been submitted successfully",
        });
        setFormData({
          name: "",
          subject: "",
          experience: "",
          phone: "",
          email: "",
          resumeUrl: "",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to submit application",
          variant: "destructive",
        });
      },
    });
  };

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
            Join Our Team
          </h1>
          <p className="text-lg text-slate-600">
            Become part of H2O Classes and make a difference in students' lives.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                icon: <Briefcase className="w-8 h-8 text-blue-600" />,
                title: "Growing Institution",
                desc: "Join a rapidly expanding educational organization with cutting-edge facilities and student-centric approach.",
              },
              {
                icon: <FileText className="w-8 h-8 text-cyan-600" />,
                title: "Professional Growth",
                desc: "Access continuous learning opportunities, seminars, and professional development programs.",
              },
              {
                icon: <Briefcase className="w-8 h-8 text-amber-600" />,
                title: "Competitive Compensation",
                desc: "Attractive salary packages, performance bonuses, and comprehensive benefits await our educators.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-block p-3 bg-slate-50 rounded-xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Submit Your Application
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject/Specialization *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Physics, Chemistry, Maths"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91-XXXXXXXXXX"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Years of Teaching Experience *</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="resumeUrl">
                  Resume/CV URL *
                  <span className="text-xs text-slate-500 ml-2">
                    (Please upload your resume to a cloud storage and paste the URL)
                  </span>
                </Label>
                <Input
                  id="resumeUrl"
                  name="resumeUrl"
                  type="url"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://your-cloud-storage.com/resume.pdf"
                  disabled={isPending}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-xs text-slate-600 text-center">
                We review all applications carefully and contact qualified candidates within 5-7 business days.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-slate-600 mb-6">
            Contact us at careers@h2oclasses.com or call +91-XXXXXXXXXX
          </p>
        </div>
      </section>
    </div>
  );
}

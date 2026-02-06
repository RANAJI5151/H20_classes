import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteConfig, useUpdateSiteConfig } from "@/hooks/use-site-config";
import { useCourses, useCreateCourse, useDeleteCourse } from "@/hooks/use-courses";
import { useFaculty, useCreateFaculty, useDeleteFaculty } from "@/hooks/use-faculty";
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from "@/hooks/use-content";
import { useSuccessStories, useCreateSuccessStory, useDeleteSuccessStory } from "@/hooks/use-success-stories";
import { useCareerApplications, useUpdateCareerApplication, useDeleteCareerApplication } from "@/hooks/use-career-applications";
import { useDirectorMessage, useUpsertDirectorMessage } from "@/hooks/use-director-message";
import { useContacts } from "@/hooks/use-content";
import { Loader2, Plus, Trash2, LogOut, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoggingIn}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn}
            />
          </div>

          {loginError && (
            <div className="text-sm text-red-600">
              {loginError instanceof Error ? loginError.message : "Login failed"}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back, Admin</p>
          </div>
          <div className="flex gap-4">
             <Link href="/">
               <Button variant="outline">View Site</Button>
             </Link>
             <Button variant="destructive" onClick={() => logout()}>
               <LogOut className="mr-2 h-4 w-4" /> Logout
             </Button>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full justify-start h-auto flex-wrap">
            <TabsTrigger value="courses" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Courses</TabsTrigger>
            <TabsTrigger value="faculty" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Faculty</TabsTrigger>
            <TabsTrigger value="announcements" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Announcements</TabsTrigger>
            <TabsTrigger value="success-stories" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Success Stories</TabsTrigger>
            <TabsTrigger value="career" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Career Apps</TabsTrigger>
            <TabsTrigger value="director" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Director Message</TabsTrigger>
            <TabsTrigger value="contacts" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Messages</TabsTrigger>
            <TabsTrigger value="settings" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="courses"><CoursesManager /></TabsContent>
          <TabsContent value="faculty"><FacultyManager /></TabsContent>
          <TabsContent value="announcements"><AnnouncementsManager /></TabsContent>
          <TabsContent value="success-stories"><SuccessStoriesManager /></TabsContent>
          <TabsContent value="career"><CareerApplicationsManager /></TabsContent>
          <TabsContent value="director"><DirectorMessageManager /></TabsContent>
          <TabsContent value="contacts"><ContactsViewer /></TabsContent>
          <TabsContent value="settings"><SettingsManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- Sub-components for Admin Sections ---

function CoursesManager() {
  const { data: courses } = useCourses();
  const { mutate: deleteCourse } = useDeleteCourse();
  const { mutate: createCourse } = useCreateCourse();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createCourse({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      grade: formData.get('grade') as string,
      subjects: formData.get('subjects') as string,
      imageUrl: formData.get('imageUrl') as string,
    }, {
      onSuccess: () => {
        setIsOpen(false);
        toast({ title: "Course Created" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Courses</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Course</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Course</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2"><Label>Title</Label><Input name="title" required /></div>
              <div className="grid gap-2"><Label>Description</Label><Textarea name="description" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Grade/Class</Label><Input name="grade" required /></div>
                <div className="grid gap-2"><Label>Subjects</Label><Input name="subjects" required /></div>
              </div>
              <div className="grid gap-2"><Label>Image URL</Label><Input name="imageUrl" /></div>
              <Button type="submit" className="w-full">Create Course</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {courses?.map(course => (
          <div key={course.id} className="bg-white p-6 rounded-xl border border-slate-200 flex justify-between items-start shadow-sm">
            <div>
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-2">{course.grade} • {course.subjects}</p>
              <p className="text-slate-600">{course.description}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => deleteCourse(course.id)}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacultyManager() {
  const { data: faculty } = useFaculty();
  const { mutate: deleteFaculty } = useDeleteFaculty();
  const { mutate: createFaculty } = useCreateFaculty();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createFaculty({
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      qualification: formData.get('qualification') as string,
      bio: formData.get('bio') as string,
      imageUrl: formData.get('imageUrl') as string,
    }, {
      onSuccess: () => {
        setIsOpen(false);
        toast({ title: "Faculty Added" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Faculty Team</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Faculty</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Faculty Member</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2"><Label>Name</Label><Input name="name" required /></div>
              <div className="grid gap-2"><Label>Role</Label><Input name="role" required /></div>
              <div className="grid gap-2"><Label>Qualification</Label><Input name="qualification" /></div>
              <div className="grid gap-2"><Label>Bio</Label><Textarea name="bio" /></div>
              <div className="grid gap-2"><Label>Image URL</Label><Input name="imageUrl" /></div>
              <Button type="submit" className="w-full">Add Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faculty?.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 items-center shadow-sm">
            <div className="h-16 w-16 bg-slate-100 rounded-full overflow-hidden shrink-0">
               {member.imageUrl ? <img src={member.imageUrl} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-slate-500">{member.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => deleteFaculty(member.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsManager() {
  const { data: announcements } = useAnnouncements();
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
  const { mutate: createAnnouncement } = useCreateAnnouncement();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createAnnouncement({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      importance: formData.get('importance') as string,
      startDate: new Date(),
      expiryDate: formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : undefined,
      active: true,
    }, {
      onSuccess: () => {
        setIsOpen(false);
        toast({ title: "Announcement Posted" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Announcements</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Post New</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2"><Label>Title</Label><Input name="title" required placeholder="e.g., Exam Schedule" /></div>
              <div className="grid gap-2"><Label>Content</Label><Textarea name="content" required placeholder="Details..." /></div>
              <div className="grid gap-2">
                <Label>Importance</Label>
                <select name="importance" className="border border-slate-300 rounded px-3 py-2">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="grid gap-2"><Label>Expiry Date (optional)</Label><Input name="expiryDate" type="date" /></div>
              <Button type="submit" className="w-full">Post Announcement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements?.map(item => (
          <div key={item.id} className={`p-4 rounded-xl border shadow-sm flex justify-between items-center ${
            item.importance === 'critical' ? 'bg-red-50 border-red-200' :
            item.importance === 'high' ? 'bg-orange-50 border-orange-200' :
            'bg-blue-50 border-blue-200'
          }`}>
             <div>
               <h3 className="font-bold">{item.title}</h3>
               <p className="text-slate-600 text-sm">{item.content}</p>
               {item.expiryDate && <p className="text-xs text-slate-500 mt-1">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>}
             </div>
             <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => deleteAnnouncement(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsViewer() {
  const { data: contacts } = useContacts();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Messages</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Contact</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Message</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map(contact => (
              <tr key={contact.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="p-4">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-xs text-slate-500">{contact.grade}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">{contact.phone}</div>
                  <div className="text-xs text-slate-500">{contact.email}</div>
                </td>
                <td className="p-4 text-sm text-slate-600 max-w-md">{contact.message}</td>
                <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
            {(!contacts || contacts.length === 0) && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No messages yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsManager() {
  const { data: config } = useSiteConfig();
  const { mutate: updateConfig } = useUpdateSiteConfig();
  const { toast } = useToast();

  const getConfig = (key: string) => config?.find(c => c.key === key)?.value || "";

  const handleSave = (key: string, value: string) => {
    updateConfig({ key, value }, {
      onSuccess: () => toast({ title: "Updated!", description: `${key} saved successfully.` })
    });
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-xl font-bold mb-4">Site Configuration</h2>
      
      {[
        { key: "phone", label: "Phone Number" },
        { key: "email", label: "Email Address" },
        { key: "address", label: "Physical Address" },
        { key: "tagline", label: "Website Tagline" },
        { key: "branding_line", label: "Branding Line (Scholar's Academy...)" },
      ].map(field => (
        <div key={field.key} className="flex gap-4 items-end">
          <div className="grid gap-2 flex-1">
            <Label>{field.label}</Label>
            <Input 
              defaultValue={getConfig(field.key)} 
              onBlur={(e) => handleSave(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
          <Button size="sm" variant="secondary">Save</Button>
        </div>
      ))}
    </div>
  );
}

function SuccessStoriesManager() {
  const { data: stories } = useSuccessStories();
  const { mutate: createStory } = useCreateSuccessStory();
  const { mutate: deleteStory } = useDeleteSuccessStory();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createStory({
      studentName: formData.get('studentName') as string,
      year: parseInt(formData.get('year') as string),
      exam: formData.get('exam') as string,
      achievement: formData.get('achievement') as string,
      description: formData.get('description') as string,
      photoUrl: formData.get('photoUrl') as string,
      verified: formData.get('verified') === 'on',
    }, {
      onSuccess: () => {
        setIsOpen(false);
        toast({ title: "Success Story Added" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Success Stories</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Story</Button></DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto">
            <DialogHeader><DialogTitle>Add Success Story</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2"><Label>Student Name</Label><Input name="studentName" required /></div>
              <div className="grid gap-2"><Label>Year</Label><Input name="year" type="number" required /></div>
              <div className="grid gap-2"><Label>Exam (IIT-JEE, NEET, CUET, Board)</Label><Input name="exam" required /></div>
              <div className="grid gap-2"><Label>Achievement</Label><Input name="achievement" required placeholder="e.g., Rank 1" /></div>
              <div className="grid gap-2"><Label>Description</Label><Textarea name="description" placeholder="Optional details..." /></div>
              <div className="grid gap-2"><Label>Photo URL</Label><Input name="photoUrl" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="verified" id="verified" />
                <Label htmlFor="verified">Mark as Verified</Label>
              </div>
              <Button type="submit" className="w-full">Add Story</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {stories?.map(story => (
          <div key={story.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold">{story.studentName}</h3>
              <p className="text-sm text-slate-600">{story.exam} • {story.achievement} • {story.year}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => deleteStory(story.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CareerApplicationsManager() {
  const { data: applications } = useCareerApplications();
  const { mutate: deleteApplication } = useDeleteCareerApplication();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    const { mutate: updateApplication } = useUpdateCareerApplication(id);
    updateApplication({ status }, {
      onSuccess: () => toast({ title: "Status Updated" })
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Career Applications</h2>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Subject</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Experience</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map(app => (
              <tr key={app.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="p-4">
                  <div className="font-medium">{app.name}</div>
                  <div className="text-xs text-slate-500">{app.email}</div>
                </td>
                <td className="p-4">{app.subject}</td>
                <td className="p-4">{app.experience} years</td>
                <td className="p-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="text-sm px-2 py-1 rounded border border-slate-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="p-4 space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => window.open(app.resumeUrl, '_blank')} title="Download Resume">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => deleteApplication(app.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {(!applications || applications.length === 0) && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DirectorMessageManager() {
  const { data: message, isLoading } = useDirectorMessage();
  const { mutate: upsertMessage } = useUpsertDirectorMessage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    upsertMessage({
      directorName: (formData.get('directorName') || '') as string,
      message: (formData.get('message') || '') as string,
      photoUrl: (formData.get('photoUrl') || '') as string,
    }, {
      onSuccess: () => {
        toast({ title: "Director Message Updated" });
      }
    });
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-xl font-bold">Director's Message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label>Director Name</Label>
          <Input
            name="directorName"
            defaultValue={message?.directorName || ""}
            required
            placeholder="e.g., Dr. Tarun Pant"
          />
        </div>

        <div className="grid gap-2">
          <Label>Message</Label>
          <Textarea
            name="message"
            defaultValue={message?.message || ""}
            required
            rows={10}
            placeholder="Enter the director's message..."
          />
        </div>

        <div className="grid gap-2">
          <Label>Photo URL</Label>
          <Input
            name="photoUrl"
            defaultValue={message?.photoUrl || ""}
            type="url"
            placeholder="https://..."
          />
        </div>

        <Button type="submit" className="w-full">Save Message</Button>
      </form>
    </div>
  );
}

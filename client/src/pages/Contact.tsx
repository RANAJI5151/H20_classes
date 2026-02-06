import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContactMessage } from "@shared/routes";
import { useCreateContact } from "@/hooks/use-content";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const { data: config } = useSiteConfig();
  const { mutate: sendMessage, isPending } = useCreateContact();
  const { toast } = useToast();

  const getConfig = (key: string) => config?.find(c => c.key === key)?.value;

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      grade: "",
      message: ""
    }
  });

  function onSubmit(data: InsertContactMessage) {
    sendMessage(data, {
      onSuccess: () => {
        toast({ title: "Message Sent!", description: "We will get back to you shortly." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
      }
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Info */}
          <div>
            <h1 className="text-4xl font-bold mb-6 text-slate-900">Get in Touch</h1>
            <p className="text-lg text-slate-600 mb-12">
              Have questions about our courses or admissions? We're here to help!
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                  <p className="text-slate-600">{getConfig("address") || "Kashipur, Uttarakhand"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-slate-600">{getConfig("phone") || "+91 98765 43210"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-slate-600">{getConfig("email") || "info@h2oclasses.com"}</p>
                </div>
              </div>
            </div>
            
            <a 
               href={`https://wa.me/${(getConfig("phone") || "").replace(/[^0-9]/g, '')}`} 
               target="_blank" 
               rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25">
                <MessageSquare className="mr-2 h-5 w-5" /> Chat on WhatsApp
              </Button>
            </a>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="98765..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl><Input placeholder="john@example.com" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class/Grade</FormLabel>
                        <FormControl><Input placeholder="e.g. Class 10" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl><Textarea placeholder="How can we help you?" className="min-h-[120px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-20 rounded-3xl overflow-hidden shadow-lg h-96 border border-slate-200">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3489.123456789!2d78.96288!3d29.21042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a43c000000001%3A0x0!2sKashipur%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

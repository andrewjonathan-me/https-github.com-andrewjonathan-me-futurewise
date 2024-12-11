import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/ContactForm";

export default function Contact() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col" id="contact">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-2xl mx-auto relative">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleCancel}
          >
            <X className="h-6 w-6" />
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hubungi Kami</h1>
          
          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const About = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & Head Chef",
      bio: "Former molecular gastronomy chef turned plant-based food innovator",
      image: "photo-1506744038136-46273834b3fb"
    },
    {
      name: "Marcus Rodriguez",
      role: "Fermentation Specialist",
      bio: "PhD in Food Science with 15 years of fermentation research",
      image: "photo-1513836279014-a89f7a76ae86"
    },
    {
      name: "Elena Nakamura",
      role: "Sustainability Director",
      bio: "Environmental scientist ensuring our practices support the planet",
      image: "photo-1465146344425-f00d5f5c8f07"
    }
  ];

  const values = [
    {
      title: "Transparency",
      description: "We believe you should know exactly what goes into your food and how it's made.",
      icon: "🔍"
    },
    {
      title: "Sustainability",
      description: "Every decision we make considers the impact on our planet and future generations.",
      icon: "🌱"
    },
    {
      title: "Quality",
      description: "We never compromise on ingredients, processes, or the final product quality.",
      icon: "⭐"
    },
    {
      title: "Innovation",
      description: "Combining traditional methods with modern science to create extraordinary foods.",
      icon: "🔬"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              #NoFuss Philosophy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              About FutureFoodz
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to revolutionize how we think about food. Founded in 2023, 
              FutureFoodz combines ancient wisdom with modern innovation to create plant-based 
              foods that are better for you and better for the planet.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  It all started in a small kitchen in Portland, where our founder Sarah Chen 
                  was experimenting with traditional fermentation techniques. After years of 
                  working in high-end restaurants, she realized that the future of food wasn't 
                  about complexity—it was about simplicity done right.
                </p>
                <p>
                  The #NoFuss philosophy was born from this realization. Great food doesn't need 
                  artificial additives, complicated processes, or ingredients you can't pronounce. 
                  It needs time, care, and respect for the natural processes that have nourished 
                  humans for thousands of years.
                </p>
                <p>
                  Today, we work with local farmers, use traditional fermentation methods, and 
                  leverage modern food safety standards to create products that honor both our 
                  health and our planet.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={`https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=400&fit=crop`}
                alt="Our kitchen"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="text-4xl">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              The passionate people behind FutureFoodz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${member.image}?w=400&h=400&fit=crop`}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <Badge variant="secondary">{member.role}</Badge>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600">
                Have questions? Want to collaborate? We'd love to hear from you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Our Kitchen</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>123 Green Street</p>
                      <p>Portland, OR 97205</p>
                      <p>United States</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>📧 hello@futurefoodz.com</p>
                      <p>📞 (555) 123-4567</p>
                      <p>🕒 Mon-Fri: 9AM-6PM PST</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>📱 @FutureFoodz</p>
                      <p>💼 LinkedIn: FutureFoodz</p>
                      <p>📺 YouTube: FutureFoodz Kitchen</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

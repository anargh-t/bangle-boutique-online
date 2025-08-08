import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqData: FAQItem[] = [
    {
      question: "How do I find my bangle size?",
      answer: "We provide a comprehensive size guide on our website. You can measure your hand using a string around your knuckles or use a ring that fits your middle finger. Visit our Size Guide page for detailed instructions and our size chart."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer bangles in sizes 2.2, 2.4, 2.6, and 2.8 inches. These correspond to inner diameters of 5.50cm, 5.70cm, 6.00cm, and 6.40cm respectively."
    },
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our collection and contact us via WhatsApp (+91 7012849883) or Instagram DM (@kuppivala_by_gg). Provide your size preferences, shipping address, and we'll confirm your order with payment details."
    },
    {
      question: "Do you ship all over India?",
      answer: "Yes! We offer shipping services across all of India. No matter where you are located, we can deliver our beautiful glass bangles to your doorstep."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery typically takes 14 business days within India. Delivery times may vary based on your location and current order volume."
    },
    {
      question: "Do you accept returns or refunds?",
      answer: "Due to the delicate nature of our glass bangles and to ensure product quality, we do not accept returns or offer refunds. Please carefully review your order before confirming your purchase."
    },
    {
      question: "Why do you require an opening video?",
      answer: "We require an opening video to ensure transparency and protect both you and us. This helps us verify the condition of the product upon delivery and address any concerns immediately."
    },
    {
      question: "What should I include in the opening video?",
      answer: "Your opening video should show the unopened package clearly, open the package in one continuous video, display all items received, and show any packaging or damage issues if present."
    },
    {
      question: "Are your bangles made of real glass?",
      answer: "Yes, all our bangles are made of high-quality glass. Each piece is handcrafted with attention to detail using traditional techniques and premium materials."
    },
    {
      question: "How do I care for my glass bangles?",
      answer: "Store your bangles in a cool, dry place away from direct sunlight. Clean them gently with a soft cloth. Avoid exposure to harsh chemicals, perfumes, or extreme temperatures to maintain their beauty."
    },
    {
      question: "Can I order custom designs?",
      answer: "Currently, we offer our curated collection of designs. For custom requests, please contact us via WhatsApp or Instagram DM to discuss availability and possibilities."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including UPI, bank transfers, and digital wallets. Payment details will be provided when you place your order."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "For bulk orders or special occasions, please contact us directly via WhatsApp or Instagram DM. We're happy to discuss special pricing for larger quantities."
    },
    {
      question: "Are your bangles suitable for all occasions?",
      answer: "Yes! Our bangles are perfect for various occasions including weddings, festivals, parties, and everyday wear. We offer different styles from elegant to vibrant to suit different preferences and events."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via WhatsApp at +91 7012849883 or Instagram DM at @kuppivala_by_gg. We typically respond within a few hours during business hours."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our bangles, ordering process, and policies
          </p>
        </div>

        <Separator className="mb-8" />

        {/* FAQ Categories */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Ordering & Sizing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqData.slice(0, 3).map((item, index) => (
                <div key={index} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left py-4 flex items-center justify-between hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(index) && (
                    <div className="pb-4 px-2 -mx-2">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Shipping & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqData.slice(3, 6).map((item, index) => (
                <div key={index + 3} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleItem(index + 3)}
                    className="w-full text-left py-4 flex items-center justify-between hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {openItems.includes(index + 3) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(index + 3) && (
                    <div className="pb-4 px-2 -mx-2">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Returns & Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqData.slice(6, 8).map((item, index) => (
                <div key={index + 6} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleItem(index + 6)}
                    className="w-full text-left py-4 flex items-center justify-between hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {openItems.includes(index + 6) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(index + 6) && (
                    <div className="pb-4 px-2 -mx-2">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Product & Care
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqData.slice(8, 11).map((item, index) => (
                <div key={index + 8} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleItem(index + 8)}
                    className="w-full text-left py-4 flex items-center justify-between hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {openItems.includes(index + 8) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(index + 8) && (
                    <div className="pb-4 px-2 -mx-2">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Payment & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqData.slice(11).map((item, index) => (
                <div key={index + 11} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleItem(index + 11)}
                    className="w-full text-left py-4 flex items-center justify-between hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {openItems.includes(index + 11) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(index + 11) && (
                    <div className="pb-4 px-2 -mx-2">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-serif text-xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? We're here to help!
            </p>
                         <div className="flex justify-center">
               <a
                 href="https://www.instagram.com/kuppivala_by_gg"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
               >
                 Instagram DM
               </a>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ; 
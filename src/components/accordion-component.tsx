import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Do I get access to this landing page in the starter kit?",
    answer: "Yes, this page isn't even a real landing page more so a template for you to build on."
  },
  {
    question: "Is the starter kit customizable?",
    answer: "The starter kit is designed to be fully customizable to fit your specific needs and branding."
  },
  {
    question: "What technologies are used in the starter kit?",
    answer: "The starter kit uses React, Next.js, Tailwind CSS, and shadcn/ui components to provide a modern, efficient development experience."
  },
  {
    question: "Is there documentation available for the starter kit?",
    answer: "Yes, comprehensive documentation is provided to help you get started quickly and make the most of the starter kit's features."
  }
]

export function AccordionComponent() {
  return (
    <section className="py-12 w-screen ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Frequently Asked Questions (FAQs)
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <span className="font-medium text-left">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
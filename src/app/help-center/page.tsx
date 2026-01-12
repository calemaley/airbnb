
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function HelpCenterPage() {
  const faqs = [
    {
      question: 'How do I book a stay?',
      answer: 'To book a stay, simply navigate to the listing you are interested in, select your desired dates, and click the "Book Now" button. You will then be guided through the payment process.',
    },
    {
      question: 'What is the cancellation policy?',
      answer: 'Cancellation policies are set by individual hosts and can vary. You can find the specific cancellation policy for a listing on its detail page before you book.',
    },
    {
      question: 'How can I become a host?',
      answer: 'We\'d love to have you! Click on the "Become a Host" link in the navigation bar and follow the instructions on the registration page to list your property.',
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes, absolutely. We use industry-leading payment processors like Stripe, PayPal, and Pesapal to ensure your payment information is always secure.',
    },
    {
      question: 'How do I contact a host before booking?',
      answer: 'On each listing page, you will find options to call or message the host directly. We encourage communication to ensure the stay is a perfect fit for you.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Help Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Frequently Asked Questions
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard explorer shipping takes 3-5 business days within the continental US. International expeditions may take 7-14 days depending on the destination.',
      open: false
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day "No Questions Asked" return policy for all gear in original condition. If your equipment doesn\'t meet your mission requirements, we\'ll refund it fully.',
      open: false
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, Earthbound ships to over 50 countries. Shipping costs and delivery times are calculated at checkout based on your base camp location.',
      open: false
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your gear is dispatched, you will receive a tracking link via email. You can also monitor your mission from your personal Dashboard.',
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}

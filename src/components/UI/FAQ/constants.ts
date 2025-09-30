type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ['Frequently asked', 'questions'];
export const mobileHeaderPhrase = ['Frequently', 'asked', 'questions'];
export const animate = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  open: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

export const faqData: FAQItem[] = [
  {
    question: 'How do I create an account with Hajira?',
    answer:
      'Simply sign up with your email or phone number, complete your profile, and you’ll be ready to post or apply for jobs in minutes.',
  },
  {
    question: 'How does Hajira ensure secure payments?',
    answer:
      'Hajira uses trusted payment systems and only releases funds once the job is completed. This ensures both job seekers and posters are protected.',
  },
  {
    question: 'What types of jobs can I find on Hajira?',
    answer:
      'You can find a wide variety of short-term and long-term tasks — from deliveries and tutoring to repairs, freelancing, and more.',
  },
  {
    question: 'Is Hajira safe to use?',
    answer:
      'Yes. All users are verified, and our built-in rating and review system helps ensure a safe and trustworthy experience for everyone.',
  },
];

import { StaticImageData } from 'next/image';
import female1 from '../../../../public/images/female.webp';
import female2 from '../../../../public/images/female2.webp';
import female3 from '../../../../public/images/female3.webp';
import male1 from '../../../../public/images/male1.webp';
import male2 from '../../../../public/images/male2.webp';

export type Props = {
  testimony: string;
  person: string;
  avatar: StaticImageData;
};

export const testimonials = [
  {
    testimony:
      "Hajira has transformed how I handle side jobs. Their secure system makes it easy to find opportunities and get paid on time. I've never felt more confident about my extra income.",
    person: 'Amina Yusuf',
    avatar: female1,
  },
  {
    testimony:
      "I can't express how grateful I am to Hajira. Their platform has been a game-changer for my family’s financial stability. The trusted connections and reliable payments give us peace of mind.",
    person: 'David Kamau',
    avatar: male1,
  },
  {
    testimony:
      "Hajira’s job-matching service has been a lifeline for me. I used to struggle finding gigs, but now I get consistent work that fits my skills. It’s been a game-changer for reaching my goals.",
    person: 'Grace Mwangi',
    avatar: female2,
  },
  {
    testimony:
      "Hajira has made finding safe, quick-paying jobs so easy. The platform connects me with the right people, and I can trust every transaction. It’s really simplified my hustle.",
    person: 'Peter Otieno',
    avatar: male2,
  },
  {
    testimony:
      "I love how Hajira helps me balance my time and skills. The secure payments and simple interface mean I can focus on my work without worrying about being cheated.",
    person: 'Lydia Njeri',
    avatar: female3,
  },
];


export const desktopHeaderPhrase = ['Join thousands of ', 'other members'];

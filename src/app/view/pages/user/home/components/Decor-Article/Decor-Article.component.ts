import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'decor-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Decor-Article.component.html',
  styleUrls: ['./Decor-Article.component.css']
})
export class DecorArticleComponent {
  articles = [
    {
      img: '/assets/images/article1.webp',
      category: 'DECOR',
      date: '22 OCTOBER 2024',
      title: 'The best influencers to follow for sartorial inspiration',
    },
    {
      img: '/assets/images/article2.webp',
      category: 'DESIGN',
      date: '22 OCTOBER 2024',
      title: 'Everything you need to know about decor’s big night out',
    },
    {
      img: '/assets/images/article3.webp',
      category: 'DECOR',
      date: '22 OCTOBER 2024',
      title: 'All the best looks & moments from the met gala 2023',
    },
    {
      img: '/assets/images/article4.webp',
      category: 'DECOR',
      date: '22 OCTOBER 2024',
      title: 'Find a colour palette that reflects your passion',
    },
  ];

  features = [
    {
      icon: 'fa fa-truck',
      title: 'Free shipping',
      subtitle: 'Free return & exchange',
    },
    {
      icon: 'fa fa-globe',
      title: 'Store locator',
      subtitle: 'Find nearest store',
    },
    {
      icon: 'fa fa-lock',
      title: 'Secure payment',
      subtitle: '100% secure method',
    },
    {
      icon: 'fa fa-headphones',
      title: 'Online support',
      subtitle: '24/7 support center',
    },
  ];
}

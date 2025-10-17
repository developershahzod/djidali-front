import { Tour } from '../types';

export const tours: Tour[] = [
  {
    id: '1',
    title: 'Autumn Uzbekistan 5 Days: Wild Boar Hunting',
    image: 'https://static.norma.uz/images/201684_e7177dd2f26905ef70b0fb894681.jpg',
    rating: 4.9,
    reviewCount: 75,
    location: 'Uzbekistan, Tashkent',
    duration: 5,
    dates: 'November 1—5',
    price: 71683,
    badge: 'author',
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Aziz Karimov',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 8,
    maxParticipants: 12
  },
  {
    id: '2',
    title: 'Pheasant Hunting in Fergana Valley',
    image: 'https://static.norma.uz/images/155731_33e3455f07946d78bbeaf52817b1.png',
    rating: 5.0,
    reviewCount: 25,
    location: 'Uzbekistan, Fergana',
    duration: 3,
    dates: 'November 17—19',
    price: 35648,
    originalPrice: 42343,
    discount: '-16%',
    badge: 'recommended',
    category: 'hunting',
    subcategory: 'bird-hunting',
    guide: {
      name: 'Dilshod Rakhimov',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 6,
    maxParticipants: 10
  },
  {
    id: '3',
    title: 'Deer Hunting in Chimgan Mountains',
    image: 'https://www.norma.uz/img/2c/84/3dbbd49e80739a5de99581b5b7a9.jpg',
    rating: 4.8,
    reviewCount: 42,
    location: 'Uzbekistan, Chimgan',
    duration: 7,
    dates: 'December 2—8',
    price: 95376,
    badge: 'author',
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Farkhod Usmanov',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 4,
    maxParticipants: 8
  },
  {
    id: '4',
    title: 'Waterfowl Hunting Adventure',
    image: 'https://profihunt.com/wp-content/uploads/2020/01/uzbekistan_05.jpg',
    rating: 4.7,
    reviewCount: 38,
    location: 'Uzbekistan, Aydarkul',
    duration: 4,
    dates: 'November 5—8',
    price: 52990,
    badge: 'recommended',
    category: 'hunting',
    subcategory: 'waterfowl',
    guide: {
      name: 'Nodir Akhmedov',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 8,
    maxParticipants: 12
  },
  {
    id: '5',
    title: 'Hare Hunting in Karakalpakstan Steppes',
    image: 'https://profihunt.com/wp-content/uploads/2020/01/uzbekistan_03.jpg',
    rating: 4.6,
    reviewCount: 29,
    location: 'Uzbekistan, Nukus',
    duration: 2,
    dates: 'December 1—2',
    price: 28830,
    originalPrice: 35956,
    discount: '-20%',
    badge: 'excursion',
    category: 'hunting',
    subcategory: 'small-game',
    guide: {
      name: 'Bakhtiyor Yusupov',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 10,
    maxParticipants: 15
  },
  {
    id: '6',
    title: 'Sport Shooting: Championship Experience',
    image: 'https://profihunt.com/wp-content/uploads/2020/01/uzbekistan_04.jpg',
    rating: 5.0,
    reviewCount: 15,
    location: 'Uzbekistan, Tashkent',
    duration: 1,
    dates: 'November 19',
    price: 18086,
    badge: 'excursion',
    category: 'hunting',
    subcategory: 'sport-shooting',
    guide: {
      name: 'Olim Tursunov',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 8,
    maxParticipants: 12
  },
  {
    id: '7',
    title: 'Quail Hunting in Surkhandarya',
    image: 'https://stalker-group.ru/wp-content/uploads/2023/05/uzbekistan-hunting.jpg',
    rating: 4.8,
    reviewCount: 32,
    location: 'Uzbekistan, Termez',
    duration: 3,
    dates: 'November 10—12',
    price: 42500,
    category: 'hunting',
    subcategory: 'bird-hunting',
    guide: {
      name: 'Gulom Ismailov',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 6,
    maxParticipants: 10
  },
  {
    id: '8',
    title: 'Roe Deer Hunting in Nuratau Mountains',
    image: 'https://fhs.uz/images/2.jpg',
    rating: 4.9,
    reviewCount: 28,
    location: 'Uzbekistan, Nuratau',
    duration: 6,
    dates: 'November 15—20',
    price: 78200,
    originalPrice: 89000,
    discount: '-12%',
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Rustam Nazarov',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 4,
    maxParticipants: 8
  },
  {
    id: '9',
    title: 'Ibex Hunting Expedition',
    image: 'https://stalker-group.ru/wp-content/uploads/2023/05/hunt-ibex-uzbekistan.jpg',
    rating: 4.7,
    reviewCount: 19,
    location: 'Uzbekistan, Kyzylkum',
    duration: 4,
    dates: 'December 8—11',
    price: 89600,
    badge: 'author',
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Sherzod Mirzaev',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 3,
    maxParticipants: 6
  },
  {
    id: '10',
    title: 'Mountain Transfer Hunting Experience',
    image: 'https://stalker-group.ru/wp-content/uploads/2025/03/transfer-to-mountains-uzbekistan-10.2024.jpg',
    rating: 4.5,
    reviewCount: 22,
    location: 'Uzbekistan, Bukhara',
    duration: 2,
    dates: 'November 23—24',
    price: 31900,
    badge: 'recommended',
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Mukhabbat Karimov',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 8,
    maxParticipants: 12
  },
  {
    id: '11',
    title: 'Premium Hunting Safari',
    image: 'https://profihunt.com/wp-content/uploads/2020/07/uzbekistan_06.jpg',
    rating: 4.6,
    reviewCount: 16,
    location: 'Uzbekistan, Navoi',
    duration: 5,
    dates: 'November 12—16',
    price: 65300,
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Jamshid Abdullaev',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 6,
    maxParticipants: 10
  },
  {
    id: '12',
    title: 'Big Chimgan Mountain Adventure',
    image: 'https://ru.travelornament.com/d/gora_bolshoj_chimgan_v_uzbekistane.jpg',
    rating: 4.9,
    reviewCount: 35,
    location: 'Uzbekistan, Chimgan',
    duration: 4,
    dates: 'November 25—28',
    price: 67800,
    badge: 'author',
    category: 'hunting',
    subcategory: 'big-game',
    guide: {
      name: 'Dilshod Rakhimov',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    participants: 6,
    maxParticipants: 10
  }
];

export const getToursByCategory = (categoryId: string, subcategoryId?: string): Tour[] => {
  return tours.filter(tour => {
    if (categoryId === 'all') return true;
    if (subcategoryId && subcategoryId !== 'all') {
      return tour.category === categoryId && tour.subcategory === subcategoryId;
    }
    return tour.category === categoryId;
  });
};

export const getFilteredTours = (filters: any): Tour[] => {
  return tours.filter(tour => {
    // Category filter
    if (filters.category && filters.category !== 'all' && tour.category !== filters.category) {
      return false;
    }
    
    // Subcategory filter
    if (filters.subcategory && filters.subcategory !== 'all' && tour.subcategory !== filters.subcategory) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange && (tour.price < filters.priceRange[0] || tour.price > filters.priceRange[1])) {
      return false;
    }
    
    // Duration filter
    if (filters.duration && (tour.duration < filters.duration[0] || tour.duration > filters.duration[1])) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && tour.rating < filters.rating) {
      return false;
    }
    
    // Discount filter
    if (filters.discountOnly && !tour.discount) {
      return false;
    }
    
    return true;
  });
};
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'customer' | 'organizer' | 'admin';
  createdAt: string;
}

export interface Organizer {
  id: string;
  userId: string;
  companyName: string;
  logoUrl?: string;
  isVerified: boolean;
  contactPhone: string;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  slug: string;
  description: string;
  category: 'Concerts' | 'Cinema' | 'Theatre' | 'Comedy' | 'Sports' | 'Conferences' | 'Festivals';
  bannerUrl: string;
  startDate: string;
  endDate?: string;
  time: string;
  city: string;
  venue: string;
  startingPrice: number;
  ticketsRemaining: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  bestseller?: boolean;
  createdAt: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: 'Regular' | 'VIP' | 'VVIP' | 'Early Bird';
  price: number;
  quantityAvailable: number;
  maxPerOrder: number;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  totalAmount: number;
  paymentMethod: 'telebirr' | 'cbe_birr' | 'chapa';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  qrCodeUrl: string;
  status: 'valid' | 'used' | 'cancelled';
  createdAt: string;
}
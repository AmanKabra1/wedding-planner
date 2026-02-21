import { Injectable, OnModuleInit, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizer } from './organizer.entity';
import { OrganizerPrice } from './organizer-price.entity';
import * as bcrypt from 'bcryptjs';

const ORGANIZER_SEED = [
  { businessName: 'Royal Rajasthan Events', ownerName: 'Ramesh Sharma', email: 'royal@rajasthanevents.com', phone: '9876543210', whatsapp: '9876543210', city: 'Jaipur', state: 'Rajasthan', description: 'Specializing in authentic Rajasthani weddings with camel processions, folk music, and royal palace venues.', eventTypes: ['wedding', 'engagement', 'griha-pravesh'], servicesOffered: ['Full Event Management', 'Decoration', 'Catering', 'Photography', 'Music & Dance'], experienceYears: 12, eventsCompleted: 350, rating: 4.8, isVerified: true, password: 'Demo@1234' },
  { businessName: 'Punjabi Shaadi Planners', ownerName: 'Gurpreet Singh', email: 'info@punjabishaadi.com', phone: '9765432109', whatsapp: '9765432109', city: 'Amritsar', state: 'Punjab', description: 'Grand Punjabi weddings with Bhangra, Anand Karaj arrangements, and lavish feasts.', eventTypes: ['wedding', 'engagement', 'mundan'], servicesOffered: ['Full Event Management', 'Decoration', 'Catering', 'Bhangra Troupe', 'Dhol Players'], experienceYears: 8, eventsCompleted: 220, rating: 4.7, isVerified: true, password: 'Demo@1234' },
  { businessName: 'Shubh Mangal Mumbai', ownerName: 'Priya Mehta', email: 'priya@shubhmangal.com', phone: '9654321098', whatsapp: '9654321098', city: 'Mumbai', state: 'Maharashtra', description: 'Contemporary Maharashtrian weddings blending tradition with modern luxury.', eventTypes: ['wedding', 'engagement', 'griha-pravesh', 'upanayana'], servicesOffered: ['Full Event Management', 'Decoration', 'Photography', 'Videography', 'Catering'], experienceYears: 10, eventsCompleted: 280, rating: 4.6, isVerified: true, password: 'Demo@1234' },
  { businessName: 'South Indian Celebrations', ownerName: 'Venkatesh Iyer', email: 'venkat@southcelebrations.com', phone: '9543210987', whatsapp: '9543210987', city: 'Chennai', state: 'Tamil Nadu', description: 'Authentic Tamil wedding ceremonies with Nadaswaram and traditional Sadya feast.', eventTypes: ['wedding', 'engagement', 'upanayana', 'festival'], servicesOffered: ['Full Event Management', 'Puja Arrangements', 'Catering (Sadya)', 'Nadaswaram', 'Photography'], experienceYears: 15, eventsCompleted: 400, rating: 4.9, isVerified: true, password: 'Demo@1234' },
  { businessName: 'Navratri & Festival Planners', ownerName: 'Amit Patel', email: 'amit@festivalpro.com', phone: '9432109876', whatsapp: '9432109876', city: 'Ahmedabad', state: 'Gujarat', description: 'Specialists in Navratri Garba events, Diwali celebrations, and all major Hindu festivals.', eventTypes: ['festival', 'griha-pravesh', 'engagement'], servicesOffered: ['Event Management', 'Decoration', 'DJ & Sound', 'Catering', 'Garba Organization'], experienceYears: 6, eventsCompleted: 150, rating: 4.5, isVerified: false, password: 'Demo@1234' },
];

const PRICING_SEED = [
  { organizerId: 1, eventType: 'wedding', packageName: 'Silver Wedding Package', packageDescription: 'Perfect for intimate weddings with essential services.', basePrice: 150000, maxPrice: 300000, priceUnit: 'per event', inclusions: ['Basic decoration', 'Pandit/Priest', 'Photography 4hrs', 'Catering 100 guests', 'Mehendi artist', 'Basic sound system'], exclusions: ['Venue cost', 'Bridal makeup', 'Wedding dress', 'Videography'], guestCountMin: 50, guestCountMax: 150, isNegotiable: true },
  { organizerId: 1, eventType: 'wedding', packageName: 'Gold Wedding Package', packageDescription: 'Complete wedding experience with all major services.', basePrice: 500000, maxPrice: 900000, priceUnit: 'per event', inclusions: ['Premium floral decoration', 'Pandit full rituals', 'Photography + Videography full day', 'Catering 300 guests', 'Mehendi artist', 'DJ + Sound', 'Baraat arrangement'], exclusions: ['Venue cost', 'Bridal trousseau', 'Honeymoon'], guestCountMin: 150, guestCountMax: 350, isNegotiable: true },
  { organizerId: 1, eventType: 'wedding', packageName: 'Royal Wedding Package', packageDescription: 'Lavish royal-style wedding with camel procession.', basePrice: 1500000, maxPrice: 5000000, priceUnit: 'per event', inclusions: ['Palace venue coordination', 'Camel/horse baraat', 'Luxury decoration', 'Celebrity photographer', 'Drone videography', 'Catering 1000 guests', 'Folk performers', 'Fireworks'], exclusions: ['Actual venue booking cost', 'Honeymoon', 'Wedding attire'], guestCountMin: 300, guestCountMax: 2000, isNegotiable: true },
  { organizerId: 3, eventType: 'griha-pravesh', packageName: 'Basic Griha Pravesh', packageDescription: 'Simple sacred house warming with essential puja.', basePrice: 15000, maxPrice: 30000, priceUnit: 'per event', inclusions: ['Pandit for Vastu Puja', 'Havan arrangements', 'Kalash & puja items', 'Basic flower decoration'], exclusions: ['Catering', 'Venue decoration', 'Photography'], guestCountMin: 10, guestCountMax: 50, isNegotiable: true },
  { organizerId: 3, eventType: 'griha-pravesh', packageName: 'Complete Griha Pravesh', packageDescription: 'Full house warming with puja, decoration, catering.', basePrice: 50000, maxPrice: 120000, priceUnit: 'per event', inclusions: ['Senior Pandit', 'Complete puja samagri', 'Floral decoration', 'Catering 100 guests', 'Photography 3hrs', 'Sweets & prasad'], exclusions: ['Venue furniture', 'Videography'], guestCountMin: 30, guestCountMax: 150, isNegotiable: true },
  { organizerId: 2, eventType: 'mundan', packageName: 'Simple Mundan Ceremony', packageDescription: 'Traditional mundan ceremony at home or temple.', basePrice: 8000, maxPrice: 20000, priceUnit: 'per event', inclusions: ['Pandit', 'Puja items', 'Barber', 'Basic decoration'], exclusions: ['Venue if temple', 'Catering', 'Photography'], guestCountMin: 10, guestCountMax: 50, isNegotiable: true },
  { organizerId: 2, eventType: 'mundan', packageName: 'Grand Mundan Celebration', packageDescription: 'Full celebration with ceremony, feast and photos.', basePrice: 35000, maxPrice: 80000, priceUnit: 'per event', inclusions: ['Pandit', 'All puja items', 'Professional barber', 'Decoration', 'Catering 75 guests', 'Photography'], exclusions: ['Outside venue cost'], guestCountMin: 30, guestCountMax: 100, isNegotiable: true },
  { organizerId: 3, eventType: 'upanayana', packageName: 'Traditional Upanayana', packageDescription: 'Complete sacred thread ceremony with Vedic rituals.', basePrice: 25000, maxPrice: 60000, priceUnit: 'per event', inclusions: ['Vedic pandit', 'Sacred thread', 'All puja items', 'Havan', 'Bhiksha setup', 'Danda staff'], exclusions: ['Catering', 'Photography', 'Boy\'s clothes'], guestCountMin: 20, guestCountMax: 80, isNegotiable: true },
  { organizerId: 4, eventType: 'upanayana', packageName: 'Grand Upanayana Package', packageDescription: 'Full celebration with feast and documentation.', basePrice: 75000, maxPrice: 150000, priceUnit: 'per event', inclusions: ['Senior Vedic pandit', 'All ritual items', 'Catering 150 guests', 'Photography + Videography', 'Decoration', 'Boy\'s attire', 'Nadaswaram'], exclusions: ['Venue cost'], guestCountMin: 50, guestCountMax: 200, isNegotiable: true },
  { organizerId: 5, eventType: 'festival', packageName: 'Diwali Celebration Package', packageDescription: 'Complete Diwali celebration for societies or offices.', basePrice: 20000, maxPrice: 80000, priceUnit: 'per event', inclusions: ['Lakshmi Puja', 'Decoration (diyas, rangoli)', 'Sweets & prasad', 'Small fireworks', 'Sound system'], exclusions: ['Venue', 'Large group catering'], guestCountMin: 20, guestCountMax: 200, isNegotiable: true },
  { organizerId: 5, eventType: 'festival', packageName: 'Navratri Garba Event', packageDescription: 'Full Garba event management for 1 or 9 nights.', basePrice: 50000, maxPrice: 300000, priceUnit: 'per event', inclusions: ['Stage setup', 'Sound & lighting', 'Garba instructor', 'DJ', 'Dandiya sticks', 'Puja', 'Security'], exclusions: ['Venue', 'Food stalls', 'Costumes'], guestCountMin: 100, guestCountMax: 2000, isNegotiable: true },
  { organizerId: 5, eventType: 'festival', packageName: 'Ganesh Chaturthi Package', packageDescription: 'Complete Ganesh Chaturthi for 1-day or 10-day.', basePrice: 30000, maxPrice: 200000, priceUnit: 'per event', inclusions: ['Eco-friendly idol', 'Pandal setup', 'Decoration', 'Daily puja', 'Modak & prasad', 'Visarjan'], exclusions: ['Large catering', 'Big sound system'], guestCountMin: 20, guestCountMax: 500, isNegotiable: true },
  { organizerId: 2, eventType: 'engagement', packageName: 'Simple Engagement', packageDescription: 'Intimate ring ceremony with basic arrangements.', basePrice: 20000, maxPrice: 50000, priceUnit: 'per event', inclusions: ['Decoration', 'Photography 2hrs', 'Cake', 'Catering 50 guests'], exclusions: ['Rings', 'Venue', 'DJ'], guestCountMin: 20, guestCountMax: 75, isNegotiable: true },
  { organizerId: 2, eventType: 'engagement', packageName: 'Grand Engagement Party', packageDescription: 'Full engagement with DJ, decoration, catering.', basePrice: 80000, maxPrice: 200000, priceUnit: 'per event', inclusions: ['Premium decoration', 'Photography + Videography', 'DJ + dance floor', 'Catering 200 guests', 'Cake', 'Emcee', 'Photobooth'], exclusions: ['Rings', 'Venue cost'], guestCountMin: 75, guestCountMax: 300, isNegotiable: true },
];

@Injectable()
export class OrganizersService implements OnModuleInit {
  constructor(
    @InjectRepository(Organizer) private organizerRepo: Repository<Organizer>,
    @InjectRepository(OrganizerPrice) private priceRepo: Repository<OrganizerPrice>,
  ) {}

  async onModuleInit() {
    const count = await this.organizerRepo.count();
    if (count === 0) {
      // Hash passwords for seed data
      const seeded = await Promise.all(
        ORGANIZER_SEED.map(async o => ({
          ...o,
          password: await bcrypt.hash(o.password, 10),
        }))
      );
      const organizers = await this.organizerRepo.save(seeded);
      const prices = PRICING_SEED.map(p => ({
        ...p,
        organizerId: organizers[p.organizerId - 1]?.id || p.organizerId,
      }));
      await this.priceRepo.save(prices);
      console.log('✅ Organizers and pricing seeded successfully');
    }
  }

  // ── Public ─────────────────────────────────────────────────

  findAll(state?: string): Promise<Organizer[]> {
    const where: any = {};
    if (state) where.state = state;
    return this.organizerRepo.find({ where, order: { rating: 'DESC' } });
  }

  findOne(id: number): Promise<Organizer> {
    return this.organizerRepo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<Organizer> {
    return this.organizerRepo.findOne({ where: { email } });
  }

  getPrices(eventType?: string, organizerId?: number): Promise<OrganizerPrice[]> {
    const where: any = { isActive: true };
    if (eventType) where.eventType = eventType;
    if (organizerId) where.organizerId = organizerId;
    return this.priceRepo.find({ where, order: { basePrice: 'ASC' } });
  }

  async getOrganizerWithPrices(id: number) {
    const [organizer, prices] = await Promise.all([
      this.findOne(id),
      this.getPrices(undefined, id),
    ]);
    const { password, ...org } = organizer as any;
    return { ...org, prices };
  }

  // ── Organizer Auth ──────────────────────────────────────────

  async register(data: any): Promise<any> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(data.password, 10);
    const org = await this.organizerRepo.save(
      this.organizerRepo.create({ ...data, password: hashed, isVerified: false })
    );
    const { password, ...result } = org as any;
    return result;
  }

  async login(email: string, password: string): Promise<any> {
    const org = await this.findByEmail(email);
    if (!org) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, (org as any).password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const { password: p, ...result } = org as any;
    return result;
  }

  // ── Organizer Price Management ──────────────────────────────

  createPrice(data: Partial<OrganizerPrice>): Promise<OrganizerPrice> {
    return this.priceRepo.save(this.priceRepo.create(data));
  }

  async updatePrice(id: number, data: Partial<OrganizerPrice>): Promise<OrganizerPrice> {
    await this.priceRepo.update(id, data);
    return this.priceRepo.findOne({ where: { id } });
  }

  deletePrice(id: number): Promise<any> {
    return this.priceRepo.delete(id);
  }

  async updateProfile(id: number, data: any): Promise<any> {
    const { password, ...safe } = data;
    await this.organizerRepo.update(id, safe);
    const updated = await this.findOne(id);
    const { password: p, ...result } = updated as any;
    return result;
  }
}
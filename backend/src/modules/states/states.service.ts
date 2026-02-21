import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './state.entity';

const INDIAN_STATES = [
  { name: 'Rajasthan', code: 'RJ', language: 'Rajasthani, Hindi', region: 'North-West', culture: 'Vibrant Rajput culture with royal heritage', description: 'Known for colorful ceremonies, folk music (Maand, Manganiyar), and intricate Bandhani textiles. Rajasthani weddings feature Ghevar sweets and camel processions.' },
  { name: 'Maharashtra', code: 'MH', language: 'Marathi', region: 'West', culture: 'Maratha heritage blended with modern Maharashtrian culture', description: 'Characterised by Saptapadi under the sacred fire, Antarpat ceremony, and traditional Nauvari saree for brides. Puran poli and Modak are traditional sweets.' },
  { name: 'Punjab', code: 'PB', language: 'Punjabi', region: 'North', culture: 'Vibrant Sikh and Hindu Punjabi traditions', description: 'Famous for grand celebrations with Bhangra dance, Anand Karaj ceremony (Sikh weddings), and lavish feasts. Chooda ceremony for brides is iconic.' },
  { name: 'Tamil Nadu', code: 'TN', language: 'Tamil', region: 'South', culture: 'Dravidian culture with Brahminical traditions', description: 'Known for Kashi Yatra, Oonjal ceremony (swing), and Nalangu rituals. Kanjivaram silk sarees and Kolam rangoli are cultural highlights.' },
  { name: 'Gujarat', code: 'GJ', language: 'Gujarati', region: 'West', culture: 'Vaishnav tradition with merchant culture', description: 'Famous for Garba and Dandiya dance, Mameru ceremony where maternal uncle brings gifts. Gujarati weddings have vegetarian feasts with Undhiyu and Dhokla.' },
  { name: 'West Bengal', code: 'WB', language: 'Bengali', region: 'East', culture: 'Rich Bengali literary and artistic traditions', description: 'Known for Sampradaan (bride giving), Sindur Daan, Subho Drishti rituals. Bengali weddings feature Luchi, Kosha Mangsho, and Mishti Doi.' },
  { name: 'Kerala', code: 'KL', language: 'Malayalam', region: 'South', culture: 'Matrilineal Nair and Syrian Christian traditions', description: 'Noted for elegant simplicity. Hindu weddings feature Nischayam, Sadya feasts on banana leaves. Kerala Christian weddings follow traditional church customs.' },
  { name: 'Uttar Pradesh', code: 'UP', language: 'Hindi, Awadhi, Braj', region: 'North', culture: 'Brahminical Hindu traditions mixed with Nawabi culture', description: 'Famous for elaborate Shahnai music, Haldi ceremony with turmeric paste. UP weddings are grand with Lucknowi embroidery and Awadhi cuisine.' },
  { name: 'Karnataka', code: 'KA', language: 'Kannada', region: 'South', culture: 'Veerashaiva, Brahmin, and Lingayat traditions', description: 'Known for Dhare Erevarige (pouring water) ritual and Madhuparka ceremony. Kambala and traditional Mysore Pak sweets are cultural hallmarks.' },
  { name: 'Andhra Pradesh', code: 'AP', language: 'Telugu', region: 'South', culture: 'Kamma and Kapu community traditions with Brahmin influence', description: 'Famous for Pellikoduku, Pellikuturu ceremonies. Telugu weddings feature Mangalasnanam and Talambralu (pouring rice) rituals.' },
  { name: 'Himachal Pradesh', code: 'HP', language: 'Hindi, Pahadi', region: 'North', culture: 'Hill culture with Tibetan Buddhist influence in higher regions', description: 'Known for Nati folk dance at weddings and simple mountain ceremonies. Dham feast with rice and lentils is traditional.' },
  { name: 'Goa', code: 'GA', language: 'Konkani, Portuguese', region: 'West', culture: 'Catholic Portuguese heritage blended with Hindu Goan traditions', description: 'Goan Hindu weddings follow Saraswat Brahmin customs. Catholic weddings blend Portuguese and Indian elements with feni (cashew liquor) celebrations.' },
  { name: 'Odisha', code: 'OD', language: 'Odia', region: 'East', culture: 'Jagannath tradition with tribal cultural influences', description: 'Known for Badhia ceremony, elaborate Sindoor Daan, and classical Odissi dance performances at receptions.' },
  { name: 'Assam', code: 'AS', language: 'Assamese', region: 'North-East', culture: 'Vaishnavite Sattriya culture with tribal traditions', description: 'Famous for Bihu dance at weddings, traditional mekhela chador silk sarees for brides, and tamul (betel nut) offerings in ceremonies.' },
  { name: 'Madhya Pradesh', code: 'MP', language: 'Hindi', region: 'Central', culture: 'Tribal and Hindu traditions from Malwa and Bundelkhand regions', description: 'Known for Tikka ceremony (engagement), traditional Phulkari embroidery. MP weddings feature Bhandara (community feast) traditions.' },
];

@Injectable()
export class StatesService implements OnModuleInit {
  constructor(@InjectRepository(State) private stateRepo: Repository<State>) {}

  async onModuleInit() {
    const count = await this.stateRepo.count();
    if (count === 0) {
      await this.stateRepo.save(INDIAN_STATES);
      console.log('✅ Indian states seeded successfully');
    }
  }

  findAll(): Promise<State[]> {
    return this.stateRepo.find({ order: { name: 'ASC' } });
  }

  findOne(id: number): Promise<State> {
    return this.stateRepo.findOne({ where: { id }, relations: ['rituals'] });
  }

  findByCode(code: string): Promise<State> {
    return this.stateRepo.findOne({ where: { code }, relations: ['rituals'] });
  }
}

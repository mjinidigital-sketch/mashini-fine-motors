export interface Car {
  id: number
  year: string
  make: string
  model: string
  price: string
  miles: string
  location: string
  image: string
  tag: string
  category?: string
}

export const cars: Car[] = [
  { id: 1, year: '2022', make: 'Porsche', model: '911 Carrera S', price: '$128,900', miles: '8,420 mi', location: 'Austin, TX', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85', tag: 'Featured', category: 'Sports' },
  { id: 2, year: '2021', make: 'Mercedes-Benz', model: 'G 550', price: '$119,500', miles: '22,150 mi', location: 'Los Angeles, CA', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=85', tag: 'Great value', category: 'SUV' },
  { id: 3, year: '2023', make: 'BMW', model: 'M4 Competition', price: '$86,750', miles: '5,830 mi', location: 'Miami, FL', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85', tag: 'New listing', category: 'Sports' },
  { id: 4, year: '2022', make: 'Audi', model: 'RS e-tron GT', price: '$142,700', miles: '3,200 mi', location: 'Seattle, WA', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85', tag: 'Electric', category: 'Electric' },
  { id: 5, year: '2020', make: 'Land Rover', model: 'Range Rover Sport', price: '$95,400', miles: '28,500 mi', location: 'Denver, CO', image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1000&q=85', tag: 'Featured', category: 'SUV' },
  { id: 6, year: '2023', make: 'Tesla', model: 'Model S Plaid', price: '$109,990', miles: '1,200 mi', location: 'San Francisco, CA', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=85', tag: 'Electric', category: 'Electric' },
  { id: 7, year: '2021', make: 'Lamborghini', model: 'Huracán EVO', price: '$261,274', miles: '4,100 mi', location: 'Miami, FL', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1000&q=85', tag: 'Exotic', category: 'Sports' },
  { id: 8, year: '2022', make: 'Mercedes-Benz', model: 'AMG GT 63', price: '$179,900', miles: '7,800 mi', location: 'Chicago, IL', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85', tag: 'Performance', category: 'Sports' },
  { id: 9, year: '2020', make: 'BMW', model: 'X5 M', price: '$89,500', miles: '35,200 mi', location: 'Boston, MA', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85', tag: 'Great value', category: 'SUV' },
  { id: 10, year: '2023', make: 'Porsche', model: 'Taycan Turbo S', price: '$185,000', miles: '2,400 mi', location: 'Phoenix, AZ', image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1000&q=85', tag: 'Electric', category: 'Electric' },
  { id: 11, year: '2021', make: 'Ferrari', model: 'F8 Tributo', price: '$286,550', miles: '3,600 mi', location: 'Las Vegas, NV', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=85', tag: 'Exotic', category: 'Sports' },
  { id: 12, year: '2022', make: 'Audi', model: 'R8 V10', price: '$158,600', miles: '6,200 mi', location: 'Dallas, TX', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=85', tag: 'Performance', category: 'Sports' },
  { id: 13, year: '2020', make: 'McLaren', model: '570S', price: '$169,900', miles: '9,400 mi', location: 'Atlanta, GA', image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=85', tag: 'Exotic', category: 'Sports' },
  { id: 14, year: '2023', make: 'Range Rover', model: 'Autobiography', price: '$195,500', miles: '4,800 mi', location: 'New York, NY', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1000&q=85', tag: 'Luxury', category: 'SUV' },
  { id: 15, year: '2021', make: 'Bentley', model: 'Continental GT', price: '$214,900', miles: '5,600 mi', location: 'Los Angeles, CA', image: 'https://images.unsplash.com/photo-1606152421811-aa6781b7f72e?auto=format&fit=crop&w=1000&q=85', tag: 'Luxury', category: 'Luxury' },
  { id: 16, year: '2022', make: 'Mercedes-Benz', model: 'S 580', price: '$118,900', miles: '12,300 mi', location: 'Houston, TX', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85', tag: 'Sedan', category: 'Sedan' },
  { id: 17, year: '2023', make: 'BMW', model: '7 Series', price: '$98,500', miles: '3,100 mi', location: 'Philadelphia, PA', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85', tag: 'Sedan', category: 'Sedan' },
  { id: 18, year: '2020', make: 'Porsche', model: 'Cayenne Turbo', price: '$115,400', miles: '26,800 mi', location: 'San Diego, CA', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85', tag: 'SUV', category: 'SUV' },
  { id: 19, year: '2022', make: 'Audi', model: 'A8 L', price: '$86,900', miles: '15,200 mi', location: 'Washington, DC', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85', tag: 'Sedan', category: 'Sedan' },
  { id: 20, year: '2023', make: 'Mercedes-Benz', model: 'EQS 580', price: '$132,900', miles: '2,800 mi', location: 'Portland, OR', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85', tag: 'Electric', category: 'Electric' },
]

export const categories = ['Sports', 'SUV', 'Electric', 'Luxury', 'Sedan']

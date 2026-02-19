const sampleListing=[
    {
      title: "Stone Villa",
      description: "Green villa next to Mumbai Airport",
      img: "https://images.unsplash.com/photo-1713892086528-1149a142e386?w=1000&auto=format&fit=crop&q=60",
      price: 3600,
      location: "Bandra, Mumbai",
      country: "India"
    },
    {
      title: "Ocean Pearl Resort",
      description: "Luxury beachfront resort with sea view",
      img: "https://images.unsplash.com/photo-1501117716987-c8e2a317e7c6?w=1000&auto=format&fit=crop&q=60",
      price: 7200,
      location: "Calangute, Goa",
      country: "India"
    },
    {
      title: "Royal Heritage Stay",
      description: "Palace-style luxury hotel near forts",
      img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1000&auto=format&fit=crop&q=60",
      price: 8500,
      location: "Jaipur, Rajasthan",
      country: "India"
    },
    {
      title: "Hillside Retreat",
      description: "Peaceful mountain stay with valley view",
      img: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2c33?w=1000&auto=format&fit=crop&q=60",
      price: 4200,
      location: "Manali, Himachal Pradesh",
      country: "India"
    },
    {
      title: "Urban Comfort Inn",
      description: "Modern hotel for business travelers",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=60",
      price: 5100,
      location: "Bengaluru, Karnataka",
      country: "India"
    },
    {
      title: "Lake View Residency",
      description: "Lakeside hotel with beautiful sunsets",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=60",
      price: 4600,
      location: "Udaipur, Rajasthan",
      country: "India"
    },
    {
      title: "Green Nest Eco Stay",
      description: "Eco-friendly resort surrounded by forests",
      img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1000&auto=format&fit=crop&q=60",
      price: 3300,
      location: "Wayanad, Kerala",
      country: "India"
    },
    {
      title: "City Lights Hotel",
      description: "Premium hotel with skyline views",
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=60",
      price: 6800,
      location: "Lower Parel, Mumbai",
      country: "India"
    },
    {
      title: "Snow Peak Lodge",
      description: "Cozy lodge near snow mountains",
      img: "https://images.unsplash.com/photo-1472220625704-91e1462799b2?w=1000&auto=format&fit=crop&q=60",
      price: 4900,
      location: "Gulmarg, Kashmir",
      country: "India"
    },
    {
      title: "Desert Rose Resort",
      description: "Luxury desert stay with cultural nights",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=60",
      price: 7800,
      location: "Jaisalmer, Rajasthan",
      country: "India"
    },
  
    {
      title: "Riverfront Haven",
      description: "Calm riverside resort with nature vibes",
      img: "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1000&auto=format&fit=crop&q=60",
      price: 3900,
      location: "Rishikesh, Uttarakhand",
      country: "India"
    },
    {
      title: "Sunrise Suites",
      description: "Comfortable stay with morning city views",
      img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1000&auto=format&fit=crop&q=60",
      price: 4400,
      location: "Indore, Madhya Pradesh",
      country: "India"
    },
    {
      title: "Palm Breeze Resort",
      description: "Tropical resort surrounded by palm trees",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&auto=format&fit=crop&q=60",
      price: 6100,
      location: "Kovalam, Kerala",
      country: "India"
    },
    {
      title: "Metro Stay Hub",
      description: "Budget-friendly hotel near metro station",
      img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1000&auto=format&fit=crop&q=60",
      price: 2800,
      location: "Dwarka, New Delhi",
      country: "India"
    },
    {
      title: "Hill Crest Villa",
      description: "Private villa with hilltop views",
      img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&auto=format&fit=crop&q=60",
      price: 5600,
      location: "Lonavala, Maharashtra",
      country: "India"
    },
    {
      title: "Forest Whisper Resort",
      description: "Stay amidst dense forest and wildlife",
      img: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1000&auto=format&fit=crop&q=60",
      price: 4700,
      location: "Jim Corbett, Uttarakhand",
      country: "India"
    },
    {
      title: "Golden Leaf Residency",
      description: "Elegant hotel for family stays",
      img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=60",
      price: 5200,
      location: "Ahmedabad, Gujarat",
      country: "India"
    },
    {
      title: "Blue Horizon Hotel",
      description: "Sea-facing rooms with modern interiors",
      img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=60",
      price: 6900,
      location: "Visakhapatnam, Andhra Pradesh",
      country: "India"
    },
    {
      title: "Vintage Palace Stay",
      description: "Heritage hotel with royal architecture",
      img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=60",
      price: 8800,
      location: "Mysuru, Karnataka",
      country: "India"
    },
  
    {
      title: "Hill Breeze Inn",
      description: "Budget hill stay with fresh air",
      img: "https://images.unsplash.com/photo-1519821172141-b5d8d1c2d8f5?w=1000&auto=format&fit=crop&q=60",
      price: 3000,
      location: "Ooty, Tamil Nadu",
      country: "India"
    },
    {
      title: "Silver Sands Resort",
      description: "Luxury beach resort with private access",
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1000&auto=format&fit=crop&q=60",
      price: 9100,
      location: "Havelock Island, Andaman",
      country: "India"
    },
    {
      title: "City Nest Lodge",
      description: "Affordable stay for solo travelers",
      img: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=1000&auto=format&fit=crop&q=60",
      price: 2600,
      location: "Pune, Maharashtra",
      country: "India"
    },
    {
      title: "Amber Fort View Hotel",
      description: "Scenic stay overlooking historic fort",
      img: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1000&auto=format&fit=crop&q=60",
      price: 7400,
      location: "Jaipur, Rajasthan",
      country: "India"
    },
    {
      title: "Tranquil Bay Resort",
      description: "Calm bay-side resort for couples",
      img: "https://images.unsplash.com/photo-1502920514313-52581002a659?w=1000&auto=format&fit=crop&q=60",
      price: 6300,
      location: "Alleppey, Kerala",
      country: "India"
    },
    {
      title: "Royal Orchid Suites",
      description: "Premium suites with luxury amenities",
      img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&auto=format&fit=crop&q=60",
      price: 8200,
      location: "Hyderabad, Telangana",
      country: "India"
    },
    {
      title: "Mountain Mist Hotel",
      description: "Hotel surrounded by misty hills",
      img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&auto=format&fit=crop&q=60",
      price: 5400,
      location: "Shillong, Meghalaya",
      country: "India"
    },
    {
      title: "Sunset Boulevard Stay",
      description: "Stylish hotel with sunset rooftop view",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=60",
      price: 6600,
      location: "Chandigarh",
      country: "India"
    },
    {
      title: "Lotus Grand Residency",
      description: "Spacious rooms with premium comfort",
      img: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1000&auto=format&fit=crop&q=60",
      price: 5800,
      location: "Bhopal, Madhya Pradesh",
      country: "India"
    }
  ]
  module.exports={data:sampleListing};
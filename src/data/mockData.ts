import {
  TransitStop,
  TransitRoute,
  TransitVehicle,
  RouteScheduleItem,
  PassengerFeedback,
  ServiceDelay,
  User,
  SystemAuditLog
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Sri. K. V. Ramanathan, IPS',
    email: 'admin@tgsrtc.gov.in',
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'IPS-TG-01',
    operatorCompany: 'TGSRTC - Telangana State Road Transport Corporation',
    depot: 'TGSRTC Head Office, Bus Bhavan, Hyderabad'
  },
  {
    id: 'usr-op-1',
    name: 'S. Rajalingam (Regional Manager)',
    email: 'operator@tgsrtc.gov.in',
    username: 'operator',
    password: 'operator123',
    role: 'Transport Operator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'RM-WGL-401',
    operatorCompany: 'TGSRTC Warangal Region',
    depot: 'Warangal Regional Control Room'
  },
  {
    id: 'usr-driver-1',
    name: 'Ramesh Goud (Staff Driver)',
    email: 'driver@tgsrtc.gov.in',
    username: 'driver',
    password: 'driver123',
    role: 'Driver',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'TG-DRV-1089',
    operatorCompany: 'TGSRTC Warangal Depot-1',
    depot: 'Warangal Depot-1'
  },
  {
    id: 'usr-pass-1',
    name: 'Ananya Reddy (Daily Commuter)',
    email: 'passenger@tgsrtc.gov.in',
    username: 'passenger',
    password: 'passenger123',
    role: 'Passenger',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'KU-PASS-9042',
    depot: 'Hanamkonda'
  }
];

export const INITIAL_STOPS: TransitStop[] = [
  {
    id: 'stop-kzp',
    code: 'KZP-RLY',
    name: 'Kazipet Railway Junction Bus Stop',
    teluguName: 'కాజీపేట రైల్వే జంక్షన్',
    location: { lat: 17.9784, lng: 79.5085 },
    zone: 'Kazipet Zone',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk', 'Drinking Water'],
    routesServed: ['route-101', 'route-408']
  },
  {
    id: 'stop-ftn',
    code: 'FTN-XRD',
    name: 'Fathima Nagar Crossroads',
    teluguName: 'ఫాతిమా నగర్ చౌరస్తా',
    location: { lat: 17.9865, lng: 79.5310 },
    zone: 'Kazipet Zone',
    amenities: ['Shelter', 'Digital Display'],
    routesServed: ['route-101', 'route-408']
  },
  {
    id: 'stop-sbd',
    code: 'SBD-COL',
    name: 'Subedari / District Collectorate',
    teluguName: 'సుబేదారి / కలెక్టరేట్',
    location: { lat: 18.0015, lng: 79.5620 },
    zone: 'Hanamkonda Central',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Drinking Water'],
    routesServed: ['route-101', 'route-204']
  },
  {
    id: 'stop-hnk',
    code: 'HNK-CBS',
    name: 'Hanamkonda Central Bus Station',
    teluguName: 'హనుమకొండ బస్ స్టేషన్ (డిపో)',
    location: { lat: 18.0072, lng: 79.5702 },
    zone: 'Hanamkonda Central',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk', 'Restroom', 'Drinking Water'],
    routesServed: ['route-101', 'route-204', 'route-305']
  },
  {
    id: 'stop-ku',
    code: 'KU-GATE',
    name: 'Kakatiya University Main Gate',
    teluguName: 'కాకతీయ విశ్వవిద్యాలయం మెయిన్ గేట్',
    location: { lat: 18.0336, lng: 79.5512 },
    zone: 'KU Campus Zone',
    amenities: ['Shelter', 'Digital Display', 'Bicycle Rack'],
    routesServed: ['route-204', 'route-305']
  },
  {
    id: 'stop-mgm',
    code: 'MGM-HSP',
    name: 'MGM Government General Hospital',
    teluguName: 'ఎం.జి.ఎం ప్రభుత్వ ఆసుపత్రి',
    location: { lat: 17.9942, lng: 79.5898 },
    zone: 'Warangal North',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access'],
    routesServed: ['route-101', 'route-204']
  },
  {
    id: 'stop-wgl',
    code: 'WGL-CBS',
    name: 'Warangal City Bus Station (CBS / Station)',
    teluguName: 'వరంగల్ సిటీ బస్ స్టేషన్ (రైల్వే స్టేషన్)',
    location: { lat: 17.9689, lng: 79.6012 },
    zone: 'Warangal Central Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk', 'Restroom', 'Drinking Water'],
    routesServed: ['route-101', 'route-204', 'route-408', 'route-502']
  },
  {
    id: 'stop-wft',
    code: 'WGL-FRT',
    name: 'Warangal Fort (Khila Warangal Kakatiya Arch)',
    teluguName: 'వరంగల్ కోట (ఖిలా వరంగల్)',
    location: { lat: 17.9547, lng: 79.6178 },
    zone: 'Heritage Tourism Zone',
    amenities: ['Shelter', 'Drinking Water'],
    routesServed: ['route-204']
  },
  {
    id: 'stop-hsp',
    code: 'HSP-JNC',
    name: 'Hasanparthy Junction',
    teluguName: 'హసన్‌పర్తి జంక్షన్',
    location: { lat: 18.0790, lng: 79.5350 },
    zone: 'Greater Warangal North',
    amenities: ['Shelter'],
    routesServed: ['route-305']
  },
  {
    id: 'stop-mdk',
    code: 'MDK-IND',
    name: 'Madikonda Industrial Corridor',
    teluguName: 'మడికొండ ఇండస్ట్రియల్ కారిడార్',
    location: { lat: 17.9510, lng: 79.4620 },
    zone: 'Warangal West Suburb',
    amenities: ['Shelter', 'Digital Display'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-jgn',
    code: 'JGN-RTC',
    name: 'Jangaon RTC Bus Station',
    teluguName: 'జనగామ ఆర్టీసీ బస్ స్టేషన్',
    location: { lat: 17.7245, lng: 79.1780 },
    zone: 'Jangaon District Central',
    amenities: ['Shelter', 'Digital Display', 'Ticket Kiosk', 'Restroom', 'Drinking Water'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-alr',
    code: 'ALR-XRD',
    name: 'Aler Highway Junction',
    teluguName: 'ఆలేరు చౌరస్తా (హైవే)',
    location: { lat: 17.6530, lng: 79.0270 },
    zone: 'Yadadri Corridor',
    amenities: ['Shelter'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-bng',
    code: 'BNG-BYP',
    name: 'Bhuvanagiri Bypass (Bhongir Fort X Road)',
    teluguName: 'భువనగిరి బైపాస్',
    location: { lat: 17.5110, lng: 78.8890 },
    zone: 'Yadadri Bhuvanagiri Zone',
    amenities: ['Shelter', 'Digital Display'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-upl',
    code: 'UPL-HYD',
    name: 'Uppal Cross Roads Bus Station, Hyderabad',
    teluguName: 'ఉప్పల్ చౌరస్తా, హైదరాబాద్',
    location: { lat: 17.3984, lng: 78.5583 },
    zone: 'Hyderabad East Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-mgb',
    code: 'MGB-HYD',
    name: 'MGBS Central Bus Station, Hyderabad (Imlibun)',
    teluguName: 'ఎం.జి.బి.ఎస్ బస్ స్టేషన్, హైదరాబాద్',
    location: { lat: 17.3786, lng: 78.4808 },
    zone: 'Hyderabad Central Terminal',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk', 'Restroom', 'Drinking Water'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-krm',
    code: 'KRM-CBS',
    name: 'Karimnagar Central Bus Station (RTC Depot)',
    teluguName: 'కరీంనగర్ బస్ స్టేషన్',
    location: { lat: 18.4386, lng: 79.1288 },
    zone: 'Karimnagar Central',
    amenities: ['Shelter', 'Digital Display', 'Ticket Kiosk', 'Restroom', 'Drinking Water'],
    routesServed: ['route-305']
  },
  {
    id: 'stop-khm',
    code: 'KHM-CBS',
    name: 'Khammam Old Bus Depot (Wyra Road)',
    teluguName: 'ఖమ్మం బస్ డిపో (వైరా రోడ్)',
    location: { lat: 17.2473, lng: 80.1514 },
    zone: 'Khammam Central',
    amenities: ['Shelter', 'Digital Display', 'Ticket Kiosk', 'Restroom', 'Drinking Water'],
    routesServed: ['route-502']
  }
];

export const INITIAL_ROUTES: TransitRoute[] = [
  {
    id: 'route-101',
    code: '101',
    name: 'Kazipet - Hanamkonda - Warangal Tri-City Metro Express',
    teluguName: 'కాజీపేట - హనుమకొండ - వరంగల్ సిటీ మెట్రో ఎక్స్‌ప్రెస్',
    mode: 'Metro Express',
    color: '#0d6e52', // TGSRTC Forest Green
    description: 'High-frequency urban arterial connecting Kazipet Railway Junction, Subedari Collectorate, HNK Depot, MGM Hospital and Warangal CBS.',
    operatingHours: '05:00 AM - 11:30 PM IST',
    frequencyMinutes: 8,
    isPublished: true,
    fare: 30.0,
    totalDistanceKm: 15.8,
    averageDurationMinutes: 40,
    depotOrigin: 'Kazipet Junction',
    depotDestination: 'Warangal CBS',
    stops: [
      INITIAL_STOPS[0], // Kazipet
      INITIAL_STOPS[1], // Fathima Nagar
      INITIAL_STOPS[2], // Subedari
      INITIAL_STOPS[3], // Hanamkonda
      INITIAL_STOPS[5], // MGM
      INITIAL_STOPS[6]  // Warangal CBS
    ],
    waypoints: [
      { lat: 17.9784, lng: 79.5085 }, // Kazipet
      { lat: 17.9820, lng: 79.5190 },
      { lat: 17.9865, lng: 79.5310 }, // Fathima Nagar
      { lat: 17.9940, lng: 79.5470 },
      { lat: 18.0015, lng: 79.5620 }, // Subedari
      { lat: 18.0072, lng: 79.5702 }, // Hanamkonda
      { lat: 18.0010, lng: 79.5790 },
      { lat: 17.9942, lng: 79.5898 }, // MGM
      { lat: 17.9815, lng: 79.5960 },
      { lat: 17.9689, lng: 79.6012 }  // Warangal CBS
    ]
  },
  {
    id: 'route-204',
    code: '204',
    name: 'Kakatiya Heritage Circular (KU Campus ⇄ Warangal Fort)',
    teluguName: 'కాకతీయ విశ్వవిద్యాలయం - వరంగల్ కోట సిటీ ఆర్డినరీ',
    mode: 'City Ordinary',
    color: '#991b1b', // TGSRTC Classic Bus Red
    description: 'Connects Kakatiya University campus, Hanamkonda, Subedari, MGM Hospital, Warangal CBS, terminating at the historic Khila Warangal Fort.',
    operatingHours: '05:30 AM - 10:45 PM IST',
    frequencyMinutes: 12,
    isPublished: true,
    fare: 25.0,
    totalDistanceKm: 18.4,
    averageDurationMinutes: 48,
    depotOrigin: 'KU Campus',
    depotDestination: 'Warangal Fort',
    stops: [
      INITIAL_STOPS[4], // KU
      INITIAL_STOPS[3], // Hanamkonda
      INITIAL_STOPS[2], // Subedari
      INITIAL_STOPS[5], // MGM
      INITIAL_STOPS[6], // Warangal CBS
      INITIAL_STOPS[7]  // Warangal Fort
    ],
    waypoints: [
      { lat: 18.0336, lng: 79.5512 }, // KU
      { lat: 18.0200, lng: 79.5600 },
      { lat: 18.0072, lng: 79.5702 }, // Hanamkonda
      { lat: 18.0015, lng: 79.5620 }, // Subedari
      { lat: 17.9942, lng: 79.5898 }, // MGM
      { lat: 17.9790, lng: 79.5950 },
      { lat: 17.9689, lng: 79.6012 }, // Warangal CBS
      { lat: 17.9610, lng: 79.6090 },
      { lat: 17.9547, lng: 79.6178 }  // Warangal Fort
    ]
  },
  {
    id: 'route-305',
    code: '305',
    name: 'Warangal - Karimnagar Deluxe Express (via Husnabad)',
    teluguName: 'వరంగల్ - కరీంనగర్ డీలక్స్ ఎక్స్‌ప్రెస్',
    mode: 'Deluxe',
    color: '#b45309', // TGSRTC Amber Deluxe
    description: 'Inter-district highway corridor connecting Hanamkonda Central Depot, Hasanparthy, Husnabad highway, terminating at Karimnagar Central Bus Station.',
    operatingHours: '05:00 AM - 11:00 PM IST',
    frequencyMinutes: 20,
    isPublished: true,
    fare: 120.0,
    totalDistanceKm: 74.0,
    averageDurationMinutes: 95,
    depotOrigin: 'Hanamkonda Depot',
    depotDestination: 'Karimnagar CBS',
    stops: [
      INITIAL_STOPS[3], // Hanamkonda
      INITIAL_STOPS[4], // KU
      INITIAL_STOPS[8], // Hasanparthy
      INITIAL_STOPS[15] // Karimnagar
    ],
    waypoints: [
      { lat: 18.0072, lng: 79.5702 }, // HNK
      { lat: 18.0336, lng: 79.5512 }, // KU
      { lat: 18.0790, lng: 79.5350 }, // Hasanparthy
      { lat: 18.1500, lng: 79.4800 },
      { lat: 18.2300, lng: 79.3900 }, // Husnabad approach
      { lat: 18.3300, lng: 79.2500 },
      { lat: 18.4386, lng: 79.1288 }  // Karimnagar CBS
    ]
  },
  {
    id: 'route-408',
    code: '408',
    name: 'Warangal - Hyderabad Garuda Super Luxury (via Jangaon & Uppal)',
    teluguName: 'వరంగల్ - హైదరాబాద్ గరుడ సూపర్ లగ్జరీ (జనగామ, ఉప్పల్ మీదుగా)',
    mode: 'Super Luxury',
    color: '#1d4ed8', // Garuda Royal Blue
    description: 'Premier NH-163 express corridor connecting Warangal CBS, Kazipet, Madikonda, Jangaon RTC Stand, Aler, Bhongir bypass, Uppal and Hyderabad MGBS.',
    operatingHours: '04:30 AM - 11:55 PM IST',
    frequencyMinutes: 15,
    isPublished: true,
    fare: 240.0,
    totalDistanceKm: 142.5,
    averageDurationMinutes: 165,
    depotOrigin: 'Warangal CBS',
    depotDestination: 'Hyderabad MGBS',
    stops: [
      INITIAL_STOPS[6],  // Warangal CBS
      INITIAL_STOPS[0],  // Kazipet
      INITIAL_STOPS[9],  // Madikonda
      INITIAL_STOPS[10], // Jangaon
      INITIAL_STOPS[11], // Aler
      INITIAL_STOPS[12], // Bhongir
      INITIAL_STOPS[13], // Uppal
      INITIAL_STOPS[14]  // MGBS Hyderabad
    ],
    waypoints: [
      { lat: 17.9689, lng: 79.6012 }, // Warangal CBS
      { lat: 17.9784, lng: 79.5085 }, // Kazipet
      { lat: 17.9510, lng: 79.4620 }, // Madikonda
      { lat: 17.8500, lng: 79.3200 },
      { lat: 17.7245, lng: 79.1780 }, // Jangaon
      { lat: 17.6530, lng: 79.0270 }, // Aler
      { lat: 17.5110, lng: 78.8890 }, // Bhongir
      { lat: 17.4300, lng: 78.6800 },
      { lat: 17.3984, lng: 78.5583 }, // Uppal
      { lat: 17.3786, lng: 78.4808 }  // MGBS
    ]
  },
  {
    id: 'route-502',
    code: '502',
    name: 'Warangal - Khammam Green EV Express',
    teluguName: 'వరంగల్ - ఖమ్మం ఎలక్ట్రిక్ ఈవీ ఎక్స్‌ప్రెస్',
    mode: 'Electric EV',
    color: '#0284c7', // Clean Cyan/Teal
    description: 'Zero-emission electric corridor connecting Warangal CBS to Khammam Central Bus Depot via Wardhannapet and Kesamudram X Roads.',
    operatingHours: '05:30 AM - 10:30 PM IST',
    frequencyMinutes: 30,
    isPublished: true,
    fare: 185.0,
    totalDistanceKm: 112.0,
    averageDurationMinutes: 135,
    depotOrigin: 'Warangal CBS',
    depotDestination: 'Khammam Depot',
    stops: [
      INITIAL_STOPS[6],  // Warangal CBS
      INITIAL_STOPS[7],  // Warangal Fort X Rd
      INITIAL_STOPS[16]  // Khammam
    ],
    waypoints: [
      { lat: 17.9689, lng: 79.6012 }, // Warangal CBS
      { lat: 17.9547, lng: 79.6178 }, // Fort
      { lat: 17.8200, lng: 79.7500 }, // Wardhannapet
      { lat: 17.6100, lng: 79.9100 },
      { lat: 17.4500, lng: 80.0300 },
      { lat: 17.2473, lng: 80.1514 }  // Khammam
    ]
  }
];

export const INITIAL_VEHICLES: TransitVehicle[] = [
  {
    id: 'veh-101A',
    regNumber: 'TG-03-Z-1089',
    model: 'Ashok Leyland BS-VI Metro Express',
    mode: 'Metro Express',
    depot: 'Warangal Depot-1',
    assignedRouteId: 'route-101',
    assignedDriverId: 'usr-driver-1',
    assignedDriverName: 'Ramesh Goud',
    status: 'In Service',
    currentLocation: { lat: 17.9942, lng: 79.5898 }, // near MGM Hospital
    heading: 215,
    speedKmH: 36,
    batteryOrFuelPercent: 88,
    occupancy: 'Moderate',
    occupancyPercent: 62,
    totalDistanceTodayKm: 148.5,
    lastUpdated: 'Just now (IST)',
    currentStopIndex: 4,
    isSimulating: true,
    delayMinutes: 0,
    airConditioned: false,
    wifiEnabled: true
  },
  {
    id: 'veh-101B',
    regNumber: 'TG-03-Z-2415',
    model: 'Tata Marcopolo City Transit Bus',
    mode: 'Metro Express',
    depot: 'Hanamkonda Depot',
    assignedRouteId: 'route-101',
    assignedDriverId: 'drv-202',
    assignedDriverName: 'K. Venkateswarlu',
    status: 'In Service',
    currentLocation: { lat: 17.9865, lng: 79.5310 }, // near Fathima Nagar
    heading: 65,
    speedKmH: 28,
    batteryOrFuelPercent: 72,
    occupancy: 'Crowded',
    occupancyPercent: 85,
    totalDistanceTodayKm: 182.0,
    lastUpdated: '1 min ago',
    currentStopIndex: 1,
    isSimulating: true,
    delayMinutes: 6,
    airConditioned: false,
    wifiEnabled: false
  },
  {
    id: 'veh-204A',
    regNumber: 'TG-03-Z-3320',
    model: 'Ashok Leyland Viking City Ordinary',
    mode: 'City Ordinary',
    depot: 'Warangal Depot-2',
    assignedRouteId: 'route-204',
    assignedDriverId: 'drv-301',
    assignedDriverName: 'Mohammad Khaja',
    status: 'In Service',
    currentLocation: { lat: 18.0072, lng: 79.5702 }, // Hanamkonda Depot
    heading: 180,
    speedKmH: 32,
    batteryOrFuelPercent: 91,
    occupancy: 'Low',
    occupancyPercent: 35,
    totalDistanceTodayKm: 124.0,
    lastUpdated: 'Just now',
    currentStopIndex: 1,
    isSimulating: true,
    delayMinutes: 0,
    airConditioned: false,
    wifiEnabled: false
  },
  {
    id: 'veh-305A',
    regNumber: 'TG-02-Z-7840',
    model: 'Tata Starbus 2x2 Deluxe Express',
    mode: 'Deluxe',
    depot: 'Karimnagar Depot',
    assignedRouteId: 'route-305',
    assignedDriverId: 'drv-405',
    assignedDriverName: 'S. Balaraju',
    status: 'In Service',
    currentLocation: { lat: 18.1500, lng: 79.4800 }, // between Hasanparthy & Husnabad
    heading: 325,
    speedKmH: 58,
    batteryOrFuelPercent: 78,
    occupancy: 'Moderate',
    occupancyPercent: 55,
    totalDistanceTodayKm: 215.4,
    lastUpdated: 'Just now',
    currentStopIndex: 2,
    isSimulating: true,
    delayMinutes: 3,
    airConditioned: false,
    wifiEnabled: true
  },
  {
    id: 'veh-408A',
    regNumber: 'TG-09-Z-4521',
    model: 'Volvo B11R Multi-Axle Garuda Plus AC',
    mode: 'Super Luxury',
    depot: 'Ranigunj-1 Depot, Hyderabad',
    assignedRouteId: 'route-408',
    assignedDriverId: 'drv-502',
    assignedDriverName: 'M. Srinivas Rao',
    status: 'In Service',
    currentLocation: { lat: 17.7245, lng: 79.1780 }, // Jangaon Station
    heading: 240,
    speedKmH: 72,
    batteryOrFuelPercent: 84,
    occupancy: 'Crowded',
    occupancyPercent: 80,
    totalDistanceTodayKm: 285.0,
    lastUpdated: 'Just now',
    currentStopIndex: 3,
    isSimulating: true,
    delayMinutes: 0,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-502A',
    regNumber: 'TG-03-EV-0105',
    model: 'Olectra Greentech K9 Pure Electric AC Bus',
    mode: 'Electric EV',
    depot: 'Warangal Green EV Depot',
    assignedRouteId: 'route-502',
    assignedDriverId: 'drv-601',
    assignedDriverName: 'T. Rajender',
    status: 'In Service',
    currentLocation: { lat: 17.8200, lng: 79.7500 }, // near Wardhannapet
    heading: 145,
    speedKmH: 48,
    batteryOrFuelPercent: 82,
    occupancy: 'Low',
    occupancyPercent: 28,
    totalDistanceTodayKm: 98.2,
    lastUpdated: 'Just now',
    currentStopIndex: 1,
    isSimulating: true,
    delayMinutes: 0,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-101C',
    regNumber: 'TG-03-Z-8814',
    model: 'Ashok Leyland Super Luxury Coach',
    mode: 'Super Luxury',
    depot: 'Warangal Depot-1',
    assignedRouteId: 'route-101',
    assignedDriverId: null,
    status: 'Idle / Depot',
    currentLocation: { lat: 17.9689, lng: 79.6012 }, // at Warangal Depot
    heading: 0,
    speedKmH: 0,
    batteryOrFuelPercent: 99,
    occupancy: 'Empty',
    occupancyPercent: 0,
    totalDistanceTodayKm: 32.0,
    lastUpdated: '25 mins ago',
    currentStopIndex: 0,
    isSimulating: false,
    delayMinutes: 0,
    airConditioned: false,
    wifiEnabled: false
  },
  {
    id: 'veh-204B',
    regNumber: 'TG-03-Z-9912',
    model: 'Tata Ultra Transit Bus',
    mode: 'City Ordinary',
    depot: 'Warangal Regional Workshop',
    assignedRouteId: 'route-204',
    assignedDriverId: null,
    status: 'Maintenance',
    currentLocation: { lat: 18.0010, lng: 79.5790 },
    heading: 0,
    speedKmH: 0,
    batteryOrFuelPercent: 40,
    occupancy: 'Empty',
    occupancyPercent: 0,
    totalDistanceTodayKm: 0,
    lastUpdated: '3 hours ago',
    currentStopIndex: 0,
    isSimulating: false,
    delayMinutes: 0,
    airConditioned: false,
    wifiEnabled: false
  }
];

export const INITIAL_SCHEDULE_REPORTS: RouteScheduleItem[] = [
  {
    id: 'sch-101-01',
    routeId: 'route-101',
    routeCode: '101',
    routeName: 'Kazipet - Hanamkonda - Warangal Tri-City Express',
    tripId: 'TRP-101-0630',
    vehicleId: 'TG-03-Z-1089',
    driverId: 'usr-driver-1',
    driverName: 'Ramesh Goud',
    departureTime: '06:30 AM',
    arrivalTime: '07:10 AM',
    actualDepartureTime: '06:30 AM',
    actualArrivalTime: '07:11 AM',
    dayType: 'Weekday',
    frequency: 'Every 8 mins',
    status: 'On Time',
    varianceMinutes: 1,
    onTimeRate: 97.5,
    platformNo: 'Platform 3 (KZP)'
  },
  {
    id: 'sch-101-02',
    routeId: 'route-101',
    routeCode: '101',
    routeName: 'Kazipet - Hanamkonda - Warangal Tri-City Express',
    tripId: 'TRP-101-0715',
    vehicleId: 'TG-03-Z-2415',
    driverId: 'drv-202',
    driverName: 'K. Venkateswarlu',
    departureTime: '07:15 AM',
    arrivalTime: '07:55 AM',
    actualDepartureTime: '07:18 AM',
    actualArrivalTime: '08:01 AM',
    dayType: 'Weekday',
    frequency: 'Every 8 mins',
    status: 'Delayed',
    varianceMinutes: 6,
    onTimeRate: 89.2,
    platformNo: 'Platform 3 (KZP)'
  },
  {
    id: 'sch-204-01',
    routeId: 'route-204',
    routeCode: '204',
    routeName: 'Kakatiya Heritage Circular (KU Campus ⇄ Warangal Fort)',
    tripId: 'TRP-204-0730',
    vehicleId: 'TG-03-Z-3320',
    driverId: 'drv-301',
    driverName: 'Mohammad Khaja',
    departureTime: '07:30 AM',
    arrivalTime: '08:18 AM',
    actualDepartureTime: '07:30 AM',
    actualArrivalTime: '08:18 AM',
    dayType: 'Weekday',
    frequency: 'Every 12 mins',
    status: 'Completed',
    varianceMinutes: 0,
    onTimeRate: 98.4,
    platformNo: 'Platform 1 (KU)'
  },
  {
    id: 'sch-305-01',
    routeId: 'route-305',
    routeCode: '305',
    routeName: 'Warangal - Karimnagar Deluxe Express',
    tripId: 'TRP-305-0745',
    vehicleId: 'TG-02-Z-7840',
    driverId: 'drv-405',
    driverName: 'S. Balaraju',
    departureTime: '07:45 AM',
    arrivalTime: '09:20 AM',
    actualDepartureTime: '07:45 AM',
    actualArrivalTime: '09:23 AM',
    dayType: 'Weekday',
    frequency: 'Every 20 mins',
    status: 'On Time',
    varianceMinutes: 3,
    onTimeRate: 94.8,
    platformNo: 'Platform 6 (HNK)'
  },
  {
    id: 'sch-408-01',
    routeId: 'route-408',
    routeCode: '408',
    routeName: 'Warangal - Hyderabad Garuda Super Luxury',
    tripId: 'TRP-408-0600',
    vehicleId: 'TG-09-Z-4521',
    driverId: 'drv-502',
    driverName: 'M. Srinivas Rao',
    departureTime: '06:00 AM',
    arrivalTime: '08:45 AM',
    actualDepartureTime: '06:00 AM',
    actualArrivalTime: '08:44 AM',
    dayType: 'Weekday',
    frequency: 'Every 15 mins',
    status: 'On Time',
    varianceMinutes: -1,
    onTimeRate: 99.2,
    platformNo: 'Platform 2 (WGL CBS)'
  },
  {
    id: 'sch-502-01',
    routeId: 'route-502',
    routeCode: '502',
    routeName: 'Warangal - Khammam Green EV Express',
    tripId: 'TRP-502-0800',
    vehicleId: 'TG-03-EV-0105',
    driverId: 'drv-601',
    driverName: 'T. Rajender',
    departureTime: '08:00 AM',
    arrivalTime: '10:15 AM',
    actualDepartureTime: '08:02 AM',
    actualArrivalTime: '10:16 AM',
    dayType: 'Weekday',
    frequency: 'Every 30 mins',
    status: 'On Time',
    varianceMinutes: 1,
    onTimeRate: 96.0,
    platformNo: 'Platform 4 (WGL CBS)'
  }
];

export const INITIAL_FEEDBACK: PassengerFeedback[] = [
  {
    id: 'fb-001',
    passengerName: 'Ananya Reddy',
    isAnonymous: false,
    routeId: 'route-101',
    routeCode: '101',
    vehicleId: 'TG-03-Z-1089',
    rating: 5,
    category: 'Punctuality',
    comment: 'Punctual service between Kazipet Railway Station and Kakatiya University / Hanamkonda. Digital Telugu and English LED boards inside the bus were very clear.',
    timestamp: 'Today at 08:35 AM IST',
    sentiment: 'Positive',
    status: 'Reviewed',
    adminResponse: 'Thank you Ananya. TGSRTC Warangal Depot-1 prioritizes student and daily commuter punctuality along the tri-city corridor.'
  },
  {
    id: 'fb-002',
    passengerName: 'B. Ravi Kumar (Subedari)',
    isAnonymous: false,
    routeId: 'route-101',
    routeCode: '101',
    vehicleId: 'TG-03-Z-2415',
    rating: 3,
    category: 'Crowding / Comfort',
    comment: 'Heavy crowd during morning rush hour near MGM Hospital. Conductor was polite and accepted digital UPI payments smoothly.',
    timestamp: 'Today at 08:45 AM IST',
    sentiment: 'Neutral',
    status: 'Pending',
    adminResponse: 'Additional booster bus scheduled from Kazipet to Warangal CBS starting 08:15 AM during peak hours.'
  },
  {
    id: 'fb-003',
    passengerName: 'Mohammed Rafi (Local Resident)',
    isAnonymous: false,
    routeId: 'route-204',
    routeCode: '204',
    vehicleId: 'TG-03-Z-3320',
    rating: 5,
    category: 'Driving Safety',
    comment: 'Driver Mohammad Khaja navigated the narrow chowrasta roads near Warangal Fort very carefully. Bus was clean and well maintained.',
    timestamp: 'Yesterday at 05:20 PM IST',
    sentiment: 'Positive',
    status: 'Resolved'
  },
  {
    id: 'fb-004',
    passengerName: 'Priya Sharma (Tech Professional)',
    isAnonymous: false,
    routeId: 'route-408',
    routeCode: '408',
    vehicleId: 'TG-09-Z-4521',
    rating: 5,
    category: 'Cleanliness',
    comment: 'Garuda Super Luxury AC bus from Warangal to MGBS Hyderabad was spotless. Reached Uppal Metro Interchange ahead of schedule. Very comfortable 2x2 pushback seats.',
    timestamp: 'Yesterday at 04:10 PM IST',
    sentiment: 'Positive',
    status: 'Resolved'
  },
  {
    id: 'fb-005',
    passengerName: 'Commuter from Hanamkonda',
    isAnonymous: true,
    routeId: 'route-305',
    routeCode: '305',
    vehicleId: 'TG-02-Z-7840',
    rating: 4,
    category: 'App Experience',
    comment: 'Live GPS location matched exactly when waiting at Hasanparthy bus shelter. Arrival countdown was reliable.',
    timestamp: '02-11-2026',
    sentiment: 'Positive',
    status: 'Reviewed',
    adminResponse: 'GPS transponders have been upgraded on all Deluxe and Super Luxury units in Warangal & Karimnagar divisions.'
  }
];

export const INITIAL_SERVICE_DELAYS: ServiceDelay[] = [
  {
    id: 'dly-101',
    routeId: 'route-101',
    routeCode: '101',
    routeName: 'Kazipet - Hanamkonda - Warangal Tri-City Express',
    vehicleId: 'TG-03-Z-2415',
    delayMinutes: 6,
    cause: 'Traffic Congestion',
    affectedStops: ['MGM-HSP', 'WGL-CBS'],
    reportedByRole: 'Driver',
    reportedByName: 'K. Venkateswarlu',
    reportedAt: '08:10 AM IST',
    estimatedResolutionTime: '08:45 AM IST',
    status: 'Active',
    actionTaken: 'Traffic police assisted clearance at MGM Hospital chowrasta; auxiliary bus staged at Subedari.',
    severity: 'Medium'
  },
  {
    id: 'dly-408',
    routeId: 'route-408',
    routeCode: '408',
    routeName: 'Warangal - Hyderabad Garuda Super Luxury',
    vehicleId: 'TG-09-Z-4521',
    delayMinutes: 10,
    cause: 'Road Construction',
    affectedStops: ['JGN-RTC', 'ALR-XRD'],
    reportedByRole: 'Transport Operator',
    reportedByName: 'S. Rajalingam (RM)',
    reportedAt: '07:30 AM IST',
    estimatedResolutionTime: '09:30 AM IST',
    status: 'Active',
    actionTaken: 'NH-163 flyover construction detour via Jangaon Bypass road implemented.',
    severity: 'Medium'
  },
  {
    id: 'dly-305-hist',
    routeId: 'route-305',
    routeCode: '305',
    routeName: 'Warangal - Karimnagar Deluxe Express',
    vehicleId: 'TG-02-Z-7840',
    delayMinutes: 15,
    cause: 'Railway Gate Closure',
    affectedStops: ['HSP-JNC'],
    reportedByRole: 'Transport Operator',
    reportedByName: 'S. Rajalingam (RM)',
    reportedAt: 'Yesterday 09:15 AM IST',
    estimatedResolutionTime: 'Yesterday 09:40 AM IST',
    status: 'Resolved',
    actionTaken: 'Goods train shunting cleared at Hasanparthy LC gate; normal schedule restored.',
    severity: 'Low'
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-101',
    timestamp: 'Today at 08:12 AM IST',
    actor: 'K. Venkateswarlu',
    role: 'Driver',
    action: 'Logged Field Delay',
    details: 'Reported 6 min delay on Route 101 due to vegetable market congestion near MGM Chowrasta.',
    ipAddress: '10.14.2.89'
  },
  {
    id: 'log-102',
    timestamp: 'Today at 07:15 AM IST',
    actor: 'S. Rajalingam',
    role: 'Transport Operator',
    action: 'Vehicle Dispatched',
    details: 'Dispatched TG-03-Z-1089 from Warangal Depot-1 on Tri-City Corridor assigned to Driver Ramesh Goud.',
    ipAddress: '10.14.1.45'
  },
  {
    id: 'log-103',
    timestamp: 'Today at 06:00 AM IST',
    actor: 'Sri. K. V. Ramanathan, IPS',
    role: 'Admin',
    action: 'Published Master Timetable',
    details: 'Approved Winter Schedule & EV Fleet deployment for Warangal Tri-City & Hyderabad Corridors.',
    ipAddress: '10.1.1.10'
  },
  {
    id: 'log-104',
    timestamp: '03-11-2026 at 09:30 PM IST',
    actor: 'S. Rajalingam',
    role: 'Transport Operator',
    action: 'Fleet Maintenance Updated',
    details: 'Transit unit TG-03-Z-9912 checked in at Warangal Regional Workshop for scheduled brake overhaul.',
    ipAddress: '10.14.1.45'
  }
];

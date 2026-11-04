import { TransitStop, TransitRoute, TransitVehicle, RouteScheduleItem, PassengerFeedback, ServiceDelay, User, SystemAuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Sarah Jenkins (Chief Director)',
    email: 'admin@metrotransit.org',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'DIR-8801',
    operatorCompany: 'Metro Transit Authority'
  },
  {
    id: 'usr-op-1',
    name: 'Marcus Vance (Dispatch Manager)',
    email: 'operator@metrotransit.org',
    role: 'Transport Operator',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'DISP-402',
    operatorCompany: 'CityLink Transit Fleet Co.'
  },
  {
    id: 'usr-driver-1',
    name: 'David Rodriguez (Senior Driver)',
    email: 'driver@metrotransit.org',
    role: 'Driver',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'DRV-1099',
    operatorCompany: 'CityLink Transit Fleet Co.'
  },
  {
    id: 'usr-pass-1',
    name: 'Elena Rostova (Daily Commuter)',
    email: 'passenger@gmail.com',
    role: 'Passenger',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    badgeNumber: 'PASS-CARD-721'
  }
];

export const INITIAL_STOPS: TransitStop[] = [
  {
    id: 'stop-1',
    code: 'ST-CV1',
    name: 'Civic Center Plaza',
    location: { lat: 37.7793, lng: -122.4192 },
    zone: 'Zone 1 - Downtown Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk'],
    routesServed: ['route-101', 'route-204']
  },
  {
    id: 'stop-2',
    code: 'ST-UN2',
    name: 'Union Square Central',
    location: { lat: 37.7879, lng: -122.4075 },
    zone: 'Zone 1 - Downtown Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk'],
    routesServed: ['route-101', 'route-408']
  },
  {
    id: 'stop-3',
    code: 'ST-FN3',
    name: 'Financial District Tower',
    location: { lat: 37.7946, lng: -122.4005 },
    zone: 'Zone 1 - Downtown Core',
    amenities: ['Shelter', 'Digital Display', 'Bicycle Rack', 'Ticket Kiosk'],
    routesServed: ['route-101', 'route-408']
  },
  {
    id: 'stop-4',
    code: 'ST-EM4',
    name: 'Embarcadero Ferry Terminal',
    location: { lat: 37.7955, lng: -122.3937 },
    zone: 'Zone 1 - Downtown Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Bicycle Rack'],
    routesServed: ['route-101']
  },
  {
    id: 'stop-5',
    code: 'ST-FW5',
    name: "Fisherman's Wharf Pier 39",
    location: { lat: 37.8080, lng: -122.4098 },
    zone: 'Zone 2 - North Coast',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access'],
    routesServed: ['route-101']
  },
  {
    id: 'stop-6',
    code: 'ST-GG6',
    name: 'Golden Gate Park East',
    location: { lat: 37.7712, lng: -122.4687 },
    zone: 'Zone 3 - Westside',
    amenities: ['Shelter', 'Bicycle Rack', 'Wheelchair Access'],
    routesServed: ['route-204', 'route-305']
  },
  {
    id: 'stop-7',
    code: 'ST-AL7',
    name: 'Alamo Square Park',
    location: { lat: 37.7764, lng: -122.4346 },
    zone: 'Zone 2 - Central District',
    amenities: ['Shelter', 'Digital Display'],
    routesServed: ['route-204']
  },
  {
    id: 'stop-8',
    code: 'ST-MS8',
    name: 'Mission 24th St District',
    location: { lat: 37.7522, lng: -122.4181 },
    zone: 'Zone 2 - Central District',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk'],
    routesServed: ['route-204', 'route-305']
  },
  {
    id: 'stop-9',
    code: 'ST-OB9',
    name: 'Ocean Beach Promenade',
    location: { lat: 37.7595, lng: -122.5098 },
    zone: 'Zone 3 - Westside Coastal',
    amenities: ['Shelter', 'Bicycle Rack'],
    routesServed: ['route-305']
  },
  {
    id: 'stop-10',
    code: 'ST-CS10',
    name: 'Castro District Station',
    location: { lat: 37.7628, lng: -122.4350 },
    zone: 'Zone 2 - Central District',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk'],
    routesServed: ['route-305']
  },
  {
    id: 'stop-11',
    code: 'ST-SO11',
    name: 'SOMA Tech Corridor Hub',
    location: { lat: 37.7785, lng: -122.3990 },
    zone: 'Zone 1 - Downtown Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Bicycle Rack'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-12',
    code: 'ST-CL12',
    name: '4th & King Caltrain Depot',
    location: { lat: 37.7766, lng: -122.3949 },
    zone: 'Zone 1 - Downtown Core',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk'],
    routesServed: ['route-408']
  },
  {
    id: 'stop-13',
    code: 'ST-AP13',
    name: 'International Airport Gate Hub',
    location: { lat: 37.6213, lng: -122.3790 },
    zone: 'Zone 4 - South Airport Special',
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Access', 'Ticket Kiosk', 'Bicycle Rack'],
    routesServed: ['route-408']
  }
];

export const INITIAL_ROUTES: TransitRoute[] = [
  {
    id: 'route-101',
    code: '101',
    name: 'Blue Metro Express',
    mode: 'Bus',
    color: '#006bc9',
    description: 'Direct high-frequency corridor from Civic Center across Union Sq to Ferry Terminal & Wharf.',
    operatingHours: '05:00 AM - 11:45 PM',
    frequencyMinutes: 10,
    isPublished: true,
    fare: 2.75,
    totalDistanceKm: 7.2,
    averageDurationMinutes: 28,
    stops: [
      INITIAL_STOPS[0], // Civic Center
      INITIAL_STOPS[1], // Union Square
      INITIAL_STOPS[2], // Financial District
      INITIAL_STOPS[3], // Ferry Terminal
      INITIAL_STOPS[4]  // Wharf
    ],
    waypoints: [
      { lat: 37.7793, lng: -122.4192 },
      { lat: 37.7840, lng: -122.4130 },
      { lat: 37.7879, lng: -122.4075 },
      { lat: 37.7915, lng: -122.4035 },
      { lat: 37.7946, lng: -122.4005 },
      { lat: 37.7955, lng: -122.3937 },
      { lat: 37.8010, lng: -122.3980 },
      { lat: 37.8055, lng: -122.4040 },
      { lat: 37.8080, lng: -122.4098 }
    ]
  },
  {
    id: 'route-204',
    code: '204',
    name: 'Emerald Crosstown Connector',
    mode: 'Tram',
    color: '#059669',
    description: 'Connecting Golden Gate Park with Alamo Square, Downtown and the vibrant Mission corridor.',
    operatingHours: '05:30 AM - 11:15 PM',
    frequencyMinutes: 12,
    isPublished: true,
    fare: 3.00,
    totalDistanceKm: 8.5,
    averageDurationMinutes: 32,
    stops: [
      INITIAL_STOPS[5], // Golden Gate Park
      INITIAL_STOPS[6], // Alamo Sq
      INITIAL_STOPS[0], // Civic Center
      INITIAL_STOPS[7]  // Mission 24th
    ],
    waypoints: [
      { lat: 37.7712, lng: -122.4687 },
      { lat: 37.7735, lng: -122.4500 },
      { lat: 37.7764, lng: -122.4346 },
      { lat: 37.7780, lng: -122.4250 },
      { lat: 37.7793, lng: -122.4192 },
      { lat: 37.7650, lng: -122.4190 },
      { lat: 37.7522, lng: -122.4181 }
    ]
  },
  {
    id: 'route-305',
    code: '305',
    name: 'Sunset Rapid Shoreline',
    mode: 'Bus',
    color: '#d97706',
    description: 'Fast cross-district route from Ocean Beach via Castro to Mission District.',
    operatingHours: '06:00 AM - 10:30 PM',
    frequencyMinutes: 15,
    isPublished: true,
    fare: 2.75,
    totalDistanceKm: 10.1,
    averageDurationMinutes: 36,
    stops: [
      INITIAL_STOPS[8], // Ocean Beach
      INITIAL_STOPS[5], // Golden Gate Park
      INITIAL_STOPS[9], // Castro
      INITIAL_STOPS[7]  // Mission 24th
    ],
    waypoints: [
      { lat: 37.7595, lng: -122.5098 },
      { lat: 37.7670, lng: -122.4880 },
      { lat: 37.7712, lng: -122.4687 },
      { lat: 37.7680, lng: -122.4490 },
      { lat: 37.7628, lng: -122.4350 },
      { lat: 37.7580, lng: -122.4260 },
      { lat: 37.7522, lng: -122.4181 }
    ]
  },
  {
    id: 'route-408',
    code: '408',
    name: 'Airport Metro Direct',
    mode: 'Express Shuttle',
    color: '#7c3aed',
    description: 'Dedicated rapid shuttle connecting Union Square and SOMA with Airport Terminals.',
    operatingHours: '04:00 AM - 01:00 AM',
    frequencyMinutes: 15,
    isPublished: true,
    fare: 6.50,
    totalDistanceKm: 18.2,
    averageDurationMinutes: 24,
    stops: [
      INITIAL_STOPS[1],  // Union Sq
      INITIAL_STOPS[2],  // Financial District
      INITIAL_STOPS[10], // SOMA
      INITIAL_STOPS[11], // Caltrain Depot
      INITIAL_STOPS[12]  // Airport Hub
    ],
    waypoints: [
      { lat: 37.7879, lng: -122.4075 },
      { lat: 37.7946, lng: -122.4005 },
      { lat: 37.7850, lng: -122.3970 },
      { lat: 37.7785, lng: -122.3990 },
      { lat: 37.7766, lng: -122.3949 },
      { lat: 37.7200, lng: -122.3880 },
      { lat: 37.6600, lng: -122.3820 },
      { lat: 37.6213, lng: -122.3790 }
    ]
  }
];

export const INITIAL_VEHICLES: TransitVehicle[] = [
  {
    id: 'veh-101A',
    regNumber: 'BUS-1011',
    model: 'Volvo 7900 Electric Zero Emission',
    mode: 'Bus',
    assignedRouteId: 'route-101',
    assignedDriverId: 'usr-driver-1',
    assignedDriverName: 'David Rodriguez',
    status: 'In Service',
    currentLocation: { lat: 37.7879, lng: -122.4075 },
    heading: 45,
    speedKmH: 34,
    batteryOrFuelPercent: 88,
    occupancy: 'Moderate',
    occupancyPercent: 58,
    totalDistanceTodayKm: 142.5,
    lastUpdated: 'Just now',
    currentStopIndex: 1,
    isSimulating: true,
    delayMinutes: 2,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-101B',
    regNumber: 'BUS-1012',
    model: 'BYD K9 High-Capacity Electric',
    mode: 'Bus',
    assignedRouteId: 'route-101',
    assignedDriverId: 'drv-204',
    assignedDriverName: 'Carlos Gomez',
    status: 'In Service',
    currentLocation: { lat: 37.8010, lng: -122.3980 },
    heading: 320,
    speedKmH: 28,
    batteryOrFuelPercent: 74,
    occupancy: 'Crowded',
    occupancyPercent: 84,
    totalDistanceTodayKm: 168.0,
    lastUpdated: '1 min ago',
    currentStopIndex: 3,
    isSimulating: true,
    delayMinutes: 7,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-204A',
    regNumber: 'TRM-2041',
    model: 'Siemens Combino Low-Floor Light Rail',
    mode: 'Tram',
    assignedRouteId: 'route-204',
    assignedDriverId: 'drv-301',
    assignedDriverName: 'Jessica Miller',
    status: 'In Service',
    currentLocation: { lat: 37.7764, lng: -122.4346 },
    heading: 110,
    speedKmH: 42,
    batteryOrFuelPercent: 92,
    occupancy: 'Low',
    occupancyPercent: 32,
    totalDistanceTodayKm: 195.4,
    lastUpdated: 'Just now',
    currentStopIndex: 1,
    isSimulating: true,
    delayMinutes: 0,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-305A',
    regNumber: 'BUS-3051',
    model: 'Proterra Catalyst E2 Max',
    mode: 'Bus',
    assignedRouteId: 'route-305',
    assignedDriverId: 'drv-405',
    assignedDriverName: 'Aiden Brooks',
    status: 'In Service',
    currentLocation: { lat: 37.7680, lng: -122.4490 },
    heading: 135,
    speedKmH: 31,
    batteryOrFuelPercent: 65,
    occupancy: 'Moderate',
    occupancyPercent: 62,
    totalDistanceTodayKm: 118.2,
    lastUpdated: 'Just now',
    currentStopIndex: 2,
    isSimulating: true,
    delayMinutes: 3,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-408A',
    regNumber: 'EXP-4081',
    model: 'Mercedes-Benz Citaro Airport Coach',
    mode: 'Express Shuttle',
    assignedRouteId: 'route-408',
    assignedDriverId: 'drv-502',
    assignedDriverName: 'Maya Patel',
    status: 'In Service',
    currentLocation: { lat: 37.7766, lng: -122.3949 },
    heading: 180,
    speedKmH: 68,
    batteryOrFuelPercent: 81,
    occupancy: 'Low',
    occupancyPercent: 24,
    totalDistanceTodayKm: 245.0,
    lastUpdated: 'Just now',
    currentStopIndex: 3,
    isSimulating: true,
    delayMinutes: 0,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-101C',
    regNumber: 'BUS-1013',
    model: 'Volvo 7900 Hybrid City',
    mode: 'Bus',
    assignedRouteId: 'route-101',
    assignedDriverId: null,
    status: 'Idle / Depot',
    currentLocation: { lat: 37.7790, lng: -122.4190 },
    heading: 0,
    speedKmH: 0,
    batteryOrFuelPercent: 99,
    occupancy: 'Empty',
    occupancyPercent: 0,
    totalDistanceTodayKm: 42.0,
    lastUpdated: '25 mins ago',
    currentStopIndex: 0,
    isSimulating: false,
    delayMinutes: 0,
    airConditioned: true,
    wifiEnabled: true
  },
  {
    id: 'veh-204B',
    regNumber: 'TRM-2042',
    model: 'Bombardier Flexity Swift Tram',
    mode: 'Tram',
    assignedRouteId: 'route-204',
    assignedDriverId: null,
    status: 'Maintenance',
    currentLocation: { lat: 37.7550, lng: -122.4150 },
    heading: 0,
    speedKmH: 0,
    batteryOrFuelPercent: 45,
    occupancy: 'Empty',
    occupancyPercent: 0,
    totalDistanceTodayKm: 0,
    lastUpdated: '2 hours ago',
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
    routeName: 'Blue Metro Express',
    tripId: 'TRIP-101-0800',
    vehicleId: 'BUS-1011',
    driverId: 'usr-driver-1',
    driverName: 'David Rodriguez',
    departureTime: '08:00 AM',
    arrivalTime: '08:28 AM',
    actualDepartureTime: '08:02 AM',
    actualArrivalTime: '08:31 AM',
    dayType: 'Weekday',
    frequency: 'Every 10 mins',
    status: 'Delayed',
    varianceMinutes: 3,
    onTimeRate: 94.2
  },
  {
    id: 'sch-101-02',
    routeId: 'route-101',
    routeCode: '101',
    routeName: 'Blue Metro Express',
    tripId: 'TRIP-101-0810',
    vehicleId: 'BUS-1012',
    driverId: 'drv-204',
    driverName: 'Carlos Gomez',
    departureTime: '08:10 AM',
    arrivalTime: '08:38 AM',
    actualDepartureTime: '08:11 AM',
    actualArrivalTime: '08:45 AM',
    dayType: 'Weekday',
    frequency: 'Every 10 mins',
    status: 'Delayed',
    varianceMinutes: 7,
    onTimeRate: 88.5
  },
  {
    id: 'sch-204-01',
    routeId: 'route-204',
    routeCode: '204',
    routeName: 'Emerald Crosstown Connector',
    tripId: 'TRIP-204-0815',
    vehicleId: 'TRM-2041',
    driverId: 'drv-301',
    driverName: 'Jessica Miller',
    departureTime: '08:15 AM',
    arrivalTime: '08:47 AM',
    actualDepartureTime: '08:15 AM',
    actualArrivalTime: '08:46 AM',
    dayType: 'Weekday',
    frequency: 'Every 12 mins',
    status: 'On Time',
    varianceMinutes: -1,
    onTimeRate: 98.7
  },
  {
    id: 'sch-305-01',
    routeId: 'route-305',
    routeCode: '305',
    routeName: 'Sunset Rapid Shoreline',
    tripId: 'TRIP-305-0830',
    vehicleId: 'BUS-3051',
    driverId: 'drv-405',
    driverName: 'Aiden Brooks',
    departureTime: '08:30 AM',
    arrivalTime: '09:06 AM',
    actualDepartureTime: '08:32 AM',
    actualArrivalTime: '09:09 AM',
    dayType: 'Weekday',
    frequency: 'Every 15 mins',
    status: 'Delayed',
    varianceMinutes: 3,
    onTimeRate: 91.0
  },
  {
    id: 'sch-408-01',
    routeId: 'route-408',
    routeCode: '408',
    routeName: 'Airport Metro Direct',
    tripId: 'TRIP-408-0800',
    vehicleId: 'EXP-4081',
    driverId: 'drv-502',
    driverName: 'Maya Patel',
    departureTime: '08:00 AM',
    arrivalTime: '08:24 AM',
    actualDepartureTime: '08:00 AM',
    actualArrivalTime: '08:23 AM',
    dayType: 'Weekday',
    frequency: 'Every 15 mins',
    status: 'On Time',
    varianceMinutes: -1,
    onTimeRate: 99.1
  },
  {
    id: 'sch-101-03',
    routeId: 'route-101',
    routeCode: '101',
    routeName: 'Blue Metro Express',
    tripId: 'TRIP-101-0820',
    vehicleId: 'BUS-1013',
    driverId: 'drv-601',
    driverName: 'Liam Chen',
    departureTime: '08:20 AM',
    arrivalTime: '08:48 AM',
    actualDepartureTime: '08:20 AM',
    actualArrivalTime: '08:48 AM',
    dayType: 'Weekday',
    frequency: 'Every 10 mins',
    status: 'Completed',
    varianceMinutes: 0,
    onTimeRate: 97.4
  }
];

export const INITIAL_FEEDBACK: PassengerFeedback[] = [
  {
    id: 'fb-001',
    passengerName: 'Elena Rostova',
    isAnonymous: false,
    routeId: 'route-101',
    routeCode: '101',
    vehicleId: 'BUS-1011',
    rating: 5,
    category: 'Driving Safety',
    comment: 'Driver David was very polite and smooth around sharp downtown turns. Clean electric bus with working AC!',
    timestamp: 'Today at 08:35 AM',
    sentiment: 'Positive',
    status: 'Reviewed',
    adminResponse: 'Thank you Elena! We have shared your compliments with Driver David and the team.'
  },
  {
    id: 'fb-002',
    passengerName: 'Anonymous Commuter',
    isAnonymous: true,
    routeId: 'route-101',
    routeCode: '101',
    vehicleId: 'BUS-1012',
    rating: 3,
    category: 'Punctuality',
    comment: 'Bus arrived 7 minutes later than posted on the digital sign at Ferry Building. Very crowded by 8:30.',
    timestamp: 'Today at 08:42 AM',
    sentiment: 'Neutral',
    status: 'Pending',
    adminResponse: 'Traffic delays at Market Street were active during your trip; dispatch is adding an extra morning booster bus.'
  },
  {
    id: 'fb-003',
    passengerName: 'Brian K.',
    isAnonymous: false,
    routeId: 'route-204',
    routeCode: '204',
    vehicleId: 'TRM-2041',
    rating: 5,
    category: 'Cleanliness',
    comment: 'Spotless low-floor tram! Super easy boarding with stroller, digital screens gave exact countdowns.',
    timestamp: 'Yesterday at 05:15 PM',
    sentiment: 'Positive',
    status: 'Resolved'
  },
  {
    id: 'fb-004',
    passengerName: 'Kavita Sundaram',
    isAnonymous: false,
    routeId: 'route-408',
    routeCode: '408',
    vehicleId: 'EXP-4081',
    rating: 5,
    category: 'App Experience',
    comment: 'Airport direct GPS tracking was 100% accurate. Reached terminal 3 on schedule. Luggage racks are great.',
    timestamp: 'Yesterday at 03:20 PM',
    sentiment: 'Positive',
    status: 'Resolved'
  },
  {
    id: 'fb-005',
    passengerName: 'Anonymous Rider',
    isAnonymous: true,
    routeId: 'route-305',
    routeCode: '305',
    vehicleId: 'BUS-3051',
    rating: 2,
    category: 'Crowding / Comfort',
    comment: 'Air conditioning seemed low on bus 3051 during morning rush. Stuffy near rear seats.',
    timestamp: '2 days ago',
    sentiment: 'Negative',
    status: 'Reviewed',
    adminResponse: 'Maintenance depot inspected HVAC system and replaced cabin filter on BUS-3051.'
  }
];

export const INITIAL_SERVICE_DELAYS: ServiceDelay[] = [
  {
    id: 'dly-101',
    routeId: 'route-101',
    routeCode: '101',
    routeName: 'Blue Metro Express',
    vehicleId: 'BUS-1012',
    delayMinutes: 7,
    cause: 'Traffic Congestion',
    affectedStops: ['ST-EM4', 'ST-FW5'],
    reportedByRole: 'Driver',
    reportedByName: 'Carlos Gomez',
    reportedAt: '08:25 AM',
    estimatedResolutionTime: '09:15 AM',
    status: 'Active',
    actionTaken: 'Transit Priority Signal lane activated; auxiliary bus BUS-1013 staged at Civic Center.',
    severity: 'Medium'
  },
  {
    id: 'dly-305',
    routeId: 'route-305',
    routeCode: '305',
    routeName: 'Sunset Rapid Shoreline',
    vehicleId: 'BUS-3051',
    delayMinutes: 3,
    cause: 'Road Construction',
    affectedStops: ['ST-CS10'],
    reportedByRole: 'Transport Operator',
    reportedByName: 'Marcus Vance',
    reportedAt: '07:45 AM',
    estimatedResolutionTime: '11:00 AM',
    status: 'Active',
    actionTaken: 'Minor detour via 18th Avenue bypass implemented.',
    severity: 'Low'
  },
  {
    id: 'dly-204-hist',
    routeId: 'route-204',
    routeCode: '204',
    routeName: 'Emerald Crosstown Connector',
    vehicleId: 'TRM-2042',
    delayMinutes: 18,
    cause: 'Mechanical Issue',
    affectedStops: ['ST-MS8', 'ST-CV1'],
    reportedByRole: 'Transport Operator',
    reportedByName: 'Marcus Vance',
    reportedAt: 'Yesterday 06:10 PM',
    estimatedResolutionTime: 'Yesterday 06:55 PM',
    status: 'Resolved',
    actionTaken: 'Tram swapped with reserve train TRM-2041. Passengers transferred with 0 fare penalty.',
    severity: 'High'
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-101',
    timestamp: 'Today at 08:26 AM',
    actor: 'Carlos Gomez',
    role: 'Driver',
    action: 'Reported Delay',
    details: 'Logged 7 min delay on Route 101 due to Market St heavy congestion.',
    ipAddress: '192.168.4.11'
  },
  {
    id: 'log-102',
    timestamp: 'Today at 08:12 AM',
    actor: 'Marcus Vance',
    role: 'Transport Operator',
    action: 'Vehicle Dispatched',
    details: 'Dispatched BUS-1011 on Route 101 assigned to Driver David Rodriguez.',
    ipAddress: '10.0.1.45'
  },
  {
    id: 'log-103',
    timestamp: 'Today at 07:30 AM',
    actor: 'Sarah Jenkins',
    role: 'Admin',
    action: 'Published Timetable Update',
    details: 'Approved and published Summer Q3 Master Schedule for all 4 routes.',
    ipAddress: '10.0.1.10'
  },
  {
    id: 'log-104',
    timestamp: 'Today at 07:00 AM',
    actor: 'Marcus Vance',
    role: 'Transport Operator',
    action: 'Fleet Telemetry Initialized',
    details: 'GPS tracking simulation synchronized across 7 fleet units.',
    ipAddress: '10.0.1.45'
  }
];

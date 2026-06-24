#!/usr/bin/env node
/**
 * Generates assets/courses-data.js — single source of truth for all TX public courses.
 * Merges exact-coordinate data (19 featured courses) with city-approximate coords for the rest.
 */

const fs = require('fs');
const path = require('path');

// City-center coordinates for Texas golf cities
const CITY_COORDS = {
  'Austin':         { lat: 30.2672, lng: -97.7431 },
  'San Antonio':    { lat: 29.4241, lng: -98.4936 },
  'Dallas':         { lat: 32.7767, lng: -96.7970 },
  'Fort Worth':     { lat: 32.7555, lng: -97.3308 },
  'Houston':        { lat: 29.7604, lng: -95.3698 },
  'El Paso':        { lat: 31.7619, lng: -106.4850 },
  'Lubbock':        { lat: 33.5779, lng: -101.8552 },
  'Abilene':        { lat: 32.4487, lng: -99.7331 },
  'Waco':           { lat: 31.5493, lng: -97.1467 },
  'Arlington':      { lat: 32.7357, lng: -97.1081 },
  'Plano':          { lat: 33.0198, lng: -96.6989 },
  'Irving':         { lat: 32.8140, lng: -96.9489 },
  'Garland':        { lat: 32.9126, lng: -96.6389 },
  'Corpus Christi': { lat: 27.8006, lng: -97.3964 },
  'McAllen':        { lat: 26.2034, lng: -98.2300 },
  'Amarillo':       { lat: 35.2219, lng: -101.8313 },
  'Tyler':          { lat: 32.3513, lng: -95.3010 },
  'College Station':{ lat: 30.6280, lng: -96.3344 },
  'Midland':        { lat: 31.9973, lng: -102.0779 },
  'Beaumont':       { lat: 30.0802, lng: -94.1266 },
  'San Marcos':     { lat: 29.8827, lng: -97.9411 },
  'Laredo':         { lat: 27.5036, lng: -99.5075 },
  'Galveston':      { lat: 29.3013, lng: -94.7977 },
  'Killeen':        { lat: 31.1171, lng: -97.7278 },
  'Wichita Falls':  { lat: 33.9137, lng: -98.4934 },
  'The Colony':     { lat: 33.0901, lng: -96.8920 },
  'McKinney':       { lat: 33.1972, lng: -96.6397 },
  'Grapevine':      { lat: 32.9343, lng: -97.0781 },
  'Round Rock':     { lat: 30.5083, lng: -97.6789 },
  'Rowlett':        { lat: 32.9026, lng: -96.5638 },
  'Pearland':       { lat: 29.5636, lng: -95.2860 },
  'Sugar Land':     { lat: 29.6197, lng: -95.6349 },
  'Cypress':        { lat: 29.9691, lng: -95.6972 },
  'Weslaco':        { lat: 26.1570, lng: -97.9908 },
  'New Braunfels':  { lat: 29.7030, lng: -98.1245 },
  'Pflugerville':   { lat: 30.4388, lng: -97.6200 },
  'Cedar Park':     { lat: 30.5052, lng: -97.8203 },
  'Conroe':         { lat: 30.3119, lng: -95.4560 },
  'Baytown':        { lat: 29.7355, lng: -94.9774 },
  'Friendswood':    { lat: 29.5294, lng: -95.2010 },
  'Lake Jackson':   { lat: 29.0344, lng: -95.4344 },
  'Missouri City':  { lat: 29.6185, lng: -95.5374 },
  'Hutto':          { lat: 30.5427, lng: -97.5461 },
  'Georgetown':     { lat: 30.6333, lng: -97.6776 },
  'Rockwall':       { lat: 32.9312, lng: -96.4597 },
  'Grand Prairie':  { lat: 32.7459, lng: -97.0231 },
  'Cedar Hill':     { lat: 32.5885, lng: -97.0058 },
  'Hurst':          { lat: 32.8237, lng: -97.1881 },
  'Denton':         { lat: 33.2148, lng: -97.1331 },
  'Odessa':         { lat: 31.8457, lng: -102.3676 },
  'Mineral Wells':  { lat: 32.8087, lng: -98.1145 },
  'Weatherford':    { lat: 32.7587, lng: -97.7975 },
  'Granbury':       { lat: 32.4421, lng: -97.7945 },
  'Stephenville':   { lat: 32.2207, lng: -98.2025 },
  'Pampa':          { lat: 35.5362, lng: -100.9606 },
  'Lufkin':         { lat: 31.3382, lng: -94.7291 },
  'Longview':       { lat: 32.5007, lng: -94.7405 },
  'Nacogdoches':    { lat: 31.6035, lng: -94.6552 },
  'Marshall':       { lat: 32.5449, lng: -94.3674 },
  'Palestine':      { lat: 31.7610, lng: -95.6308 },
  'Sulphur Springs':{ lat: 33.1387, lng: -95.6010 },
  'Brownsville':    { lat: 25.9017, lng: -97.4975 },
  'Henderson':      { lat: 32.1529, lng: -94.7963 },
  'Temple':         { lat: 31.0982, lng: -97.3428 },
  'Victoria':       { lat: 28.8053, lng: -97.0036 },
  'Pasadena':       { lat: 29.6910, lng: -95.2091 },
};

function region(city) {
  const map = {
    'Austin': 'Austin', 'Pflugerville': 'Austin', 'Cedar Park': 'Austin', 'Round Rock': 'Austin',
    'Georgetown': 'Austin', 'Hutto': 'Austin', 'San Marcos': 'Central Texas',
    'New Braunfels': 'Central Texas', 'Waco': 'Central Texas', 'Killeen': 'Central Texas',
    'Temple': 'Central Texas',
    'San Antonio': 'San Antonio',
    'Dallas': 'Dallas–Fort Worth', 'Fort Worth': 'Dallas–Fort Worth', 'Arlington': 'Dallas–Fort Worth',
    'Plano': 'Dallas–Fort Worth', 'Irving': 'Dallas–Fort Worth', 'Garland': 'Dallas–Fort Worth',
    'The Colony': 'Dallas–Fort Worth', 'McKinney': 'Dallas–Fort Worth', 'Grapevine': 'Dallas–Fort Worth',
    'Rowlett': 'Dallas–Fort Worth', 'Cedar Hill': 'Dallas–Fort Worth', 'Hurst': 'Dallas–Fort Worth',
    'Denton': 'Dallas–Fort Worth', 'Grand Prairie': 'Dallas–Fort Worth', 'Rockwall': 'Dallas–Fort Worth',
    'Mineral Wells': 'Dallas–Fort Worth', 'Weatherford': 'Dallas–Fort Worth', 'Granbury': 'Dallas–Fort Worth',
    'Stephenville': 'Dallas–Fort Worth',
    'Houston': 'Houston', 'Pasadena': 'Houston', 'Baytown': 'Houston', 'Friendswood': 'Houston',
    'Lake Jackson': 'Houston', 'Missouri City': 'Houston', 'Pearland': 'Houston',
    'Sugar Land': 'Houston', 'Cypress': 'Houston', 'Conroe': 'Houston',
    'El Paso': 'West Texas', 'Lubbock': 'West Texas', 'Midland': 'West Texas',
    'Odessa': 'West Texas', 'Abilene': 'West Texas', 'Amarillo': 'West Texas', 'Pampa': 'West Texas',
    'Tyler': 'East Texas', 'Lufkin': 'East Texas', 'Longview': 'East Texas',
    'Nacogdoches': 'East Texas', 'Marshall': 'East Texas', 'Palestine': 'East Texas',
    'Sulphur Springs': 'East Texas', 'Henderson': 'East Texas',
    'Beaumont': 'East Texas', 'College Station': 'Central Texas',
    'Wichita Falls': 'North Texas',
    'Galveston': 'Texas Coast', 'Corpus Christi': 'Texas Coast',
    'McAllen': 'South Texas', 'Weslaco': 'South Texas', 'Laredo': 'South Texas',
    'Brownsville': 'South Texas', 'Victoria': 'South Texas',
  };
  return map[city] || 'Texas';
}

// Existing 19 courses with verified exact coordinates and local photos
const EXACT_COURSES = [
  { id:'c1',  name:'Lions Municipal Golf Course',      city:'Austin',     fee:35, lat:30.2880, lng:-97.7805, photo:'assets/courses/c1.jpg',  tags:['Municipal','Historic'], blurb:"Austin's first public course (1924) and a Texas historic landmark — walkable, beloved, right in West Austin." },
  { id:'c2',  name:'Morris Williams Golf Course',       city:'Austin',     fee:38, lat:30.3074, lng:-97.6868, photo:null,                     tags:['Municipal'],            blurb:"Locals' favorite muni with a unique routing and stunning downtown Austin skyline views." },
  { id:'c3',  name:'Roy Kizer Golf Course',             city:'Austin',     fee:42, lat:30.1835, lng:-97.7330, photo:null,                     tags:['Links-style'],          blurb:"Austin's premier links-style muni — open, breezy, and a great walk in South Austin." },
  { id:'c4',  name:'Jimmy Clay Golf Course',            city:'Austin',     fee:34, lat:30.1856, lng:-97.7296, photo:null,                     tags:['Municipal'],            blurb:'Shares a property with Roy Kizer — pair them for a 36-hole South Austin day.' },
  { id:'c5',  name:'Riverside Golf Course',             city:'Austin',     fee:30, lat:30.2330, lng:-97.7150, photo:null,                     tags:['Municipal','Historic'], blurb:'East-of-downtown muni where Texas legends Ben Crenshaw and Tom Kite first learned the game.' },
  { id:'c6',  name:'Hancock Golf Course',               city:'Austin',     fee:18, lat:30.3013, lng:-97.7178, photo:'assets/courses/c6.jpg',  tags:['9-hole','Historic'],    blurb:'The oldest course in Texas (1899) — a quirky, walkable nine-holer in central Austin.' },
  { id:'c7',  name:'Brackenridge Park Golf Course',     city:'San Antonio',fee:50, lat:29.4620, lng:-98.4730, photo:'assets/courses/c7.jpg',  tags:['Municipal','Historic'], blurb:'Historic tree-lined city-park course near downtown — old-school charm at a fair price.' },
  { id:'c8',  name:'Cedar Creek Golf Course',           city:'San Antonio',fee:55, lat:29.6190, lng:-98.6290, photo:null,                     tags:['Scenic'],               blurb:'Renovated in 2024 to 7,158 yards — one of the most challenging munis in Texas on the northwest side.' },
  { id:'c9',  name:'Olmos Basin Golf Course',           city:'San Antonio',fee:40, lat:29.4880, lng:-98.4900, photo:null,                     tags:['Municipal'],            blurb:'Oak-lined municipal layout just minutes from downtown San Antonio.' },
  { id:'c10', name:'Tenison Highlands',                 city:'Dallas',     fee:45, lat:32.7940, lng:-96.7330, photo:null,                     tags:['Championship'],         blurb:'Redesigned 7,100-yard championship course — 36 holes, ten minutes from downtown Dallas.' },
  { id:'c11', name:'Stevens Park Golf Course',          city:'Dallas',     fee:40, lat:32.7520, lng:-96.8520, photo:null,                     tags:['Historic'],             blurb:'1924 Kessler Park gem with downtown Dallas views — a true muni bargain.' },
  { id:'c12', name:'Luna Vista Golf Course',            city:'Dallas',     fee:32, lat:32.8720, lng:-96.9340, photo:null,                     tags:['Municipal'],            blurb:'Honest, affordable Dallas muni (formerly L.B. Houston) along the Elm Fork.' },
  { id:'c13', name:'Pecan Valley Golf Course — River',  city:'Fort Worth', fee:40, lat:32.6470, lng:-97.4520, photo:null,                     tags:['River'],                blurb:'Two 18s split by the Trinity River — widely regarded as one of the best munis in Texas.' },
  { id:'c14', name:'Rockwood Park Golf Course',         city:'Fort Worth', fee:35, lat:32.7760, lng:-97.3370, photo:null,                     tags:['Historic'],             blurb:'Fully renovated in 2017 to 7,053 yards — one of the most updated municipal facilities in DFW.' },
  { id:'c15', name:'Meadowbrook Golf Course',           city:'Fort Worth', fee:28, lat:32.7560, lng:-97.2700, photo:null,                     tags:['Municipal'],            blurb:'A John Bredemus original from 1924, renovated in 2025 — rolling East Fort Worth terrain.' },
  { id:'c16', name:'Memorial Park Golf Course',         city:'Houston',    fee:40, lat:29.7640, lng:-95.4340, photo:'assets/courses/c16.jpg', tags:['PGA Tour host','Historic'], blurb:'Widely considered the best muni in Texas — a 1936 classic that now hosts the PGA Tour.' },
  { id:'c17', name:'Gus Wortham Park Golf Course',      city:'Houston',    fee:32, lat:29.7420, lng:-95.3230, photo:null,                     tags:['Historic'],             blurb:'Restored historic muni just east of downtown Houston — scenic and affordable.' },
  { id:'c18', name:'Hermann Park Golf Course',          city:'Houston',    fee:26, lat:29.7170, lng:-95.3900, photo:'assets/courses/c18.jpg', tags:['Municipal','Central'],  blurb:'Historic, central Houston muni — easy to reach and easy on the wallet.' },
  { id:'c19', name:'Sharpstown Park Golf Course',       city:'Houston',    fee:24, lat:29.7000, lng:-95.5100, photo:null,                     tags:['Municipal'],            blurb:'Well-kept, lower-priced Houston muni — a reliable everyday track on the southwest side.' },
];

// Additional courses from the gen-script — approximate city-level coordinates
// id is derived from the gen-script id for linkability
const GEN_COURSES = [
  // San Antonio additional
  { id:'sa-mission-del-lago', name:'Mission del Lago Golf Course', city:'San Antonio', fee:40, latOff:[-.135,-.075], tags:['Municipal'], blurb:'Well-priced South Side muni on the Alamo City Golf Trail, accessible from south San Antonio.' },
  { id:'sa-northern-hills',   name:'Northern Hills Golf Course',   city:'San Antonio', fee:35, latOff:[.09,.04],     tags:['Municipal'], blurb:'Part of the city-run Alamo City Golf Trail — affordable golf on San Antonio\'s north side.' },
  { id:'sa-riverside',        name:'Riverside Golf Course (SA)',   city:'San Antonio', fee:38, latOff:[-0.04,-0.03], tags:['Municipal'], blurb:'Full 18-hole championship layout plus a 9-hole par-3 course just south of downtown San Antonio.' },
  { id:'sa-willow-springs',   name:'Willow Springs Golf Course',   city:'San Antonio', fee:42, latOff:[.02,.06],     tags:['Municipal','Historic'], blurb:'Historically significant east-side Alamo City Golf Trail course — tree-lined, classic design.' },
  // Dallas additional
  { id:'dal-cedar-crest',     name:'Cedar Crest Golf Course',      city:'Dallas',      fee:35, latOff:[-0.10,-0.04], tags:['Municipal','Historic'], blurb:'A historic 1916 A.W. Tillinghast design in south Dallas — one of the oldest munis in Texas.' },
  { id:'dal-keeton-park',     name:'Keeton Park Golf Course',      city:'Dallas',      fee:35, latOff:[.04,.08],     tags:['Municipal'], blurb:'Well-maintained east Dallas muni offering honest, playable golf for every skill level.' },
  { id:'dal-tenison-glen',    name:'Tenison Glen Golf Course',     city:'Dallas',      fee:40, latOff:[.015,.036],   tags:['Municipal'], blurb:'One of two 18-hole courses at Tenison Park — traditional muni experience just minutes from downtown.' },
  // Fort Worth additional
  { id:'fw-pecan-valley-hills', name:'Pecan Valley Golf Course — Hills', city:'Fort Worth', fee:35, latOff:[-.003,.006], tags:['Municipal'], blurb:'The "Hills" layout at Pecan Valley complements the River course — slightly shorter, added in 1982.' },
  // Houston additional
  { id:'hou-glenbrook',       name:'Glenbrook Golf Course',        city:'Houston',     fee:30, latOff:[-0.05,.08],   tags:['Municipal'], blurb:'City of Houston muni on the southeast side — affordable 18-hole layout, reliable everyday round.' },
  { id:'hou-brock-park',      name:'Brock Park Golf Course',       city:'Houston',     fee:38, latOff:[.10,.05],     tags:['Municipal'], blurb:'City of Houston northeast-side muni in Brock Park along Hunting Bayou — welcoming atmosphere.' },
  { id:'hou-melrose-park',    name:'Melrose Park Golf Course',     city:'Houston',     fee:18, latOff:[.16,.00],     tags:['9-hole','Par-3'], blurb:'18-hole par-3 layout in north Houston — ideal for short-game practice and quick affordable rounds.' },
  // El Paso
  { id:'ep-ascarate',         name:'Ascarate Municipal Golf Course', city:'El Paso',   fee:25, latOff:[.04,.07],     tags:['Municipal','9-hole'], blurb:'Accessible 9-hole municipal layout in east El Paso at Ascarate Park — beginner-friendly.' },
  // Lubbock
  { id:'lub-shadow-hills',    name:'Shadow Hills Golf Course',     city:'Lubbock',     fee:35, latOff:[-.04,-.02],   tags:['Public'], blurb:'Well-regarded public course on Lubbock\'s south side — consistent conditions, honest golf.' },
  { id:'lub-rawls',           name:'The Rawls Course at Texas Tech', city:'Lubbock',   fee:55, latOff:[.03,.01],     tags:['Public','Championship'], blurb:'Championship course at Texas Tech — consistently ranked among the best in West Texas.' },
  // Abilene
  { id:'abi-maxwell',         name:'Maxwell Municipal Golf Course', city:'Abilene',    fee:20, latOff:[.02,.03],     tags:['Municipal'], blurb:"Abilene's long-running city golf course — affordable, friendly, open to everyone." },
  { id:'abi-willow-creek',    name:'Willow Creek Golf Center',     city:'Abilene',     fee:18, latOff:[-.02,.02],    tags:['Public'], blurb:'Public golf facility in Abilene — shorter layout well-suited to beginners and casual players.' },
  // Waco
  { id:'wac-cottonwood-creek', name:'Cottonwood Creek Golf Course', city:'Waco',       fee:35, latOff:[.02,.01],     tags:['Public'], blurb:'Pete Dye and Joe Finger design from 1985 — one of the most distinguished public courses in Central Texas.' },
  // Arlington
  { id:'arl-lake-arlington',  name:'Lake Arlington Golf Course',   city:'Arlington',   fee:36, latOff:[-.02,.03],    tags:['Municipal'], blurb:'Classic City of Arlington muni on the shores of Lake Arlington — wide fairways, lake views.' },
  { id:'arl-chester-w-ditto', name:'Chester W. Ditto Golf Course', city:'Arlington',   fee:34, latOff:[.02,-.02],    tags:['Municipal'], blurb:"Arlington's links-influenced muni known for excellent greens and strong value for the area." },
  { id:'arl-tierra-verde',    name:'Tierra Verde Golf Club',       city:'Arlington',   fee:55, latOff:[.04,.04],     tags:['Public','Championship'], blurb:'Championship 18-hole daily-fee course in Arlington with a links-inspired design and full practice facility.' },
  // Plano
  { id:'pla-pecan-hollow',    name:'Pecan Hollow Golf Course',     city:'Plano',       fee:50, latOff:[.01,.01],     tags:['Municipal'], blurb:'One of the finest municipal courses in North Texas — recently renovated, set along Rowlett Creek.' },
  // Irving
  { id:'irv-twin-wells',      name:'Twin Wells Golf Course',       city:'Irving',      fee:40, latOff:[-.01,.01],    tags:['Municipal'], blurb:'36-hole municipal facility in Irving — two distinct layouts near DFW Airport.' },
  // Garland
  { id:'gar-firewheel-old',   name:'Firewheel Golf Park — Old Course', city:'Garland', fee:55, latOff:[-.01,.01],    tags:['Municipal','Top-Rated'], photo:'https://upload.wikimedia.org/wikipedia/commons/3/36/Firewheel_Golf_Park_2.jpg', blurb:'Consistently rated among the top 5 public courses in Texas — hosted the Ben Hogan Tour in the 1990s.' },
  { id:'gar-firewheel-lakes', name:'Firewheel Golf Park — Lakes',  city:'Garland',     fee:55, latOff:[.01,-.01],    tags:['Municipal'], blurb:'Open, water-influenced Lakes layout — paired with the Old Course for 36 holes at the top public facility in northeast DFW.' },
  // Corpus Christi
  { id:'cc-gabe-lozano',      name:'Gabe Lozano Sr. Golf Center',  city:'Corpus Christi', fee:32, latOff:[.03,.02], tags:['Municipal'], blurb:'27-hole municipal complex on Corpus Christi\'s north side — most popular public golf on the Coastal Bend.' },
  { id:'cc-oso-beach',        name:'Oso Beach Municipal Golf Course', city:'Corpus Christi', fee:25, latOff:[-.04,-.02], tags:['Municipal','9-hole'], blurb:'9-hole muni near the water on Corpus Christi\'s south side — one of the most affordable rounds in Coastal Bend Texas.' },
  // McAllen
  { id:'mcal-mcallen-muni',   name:'McAllen Municipal Golf Course', city:'McAllen',    fee:28, latOff:[.01,.01],     tags:['Municipal'], blurb:'Main public golf facility in the Rio Grande Valley — popular winter destination for snowbirds.' },
  // Amarillo
  { id:'ama-ross-rogers',     name:'Ross Rogers Golf Course',      city:'Amarillo',    fee:30, latOff:[-.02,.02],    tags:['Municipal'], blurb:'Beloved 36-hole municipal facility in Amarillo — two 18-hole layouts, excellent conditions in the Panhandle.' },
  { id:'ama-comanche-trail',  name:'Comanche Trail Golf Course',   city:'Amarillo',    fee:28, latOff:[.03,-.02],    tags:['Municipal'], blurb:'Scenic, relaxed alternative city course along Comanche Trail Park — wide open, very walkable.' },
  // Tyler
  { id:'tyl-faulkner-park',   name:'Faulkner Park Golf Course',    city:'Tyler',       fee:30, latOff:[.01,.01],     tags:['Municipal'], blurb:"Tyler's primary muni — tree-lined East Texas layout known for well-manicured conditions." },
  // College Station
  { id:'bcs-pebble-creek',    name:'Pebble Creek Golf Course',     city:'College Station', fee:40, latOff:[.01,.01], tags:['Public'], blurb:'Links-style 18-hole track in College Station — excellent conditions, go-to course for Aggie golfers.' },
  // Midland
  { id:'mid-hogan-park',      name:'Hogan Park Golf Course',       city:'Midland',     fee:28, latOff:[.01,.01],     tags:['Municipal'], blurb:'Named for Ben Hogan — two 18-hole layouts serving the Midland area, the golf hub of West Texas.' },
  // Beaumont
  { id:'bmt-tyrrell-park',    name:'Tyrrell Park Golf Course',     city:'Beaumont',    fee:32, latOff:[.01,.01],     tags:['Municipal','Historic'], blurb:'Opened in 1926 — one of the oldest continuously operated public courses in Texas, a Southeast Texas institution.' },
  // San Marcos
  { id:'smk-springs-hill',    name:'Springs Hill Golf Course',     city:'San Marcos',  fee:35, latOff:[.01,.01],     tags:['Public','Scenic'], blurb:'Beautiful public layout in San Marcos with Hill Country terrain and scenic views between Austin and San Antonio.' },
  // Laredo
  { id:'lrd-casa-blanca',     name:'Casa Blanca Golf Course',      city:'Laredo',      fee:22, latOff:[.01,.01],     tags:['Municipal'], blurb:"Laredo's main public facility adjacent to Casa Blanca Lake — accessible, affordable year-round muni." },
  // Galveston
  { id:'gal-galveston-island', name:'Galveston Island Golf Course', city:'Galveston',  fee:38, latOff:[.01,.01],     tags:['Municipal','Coastal'], blurb:'Only public course on Galveston Island — unique coastal setting with gulf breezes on every hole.' },
  // Killeen
  { id:'kil-skylark-field',   name:'Skylark Field Golf Course',    city:'Killeen',     fee:30, latOff:[.01,.01],     tags:['Public'], blurb:'Straightforward public layout near Fort Cavazos — primary public golf option for the Killeen–Temple area.' },
  // Temple
  { id:'tem-sammons',         name:'Sammons Golf Course',          city:'Temple',      fee:30, latOff:[.01,.01],     tags:['Municipal'], blurb:"Temple's city-run 18-hole muni midway between Waco and Austin — consistent conditions, affordable green fees." },
  // Wichita Falls
  { id:'wf-weeks-park',       name:'Weeks Park Golf Course',       city:'Wichita Falls', fee:28, latOff:[.01,.01],  tags:['Municipal'], blurb:"Wichita Falls' main municipal course in Weeks Park along Holliday Creek — solid, affordable, good greens." },
  // The Colony
  { id:'col-the-tribute',     name:'The Tribute Golf Club',        city:'The Colony',  fee:75, latOff:[.01,.01],     tags:['Public','Scottish Links','Top-Rated'], blurb:'Scottish links-style masterpiece on the shores of Lake Lewisville — consistently ranked top 5 public courses in Texas.' },
  // McKinney
  { id:'mck-tpc-craig-ranch', name:'TPC Craig Ranch',              city:'McKinney',    fee:85, latOff:[.01,.01],     tags:['PGA Tour host','Championship'], photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/TPC_Craig_Ranch%2C_McKinney%2C_Texas.jpg/800px-TPC_Craig_Ranch%2C_McKinney%2C_Texas.jpg', blurb:'Home of the PGA Tour\'s AT&T Byron Nelson — world-class public layout, open to the public year-round.' },
  // Grapevine
  { id:'grv-grapevine-golf',  name:'Grapevine Golf Course — Dove Valley', city:'Grapevine', fee:48, latOff:[.01,.01], tags:['Municipal'], blurb:"City of Grapevine's flagship 18-hole muni — links-influenced layout near DFW Airport, well-maintained." },
  // Round Rock
  { id:'rr-old-settlers-park', name:'Old Settlers Park Golf Course', city:'Round Rock', fee:35, latOff:[-.01,.01],   tags:['Municipal'], blurb:"Round Rock's city-owned 18-hole course in Old Settlers Park — affordable, well-maintained, heavy local play." },
  { id:'rr-teravista',        name:'Teravista Golf Club',           city:'Round Rock',  fee:60, latOff:[.01,-.01],    tags:['Public'], blurb:'18-hole daily-fee course in the Teravista community — rolling Hill Country terrain, long-range views.' },
  // Rowlett
  { id:'row-waterview',       name:'Waterview Golf Club',           city:'Rowlett',     fee:45, latOff:[.01,.01],     tags:['Public','Scenic'], blurb:'Daily-fee course above Lake Ray Hubbard — dramatic elevation changes and memorable finishing holes in Dallas area.' },
  // Cedar Hill
  { id:'ced-cedar-hill',      name:'Cedar Hill Golf Course',        city:'Cedar Hill',  fee:42, latOff:[.01,.01],     tags:['Public'], blurb:'Public 18-hole course in Cedar Hill near Joe Pool Lake — affordable, tree-lined, well-maintained.' },
  // Hurst
  { id:'hst-hurst-hills',     name:'Hurst Hills Golf Course',       city:'Hurst',       fee:35, latOff:[.01,.01],     tags:['Municipal','Par-3'], blurb:'City of Hurst municipal par-3 and 9-hole layout — great for beginners, quick rounds, and short-game practice.' },
  // Denton
  { id:'den-eagle-pointe',    name:'Eagle Pointe Golf Club',        city:'Denton',      fee:38, latOff:[.01,.01],     tags:['Public'], blurb:'Daily-fee 18-hole course in Denton serving the UNT/TWU community and rapidly growing North Texas metro.' },
  // Grand Prairie
  { id:'gp-tangle-ridge',     name:'Tangle Ridge Golf Course',      city:'Grand Prairie', fee:55, latOff:[.01,.01],  tags:['Public','Scenic'], blurb:'One of the most scenic public courses in DFW — dramatic elevation changes, Hill Country-style terrain.' },
  // Rockwall
  { id:'rwk-rockwall',        name:'Rockwall Golf & Athletic Club',  city:'Rockwall',    fee:55, latOff:[.01,.01],    tags:['Public'], blurb:'Well-regarded 18-hole daily-fee course 25 miles east of Dallas on Lake Ray Hubbard.' },
  // Pearland
  { id:'prl-pearland-golf',   name:'Pearland Golf Club at Country Place', city:'Pearland', fee:40, latOff:[.01,.01], tags:['Public'], blurb:'Popular public course in booming Pearland suburb — consistent conditions, easy access from south Houston.' },
  // Sugar Land
  { id:'sul-oyster-creek',    name:'Oyster Creek Golf Course',       city:'Sugar Land',  fee:35, latOff:[.01,.01],    tags:['Municipal'], blurb:"City of Sugar Land's muni along Oyster Creek — accessible 18-hole layout, well-loved by the community." },
  // Cypress
  { id:'cyp-longwood',        name:'Longwood Golf Club',             city:'Cypress',     fee:45, latOff:[.01,.01],    tags:['Public'], blurb:"Beloved daily-fee course on Houston's northwest side — tree-lined, conditions above their price point." },
  // Weslaco
  { id:'wes-tierra-santa',    name:'Tierra Santa Golf Club',         city:'Weslaco',     fee:38, latOff:[.01,.01],    tags:['Public'], blurb:'18-hole daily-fee track in the Rio Grande Valley — championship-length at accessible South Texas pricing.' },
  // New Braunfels
  { id:'nb-landa-park',       name:'Landa Park Golf Course',         city:'New Braunfels', fee:30, latOff:[.01,.01],  tags:['Municipal','Scenic'], blurb:'Scenic Hill Country muni in Landa Park — Comal River views and mature cypress trees lining the fairways.' },
  // Pflugerville
  { id:'pfug-blackhawk',      name:'Blackhawk Golf Club',            city:'Pflugerville', fee:50, latOff:[.01,.01],   tags:['Public'], blurb:'One of the premier public courses in the Austin metro — challenging 18 holes, excellent conditioning.' },
  // Cedar Park
  { id:'cp-twin-creeks',      name:'Twin Creeks Golf Club',          city:'Cedar Park',  fee:55, latOff:[.01,.01],    tags:['Public'], blurb:'Daily-fee 18-hole course in Cedar Park on the northwest Austin metro — genuine test of golf, well-designed holes.' },
  // Conroe
  { id:'con-west-fork',       name:'West Fork Golf Club',            city:'Conroe',      fee:45, latOff:[.01,.01],    tags:['Public'], blurb:'Public 18-hole layout just north of The Woodlands — tree-lined fairways, reasonable pricing for Houston area.' },
  // Baytown
  { id:'bay-baytown',         name:'Evergreen Point Golf Club',      city:'Baytown',     fee:32, latOff:[.01,.01],    tags:['Public'], blurb:'18-hole daily-fee course in Baytown — scenic, walkable, one of the better-value rounds on Houston\'s east side.' },
  // Friendswood
  { id:'flk-friendswood',     name:'Friendswood Golf Club',          city:'Friendswood', fee:40, latOff:[.01,.01],    tags:['Public'], blurb:'Well-maintained 18-hole public course in one of Houston\'s most desirable south suburbs — solid daily-fee experience.' },
  // Lake Jackson
  { id:'lkj-lake-jackson',    name:'Lake Jackson Golf Course',       city:'Lake Jackson', fee:32, latOff:[.01,.01],   tags:['Municipal'], blurb:'Main public golf facility in Brazoria County — consistent 18-hole muni serving the Gulf Coast community.' },
  // Missouri City
  { id:'moc-missouri-city',   name:'Missouri City Golf Course',      city:'Missouri City', fee:35, latOff:[.01,.01],  tags:['Municipal'], blurb:'Fort Bend County public 18-hole layout southwest of Houston — reliable muni golf without the crowds.' },
  // Pasadena
  { id:'pas-muni',            name:'Pasadena Municipal Golf Course', city:'Pasadena',    fee:28, latOff:[.01,.01],    tags:['Municipal'], blurb:"City of Pasadena's accessible 18-hole public course in the Houston Ship Channel area — affordable, well-run." },
  // Georgetown
  { id:'geo-georgetown-muni', name:'Georgetown Golf Course',         city:'Georgetown',  fee:35, latOff:[.01,.01],    tags:['Municipal'], blurb:"Georgetown's city-run public facility — accessible, affordable 18-hole layout north of the historic downtown square." },
  // Hutto
  { id:'hut-star-ranch',      name:'Star Ranch Golf Club',           city:'Hutto',       fee:65, latOff:[.01,.01],    tags:['Public'], blurb:'Highly rated 18-hole daily-fee course in Hutto — links-influenced design, consistently strong reviews in Austin area.' },
  // Austin additional
  { id:'aus-avery-ranch',     name:'Avery Ranch Golf Club',          city:'Austin',      fee:65, latOff:[.18,-.05],   tags:['Public'], blurb:'Popular daily-fee course in north Austin — challenging 18 holes, consistent conditions, full practice facility.' },
  // Odessa
  { id:'ods-odessa',          name:'Ratliff Ranch Golf Links',       city:'Odessa',      fee:32, latOff:[.01,.01],    tags:['Public'], blurb:'Best public golf in the Permian Basin — excellent conditions, welcoming atmosphere for Odessa and Midland golfers.' },
  // Mineral Wells
  { id:'mw-mineral-wells',    name:'Mineral Wells Golf Course',      city:'Mineral Wells', fee:22, latOff:[.01,.01],  tags:['Public'], blurb:'Classic small-city golf course in Mineral Wells — affordable, walkable layout with character built over generations.' },
  // Weatherford
  { id:'wfd-weatherford',     name:'Weatherford Golf Club',          city:'Weatherford', fee:30, latOff:[.01,.01],    tags:['Public'], blurb:"Weatherford's go-to public course — accessible 18-hole layout west of Fort Worth in rolling Parker County terrain." },
  // Granbury
  { id:'grb-granbury',        name:'Granbury Country Club',          city:'Granbury',    fee:38, latOff:[.01,.01],    tags:['Public'], blurb:'Semi-private course open to daily-fee play on the shores of Lake Granbury — Hill Country-influenced with lake views.' },
  // Stephenville
  { id:'stp-stephenville',    name:'Stephenville Golf Course',       city:'Stephenville', fee:25, latOff:[.01,.01],   tags:['Municipal'], blurb:'Public course serving Stephenville (Tarleton State) — friendly, affordable 9-hole muni in the Cross Timbers region.' },
  // Pampa
  { id:'pam-pampa',           name:'Pampa Municipal Golf Course',    city:'Pampa',       fee:20, latOff:[.01,.01],    tags:['Municipal'], blurb:'Panhandle city muni — flat, wide-open 18-hole layout using the Panhandle terrain, affordable and friendly.' },
  // Lufkin
  { id:'luf-lufkin',          name:'Lufkin Municipal Golf Course',   city:'Lufkin',      fee:28, latOff:[.01,.01],    tags:['Municipal'], blurb:'Well-maintained city course in the heart of East Texas — tree-lined, lush fairways, tall pines, welcoming hospitality.' },
  // Longview
  { id:'lng-longview',        name:'Alpine Golf Course',             city:'Longview',    fee:32, latOff:[.01,.01],    tags:['Public'], blurb:"Longview's main public facility — tree-lined, reasonably priced, loyal following among East Texas golfers." },
  // Nacogdoches
  { id:'nac-nacogdoches',     name:'Woodland Hills Golf Course',     city:'Nacogdoches', fee:28, latOff:[.01,.01],    tags:['Public'], blurb:'Scenic 18-hole daily-fee course in the oldest city in Texas — affordable East Texas golf at Nacogdoches.' },
  // Marshall
  { id:'mar-marshall',        name:'Marshall Municipal Golf Course', city:'Marshall',    fee:25, latOff:[.01,.01],    tags:['Municipal'], blurb:"Marshall's city-run public course serving the Caddo Lake area — classic, affordable layout in deep East Texas." },
  // Palestine
  { id:'plt-palestine',       name:'Palestine Country Club',         city:'Palestine',   fee:28, latOff:[.01,.01],    tags:['Public'], blurb:'Semi-public daily-fee course in Palestine — wooded, rolling terrain, one of the most scenic small-city experiences in Texas.' },
  // Sulphur Springs
  { id:'ssp-sulphur-springs', name:'Sulphur Springs Golf Course',    city:'Sulphur Springs', fee:25, latOff:[.01,.01], tags:['Public'], blurb:'Public 18-hole layout in Sulphur Springs — affordable and well-maintained, primary public option in Northeast Texas.' },
  // Brownsville
  { id:'bro-brownsville',     name:'Brownsville Municipal Golf Course', city:'Brownsville', fee:28, latOff:[.01,.01], tags:['Municipal'], blurb:"City of Brownsville's public course at the southern tip of Texas — year-round play, palm trees, border community golf." },
  // Henderson
  { id:'hen-henderson',       name:'Henderson Golf Course',          city:'Henderson',   fee:22, latOff:[.01,.01],    tags:['Municipal'], blurb:"Rusk County's public golf in Henderson — affordable community course defining small-town Texas golf for decades." },
  // Victoria
  { id:'vic-victoria-muni',   name:'Victoria Municipal Golf Course', city:'Victoria',    fee:28, latOff:[.01,.01],    tags:['Municipal'], blurb:'City of Victoria public course serving the Golden Crescent region — consistent, accessible, affordable muni.' },
];

// ── Build final output ──────────────────────────────────────────────────────
const cityCounters = {};

function allocCoords(c) {
  const base = CITY_COORDS[c.city];
  if (!base) {
    console.warn(`No coords for city: ${c.city}`);
    return { lat: 31.0, lng: -100.0 };
  }
  if (c.latOff) {
    return { lat: +(base.lat + c.latOff[0]).toFixed(4), lng: +(base.lng + c.latOff[1]).toFixed(4) };
  }
  return { lat: base.lat, lng: base.lng };
}

const allCourses = [
  ...EXACT_COURSES.map(c => ({
    ...c,
    region: region(c.city),
    partner: false,
    citySlug: c.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,'') + '-tx',
  })),
  ...GEN_COURSES.map(c => {
    const coords = allocCoords(c);
    const { latOff, ...rest } = c;
    return {
      ...rest,
      lat: coords.lat,
      lng: coords.lng,
      region: region(c.city),
      partner: false,
      photo: c.photo || null,
      citySlug: c.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,'') + '-tx',
    };
  }),
];

// Build JS output
const js = `/* TrackPass — full Texas public course directory (single source of truth)
 * Generated by scripts/build-courses-data.js
 *
 * DATA ACCURACY: only confirmed real public/municipal courses. Coordinates are
 * exact for the 19 featured courses, city-approximate for the rest.
 * partner:true ONLY when a real partner deal is signed.
 * Policy: partner = 2 free rounds/yr/course. Out-of-network = 1 free round/yr/course.
 */
window.TRACKPASS_COURSES = ${JSON.stringify(allCourses, null, 2)};
`;

const outPath = path.join(__dirname, '..', 'assets', 'courses-data.js');
fs.writeFileSync(outPath, js);
console.log(`Written ${allCourses.length} courses to assets/courses-data.js`);

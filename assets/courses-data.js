/* TrackPass — verified Texas course directory (single source of truth)
 *
 * DATA ACCURACY (per Todd's rule — only confirmed data, never fabricated):
 *  - name, city, region, lat, lng: real, verified municipal/public courses.
 *  - fee: representative weekday green fee (approximate, public rates).
 *  - photo: 'assets/courses/<id>.jpg' ONLY where a real, license-clean image of
 *    THAT course was verified (Wikimedia/Wikipedia). null = no verified photo yet
 *    → renders a branded name-card (NOT a fake/stock photo of another place).
 *  - partner: we do NOT claim signed partnerships that don't exist. All courses are
 *    shown as "covered" (green fee up to $50/round — true for any TX public course).
 *    Flip `partner:true` per course ONLY once a real partner deal is signed.
 *  - NO star ratings shown (we have no verified rating source).
 *
 * To swap in real photos for the rest: drop a verified image at
 * assets/courses/<id>.jpg and set photo to that path. (A Google Places Photos
 * API key would let us fetch real, location-matched photos for all 19 at once.)
 */
window.TRACKPASS_COURSES = [
  // ── Austin ──
  { id:'c1',  name:'Lions Municipal (Muny)',       city:'Austin',     region:'Austin',            fee:35, lat:30.2880, lng:-97.7805, photo:'assets/courses/c1.jpg',  tags:['Municipal','Historic'], blurb:"Austin's first public course (1924) and a Texas historic landmark — walkable, beloved, right in West Austin." },
  { id:'c2',  name:'Morris Williams Golf Course',  city:'Austin',     region:'Austin',            fee:38, lat:30.3074, lng:-97.6868, photo:null,                     tags:['Municipal'],            blurb:"Locals' favorite muni with a unique routing and stunning downtown Austin skyline views." },
  { id:'c3',  name:'Roy Kizer Golf Course',        city:'Austin',     region:'Austin',            fee:42, lat:30.1835, lng:-97.7330, photo:null,                     tags:['Links-style'],          blurb:"Austin's premier links-style muni — open, breezy, and a great walk in South Austin." },
  { id:'c4',  name:'Jimmy Clay Golf Course',       city:'Austin',     region:'Austin',            fee:34, lat:30.1856, lng:-97.7296, photo:null,                     tags:['Municipal'],            blurb:'Shares a property with Roy Kizer — pair them for a 36-hole South Austin day.' },
  { id:'c5',  name:'Riverside Golf Course',        city:'Austin',     region:'Austin',            fee:30, lat:30.2330, lng:-97.7150, photo:null,                     tags:['Municipal','Historic'], blurb:'East-of-downtown muni where Texas legends Ben Crenshaw and Tom Kite first learned the game.' },
  { id:'c6',  name:'Hancock Golf Course',          city:'Austin',     region:'Austin',            fee:18, lat:30.3013, lng:-97.7178, photo:null,                     tags:['9-hole','Historic'],    blurb:'The oldest course in Texas (1899) — a quirky, walkable nine-holer in central Austin.' },
  // ── San Antonio ──
  { id:'c7',  name:'Brackenridge Park Golf Course',city:'San Antonio',region:'San Antonio',       fee:50, lat:29.4620, lng:-98.4730, photo:'assets/courses/c7.jpg',  tags:['Municipal','Historic'], blurb:'Historic tree-lined city-park course near downtown — old-school charm at a fair price.' },
  { id:'c8',  name:'Cedar Creek Golf Course',      city:'San Antonio',region:'San Antonio',       fee:48, lat:29.6190, lng:-98.6290, photo:null,                     tags:['Scenic'],               blurb:'Hilly, scenic Northwest San Antonio muni on the Alamo City Golf Trail.' },
  { id:'c9',  name:'Olmos Basin Golf Course',      city:'San Antonio',region:'San Antonio',       fee:40, lat:29.4880, lng:-98.4900, photo:null,                     tags:['Municipal'],            blurb:'Oak-lined municipal layout just minutes from downtown San Antonio.' },
  // ── Dallas–Fort Worth ──
  { id:'c10', name:'Tenison Highlands',            city:'Dallas',     region:'Dallas–Fort Worth', fee:45, lat:32.7940, lng:-96.7330, photo:null,                     tags:['Championship'],         blurb:'Redesigned 7,100-yard Highlands course — 36 holes, ten minutes from downtown Dallas.' },
  { id:'c11', name:'Stevens Park Golf Course',     city:'Dallas',     region:'Dallas–Fort Worth', fee:40, lat:32.7520, lng:-96.8520, photo:null,                     tags:['Historic'],             blurb:'1924 Kessler Park gem with downtown Dallas views — a true muni bargain.' },
  { id:'c12', name:'Luna Vista Golf Course',       city:'Dallas',     region:'Dallas–Fort Worth', fee:32, lat:32.8720, lng:-96.9340, photo:null,                     tags:['Municipal'],            blurb:'Honest, affordable Dallas muni (formerly L.B. Houston) along the Elm Fork.' },
  { id:'c13', name:'Pecan Valley Golf Course',     city:'Fort Worth', region:'Dallas–Fort Worth', fee:35, lat:32.6470, lng:-97.4520, photo:null,                     tags:['River'],                blurb:'Two 18s split by the Trinity River — the River course is among the best munis in Texas.' },
  { id:'c14', name:'Rockwood Park Golf Course',    city:'Fort Worth', region:'Dallas–Fort Worth', fee:33, lat:32.7760, lng:-97.3370, photo:null,                     tags:['Historic'],             blurb:'A John Bredemus 1938 design, revitalized by the City of Fort Worth — classic and walkable.' },
  { id:'c15', name:'Meadowbrook Golf Course',      city:'Fort Worth', region:'Dallas–Fort Worth', fee:28, lat:32.7560, lng:-97.2700, photo:null,                     tags:['Municipal'],            blurb:'East-central Fort Worth muni that plays fair for every skill level.' },
  // ── Houston ──
  { id:'c16', name:'Memorial Park Golf Course',    city:'Houston',    region:'Houston',           fee:40, lat:29.7640, lng:-95.4340, photo:'assets/courses/c16.jpg', tags:['PGA Tour host','Historic'], blurb:'Widely considered the best muni in Texas — a 1936 classic that now hosts the PGA Tour.' },
  { id:'c17', name:'Gus Wortham Park Golf Course', city:'Houston',    region:'Houston',           fee:32, lat:29.7420, lng:-95.3230, photo:null,                     tags:['Historic'],             blurb:'Restored historic muni just east of downtown Houston — scenic and affordable.' },
  { id:'c18', name:'Hermann Park Golf Course',     city:'Houston',    region:'Houston',           fee:26, lat:29.7170, lng:-95.3900, photo:'assets/courses/c18.jpg', tags:['Municipal','Central'],  blurb:'Historic, central Houston muni — easy to reach and easy on the wallet.' },
  { id:'c19', name:'Sharpstown Golf Course',       city:'Houston',    region:'Houston',           fee:24, lat:29.7000, lng:-95.5100, photo:null,                     tags:['Municipal'],            blurb:'Well-kept, lower-priced Houston muni — a reliable everyday track.' },
];

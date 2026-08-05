/*
 * The client roster, shared by the homepage marquee and the clients page wall.
 *
 * Logos sit directly on the page background — no tile, no plate. Files come
 * from `Clients/trimmed`, where the transparent margin baked into each export
 * has been cropped off and the artwork capped at 400px; the raw files in
 * `Clients/` are the untouched originals and are not shipped.
 *
 * `scale` is the render height as a fraction of the logo box, derived from the
 * trimmed aspect ratio so every logo covers the same *area*. Sizing on height
 * alone would make a wide lockup like AliiKai tower over a square mark; equal
 * area is what actually reads as "the same size" on a logo wall.
 *
 * Keep these filenames URL-safe. A static import ships the name straight into
 * the asset URL, and Vercel's edge decodes a `+` in the path as a space — the
 * AliiKai logo was `Full Logo Orange+100.png` and 404'd in production while
 * working locally, because `next dev` serves off the filesystem and never
 * normalises the path.
 *
 * `block` marks the four logos whose artwork is its own opaque colour square
 * (no transparency in the source). Those render with rounded corners so the
 * square reads as a deliberate tile rather than a hard-edged crop.
 */
import Ashirwada from '@/assets/Clients/trimmed/Ashirwada .png';
import AliiKai from '@/assets/Clients/trimmed/aliikai.png';
import PNutty from '@/assets/Clients/trimmed/P Nutty logo new.png';
import SDFitness from '@/assets/Clients/trimmed/SD Fitness logo.jpg.jpg';
import SamanthaMotors from '@/assets/Clients/trimmed/SmanthaMotors.png';
import SriDhananjaya from '@/assets/Clients/trimmed/Sri_Dhananjaya_Travels___Tours_Logo_page-0001-removebg-preview.png';
import TataMotors from '@/assets/Clients/trimmed/TATA Vehicles PV logo.jpg';
import YooBoba from '@/assets/Clients/trimmed/Yoo Boba Logo W.png';
import Rupavahini from '@/assets/Clients/trimmed/jathika_rupavahini-removebg-preview.png';
import VioraCollection from '@/assets/Clients/trimmed/viora collection 3.png';

/* `name` never renders as a label — it is the alt text the logo stands in for. */
export const clients = [
  { name: 'Yoo Boba', logo: YooBoba.src, scale: 0.71 },
  { name: 'AliiKai', logo: AliiKai.src, scale: 0.34 },
  { name: 'Pnutty', logo: PNutty.src, scale: 0.65 },
  { name: 'Viora Collection', logo: VioraCollection.src, scale: 0.73, block: true },
  { name: 'Samantha Motor Traders', logo: SamanthaMotors.src, scale: 0.52 },
  { name: 'TATA Motors Passenger Vehicles', logo: TataMotors.src, scale: 0.73, block: true },
  { name: 'Sri Dhananjaya Travels & Tours', logo: SriDhananjaya.src, scale: 0.45 },
  { name: 'Rupavahini', logo: Rupavahini.src, scale: 0.68 },
  { name: 'Ashirwada', logo: Ashirwada.src, scale: 0.73, block: true },
  { name: 'SD Fitness', logo: SDFitness.src, scale: 0.73, block: true },
];

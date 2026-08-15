import type { FrameConfig } from "./types";

// Helper to encode SVG to data URI
function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

// 1. Frame: Merah Putih 4-Strip Klasik (HUT RI ke-81)
const frame1Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1800" width="600" height="1800">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Anton&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .font-anton { font-family: 'Anton', Impact, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
    </style>
  </defs>

  <!-- Background Base Canvas with Cutout Holes -->
  <!-- Top Header Banner -->
  <rect x="0" y="0" width="600" height="130" fill="#DC2626" />
  <rect x="0" y="122" width="600" height="8" fill="#18181B" />
  
  <!-- Left, Right, and Center Dividers -->
  <rect x="0" y="130" width="40" height="1510" fill="#18181B" />
  <rect x="560" y="130" width="40" height="1510" fill="#18181B" />
  <rect x="40" y="480" width="520" height="30" fill="#18181B" />
  <rect x="40" y="860" width="520" height="30" fill="#18181B" />
  <rect x="40" y="1240" width="520" height="30" fill="#18181B" />
  
  <!-- Bottom Footer Area -->
  <rect x="0" y="1640" width="600" height="160" fill="#18181B" />
  
  <!-- Slot Outer Stroke Borders -->
  <rect x="40" y="130" width="520" height="350" fill="none" stroke="#FFFFFF" stroke-width="6" />
  <rect x="40" y="510" width="520" height="350" fill="none" stroke="#FFFFFF" stroke-width="6" />
  <rect x="40" y="890" width="520" height="350" fill="none" stroke="#FFFFFF" stroke-width="6" />
  <rect x="40" y="1270" width="520" height="350" fill="none" stroke="#FFFFFF" stroke-width="6" />

  <!-- Top Header Graphics -->
  <!-- Flag Badge -->
  <rect x="25" y="25" width="60" height="40" fill="#FFFFFF" rx="4" />
  <rect x="25" y="25" width="60" height="20" fill="#DC2626" />
  <rect x="25" y="25" width="60" height="40" fill="none" stroke="#18181B" stroke-width="3" rx="4" />

  <text x="100" y="55" class="font-anton" font-size="34" fill="#FFFFFF" letter-spacing="2">HUT RI KE-81</text>
  <text x="100" y="88" class="font-sans" font-size="14" fill="#FEF08A" letter-spacing="3">17 AGUSTUS 2026</text>

  <!-- Circular 81 Badge -->
  <circle cx="530" cy="65" r="42" fill="#FEF08A" stroke="#18181B" stroke-width="4" />
  <text x="530" y="75" class="font-anton" font-size="36" fill="#18181B" text-anchor="middle">81</text>
  <text x="530" y="92" class="font-sans" font-size="9" fill="#DC2626" text-anchor="middle">TAHUN</text>

  <!-- Middle Accents -->
  <circle cx="300" cy="495" r="8" fill="#DC2626" />
  <circle cx="300" cy="875" r="8" fill="#DC2626" />
  <circle cx="300" cy="1255" r="8" fill="#DC2626" />

  <!-- Footer Information -->
  <rect x="30" y="1655" width="540" height="4" fill="#DC2626" />
  <text x="300" y="1695" class="font-anton" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">INDONESIA BERDAULAT, ADIL, DAN MAKMUR</text>
  <text x="300" y="1735" class="font-sans" font-size="16" fill="#FEF08A" text-anchor="middle" letter-spacing="4">PESTA RAKYAT PESONA CILEBUT 1</text>
  <text x="300" y="1765" class="font-sans" font-size="12" fill="#A1A1AA" text-anchor="middle" letter-spacing="3">RT 01 / RW 08 • DIRGAHAYU REPUBLIK INDONESIA</text>
</svg>
`;

// 2. Frame: Koran Proklamasi Vintage (3-Strip Editorial)
const frame2Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1600" width="800" height="1600">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Anton&amp;family=Playfair+Display:ital,wght@0,700;1,700&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .font-anton { font-family: 'Anton', Impact, sans-serif; }
      .font-serif { font-family: 'Playfair Display', serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
    </style>
  </defs>

  <!-- Parchment Vintage Top & Side Frames -->
  <rect x="0" y="0" width="800" height="210" fill="#F4EFE6" />
  <rect x="0" y="210" width="60" height="1230" fill="#F4EFE6" />
  <rect x="740" y="210" width="60" height="1230" fill="#F4EFE6" />
  <rect x="60" y="590" width="680" height="40" fill="#F4EFE6" />
  <rect x="60" y="1010" width="680" height="40" fill="#F4EFE6" />
  <rect x="0" y="1430" width="800" height="170" fill="#F4EFE6" />

  <!-- Outer Frame Border -->
  <rect x="15" y="15" width="770" height="1570" fill="none" stroke="#18181B" stroke-width="6" />
  <rect x="25" y="25" width="750" height="1550" fill="none" stroke="#18181B" stroke-width="2" />

  <!-- Slot Borders -->
  <rect x="60" y="210" width="680" height="380" fill="none" stroke="#18181B" stroke-width="5" />
  <rect x="60" y="630" width="680" height="380" fill="none" stroke="#18181B" stroke-width="5" />
  <rect x="60" y="1050" width="680" height="380" fill="none" stroke="#18181B" stroke-width="5" />

  <!-- Header Content -->
  <text x="400" y="65" class="font-serif" font-size="16" font-style="italic" fill="#18181B" text-anchor="middle" letter-spacing="4">EDISI KHUSUS HARI KEMERDEKAAN • SENIN, 17 AGUSTUS 2026</text>
  <line x1="40" y1="80" x2="760" y2="80" stroke="#18181B" stroke-width="4" />
  <line x1="40" y1="86" x2="760" y2="86" stroke="#18181B" stroke-width="1.5" />
  
  <text x="400" y="145" class="font-anton" font-size="62" fill="#DC2626" text-anchor="middle" letter-spacing="4">PROKLAMASI 81 TAHUN</text>
  <text x="400" y="185" class="font-serif" font-size="18" font-weight="700" fill="#18181B" text-anchor="middle" letter-spacing="3">"INDONESIA BERDAULAT, ADIL, DAN MAKMUR"</text>
  
  <line x1="40" y1="200" x2="760" y2="200" stroke="#18181B" stroke-width="3" />

  <!-- Divider Text in Slot Bars -->
  <text x="400" y="615" class="font-sans" font-size="12" fill="#DC2626" text-anchor="middle" letter-spacing="3">★ MERDEKA ATAU MATI • 1945 - 2026 ★</text>
  <text x="400" y="1035" class="font-sans" font-size="12" fill="#DC2626" text-anchor="middle" letter-spacing="3">★ PERSATUAN WARGA PESONA CILEBUT 1 ★</text>

  <!-- Footer Content -->
  <line x1="40" y1="1440" x2="760" y2="1440" stroke="#18181B" stroke-width="3" />
  <text x="400" y="1490" class="font-anton" font-size="34" fill="#18181B" text-anchor="middle" letter-spacing="3">PESTA RAKYAT PESONA CILEBUT 1</text>
  <text x="400" y="1530" class="font-serif" font-size="15" font-style="italic" fill="#52525B" text-anchor="middle">"Perjuanganku lebih mudah karena mengusir penjajah, perjuanganmu akan lebih sulit karena melawan bangsamu sendiri."</text>
  <text x="400" y="1560" class="font-sans" font-size="12" fill="#DC2626" text-anchor="middle" letter-spacing="4">— IR. SOEKARNO —</text>
</svg>
`;

// 3. Frame: Pesta Rakyat & Lomba 17-an (Ceria Merah Putih)
const frame3Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1800" width="600" height="1800">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Anton&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .font-anton { font-family: 'Anton', Impact, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
    </style>
  </defs>

  <!-- Red Base Frame -->
  <rect x="0" y="0" width="600" height="140" fill="#DC2626" />
  <rect x="0" y="140" width="45" height="1480" fill="#DC2626" />
  <rect x="555" y="140" width="45" height="1480" fill="#DC2626" />
  <rect x="45" y="480" width="510" height="30" fill="#DC2626" />
  <rect x="45" y="850" width="510" height="30" fill="#DC2626" />
  <rect x="45" y="1220" width="510" height="30" fill="#DC2626" />
  <rect x="0" y="1590" width="600" height="210" fill="#DC2626" />

  <!-- Slot Cutouts Borders -->
  <rect x="45" y="140" width="510" height="340" fill="none" stroke="#FFFFFF" stroke-width="8" />
  <rect x="45" y="510" width="510" height="340" fill="none" stroke="#FFFFFF" stroke-width="8" />
  <rect x="45" y="880" width="510" height="340" fill="none" stroke="#FFFFFF" stroke-width="8" />
  <rect x="45" y="1250" width="510" height="340" fill="none" stroke="#FFFFFF" stroke-width="8" />

  <!-- Triangular Festive Buntings on Top -->
  <polygon points="45,0 85,35 125,0" fill="#FFFFFF" />
  <polygon points="125,0 165,35 205,0" fill="#FEF08A" />
  <polygon points="205,0 245,35 285,0" fill="#FFFFFF" />
  <polygon points="285,0 325,35 365,0" fill="#FEF08A" />
  <polygon points="365,0 405,35 445,0" fill="#FFFFFF" />
  <polygon points="445,0 485,35 525,0" fill="#FEF08A" />
  <polygon points="525,0 555,35 555,0" fill="#FFFFFF" />

  <!-- Top Title -->
  <text x="300" y="85" class="font-anton" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">PESTA RAKYAT 17-AN</text>
  <text x="300" y="120" class="font-sans" font-size="14" fill="#FEF08A" text-anchor="middle" letter-spacing="4">PESONA CILEBUT 1 • 2026</text>

  <!-- Footer Celebration Content -->
  <rect x="45" y="1610" width="510" height="80" fill="#18181B" rx="8" stroke="#FFFFFF" stroke-width="3" />
  <text x="300" y="1650" class="font-anton" font-size="30" fill="#FEF08A" text-anchor="middle" letter-spacing="2">★ JUARA SEMANGAT 17-AN ★</text>
  <text x="300" y="1675" class="font-sans" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">INDONESIA BERDAULAT, ADIL, DAN MAKMUR</text>
  
  <text x="300" y="1730" class="font-anton" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">DIRGAHAYU REPUBLIK INDONESIA</text>
  <text x="300" y="1760" class="font-sans" font-size="14" fill="#FEF08A" text-anchor="middle" letter-spacing="4">KE-81 TAHUN MERDEKA!</text>
</svg>
`;

// 4. Frame: Modern Neo-Brutalist Independence (3-Strip Bold)
const frame4Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1600" width="900" height="1600">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Anton&amp;family=Plus+Jakarta+Sans:wght@800&amp;display=swap');
      .font-anton { font-family: 'Anton', Impact, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
    </style>
  </defs>

  <!-- Black Neo-Brutalist Frame -->
  <rect x="0" y="0" width="900" height="160" fill="#18181B" />
  <rect x="0" y="160" width="60" height="1280" fill="#18181B" />
  <rect x="840" y="160" width="60" height="1280" fill="#18181B" />
  <rect x="60" y="580" width="780" height="40" fill="#18181B" />
  <rect x="60" y="1040" width="780" height="40" fill="#18181B" />
  <rect x="0" y="1440" width="900" height="160" fill="#18181B" />

  <!-- Slot Cutouts Borders -->
  <rect x="60" y="160" width="780" height="420" fill="none" stroke="#DC2626" stroke-width="8" />
  <rect x="60" y="620" width="780" height="420" fill="none" stroke="#DC2626" stroke-width="8" />
  <rect x="60" y="1080" width="780" height="420" fill="none" stroke="#DC2626" stroke-width="8" />

  <!-- Top Brutalist Header -->
  <rect x="25" y="25" width="220" height="60" fill="#DC2626" stroke="#FFFFFF" stroke-width="4" />
  <text x="135" y="68" class="font-anton" font-size="34" fill="#FFFFFF" text-anchor="middle">HUT RI #81</text>

  <rect x="260" y="25" width="615" height="60" fill="#FEF08A" stroke="#FFFFFF" stroke-width="4" />
  <text x="567" y="66" class="font-anton" font-size="28" fill="#18181B" text-anchor="middle" letter-spacing="2">INDONESIA BERDAULAT, ADIL, DAN MAKMUR</text>
  <text x="450" y="130" class="font-sans" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">PESTA RAKYAT PESONA CILEBUT 1 • 17 AGUSTUS 2026</text>

  <!-- Divider Badges -->
  <rect x="360" y="590" width="180" height="22" fill="#DC2626" rx="4" />
  <text x="450" y="606" class="font-sans" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">MERDEKA SEJATI</text>

  <rect x="360" y="1050" width="180" height="22" fill="#DC2626" rx="4" />
  <text x="450" y="1066" class="font-sans" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">PESONA CILEBUT 1</text>

  <!-- Footer -->
  <text x="450" y="1510" class="font-anton" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">DIRGAHAYU INDONESIA KE-81</text>
  <text x="450" y="1550" class="font-sans" font-size="14" fill="#FEF08A" text-anchor="middle" letter-spacing="4">17 AGUSTUS 1945 — 17 AGUSTUS 2026</text>
</svg>
`;

export const FRAMES_CONFIG: FrameConfig[] = [
  {
    id: "frame-hutri81-classic",
    name: "Merah Putih 4-Strip (HUT RI 81)",
    src: createSvgDataUri(frame1Svg),
    thumbnail: createSvgDataUri(frame1Svg),
    canvasWidth: 600,
    canvasHeight: 1800,
    slots: [
      { x: 40, y: 130, width: 520, height: 350 },
      { x: 40, y: 510, width: 520, height: 350 },
      { x: 40, y: 890, width: 520, height: 350 },
      { x: 40, y: 1270, width: 520, height: 350 }
    ],
    watermark: {
      logo: "",
      text: "",
      position: "bottom-global"
    }
  },
  {
    id: "frame-proklamasi-newspaper",
    name: "Koran Proklamasi Retro (3-Foto)",
    src: createSvgDataUri(frame2Svg),
    thumbnail: createSvgDataUri(frame2Svg),
    canvasWidth: 800,
    canvasHeight: 1600,
    slots: [
      { x: 60, y: 210, width: 680, height: 380 },
      { x: 60, y: 630, width: 680, height: 380 },
      { x: 60, y: 1050, width: 680, height: 380 }
    ],
    watermark: {
      logo: "",
      text: "",
      position: "bottom-global"
    }
  },
  {
    id: "frame-pesta-rakyat-4strip",
    name: "Pesta Rakyat & Lomba 17-an (4-Foto)",
    src: createSvgDataUri(frame3Svg),
    thumbnail: createSvgDataUri(frame3Svg),
    canvasWidth: 600,
    canvasHeight: 1800,
    slots: [
      { x: 45, y: 140, width: 510, height: 340 },
      { x: 45, y: 510, width: 510, height: 340 },
      { x: 45, y: 880, width: 510, height: 340 },
      { x: 45, y: 1250, width: 510, height: 340 }
    ],
    watermark: {
      logo: "",
      text: "",
      position: "bottom-global"
    }
  },
  {
    id: "frame-modern-brutalist",
    name: "Modern Neo-Brutalist (3-Foto)",
    src: createSvgDataUri(frame4Svg),
    thumbnail: createSvgDataUri(frame4Svg),
    canvasWidth: 900,
    canvasHeight: 1600,
    slots: [
      { x: 60, y: 160, width: 780, height: 420 },
      { x: 60, y: 620, width: 780, height: 420 },
      { x: 60, y: 1080, width: 780, height: 420 }
    ],
    watermark: {
      logo: "",
      text: "",
      position: "bottom-global"
    }
  }
];

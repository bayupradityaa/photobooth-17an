<template>
  <div v-if="!isStudioActive" class="min-h-screen text-secondary relative flex flex-col justify-between overflow-x-hidden bg-[#FDFBF7]"
       style="background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px); background-size: 24px 24px;">
    
    <!-- Top Running Marquee Kemerdekaan -->
    <div class="bg-primary text-white border-b-4 border-black py-2.5 overflow-hidden select-none relative z-20">
      <div class="flex whitespace-nowrap animate-marquee font-display text-sm sm:text-base tracking-widest uppercase">
        <span v-for="i in 3" :key="i" class="mx-4 flex items-center gap-3">
          <Flag class="w-4 h-4 fill-white" />
          <span>DIRGAHAYU REPUBLIK INDONESIA KE-81</span>
          <span class="text-gold-light">★</span>
          <span>INDONESIA BERDAULAT, ADIL, DAN MAKMUR</span>
          <span class="text-gold-light">★</span>
          <span>PESTA RAKYAT PESONA CILEBUT 1</span>
          <span class="text-gold-light">★</span>
          <span>SENIN, 17 AGUSTUS 2026</span>
        </span>
      </div>
    </div>

    <!-- Top Navigation Bar -->
    <nav class="max-w-6xl w-full mx-auto px-4 pt-4 sm:pt-6 flex justify-between items-center z-10">
      <div class="flex items-center gap-2.5 sm:gap-3.5">
        <img src="/logomerah81.png" alt="Logo HUT RI ke-81" class="h-10 sm:h-14 w-auto object-contain" />
        <div class="border-l-3 border-black pl-2.5 sm:pl-3.5">
          <p class="font-display text-base sm:text-lg uppercase leading-tight tracking-wider text-black">Pesona Cilebut 1</p>
          <p class="font-sans text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest">Peringatan 17 Agustus 2026</p>
        </div>
      </div>
    </nav>

    <!-- Header Hero Section -->
    <header class="text-center pt-6 pb-2 px-4 flex flex-col items-center z-10 max-w-4xl mx-auto">
      <div class="inline-flex items-center gap-2 bg-gold-light border-3 border-black px-3 sm:px-4 py-1 mb-3 sm:mb-4 shadow-brutal-sm">
        <Flag class="w-3.5 h-3.5 text-primary fill-primary animate-bounce" />
        <span class="font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wider text-black">
          Pesta Kemerdekaan RI ke-81 • RT 01 / RW 08
        </span>
      </div>

      <h1 class="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] uppercase tracking-wider text-black mb-3">
        PHOTOBOOTH <br class="hidden sm:inline"/><span class="text-primary underline decoration-black decoration-wavy decoration-2 sm:decoration-4">17 AGUSTUS</span>
      </h1>

      <p class="font-serif italic font-bold text-base sm:text-xl md:text-2xl text-black/80 max-w-2xl px-2">
        "Indonesia Berdaulat, Adil, dan Makmur"
      </p>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-6 z-10">
      
      <!-- Left Column: Interactive 3D Tilt Photostrip Preview -->
      <div class="lg:col-span-5 flex justify-center relative">
        <div class="relative bg-black p-3 sm:p-4 pb-14 sm:pb-16 rotate-[-3deg] hover:rotate-0 transition-transform duration-500 shadow-brutal-lg w-56 sm:w-64 border-4 border-black"
             style="border-image: radial-gradient(circle, #FDFBF7 4px, transparent 5px) 8 stretch;">
          
          <!-- Polka dot halftone bg -->
          <div class="absolute inset-0 pointer-events-none opacity-20 bg-halftone-white"></div>
          
          <!-- Top Tag in Strip -->
          <div class="bg-primary text-white text-center py-1 font-display text-xs uppercase tracking-widest border-2 border-white mb-2 relative z-10">
            HUT RI KE-81 • 2026
          </div>

          <!-- Photo slots simulation with patriotic illustrations -->
          <div class="space-y-2 relative z-10">
            <div class="bg-[#1e1e24] aspect-[4/3] w-full border-2 border-white/40 flex flex-col items-center justify-center p-2 text-center text-white relative overflow-hidden">
              <Flag class="w-6 h-6 text-primary fill-primary mb-1" />
              <span class="font-display text-xs uppercase tracking-wider text-gold-light">Senyum Merdeka</span>
              <span class="font-sans text-[9px] text-white/70 font-bold">Slot Foto #1</span>
            </div>
            
            <div class="bg-[#1e1e24] aspect-[4/3] w-full border-2 border-white/40 flex flex-col items-center justify-center p-2 text-center text-white relative overflow-hidden">
              <Sparkles class="w-6 h-6 text-gold-light mb-1" />
              <span class="font-display text-xs uppercase tracking-wider text-gold-light">Semangat 17-an</span>
              <span class="font-sans text-[9px] text-white/70 font-bold">Slot Foto #2</span>
            </div>

            <div class="bg-[#1e1e24] aspect-[4/3] w-full border-2 border-white/40 flex flex-col items-center justify-center p-2 text-center text-white relative overflow-hidden">
              <Trophy class="w-6 h-6 text-gold-light mb-1" />
              <span class="font-display text-xs uppercase tracking-wider text-gold-light">Pesona Cilebut 1</span>
              <span class="font-sans text-[9px] text-white/70 font-bold">Slot Foto #3</span>
            </div>
          </div>
          
          <!-- Bottom Strip Label -->
          <div class="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center text-gold-light font-display tracking-[0.25em] text-xs">
            INDONESIA MAJU
          </div>
          
          <!-- Floating 81 Years Medal Badge with Official Logo -->
          <div class="absolute -top-6 -right-6 sm:-top-7 sm:-right-7 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-brutal transform rotate-12 border-4 border-black z-20 animate-bounce" style="animation-duration: 3s;">
            <img src="/logomerah81.png" alt="Logo HUT RI 81" class="w-full h-full object-contain" />
          </div>

          <!-- Left Ribbon -->
          <div class="absolute -bottom-4 -left-4 bg-primary text-white font-display text-[10px] sm:text-xs px-3 py-1 border-2 border-black shadow-brutal-sm transform -rotate-6 z-20">
            MERDEKA!
          </div>
        </div>
      </div>

      <!-- Right Column: Info & Action Card -->
      <div class="lg:col-span-7 flex flex-col gap-6">
        
        <!-- Information Box -->
        <div class="bg-white border-4 border-black p-5 sm:p-7 shadow-brutal">
          <h2 class="font-display text-2xl sm:text-3xl uppercase tracking-wide text-black border-b-4 border-black pb-2 mb-4 flex items-center gap-2.5">
            <Camera class="w-7 h-7 text-primary" />
            <span>Abadikan Momen Kemerdekaan!</span>
          </h2>
          
          <p class="font-sans font-medium text-black/80 text-sm sm:text-base leading-relaxed mb-5">
            Sambut semarak peringatan <strong>HUT ke-81 Kemerdekaan Republik Indonesia</strong>! Buat photostrip bertema 17 Agustus eksklusif warga Pesona Cilebut 1 langsung dari HP atau Laptop Anda.
          </p>

          <!-- Feature Badges Grid -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-[#FDFBF7] border-2 border-black p-2.5 flex items-center gap-2.5">
              <Palette class="w-5 h-5 text-primary shrink-0" />
              <div>
                <p class="font-display text-xs sm:text-sm uppercase text-black leading-tight">4 Template Bingkai</p>
                <p class="font-sans text-[10px] text-black/60 font-bold">Pilihan Tema 17-an</p>
              </div>
            </div>

            <div class="bg-[#FDFBF7] border-2 border-black p-2.5 flex items-center gap-2.5">
              <ShieldCheck class="w-5 h-5 text-primary shrink-0" />
              <div>
                <p class="font-display text-xs sm:text-sm uppercase text-black leading-tight">100% Privasi Aman</p>
                <p class="font-sans text-[10px] text-black/60 font-bold">Tanpa Galeri Publik</p>
              </div>
            </div>

            <div class="bg-[#FDFBF7] border-2 border-black p-2.5 flex items-center gap-2.5">
              <Share2 class="w-5 h-5 text-primary shrink-0" />
              <div>
                <p class="font-display text-xs sm:text-sm uppercase text-black leading-tight">Share Instan</p>
                <p class="font-sans text-[10px] text-black/60 font-bold">Langsung ke Status WA/IG</p>
              </div>
            </div>

            <div class="bg-[#FDFBF7] border-2 border-black p-2.5 flex items-center gap-2.5">
              <Sparkles class="w-5 h-5 text-primary shrink-0" />
              <div>
                <p class="font-display text-xs sm:text-sm uppercase text-black leading-tight">HD Quality Export</p>
                <p class="font-sans text-[10px] text-black/60 font-bold">Siap Cetak & Pasang</p>
              </div>
            </div>
          </div>

          <!-- Big Start Button -->
          <button @click="startStudio" 
                  class="group w-full bg-primary hover:bg-primary-dark text-white p-4 sm:p-5 border-4 border-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all flex flex-col items-center text-center cursor-pointer">
            <span class="font-display text-3xl sm:text-4xl md:text-5xl leading-none uppercase tracking-wider flex items-center gap-3">
              <span>MULAI BERFOTO SEKARANG</span>
              <ArrowRight class="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </span>
            <span class="font-sans text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gold-light mt-2 border-t-2 border-white/30 pt-2 w-full">
              Pilih Bingkai & Tangkap Momen Kemerdekaan
            </span>
          </button>
        </div>

        <!-- Privacy & Neighborhood Notice -->
        <div class="bg-gold-light/40 border-3 border-black p-3.5 flex items-center gap-3 shadow-brutal-sm">
          <Award class="w-6 h-6 text-primary shrink-0" />
          <p class="font-sans text-xs sm:text-sm font-bold text-black leading-snug">
            Diselenggarakan oleh <strong>Panitia Pesta Rakyat RT 01/RW 08 Pesona Cilebut 1</strong>. Foto Anda diproses di perangkat masing-masing dan tidak dipublikasikan ke orang lain.
          </p>
        </div>

      </div>

    </main>

    <!-- Footer Quote Section -->
    <footer class="border-t-4 border-black bg-white py-6 px-4 text-center z-10">
      <div class="max-w-4xl mx-auto space-y-2">
        <p class="font-serif italic text-sm sm:text-base text-black/80 font-bold">
          "Bangsa yang besar adalah bangsa yang menghormati jasa pahlawannya."
        </p>
        <p class="font-display text-xs sm:text-sm text-primary uppercase tracking-widest">
          — Ir. Soekarno —
        </p>
        <div class="border-t-2 border-black/10 pt-3 mt-3 flex flex-col sm:flex-row justify-between items-center text-[11px] font-sans font-bold text-black/60 gap-2">
          <span>HUT RI ke-81 • 17 Agustus 2026</span>
          <span>Pesona Cilebut 1 • Indonesia Berdaulat, Adil, dan Makmur</span>
          <span>Photobooth Virtual Warga</span>
        </div>
      </div>
    </footer>

  </div>

  <!-- Studio View -->
  <div v-else class="min-h-[100dvh] w-full relative flex flex-col p-2 sm:p-4 md:p-6 bg-[#FDFBF7]"
       style="background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px); background-size: 24px 24px;">
    
    <!-- Top Back to Home Bar -->
    <div class="w-full max-w-5xl mx-auto flex justify-between items-center mb-4 z-50">
      <button @click="isStudioActive = false" class="bg-white text-black border-3 sm:border-4 border-black font-display px-3 sm:px-5 py-1.5 sm:py-2 hover:bg-black hover:text-white shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 cursor-pointer">
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </button>

      <div class="flex items-center gap-2.5">
        <img src="/logomerah81.png" alt="Logo HUT RI 81" class="h-8 w-auto object-contain hidden sm:inline-block" />
        <span class="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider text-black bg-gold-light border-2 border-black px-2.5 py-1">
          <Flag class="w-3.5 h-3.5 text-primary fill-primary" />
          <span>HUT RI ke-81</span>
        </span>
      </div>
    </div>

    <!-- Main Studio Component Container -->
    <div class="flex-1 flex flex-col items-center justify-center w-full max-w-full">
      <PhotoboothStudio />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Camera, Flag, Sparkles, ArrowRight, ArrowLeft, Palette, ShieldCheck, Share2, Award, Trophy } from 'lucide-vue-next';
import PhotoboothStudio from '~/components/PhotoboothStudio.vue';

const isStudioActive = ref(false);

const startStudio = () => {
  isStudioActive.value = true;
};
</script>

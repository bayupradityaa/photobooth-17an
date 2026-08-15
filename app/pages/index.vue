<template>
  <div v-if="!isStudioActive" class="min-h-screen text-black relative flex flex-col p-4 md:p-8 justify-center"
       style="background-image: url('/bg.webp'); background-size: cover; background-position: center;">
    
    <!-- Header Section -->
    <header class="text-center mb-8 md:mb-12 flex flex-col items-center pt-4">
      <h2 class="font-serif text-base sm:text-lg md:text-xl tracking-widest uppercase border-b-2 border-black pb-1 mb-2 sm:mb-4 inline-block">Photobooth Event</h2>
      <h1 class="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.85] uppercase tracking-wider">Gabriela Abigail's<br/>20th Birthday</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-8 pb-24 lg:pb-8">
      
      <!-- Left Column (Visuals) -->
      <div class="flex justify-center relative">
        <!-- Photostrip container -->
        <div class="relative bg-black p-2 sm:p-3 pb-12 sm:pb-16 rotate-[-3deg] shadow-2xl w-40 sm:w-64 max-w-[50vw] sm:max-w-[70vw] transition-transform hover:rotate-0 duration-500" 
             style="border-image: radial-gradient(white 4px, transparent 5px) 10 stretch; border-width: 10px; border-style: solid;">
          <!-- Polka dot bg -->
          <div class="absolute inset-0 pointer-events-none opacity-20" 
               style="background-image: radial-gradient(white 2px, transparent 2px); background-size: 16px 16px;"></div>
          
          <!-- Photo frames -->
          <div class="space-y-2 sm:space-y-3 relative z-10">
            <div class="bg-[#d0c8b6] aspect-[4/3] w-full shadow-inner flex items-center justify-center overflow-hidden">
               <img src="/foto-1.jpeg" class="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125" alt="Ella" />
            </div>
            <div class="bg-[#d0c8b6] aspect-[4/3] w-full shadow-inner flex items-center justify-center overflow-hidden">
               <img src="/foto-2.jpeg" class="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125" alt="Ella" />
            </div>
            <div class="bg-[#d0c8b6] aspect-[4/3] w-full shadow-inner flex items-center justify-center overflow-hidden">
               <img src="/foto-3.jpeg" class="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125" alt="Ella" />
            </div>
          </div>
          
          <div class="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center text-white font-serif tracking-[0.3em] text-[10px] sm:text-sm">
            ARC 20
          </div>
          
          <!-- Floating badge -->
          <div class="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-16 h-16 sm:w-24 sm:h-24 bg-black rounded-full flex flex-col items-center justify-center text-white font-display shadow-xl transform rotate-12 border-4 sm:border-[6px] border-white z-20">
            <span class="text-2xl sm:text-4xl leading-none mt-0.5 sm:mt-1">20</span>
            <span class="text-[8px] sm:text-[10px] font-serif uppercase tracking-widest leading-none mt-0.5 sm:mt-1">Years</span>
          </div>
        </div>
      </div>

      <!-- Right Column (Start Button) -->
      <div class="fixed bottom-4 left-4 right-4 z-50 lg:static lg:flex lg:justify-start">
        <button @click="startStudio" 
                class="group bg-black text-[#f9f6f0] py-4 sm:py-6 px-4 sm:px-8 hover:bg-gray-800 transition-all transform hover:scale-[1.02] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none flex flex-col items-center border-4 border-black text-center w-full lg:max-w-sm mx-auto lg:mx-0">
          <span class="font-display text-3xl sm:text-4xl md:text-5xl leading-[0.9]">START<br/>PHOTOBOOTH</span>
          <span class="text-[10px] sm:text-sm md:text-base font-serif mt-3 sm:mt-6 font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase border-t border-white/30 pt-2 sm:pt-4 w-full group-hover:text-yellow-300 transition-colors">Click Here to Begin &rarr;</span>
        </button>
      </div>

    </main>
  </div>

  <!-- Studio View -->
  <div v-else class="min-h-[100dvh] w-full relative flex flex-col p-2 sm:p-4 md:p-8"
       style="background-image: url('/bg.webp'); background-size: cover; background-position: center; background-attachment: fixed;">
    <div class="absolute top-2 left-2 sm:top-4 sm:left-4 z-50">
      <button @click="isStudioActive = false" class="bg-black text-[#f9f6f0] border-[3px] border-black font-serif px-2 sm:px-4 py-1 sm:py-2 font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] flex items-center gap-1 sm:gap-2 transition-all uppercase tracking-widest text-xs sm:text-sm">
        <span>&larr;</span> <span class="hidden sm:inline">Back to Home</span><span class="sm:hidden">Back</span>
      </button>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center pt-10 sm:pt-16 w-full max-w-full">
      <PhotoboothStudio />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PhotoboothStudio from '~/components/PhotoboothStudio.vue';

const isStudioActive = ref(false);

const startStudio = () => {
  isStudioActive.value = true;
};
</script>

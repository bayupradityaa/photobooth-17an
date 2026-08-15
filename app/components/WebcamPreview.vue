<template>
  <div class="bg-[#f9f6f0] border-2 sm:border-4 border-black p-2 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative w-full max-w-[280px] sm:max-w-md mx-auto aspect-square md:aspect-[4/3] overflow-hidden">
    <!-- Title Bar -->
    <div class="flex items-center justify-between mb-2 sm:mb-3 font-display uppercase tracking-widest text-black text-xs sm:text-sm border-b-2 sm:border-b-4 border-black pb-2">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black animate-pulse" />
        <span>
          {{ showConfirm ? "KONFIRMASI FOTO" : "LIVE PREVIEW" }}
        </span>
      </div>
      <span v-if="showVideo || showConfirm" class="bg-black text-[#f9f6f0] px-2 py-1 font-display text-[10px] sm:text-xs">
        SLOT {{ photoIndex + 1 }} / {{ capturedPhotos.length }}
      </span>
    </div>

    <!-- Screen Area -->
    <div class="flex-1 overflow-hidden relative flex items-center justify-center border-2 sm:border-4 border-black">
      <!-- Video stream always mounted, visibility toggled -->
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="w-full h-full object-cover scale-x-[-1]"
        :class="{ 'block': showVideo, 'hidden': !showVideo }"
      ></video>

      <!-- Captured image display -->
      <img
        v-if="confirmPhoto && !showVideo"
        :src="capturedPhotos[photoIndex]"
        :alt="`Foto ${photoIndex + 1}`"
        @mousedown="handleDragStart"
        @touchstart.passive="handleDragStart"
        class="w-full h-full object-cover absolute inset-0 transition-transform duration-100"
        :class="{'cursor-grab': (photoScale || 1.0) > 1.0, 'cursor-grabbing': isDragging}"
        :style="{ transform: `scaleX(-1) translate(${photoOffsetX || 0}%, ${photoOffsetY || 0}%) scale(${photoScale || 1.0})` }"
      />

      <!-- Standby/Error placeholder when neither video nor captured image should show -->
      <div v-if="!showVideo && !confirmPhoto" class="flex flex-col items-center justify-center p-4 sm:p-8 text-center text-black font-serif absolute inset-0">
        <div v-if="state === 'REQUESTING_CAMERA'" class="flex flex-col items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 border-4 border-black border-t-transparent animate-spin" />
          <p class="font-bold italic text-xs sm:text-sm">Menghubungkan ke kamera...</p>
        </div>
        <div v-else-if="state === 'CAMERA_ERROR'" class="flex flex-col items-center gap-2 sm:gap-3 text-black">
          <svg class="w-8 h-8 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="font-bold italic text-xs sm:text-sm">Akses Kamera Gagal</p>
          <p class="text-[10px] sm:text-xs italic max-w-[250px] leading-relaxed">
            Pastikan izin kamera telah diberikan dan kamera tidak sedang digunakan aplikasi lain.
          </p>
        </div>
        <div v-else class="flex flex-col items-center gap-2 sm:gap-3">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-transparent flex items-center justify-center border-4 border-black">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p class="font-bold italic text-xs sm:text-sm">Kamera Belum Aktif</p>
          <p class="text-[10px] sm:text-xs italic leading-relaxed">Kamera akan aktif setelah Anda menekan tombol di sebelah kanan.</p>
        </div>
      </div>

      <!-- Countdown Overlay -->
      <div v-if="showCountdown" class="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
        <div class="text-[#f9f6f0] font-display text-[6rem] sm:text-[10rem] animate-ping">
          {{ countdown }}
        </div>
      </div>

      <!-- Flash Overlay -->
      <div v-if="showFlash" class="absolute inset-0 bg-white animate-pulse z-20 pointer-events-none" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PhotoboothState } from '~/utils/photobooth/types';

const props = defineProps<{
  state: PhotoboothState;
  stream: MediaStream | null;
  photoIndex: number;
  countdown: number;
  capturedPhotos: string[];
  photoScale?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
}>();

const emit = defineEmits<{
  (e: 'offsetChange', px: number, py: number): void;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);

watch(() => props.stream, (newStream) => {
  if (videoRef.value && newStream) {
    videoRef.value.srcObject = newStream;
  }
}, { immediate: true });

onMounted(() => {
  if (videoRef.value && props.stream) {
    videoRef.value.srcObject = props.stream;
  }
});

const showVideo = computed(() => props.state === "LIVE_PREVIEW" || props.state === "COUNTDOWN" || props.state === "CAPTURING");
const showCountdown = computed(() => props.state === "COUNTDOWN" && props.countdown > 0);
const showFlash = computed(() => props.state === "CAPTURING");
const showConfirm = computed(() => props.state === "CONFIRM_CAPTURE");
const confirmPhoto = computed(() => showConfirm.value && props.capturedPhotos && props.capturedPhotos[props.photoIndex]);

// --- Drag Logic ---
const isDragging = ref(false);
const dragState = {
  startX: 0,
  startY: 0,
  initialOffsetX: 0,
  initialOffsetY: 0,
  containerWidth: 0,
  containerHeight: 0
};

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (!confirmPhoto.value || (props.photoScale || 1.0) <= 1.0) return;
  
  isDragging.value = true;
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
  
  dragState.startX = clientX;
  dragState.startY = clientY;
  dragState.initialOffsetX = props.photoOffsetX || 0;
  dragState.initialOffsetY = props.photoOffsetY || 0;
  
  const target = e.currentTarget as HTMLElement;
  dragState.containerWidth = target.clientWidth;
  dragState.containerHeight = target.clientHeight;
  
  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('touchmove', handleDragMove, { passive: false });
  window.addEventListener('mouseup', handleDragEnd);
  window.addEventListener('touchend', handleDragEnd);
};

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  if ('touches' in e && e.cancelable) e.preventDefault();
  
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
  
  const dx = clientX - dragState.startX;
  const dy = clientY - dragState.startY;
  
  // WebcamPreview is mirrored, so invert dx
  const px = dragState.initialOffsetX - (dx / dragState.containerWidth) * 100;
  const py = dragState.initialOffsetY + (dy / dragState.containerHeight) * 100;
  
  emit('offsetChange', px, py);
};

const handleDragEnd = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handleDragMove);
  window.removeEventListener('touchmove', handleDragMove);
  window.removeEventListener('mouseup', handleDragEnd);
  window.removeEventListener('touchend', handleDragEnd);
};

defineExpose({
  videoRef
});
</script>

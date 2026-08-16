<template>
  <div class="bg-paper border-3 sm:border-4 border-black p-2.5 sm:p-4 shadow-brutal flex flex-col relative w-full max-w-[280px] sm:max-w-md mx-auto aspect-square md:aspect-[4/3] overflow-hidden">
    <!-- Title Bar -->
    <div class="flex items-center justify-between mb-2 sm:mb-3 font-display uppercase tracking-widest text-black text-xs sm:text-sm border-b-2 sm:border-b-3 border-black pb-2">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        <span>
          {{ showConfirm ? "SESUAIKAN FOTO" : "KAMERA LIVE" }}
        </span>
      </div>
      <span v-if="showVideo || showConfirm" class="bg-black text-gold-light px-2 py-0.5 font-display text-[10px] sm:text-xs">
        SLOT {{ photoIndex + 1 }} / {{ capturedPhotos.length }}
      </span>
    </div>

    <!-- Screen Area -->
    <div class="flex-1 overflow-hidden relative flex items-center justify-center border-2 sm:border-3 border-black bg-black">
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
      <div v-if="!showVideo && !confirmPhoto" class="flex flex-col items-center justify-center p-4 sm:p-8 text-center text-white font-sans absolute inset-0 bg-[#18181B]">
        <div v-if="state === 'REQUESTING_CAMERA'" class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p class="font-bold text-xs sm:text-sm">Nyalain kamera dulu...</p>
        </div>
        <div v-else-if="state === 'CAMERA_ERROR'" class="flex flex-col items-center gap-2 sm:gap-3 text-white">
          <AlertTriangle class="w-8 h-8 text-primary" />
          <p class="font-bold text-xs sm:text-sm text-primary-light">Kamera Gagal Dibuka</p>
          <p class="text-[10px] sm:text-xs text-white/70 max-w-[250px] leading-relaxed">
            Izinkan akses kamera di browser, atau pilih foto dari galeri.
          </p>
        </div>
        <div v-else class="flex flex-col items-center gap-2 sm:gap-3">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 flex items-center justify-center border-2 border-white/30 rounded-lg">
            <Camera class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <p class="font-bold text-xs sm:text-sm">Kamera Siap</p>
          <p class="text-[10px] sm:text-xs text-white/60 leading-relaxed">Siap? Tekan tombol Ambil Foto.</p>
        </div>
      </div>

      <!-- Countdown Overlay -->
      <div v-if="showCountdown" class="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
        <div class="text-gold-light font-display text-[7rem] sm:text-[10rem] animate-ping">
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
import { Camera, AlertTriangle } from 'lucide-vue-next';
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
  
  let clientX = 0;
  let clientY = 0;
  if ('touches' in e) {
    const touch = e.touches[0];
    if (!touch) return;
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  
  isDragging.value = true;
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
  
  let clientX = 0;
  let clientY = 0;
  if ('touches' in e) {
    const touch = e.touches[0];
    if (!touch) return;
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  
  const dx = clientX - dragState.startX;
  const dy = clientY - dragState.startY;
  
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

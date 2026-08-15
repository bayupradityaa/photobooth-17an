<template>
  <div class="bg-paper border-4 border-black p-3 sm:p-6 flex flex-col justify-center gap-3 sm:gap-5 w-full max-w-sm sm:max-w-md mx-auto shadow-brutal relative">
    
    <!-- Step Indicator Header -->
    <div class="flex justify-between items-center text-xs sm:text-sm text-black font-display tracking-widest uppercase border-b-4 border-black pb-2">
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-primary"></span>
        Tahapan Photobooth
      </span>
      <span class="bg-black text-gold-light px-3 py-0.5 border-2 border-black font-extrabold text-xs">
        <template v-if="isSelectFrame">1 / 4 • BINGKAI</template>
        <template v-else-if="isSelectInput">2 / 4 • METODE</template>
        <template v-else-if="isRequesting || isError || isLivePreview || isCountdown || isCapturing || isConfirmCapture || isUploadPreview">3 / 4 • FOTO</template>
        <template v-else-if="isReview || isExporting">4 / 4 • SELESAI</template>
      </span>
    </div>

    <!-- Title & Guidance Box -->
    <div class="text-center border-3 sm:border-4 border-black p-3 sm:p-4 bg-white shadow-brutal-sm">
      <h3 class="font-display text-lg sm:text-2xl text-black uppercase tracking-wide flex items-center justify-center gap-2">
        <template v-if="isSelectFrame">Pilih Bingkai 17-an</template>
        <template v-else-if="isSelectInput">Pilih Metode Foto</template>
        <template v-else-if="isRequesting">Membuka Kamera...</template>
        <template v-else-if="isError">Izin Kamera Ditolak</template>
        <template v-else-if="isLivePreview">Foto Slot {{ photoIndex + 1 }} dari {{ slotsCount }}</template>
        <template v-else-if="isCountdown">Bersiaplah...</template>
        <template v-else-if="isCapturing">
          <Camera class="w-6 h-6 text-primary animate-bounce" />
          <span>Cekrek!</span>
        </template>
        <template v-else-if="isConfirmCapture">Sesuaikan Foto Slot {{ photoIndex + 1 }}</template>
        <template v-else-if="isUploadPreview">Unggah Foto ({{ uploadedCount }}/{{ slotsCount }})</template>
        <template v-else-if="isReview">
          <Sparkles class="w-6 h-6 text-gold" />
          <span>Photostrip Selesai!</span>
        </template>
        <template v-else-if="isExporting">Menyusun Gambar HD...</template>
      </h3>
      
      <p class="hidden sm:block text-xs sm:text-sm text-black/80 font-sans mt-2 font-semibold leading-relaxed border-t-2 border-black/10 pt-2">
        <template v-if="isSelectFrame">Pilih salah satu template bertema Kemerdekaan RI ke-81 favoritmu.</template>
        <template v-else-if="isSelectInput">Gunakan kamera selfie HP/Laptop atau unggah foto yang sudah ada dari galeri.</template>
        <template v-else-if="isRequesting">Izinkan akses kamera browser saat jendela pop-up muncul.</template>
        <template v-else-if="isError">Kamera tidak dapat diakses. Silakan gunakan opsi Unggah File dari galeri.</template>
        <template v-else-if="isLivePreview">Posisikan wajahmu dengan senyum terbaik, lalu tekan tombol Ambil Foto.</template>
        <template v-else-if="isCountdown">Pose ter-kece! Foto akan otomatis diambil saat hitungan nol.</template>
        <template v-else-if="isCapturing">Tahan posemu sejenak...</template>
        <template v-else-if="isConfirmCapture">Foto sudah pas? Kamu bisa memperbesar/geser posisi foto sebelum lanjut.</template>
        <template v-else-if="isUploadPreview">Pilih {{ slotsCount }} foto terbaik dari galeri perangkatmu.</template>
        <template v-else-if="isReview">Unduh hasilnya atau bagikan langsung ke WhatsApp & Instagram Story!</template>
        <template v-else-if="isExporting">Sedang merender photostrip kualitas tinggi, harap tunggu...</template>
      </p>
    </div>

    <!-- Zoom Slider (when adjusting photo in slot) -->
    <div v-if="showZoomSlider" class="flex flex-col gap-2 p-3 border-3 sm:border-4 border-black bg-white shadow-brutal-sm">
      <div class="flex justify-between items-center text-xs sm:text-sm font-display text-black uppercase tracking-wide">
        <span class="flex items-center gap-1.5">
          <ZoomIn class="w-4 h-4 text-black" />
          <span>Sesuaikan Zoom Foto</span>
        </span>
        <span class="text-primary font-bold">{{ Math.round(photoScale * 100) }}%</span>
      </div>
      <input
        type="range"
        min="1.0"
        max="2.5"
        step="0.05"
        :value="photoScale"
        @input="(e) => $emit('scaleChange', parseFloat((e.target as HTMLInputElement).value))"
        class="w-full h-2 bg-neutral-200 border-2 border-black appearance-none cursor-pointer accent-primary"
      />
      <span class="text-[10px] font-sans text-black/60 italic text-center">Geser foto pada preview untuk memposisikan wajah</span>
    </div>

    <!-- Action Buttons Set -->
    <div class="flex flex-col gap-2.5 sm:gap-3">
      
      <!-- Step 1: Select Frame -->
      <button
        v-if="isSelectFrame"
        @click="$emit('selectFrameNext')"
        class="w-full bg-primary hover:bg-primary-dark text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-base sm:text-xl py-2.5 sm:py-3.5 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-2"
      >
        <span>Lanjut ke Kamera</span>
        <ArrowRight class="w-5 h-5" />
      </button>

      <!-- Step 2: Select Input Mode -->
      <template v-if="isSelectInput">
        <button
          @click="$emit('start')"
          class="w-full bg-primary hover:bg-primary-dark text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-lg py-2.5 sm:py-3.5 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-2"
        >
          <Camera class="w-5 h-5" />
          <span>Gunakan Kamera Live</span>
        </button>
        
        <button
          @click="$emit('startUpload')"
          class="w-full bg-white hover:bg-neutral-100 text-black border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-lg py-2.5 sm:py-3.5 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-2"
        >
          <FolderUp class="w-5 h-5" />
          <span>Unggah dari Galeri</span>
        </button>
        
        <button
          @click="$emit('cancelUpload')"
          class="w-full mt-1 text-black font-display uppercase tracking-wider text-xs sm:text-sm hover:text-primary transition-colors text-center"
        >
          &larr; Ganti Bingkai Lain
        </button>
      </template>

      <!-- Step 3 (Camera): Live Preview Mode -->
      <template v-if="isLivePreview">
        <button
          @click="$emit('captureClick')"
          class="w-full bg-primary hover:bg-primary-dark text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-base sm:text-2xl py-3 sm:py-4 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-2.5"
        >
          <Camera class="w-6 h-6" />
          <span>AMBIL FOTO (3 DETIK)</span>
        </button>

        <button
          @click="$emit('cancelUpload')"
          class="w-full text-black font-display uppercase tracking-wider text-xs sm:text-sm hover:text-primary transition-colors text-center"
        >
          &larr; Ganti Metode / Bingkai
        </button>
      </template>

      <!-- Step 3 (Camera): Confirm Capture Mode -->
      <template v-if="isConfirmCapture">
        <div v-if="isAllCaptured" class="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-1 w-full">
          <button
            v-for="i in slotsCount"
            :key="i"
            @click="$emit('selectSlot', i - 1)"
            :class="photoIndex === i - 1 ? 'bg-primary text-white border-black shadow-brutal-sm' : 'bg-white text-black border-black/40 hover:border-black'"
            class="px-2.5 py-1 font-display text-xs border-2 transition-all flex-1 min-w-[50px]"
          >
            FOTO {{ i }}
          </button>
        </div>

        <button
          @click="$emit('confirmPhoto')"
          :class="['w-full border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-2.5 sm:py-3.5 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-2', isAllCaptured ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-black text-white']"
        >
          <span>{{ isAllCaptured ? 'LIHAT HASIL PHOTOSTRIP' : 'SIMPAN & FOTO BERIKUTNYA' }}</span>
          <ArrowRight class="w-5 h-5" />
        </button>

        <button
          @click="$emit('retry')"
          class="w-full bg-white hover:bg-neutral-100 text-black border-3 sm:border-4 border-black font-display uppercase tracking-widest text-xs sm:text-base py-2 px-4 shadow-brutal-sm transition-all text-center cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Jepret Ulang Slot Ini</span>
        </button>
      </template>

      <!-- Step 3 (Upload): Upload Mode Actions -->
      <template v-if="isUploadPreview">
        <button
          @click="$emit('processUpload')"
          :disabled="uploadedCount < slotsCount"
          class="w-full border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-2.5 sm:py-3.5 px-4 transition-all text-center flex items-center justify-center gap-2"
          :class="uploadedCount === slotsCount ? 'bg-primary hover:bg-primary-dark text-white shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer' : 'bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-60 border-neutral-400'"
        >
          <Sparkles class="w-5 h-5" />
          <span>{{ uploadedCount === slotsCount ? 'LIHAT HASIL PHOTOSTRIP' : `PILIH ${slotsCount - uploadedCount} FOTO LAGI` }}</span>
        </button>

        <button
          @click="$emit('cancelUpload')"
          class="w-full text-black font-display uppercase tracking-wider text-xs sm:text-sm hover:text-primary transition-colors text-center"
        >
          &larr; Batal & Ganti Metode
        </button>
      </template>

      <!-- Camera Error State -->
      <template v-if="isError">
        <button
          @click="$emit('start')"
          class="w-full bg-primary hover:bg-primary-dark text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-lg py-2.5 px-4 shadow-brutal cursor-pointer text-center flex items-center justify-center gap-2"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Coba Kamera Lagi</span>
        </button>
        <button
          @click="$emit('startUpload')"
          class="w-full bg-white hover:bg-neutral-100 text-black border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-lg py-2.5 px-4 shadow-brutal cursor-pointer text-center flex items-center justify-center gap-2"
        >
          <FolderUp class="w-4 h-4" />
          <span>Unggah File Saja</span>
        </button>
      </template>

      <!-- Countdown in progress state -->
      <button
        v-if="isCountdown"
        disabled
        class="w-full bg-primary text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-lg sm:text-2xl py-3 px-4 opacity-90 cursor-not-allowed text-center animate-pulse shadow-brutal flex items-center justify-center gap-2"
      >
        <Hourglass class="w-6 h-6 animate-spin" />
        <span>HITUNG MUNDUR...</span>
      </button>

      <!-- Capturing state -->
      <button
        v-if="isCapturing"
        disabled
        class="w-full bg-black text-gold-light border-3 sm:border-4 border-black font-display uppercase tracking-widest text-lg sm:text-2xl py-3 px-4 cursor-not-allowed text-center shadow-brutal flex items-center justify-center gap-2"
      >
        <Camera class="w-6 h-6 text-primary animate-bounce" />
        <span>CEKREK!</span>
      </button>

      <!-- Step 4: Final Review Actions -->
      <template v-if="isReview">
        
        <!-- 1. Primary Download Button -->
        <button
          @click="$emit('download')"
          class="w-full bg-black hover:bg-neutral-800 text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-lg py-2.5 sm:py-3.5 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2.5 text-center"
        >
          <Download class="w-5 h-5" />
          <span>UNDUH FOTO (HD PNG)</span>
        </button>

        <!-- 2. Smart Share Button (WhatsApp / IG Story Native Share Sheet) -->
        <button
          @click="$emit('share')"
          class="w-full bg-primary hover:bg-primary-dark text-white border-3 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-lg py-2.5 sm:py-3.5 px-4 transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2.5 text-center"
        >
          <Share2 class="w-5 h-5" />
          <span>BAGIKAN FOTO</span>
        </button>

        <!-- 3. Copy Promotion Text & Link Button -->
        <button
          @click="$emit('copyCaption')"
          class="w-full bg-gold-light hover:bg-yellow-200 text-black border-2 sm:border-3 border-black font-display uppercase tracking-wider text-xs sm:text-sm py-2 px-3 transition-all shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-center"
        >
          <Copy class="w-4 h-4" />
          <span>Salin Teks & Link Promo</span>
        </button>

        <!-- 4. Retake / Start Over -->
        <button
          @click="$emit('retake')"
          class="w-full mt-1 text-black font-display uppercase tracking-wider text-xs sm:text-sm hover:text-primary transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Foto Lagi / Ganti Bingkai</span>
        </button>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Camera, Download, Share2, Copy, RotateCcw, FolderUp, ZoomIn, ArrowRight, Sparkles, Hourglass } from 'lucide-vue-next';
import type { PhotoboothState } from '~/utils/photobooth/types';

const props = defineProps<{
  state: PhotoboothState;
  canShare: boolean;
  uploadedCount: number;
  slotsCount: number;
  photoIndex: number;
  isAllCaptured: boolean;
  photoScale: number;
  showZoomSlider: boolean;
}>();

defineEmits<{
  (e: 'selectFrameNext'): void;
  (e: 'start'): void;
  (e: 'startUpload'): void;
  (e: 'retry'): void;
  (e: 'retake'): void;
  (e: 'download'): void;
  (e: 'share'): void;
  (e: 'copyCaption'): void;
  (e: 'processUpload'): void;
  (e: 'cancelUpload'): void;
  (e: 'captureClick'): void;
  (e: 'confirmPhoto'): void;
  (e: 'scaleChange', scale: number): void;
  (e: 'selectSlot', index: number): void;
}>();

const isSelectFrame = computed(() => props.state === 'SELECT_FRAME');
const isSelectInput = computed(() => props.state === 'SELECT_INPUT_MODE');
const isRequesting = computed(() => props.state === 'REQUESTING_CAMERA');
const isError = computed(() => props.state === 'CAMERA_ERROR');
const isLivePreview = computed(() => props.state === 'LIVE_PREVIEW');
const isCountdown = computed(() => props.state === 'COUNTDOWN');
const isCapturing = computed(() => props.state === 'CAPTURING');
const isConfirmCapture = computed(() => props.state === 'CONFIRM_CAPTURE');
const isUploadPreview = computed(() => props.state === 'UPLOAD_PREVIEW');
const isReview = computed(() => props.state === 'REVIEW');
const isExporting = computed(() => props.state === 'EXPORTING');
</script>

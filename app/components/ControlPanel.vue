<template>
  <div class="bg-[#f9f6f0] border-4 border-black p-2 sm:p-6 flex flex-col justify-center gap-2 sm:gap-6 w-full max-w-sm mx-auto h-full sm:min-h-[260px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
    <!-- Step Indicator Header -->
    <div class="flex justify-between items-center text-sm text-black font-display tracking-widest uppercase border-b-4 border-black pb-2">
      <span>Langkah / Step</span>
      <span class="bg-black text-[#f9f6f0] px-3 py-1">
        <template v-if="isSelectFrame">1 dari 4</template>
        <template v-else-if="isSelectInput">2 dari 4</template>
        <template v-else-if="isRequesting || isError || isLivePreview || isCountdown || isCapturing || isConfirmCapture || isUploadPreview">3 dari 4</template>
        <template v-else-if="isReview || isExporting">4 dari 4</template>
      </span>
    </div>

    <div class="text-center mb-1 sm:mb-2 border-2 sm:border-4 border-black p-2 sm:p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 class="font-display text-base sm:text-2xl text-black uppercase tracking-wider">
        <template v-if="isSelectFrame">Pilih Bingkai Foto</template>
        <template v-else-if="isSelectInput">Pilih Metode Foto</template>
        <template v-else-if="isRequesting">Membuka Kamera</template>
        <template v-else-if="isError">Akses Kamera Gagal</template>
        <template v-else-if="isLivePreview">Foto Slot ke-{{ photoIndex + 1 }} / {{ slotsCount }}</template>
        <template v-else-if="isCountdown">Siap-siap...</template>
        <template v-else-if="isCapturing">Cekrek!</template>
        <template v-else-if="isConfirmCapture">Konfirmasi Foto Slot {{ photoIndex + 1 }} / {{ slotsCount }}</template>
        <template v-else-if="isUploadPreview">Unggah Foto ({{ uploadedCount }}/{{ slotsCount }})</template>
        <template v-else-if="isReview">Hasil Photostrip Kamu!</template>
        <template v-else-if="isExporting">Menyimpan Gambar...</template>
      </h3>
      <p class="hidden sm:block text-sm text-black font-serif italic mt-2 font-bold leading-relaxed border-t-2 border-black/20 pt-2">
        <template v-if="isSelectFrame">Pilih tema bingkai foto Anda (Klasik Vertikal, Kotak Grid, atau Lebar Horisontal) sebelum memotret.</template>
        <template v-else-if="isSelectInput">Ambil pose foto langsung menggunakan kamera webcam perangkat Anda, atau unggah foto yang sudah ada dari galeri.</template>
        <template v-else-if="isRequesting">Berikan izin kamera jika muncul petunjuk dari browser Anda.</template>
        <template v-else-if="isError">Kami membutuhkan akses webcam Anda untuk mengambil foto secara langsung.</template>
        <template v-else-if="isLivePreview">Posisikan diri Anda di depan kamera, lalu klik tombol Ambil Foto di bawah untuk slot foto ke-{{ photoIndex + 1 }}.</template>
        <template v-else-if="isCountdown">Pose yang kece! Hitung mundur sedang berjalan...</template>
        <template v-else-if="isCapturing">Sedang mengambil gambar, harap diam sejenak.</template>
        <template v-else-if="isConfirmCapture">Apakah foto slot ini sudah pas? Anda bisa memperbesar/kecilkan gambar sebelum menyimpannya.</template>
        <template v-else-if="isUploadPreview">Unggah {{ slotsCount }} file foto di panel sebelah kiri untuk menyusun photostrip.</template>
        <template v-else-if="isReview">Photostrip Anda sudah siap! Anda bisa langsung mengunduh atau membagikan hasilnya sekarang.</template>
        <template v-else-if="isExporting">Sedang memproses komposit photostrip kualitas tinggi...</template>
      </p>
    </div>

    <!-- Zoom Slider -->
    <div v-if="showZoomSlider" class="flex flex-col gap-2 p-3 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
      <div class="flex justify-between items-center text-sm font-display text-black uppercase tracking-wide">
        <span>Sesuaikan Ukuran (Zoom)</span>
        <span class="text-red-600">{{ Math.round(photoScale * 100) }}%</span>
      </div>
      <input
        type="range"
        min="1.0"
        max="2.5"
        step="0.05"
        :value="photoScale"
        @input="(e) => $emit('scaleChange', parseFloat((e.target as HTMLInputElement).value))"
        class="w-full h-2 bg-neutral-200 border-2 border-black appearance-none cursor-pointer accent-black"
      />
    </div>

    <div class="flex flex-col gap-4">
      <!-- Step 1: Select Frame -->
      <button
        v-if="isSelectFrame"
        @click="$emit('selectFrameNext')"
        aria-label="Lanjut ke pemilihan metode pengambilan foto"
        class="w-full bg-black text-[#f9f6f0] border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-1.5 sm:py-3 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center"
      >
        Lanjut &rarr;
      </button>

      <!-- Step 2: Select Input Mode -->
      <template v-if="isSelectInput">
        <button
          @click="$emit('start')"
          aria-label="Mulai Foto menggunakan Kamera"
          class="w-full bg-black text-[#f9f6f0] border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-1.5 sm:py-3 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-1 sm:gap-2"
        >
          <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          Gunakan Kamera
        </button>
        <button
          @click="$emit('startUpload')"
          aria-label="Mulai menggunakan Unggah Foto"
          class="w-full bg-white text-black border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-1.5 sm:py-3 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-1 sm:gap-2"
        >
          <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12" />
          </svg>
          Unggah File
        </button>
        <button
          @click="$emit('cancelUpload')"
          aria-label="Kembali ke pemilihan bingkai"
          class="w-full mt-1 sm:mt-2 text-black font-serif italic font-bold border-b-2 border-black pb-0.5 self-center hover:text-red-600 transition-colors text-xs sm:text-base"
        >
          &larr; Kembali
        </button>
      </template>

      <!-- Step 3 (Camera): Live Preview -->
      <template v-if="isLivePreview">
        <button
          @click="$emit('captureClick')"
          aria-label="Ambil foto selfie"
          class="w-full bg-black text-[#f9f6f0] border-2 sm:border-4 border-black font-display uppercase tracking-widest text-base sm:text-2xl py-1.5 sm:py-4 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center flex items-center justify-center gap-1.5 sm:gap-3"
        >
          <svg class="w-5 h-5 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          AMBIL FOTO
        </button>

        <button
          @click="$emit('cancelUpload')"
          aria-label="Kembali ke menu pemilihan metode"
          class="w-full mt-1 sm:mt-2 text-black font-serif italic font-bold border-b-2 border-black pb-0.5 self-center hover:text-red-600 transition-colors text-xs sm:text-base"
        >
          &larr; Kembali
        </button>
      </template>

      <!-- Step 3 (Camera): Confirm Capture -->
      <template v-if="isConfirmCapture">
        <div v-if="isAllCaptured" class="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 w-full">
          <button
            v-for="i in slotsCount"
            :key="i"
            @click="$emit('selectSlot', i - 1)"
            :class="photoIndex === i - 1 ? 'bg-black text-white border-black' : 'bg-white text-black border-black/30 hover:border-black'"
            class="px-2 py-1 sm:px-3 sm:py-1.5 font-display text-xs sm:text-sm border-2 transition-colors flex-1 min-w-[60px]"
          >
            FOTO {{ i }}
          </button>
        </div>
        <button
          @click="$emit('confirmPhoto')"
          aria-label="Konfirmasi dan simpan foto ini"
          :class="['w-full border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-1.5 sm:py-3 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center', isAllCaptured ? 'bg-red-600 text-white' : 'bg-black text-[#f9f6f0]']"
        >
          {{ isAllCaptured ? 'PROSES PHOTOSTRIP' : 'SIMPAN FOTO' }}
        </button>
        <button
          @click="$emit('retry')"
          aria-label="Ambil ulang pose untuk slot ini"
          class="w-full bg-[#f9f6f0] text-black border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-1.5 sm:py-3 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center"
        >
          Foto Ulang
        </button>
      </template>

      <!-- Step 3 (Upload): Uploading Photos -->
      <template v-if="isUploadPreview">
        <button
          @click="$emit('processUpload')"
          :disabled="uploadedCount < slotsCount"
          aria-label="Proses hasil foto menjadi photostrip"
          class="w-full border-4 border-black font-display uppercase tracking-widest text-xl py-3 px-6 transition-all text-center flex items-center justify-center gap-2"
          :class="uploadedCount === slotsCount ? 'bg-black text-[#f9f6f0] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer' : 'bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-50'"
        >
          Proses Photostrip
        </button>
        <button
          @click="$emit('cancelUpload')"
          aria-label="Batal dan kembali ke menu pemilihan metode"
          class="w-full mt-2 text-black font-serif italic font-bold border-b-2 border-black pb-0.5 self-center hover:text-red-600 transition-colors"
        >
          &larr; Batal
        </button>
      </template>

      <!-- Retry Camera Button (when camera error) -->
      <template v-if="isError">
        <button
          @click="$emit('start')"
          class="w-full bg-black text-[#f9f6f0] border-4 border-black font-display uppercase tracking-widest text-xl py-3 px-6 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center"
        >
          Coba Lagi Kamera
        </button>
        <button
          @click="$emit('startUpload')"
          class="w-full bg-white text-black border-4 border-black font-display uppercase tracking-widest text-xl py-3 px-6 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer text-center"
        >
          Unggah File Saja
        </button>
      </template>

      <!-- Loading / Disabled states during capture countdown -->
      <button
        v-if="isRequesting"
        disabled
        class="w-full bg-white text-black border-4 border-black font-display uppercase tracking-widest text-xl py-3 px-6 opacity-70 cursor-not-allowed flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div class="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
        MENGHUBUNGKAN...
      </button>

      <button
        v-if="isCountdown"
        disabled
        class="w-full bg-black text-[#f9f6f0] border-4 border-black font-display uppercase tracking-widest text-2xl py-4 px-6 opacity-90 cursor-not-allowed text-center animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        HITUNG MUNDUR...
      </button>

      <button
        v-if="isCapturing"
        disabled
        class="w-full bg-red-600 text-white border-4 border-black font-display uppercase tracking-widest text-2xl py-4 px-6 cursor-not-allowed text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        MEMOTRET!
      </button>

      <!-- Step 4: Review Action Buttons -->
      <template v-if="isReview">
        <button
          @click="$emit('saveToCloud')"
          aria-label="Simpan ke Cloud & Unduh"
          class="w-full bg-black text-[#f9f6f0] border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-2 sm:py-4 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer flex items-center justify-center gap-1.5 sm:gap-3 text-center"
        >
          <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          SIMPAN & UNDUH
        </button>

        <button
          v-if="canShare"
          @click="$emit('share')"
          aria-label="Bagikan Foto"
          class="w-full bg-[#f9f6f0] text-black border-2 sm:border-4 border-black font-display uppercase tracking-widest text-sm sm:text-xl py-1.5 sm:py-3 px-2 sm:px-6 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer flex items-center justify-center gap-1.5 sm:gap-3 text-center"
        >
          <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 10.742l4.684-2.342m0 5.2l-4.684-2.342M19 12a3 3 0 11-6 0 3 3 0 016 0zM6 6a3 3 0 11-6 0 3 3 0 016 0zm0 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          BAGIKAN
        </button>

        <button
          @click="$emit('retake')"
          aria-label="Mulai Baru (Reset Semua)"
          class="w-full mt-1 sm:mt-2 text-black font-serif italic font-bold border-b-2 border-black pb-0.5 self-center hover:text-red-600 transition-colors text-xs sm:text-base"
        >
          &larr; Mulai Baru
        </button>
      </template>

      <button
        v-if="isExporting"
        disabled
        class="w-full bg-white text-black border-4 border-black font-display uppercase tracking-widest text-xl py-3 px-6 opacity-70 cursor-not-allowed flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div class="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
        MEMPROSES...
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
  (e: 'saveToCloud'): void;
  (e: 'processUpload'): void;
  (e: 'cancelUpload'): void;
  (e: 'captureClick'): void;
  (e: 'confirmPhoto'): void;
  (e: 'scaleChange', scale: number): void;
  (e: 'selectSlot', idx: number): void;
}>();

const isSelectFrame = computed(() => props.state === "SELECT_FRAME");
const isSelectInput = computed(() => props.state === "SELECT_INPUT_MODE");
const isError = computed(() => props.state === "CAMERA_ERROR");
const isRequesting = computed(() => props.state === "REQUESTING_CAMERA");
const isLivePreview = computed(() => props.state === "LIVE_PREVIEW");
const isCountdown = computed(() => props.state === "COUNTDOWN");
const isCapturing = computed(() => props.state === "CAPTURING");
const isConfirmCapture = computed(() => props.state === "CONFIRM_CAPTURE");
const isUploadPreview = computed(() => props.state === "UPLOAD_PREVIEW");
const isReview = computed(() => props.state === "REVIEW");
const isExporting = computed(() => props.state === "EXPORTING");
</script>

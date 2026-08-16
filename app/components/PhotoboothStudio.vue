<template>
  <div class="flex flex-col items-center w-full relative">
    
    <!-- Toast Notification Popup -->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform -translate-y-4 opacity-0 scale-95"
                enter-to-class="transform translate-y-0 opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform translate-y-0 opacity-100 scale-100"
                leave-to-class="transform -translate-y-4 opacity-0 scale-95">
      <div v-if="toastMessage" class="fixed top-5 z-50 max-w-md w-full mx-auto px-4 pointer-events-none">
        <div class="bg-black text-white border-3 border-gold-light p-4 shadow-brutal flex items-center gap-3">
          <Flag class="w-6 h-6 text-primary fill-primary shrink-0" />
          <p class="font-sans font-bold text-xs sm:text-sm leading-snug flex-1">
            {{ toastMessage }}
          </p>
        </div>
      </div>
    </transition>

    <!-- Camera Flash Effect Overlay -->
    <div v-if="isFlashing" class="fixed inset-0 bg-white z-[9999] pointer-events-none animate-flash"></div>

    <!-- Show Loading Spinner while loading settings -->
    <div v-if="loadingSettings" class="flex flex-col items-center justify-center min-h-[400px] w-full text-center">
      <div class="w-12 h-12 bg-primary border-4 border-black shadow-brutal animate-spin mb-6"></div>
      <p class="text-xl text-black font-display uppercase tracking-widest animate-pulse">Memuat Studio 17-an...</p>
    </div>

    <!-- Show Event Inactive State if disabled by Admin -->
    <div v-else-if="settings && !settings.active" class="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 px-6 bg-paper border-4 border-black shadow-brutal mt-8">
      <div class="w-16 h-16 bg-primary text-white border-3 border-black shadow-brutal-sm flex items-center justify-center font-display text-3xl mb-4">
        !
      </div>
      <h1 class="text-2xl sm:text-3xl font-display text-black uppercase tracking-wider mb-3 border-b-4 border-black pb-2">
        Akses Ditutup Sementara
      </h1>
      <p class="text-sm sm:text-base text-black/80 font-sans font-semibold mb-6">
        {{ settings.maintenanceMessage || "Studio foto saat ini sedang dinonaktifkan sementara oleh panitia. Nantikan pengumuman acara berikutnya!" }}
      </p>
      <a
        href="/"
        class="bg-black hover:bg-neutral-800 text-white font-display text-base uppercase tracking-widest py-3 px-8 border-3 border-black shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </a>
    </div>

    <!-- Guard: no frames available at all -->
    <div v-else-if="framesList.length === 0" class="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 px-4 gap-4">
      <div class="p-6 bg-white border-4 border-black shadow-brutal text-black text-left space-y-3">
        <h3 class="font-display uppercase tracking-widest text-xl border-b-3 border-black pb-2">BELUM ADA TEMPLATE BINGKAI</h3>
        <p class="font-sans text-sm font-semibold text-black/80">
          Template statis bawaan telah dinonaktifkan. Silakan login ke halaman Admin untuk mengunggah template bingkai custom PNG Anda.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <a href="/admin" class="bg-primary hover:bg-primary-dark text-white font-display uppercase tracking-widest px-5 py-2.5 border-3 border-black shadow-brutal text-center flex items-center justify-center gap-2">
            <span>KE HALAMAN ADMIN &rarr;</span>
          </a>
          <a href="/" class="bg-white hover:bg-neutral-100 text-black font-display uppercase tracking-widest px-5 py-2.5 border-3 border-black shadow-brutal text-center flex items-center justify-center gap-2">
            <ArrowLeft class="w-4 h-4" />
            <span>KEMBALI</span>
          </a>
        </div>
      </div>
    </div>


    <!-- Step 1 Layout: Full-Screen Template Selection Grid -->
    <div v-else-if="isSelectFrame" class="flex flex-col items-center w-full max-w-5xl mx-auto px-2">
      <div class="text-center space-y-2 max-w-3xl mx-auto mb-6 sm:mb-10 flex flex-col items-center">
        <img src="/logomerah81.png" alt="Logo HUT RI 81" class="h-14 sm:h-20 w-auto object-contain mb-1" />
        <div class="inline-block bg-primary text-white font-display text-xs px-3 py-1 uppercase tracking-widest border-2 border-black mb-1">
          Langkah 1: Pilih Bingkai
        </div>
        <h1 class="text-3xl sm:text-5xl font-display text-black uppercase tracking-wider leading-[0.95]">
          Pilih Bingkai <span class="text-primary">17 Agustus</span>
        </h1>
        <p class="text-xs sm:text-base text-black/80 font-sans font-semibold px-4">
          Mau gaya yang mana? Pilih bingkai, lalu kita lanjut foto!
        </p>
      </div>

      <!-- Frame Cards Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full justify-center pb-24 sm:pb-32">
        <button
          v-for="frame in framesList"
          :key="frame.id"
          @click="selectFrame(frame.id, frame.slots.length)"
          class="flex flex-col text-left bg-white border-3 sm:border-4 border-black transition-all duration-200 w-full focus:outline-none relative group cursor-pointer"
          :class="frame.id === state.activeFrameId ? 'shadow-none translate-y-1 translate-x-1 border-primary bg-gold-light/30 ring-3 ring-primary' : 'shadow-brutal hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-brutal-sm'"
        >
          <!-- Frame Preview Container -->
          <div class="w-full aspect-[4/5] bg-paper-dark relative flex items-center justify-center p-2 sm:p-4 border-b-3 sm:border-b-4 border-black overflow-hidden">
            <div class="absolute inset-0 opacity-15 bg-halftone-black" />
            
            <div
              class="h-full relative overflow-hidden flex items-center justify-center border-2 border-black shadow-sm transition-transform duration-300 group-hover:scale-105 bg-white"
              :style="{ aspectRatio: `${frame.canvasWidth} / ${frame.canvasHeight}` }"
            >
              <img :src="frame.thumbnail ?? frame.src" :alt="frame.name" class="w-full h-full object-contain" />
            </div>

            <!-- Active Selected Indicator -->
            <div v-if="frame.id === state.activeFrameId" class="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] sm:text-[11px] font-display px-2 py-0.5 uppercase tracking-widest border border-black shadow-sm flex items-center gap-1">
              <Check class="w-3 h-3" />
              <span>DIPILIH</span>
            </div>
          </div>

          <!-- Frame Info Footer -->
          <div class="p-2.5 sm:p-3.5 w-full flex flex-col bg-inherit">
            <h3 class="font-display text-xs sm:text-base text-black group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-wide">
              {{ frame.name }}
            </h3>
            <div class="flex items-center justify-between text-[10px] sm:text-xs text-black/70 font-sans font-bold border-t border-black/15 pt-1.5 mt-1.5">
              <span class="flex items-center gap-1">
                <Camera class="w-3.5 h-3.5 text-primary" />
                <span>{{ frame.slots.length }} Slot Foto</span>
              </span>
              <ArrowRight class="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </button>
      </div>

      <!-- Sticky Next Action Bar -->
      <div v-if="state.activeFrameId" class="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 flex justify-center max-w-md w-full">
        <button
          @click="state.status = 'SELECT_INPUT_MODE'"
          class="w-full bg-primary hover:bg-primary-dark text-white border-4 border-black font-display uppercase tracking-widest text-lg sm:text-2xl py-3 sm:py-4 px-8 transition-all shadow-brutal hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 cursor-pointer text-center flex items-center justify-center gap-2.5"
        >
          <span>LANJUT FOTO</span>
          <ArrowRight class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Step 2, 3, 4 Layout: Studio 3-Column Interface -->
    <div v-else class="flex flex-col items-center w-full">
      <div class="text-center space-y-1 max-w-4xl mx-auto mb-3 sm:mb-6 px-4 shrink-0">
        <h1 class="text-2xl sm:text-4xl font-display text-black uppercase tracking-wider leading-tight border-b-3 sm:border-b-4 border-black pb-1 inline-block">
          Studio Photobooth
        </h1>
        <p class="hidden sm:block text-xs sm:text-sm text-black/80 font-sans font-semibold">
          Bingkai: <span class="text-primary font-bold">{{ activeFrame?.name }}</span> • {{ activeFrame?.slots.length }} Foto
        </p>
      </div>

      <div class="w-full max-w-6xl flex flex-col md:grid md:grid-cols-12 gap-4 sm:gap-6 items-center justify-center flex-1 px-2 pb-4">
        
        <!-- Left Column: Camera/Upload Preview, Steps Guide, or Export Help -->
        <div :class="`md:col-span-4 hidden md:flex justify-center w-full ${leftColOrder}`">
          
          <!-- Guide Box for Input Mode Selection -->
          <div v-if="isSelectInput" class="bg-white p-5 border-4 border-black text-left w-full max-w-sm shadow-brutal relative">
            <div class="absolute -top-3.5 left-4 bg-black text-gold-light px-2.5 py-0.5 font-display tracking-widest uppercase text-xs border-2 border-black">
              Biar Hasilnya Mantap
            </div>
            <ul class="text-black font-sans text-xs sm:text-sm space-y-3 font-semibold mt-2">
              <li class="flex gap-2.5 border-b border-black/10 pb-2">
                <span class="font-display text-lg text-primary">1</span>
                <span>
                  <span class="font-bold uppercase tracking-wide text-black">Siapkan Pose</span>
                  <br/>
                  Gunakan kamera HP/laptop atau pilih foto dari galeri.
                </span>
              </li>
              <li class="flex gap-2.5 border-b border-black/10 pb-2">
                <span class="font-display text-lg text-primary">2</span>
                <span>
                  <span class="font-bold uppercase tracking-wide text-black">Senyum Dulu!</span>
                  <br/>
                  Hitung mundur 3 detik, lalu kamera otomatis mengambil foto.
                </span>
              </li>
              <li class="flex gap-2.5">
                <span class="font-display text-lg text-primary">3</span>
                <span>
                  <span class="font-bold uppercase tracking-wide text-black">Atur Sesukamu</span>
                  <br/>
                  Sesuaikan posisi dan zoom sebelum lanjut ke foto berikutnya.
                </span>
              </li>
            </ul>
          </div>

          <!-- Upload Panel (Desktop) -->
          <UploadPanel
            v-else-if="isUploadPreview"
            :photos="state.capturedPhotos"
            @photoUploaded="onPhotoUploaded"
            @photoRemoved="onPhotoRemoved"
            class="hidden md:flex"
          />

          <!-- Webcam Preview (Desktop) -->
          <WebcamPreview
            v-else-if="!isReview"
            ref="webcamPreviewRef"
            :state="state.status"
            :stream="state.stream"
            :photoIndex="state.photoIndex"
            :countdown="state.countdown"
            :capturedPhotos="state.capturedPhotos"
            class="hidden md:flex"
          />

          <!-- Review Tips Box (Desktop) -->
          <div v-else class="bg-white p-5 border-4 border-black text-left w-full max-w-sm shadow-brutal relative">
            <div class="absolute -top-3.5 left-4 bg-primary text-white px-2.5 py-0.5 font-display tracking-widest uppercase text-xs border-2 border-black">
              Simpan Momenmu
            </div>
            <ul class="text-black font-sans text-xs sm:text-sm space-y-3 font-semibold mt-2">
              <li class="flex gap-2.5 border-b border-black/10 pb-2 items-center">
                <Download class="w-5 h-5 text-primary shrink-0" />
                <span>Unduh hasil HD, langsung ke galeri HP.</span>
              </li>
              <li class="flex gap-2.5 border-b border-black/10 pb-2 items-center">
                <Share2 class="w-5 h-5 text-primary shrink-0" />
                <span>Bagikan ke WhatsApp atau Instagram Story.</span>
              </li>
              <li class="flex gap-2.5 items-center">
                <ShieldCheck class="w-5 h-5 text-primary shrink-0" />
                <span>Foto kamu tetap di perangkatmu, nggak tampil publik.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Center Column: Photostrip Live Canvas / Slots Preview -->
        <div :class="`md:col-span-4 flex justify-center w-full relative ${centerColOrder}`">
          
          <!-- MOBILE ONLY COMPONENT PREVIEWS -->
          <div v-if="!isReview && !isSelectInput" class="md:hidden flex items-center justify-center w-full mb-3 sticky top-2 z-40">
            <UploadPanel
              v-if="isUploadPreview"
              :photos="state.capturedPhotos"
              @photoUploaded="onPhotoUploaded"
              @photoRemoved="onPhotoRemoved"
              class="w-full"
            />
            <WebcamPreview
              v-else-if="!isReview && !isSelectInput"
              ref="webcamPreviewRef"
              :state="state.status"
              :stream="state.stream"
              :photoIndex="state.photoIndex"
              :countdown="state.countdown"
              :capturedPhotos="state.capturedPhotos"
              :photoScale="state.photoScales[state.photoIndex]"
              :photoOffsetX="state.photoOffsetsX[state.photoIndex]"
              :photoOffsetY="state.photoOffsetsY[state.photoIndex]"
              @offsetChange="(dx, dy) => handleMobileDrag(dx, dy)"
              class="w-full"
            />
          </div>

          <!-- Final Review Composite Canvas -->
          <div v-if="isReview" class="flex flex-col items-center w-full justify-center">
            <canvas
              ref="canvasRef"
              class="w-full max-w-[280px] h-auto md:max-w-none md:max-h-[72vh] border-4 sm:border-6 border-black shadow-brutal-lg bg-white transition-transform hover:scale-[1.02] duration-300 mx-auto"
              :style="{ aspectRatio: `${activeFrame?.canvasWidth} / ${activeFrame?.canvasHeight}` }"
            ></canvas>
            <p class="font-sans text-xs sm:text-sm font-bold text-black/70 text-center mt-3 sm:mt-4 px-2">
              Merdeka! 🇮🇩 Momen ini resmi jadi kenangan Pesona Cilebut 1.
            </p>
          </div>

          <!-- Desktop Interactive Strip Preview -->
          <div
            v-else-if="activeFrame"
            class="relative w-full max-w-[280px] h-auto md:max-w-none md:max-h-[72vh] border-4 sm:border-6 border-black shadow-brutal-lg overflow-hidden bg-[#e8e4db] flex flex-col select-none transition-all duration-300 mx-auto hidden md:flex"
            :style="{ aspectRatio: `${activeFrame.canvasWidth} / ${activeFrame.canvasHeight}` }"
          >
            <div class="absolute inset-0 bg-neutral-50 opacity-20 bg-halftone-black" style="z-index: 1" />
            
            <img
              :src="activeFrame.src"
              :alt="activeFrame.name"
              class="absolute inset-0 w-full h-full pointer-events-none"
              style="z-index: 2"
            />

            <!-- Interactive Clickable / Draggable Slots -->
            <div class="absolute inset-0" style="z-index: 3">
              <div
                v-for="(slot, idx) in activeFrame.slots"
                :key="idx"
                @click="handleSlotClick(idx)"
                @mousedown="(e) => handleDragStart(e, idx)"
                @touchstart.passive="(e) => handleDragStart(e, idx)"
                class="absolute flex items-center justify-center overflow-hidden text-xs font-bold transition-all duration-200 bg-black/10 text-black border-3 border-dashed border-black/30"
                :class="isSlotClickable(idx) ? 'cursor-pointer pointer-events-auto hover:bg-black/20' : 'pointer-events-none'"
                :style="{
                  left: `${(slot.x / activeFrame.canvasWidth) * 100}%`,
                  top: `${(slot.y / activeFrame.canvasHeight) * 100}%`,
                  width: `${(slot.width / activeFrame.canvasWidth) * 100}%`,
                  height: `${(slot.height / activeFrame.canvasHeight) * 100}%`,
                  ...(isSlotActive(idx) && isSlotClickable(idx) ? {
                    borderColor: '#DC2626',
                    borderStyle: 'solid',
                    borderWidth: '5px',
                    boxShadow: 'inset 0 0 0 3px white'
                  } : {})
                }"
              >
                <img
                  v-if="state.capturedPhotos[idx]"
                  :src="state.capturedPhotos[idx]"
                  alt=""
                  class="w-full h-full object-cover transition-transform duration-100"
                  :style="{
                    transform: `scaleX(${state.inputMode === 'camera' ? -1 : 1}) translate(${state.photoOffsetsX[idx] || 0}%, ${state.photoOffsetsY[idx] || 0}%) scale(${state.photoScales[idx] || 1.0})`
                  }"
                />
                <template v-else>
                  <span class="bg-black text-white px-2 py-0.5 font-display text-xs">
                    {{ isSlotActive(idx) && (state.status === 'COUNTDOWN' || state.status === 'CAPTURING') ? 'POSE!' : `SLOT ${idx + 1}` }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Control Panel & Action Buttons -->
        <div :class="`md:col-span-4 flex justify-center w-full ${rightColOrder}`">
          <ControlPanel
            :state="state.status"
            :canShare="canShare"
            :uploadedCount="filledPhotosCount"
            :slotsCount="activeFrame?.slots.length || 0"
            :photoIndex="state.photoIndex"
            :isAllCaptured="isAllCaptured"
            :photoScale="currentScale"
            :showZoomSlider="showZoomSlider"
            @selectFrameNext="state.status = 'SELECT_INPUT_MODE'"
            @start="startCaptureSequence"
            @startUpload="startUploadSequence"
            @retry="retryPhoto"
            @retake="handleRetake"
            @retakeSame="retakeSameFrame"
            @download="handleDownload"
            @share="handleShare"
            @copyCaption="handleCopyCaption"
            @processUpload="state.status = 'REVIEW'"
            @cancelUpload="cancelUpload"
            @captureClick="startCountdown"
            @confirmPhoto="confirmPhoto"
            @scaleChange="updateScale"
            @selectSlot="handleSlotClick"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Camera, Flag, Check, ArrowRight, ArrowLeft, Download, Share2, ShieldCheck } from 'lucide-vue-next';
import type { PhotoboothState, FrameConfig } from '~/utils/photobooth/types';
import { startCamera, stopCamera } from '~/utils/photobooth/camera';
import { compositePhotostrip } from '~/utils/photobooth/compositor';
import { photoboothService } from '~/services/photoboothService';
import WebcamPreview from './WebcamPreview.vue';
import ControlPanel from './ControlPanel.vue';
import UploadPanel from './UploadPanel.vue';

interface State {
  status: PhotoboothState;
  stream: MediaStream | null;
  capturedPhotos: string[];
  photoScales: number[];
  photoOffsetsX: number[];
  photoOffsetsY: number[];
  photoIndex: number;
  countdown: number;
  activeFrameId: string;
  errorMsg: string;
  inputMode: "camera" | "upload" | null;
}

const state = reactive<State>({
  status: "SELECT_FRAME",
  stream: null,
  capturedPhotos: [],
  photoScales: [],
  photoOffsetsX: [],
  photoOffsetsY: [],
  photoIndex: 0,
  countdown: 0,
  activeFrameId: "",
  errorMsg: "",
  inputMode: null
});

const framesList = ref<FrameConfig[]>([]);
const canShare = ref(true);
const settings = ref<{ active: boolean; maintenanceMessage: string } | null>(null);
const loadingSettings = ref(true);
const isFlashing = ref(false);
const toastMessage = ref('');

const webcamPreviewRef = ref<any>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const activeFrame = computed(() => {
  return framesList.value.find((f) => f.id === state.activeFrameId) || framesList.value[0] || null;
});

const filledPhotosCount = computed(() => state.capturedPhotos.filter(p => p !== "").length);
const isAllCaptured = computed(() => activeFrame.value ? filledPhotosCount.value === activeFrame.value.slots.length : false);

const isSelectFrame = computed(() => state.status === "SELECT_FRAME");
const isSelectInput = computed(() => state.status === "SELECT_INPUT_MODE");
const isUploadPreview = computed(() => state.status === "UPLOAD_PREVIEW");
const isReview = computed(() => state.status === "REVIEW");

const leftColOrder = "order-3 md:order-none";
const centerColOrder = "order-1 md:order-none";
const rightColOrder = "order-2 md:order-none";

// --- Web Audio Camera Shutter Sound Effect ---
const playShutterSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Quick click transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);

    // Mechanical shutter noise
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(ctx.currentTime + 0.01);
  } catch (e) {
    // Audio context may be restricted by user gesture policy
  }
};

const showToast = (msg: string, duration = 4000) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, duration);
};

const getPromoCaption = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `Baru aja foto 17-an di Photobooth HUT RI ke-81 Pesona Cilebut 1!\nYuk abadikan seru-seruan momen kemerdekaanmu juga di: ${origin}`;
};

onMounted(async () => {
  try {
    const [data, framesData] = await Promise.all([
      photoboothService.getSettings(),
      photoboothService.getFrames()
    ]);
    settings.value = data;
    if (framesData && framesData.length > 0 && framesData[0]) {
      framesList.value = framesData;
      state.activeFrameId = framesData[0].id || '';
    }
  } catch (err) {
    console.error("Gagal memuat data:", err);
    settings.value = { active: true, maintenanceMessage: "" };
  } finally {
    loadingSettings.value = false;
  }
});

onUnmounted(() => {
  if (state.stream) {
    stopCamera(state.stream);
  }
});

watch(() => state.status, (newStatus) => {
  const cameraStates = ["REQUESTING_CAMERA", "LIVE_PREVIEW", "COUNTDOWN", "CAPTURING", "CONFIRM_CAPTURE"];
  if (!cameraStates.includes(newStatus) && state.stream) {
    stopCamera(state.stream);
    state.stream = null;
  }

  if (newStatus === "REVIEW" && activeFrame.value && isAllCaptured.value) {
    const mirrorPhotos = state.inputMode === "camera";
    nextTick(() => {
      if (canvasRef.value) {
        compositePhotostrip(canvasRef.value, [...state.capturedPhotos], activeFrame.value!, mirrorPhotos, [...state.photoScales]);
      }
    });
  }
});

const selectFrame = (frameId: string, slotsCount: number) => {
  state.activeFrameId = frameId;
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoOffsetsX = Array(slotsCount).fill(0);
  state.photoOffsetsY = Array(slotsCount).fill(0);
  state.photoIndex = 0;
};

const startCaptureSequence = async () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  state.status = "REQUESTING_CAMERA";
  state.inputMode = "camera";
  state.errorMsg = "";
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoOffsetsX = Array(slotsCount).fill(0);
  state.photoOffsetsY = Array(slotsCount).fill(0);
  state.photoIndex = 0;
  state.countdown = 0;

  try {
    const cameraStream = await startCamera();
    state.stream = cameraStream;
    state.status = "LIVE_PREVIEW";
  } catch (err: any) {
    console.error(err);
    state.errorMsg = err.message || "Gagal mengakses kamera.";
    state.status = "CAMERA_ERROR";
    state.inputMode = null;
  }
};

const startUploadSequence = () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  state.status = "UPLOAD_PREVIEW";
  state.inputMode = "upload";
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoOffsetsX = Array(slotsCount).fill(0);
  state.photoOffsetsY = Array(slotsCount).fill(0);
  state.photoIndex = 0;
  state.countdown = 0;
  state.errorMsg = "";
};

const onPhotoUploaded = (index: number, dataUrl: string) => {
  state.capturedPhotos[index] = dataUrl;
};

const onPhotoRemoved = (index: number) => {
  state.capturedPhotos[index] = "";
  state.photoScales[index] = 1.0;
  state.photoOffsetsX[index] = 0;
  state.photoOffsetsY[index] = 0;
  if (state.status === "CONFIRM_CAPTURE") {
    state.status = "LIVE_PREVIEW";
  }
};

const cancelUpload = () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  if (state.status === "SELECT_INPUT_MODE") {
    state.status = "SELECT_FRAME";
    state.inputMode = null;
    state.capturedPhotos = [];
    state.photoScales = Array(slotsCount).fill(1.0);
    state.photoOffsetsX = Array(slotsCount).fill(0);
    state.photoOffsetsY = Array(slotsCount).fill(0);
  } else {
    state.status = "SELECT_INPUT_MODE";
    state.inputMode = null;
    state.capturedPhotos = [];
    state.photoScales = Array(slotsCount).fill(1.0);
    state.photoOffsetsX = Array(slotsCount).fill(0);
    state.photoOffsetsY = Array(slotsCount).fill(0);
  }
};

let countdownTimer: any = null;
const startCountdown = () => {
  state.status = "COUNTDOWN";
  state.countdown = 3;

  const tick = () => {
    if (state.countdown > 1) {
      state.countdown--;
      countdownTimer = setTimeout(tick, 1000);
    } else {
      state.countdown = 0;
      capturePhoto();
    }
  };
  countdownTimer = setTimeout(tick, 1000);
};

const capturePhoto = () => {
  state.status = "CAPTURING";
  
  // Audio & Flash Effect
  playShutterSound();
  isFlashing.value = true;
  setTimeout(() => {
    isFlashing.value = false;
  }, 400);

  setTimeout(() => {
    if (webcamPreviewRef.value?.videoRef) {
      const video = webcamPreviewRef.value.videoRef;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth || 640;
      tempCanvas.height = video.videoHeight || 480;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        const dataUrl = tempCanvas.toDataURL("image/png");
        state.capturedPhotos[state.photoIndex] = dataUrl;
        
        const nextEmpty = state.capturedPhotos.findIndex(p => !p);
        
        if (nextEmpty !== -1) {
          state.photoIndex = nextEmpty;
          state.status = "LIVE_PREVIEW";
        } else {
          state.status = "CONFIRM_CAPTURE";
        }
      }
    }
  }, 250);
};

const confirmPhoto = () => {
  if (isAllCaptured.value) {
    state.status = "REVIEW";
    return;
  }
  
  const nextEmpty = state.capturedPhotos.findIndex(p => !p);
  if (nextEmpty !== -1) {
    state.photoIndex = nextEmpty;
  }
  state.status = "LIVE_PREVIEW";
};

const retryPhoto = () => {
  state.capturedPhotos[state.photoIndex] = "";
  state.photoScales[state.photoIndex] = 1.0;
  state.photoOffsetsX[state.photoIndex] = 0;
  state.photoOffsetsY[state.photoIndex] = 0;
  state.status = "LIVE_PREVIEW";
};

const handleRetake = () => {
  if (state.stream) {
    stopCamera(state.stream);
    state.stream = null;
  }
  state.status = "SELECT_FRAME";
  state.capturedPhotos = [];
  state.photoScales = [];
  state.photoOffsetsX = [];
  state.photoOffsetsY = [];
  state.photoIndex = 0;
  state.countdown = 0;
  state.inputMode = null;
};

const retakeSameFrame = () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoOffsetsX = Array(slotsCount).fill(0);
  state.photoOffsetsY = Array(slotsCount).fill(0);
  state.photoIndex = 0;
  state.countdown = 0;
  state.inputMode = null;
  state.status = "SELECT_INPUT_MODE";
};

// 1. Direct Download Handler (HD PNG Client-side)
const handleDownload = () => {
  if (!canvasRef.value) return;
  state.status = "EXPORTING";

  canvasRef.value.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photobooth-hut-ri-81-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Foto berhasil diunduh ke perangkatmu!");
    }
    state.status = "REVIEW";
  }, "image/png");
};

// 2. Smart Share Handler (Web Share API with fallback)
const handleShare = async () => {
  if (!canvasRef.value) return;
  state.status = "EXPORTING";

  canvasRef.value.toBlob(async (blob) => {
    if (!blob) {
      state.status = "REVIEW";
      return;
    }

    const fileName = `photobooth-hut-ri-81-${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const caption = getPromoCaption();

    // Check if device supports sharing files directly via OS share sheet
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Photobooth HUT RI ke-81 Pesona Cilebut 1",
          text: caption,
          url: shareUrl
        });
        state.status = "REVIEW";
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn("Native share error, falling back:", err);
        } else {
          state.status = "REVIEW";
          return;
        }
      }
    }

    // Fallback for Desktop / browsers that don't support file sharing
    // 1. Auto download photo
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 2. Copy caption to clipboard
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
      }
    } catch (e) {
      // clipboard fallback
    }

    showToast("Foto ke-download & teks ke-salin. Tinggal upload di WA/IG Story!");
    state.status = "REVIEW";
  }, "image/png");
};

// 3. Copy Caption Handler
const handleCopyCaption = async () => {
  const caption = getPromoCaption();
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(caption);
      showToast("Teks & link ke-salin ke clipboard!");
    } else {
      showToast("Link acara: " + window.location.origin);
    }
  } catch (err) {
    showToast("Link acara: " + window.location.origin);
  }
};

const isSlotActive = (idx: number) => {
  return state.photoIndex === idx && (state.status === "LIVE_PREVIEW" || state.status === "CONFIRM_CAPTURE" || state.status === "COUNTDOWN" || state.status === "CAPTURING" || state.status === "UPLOAD_PREVIEW");
};

const isSlotClickable = (idx: number) => {
  return state.status === "LIVE_PREVIEW" || state.status === "CONFIRM_CAPTURE" || state.status === "UPLOAD_PREVIEW";
};

const handleSlotClick = (idx: number) => {
  if (isSlotClickable(idx)) {
    state.photoIndex = idx;
    const hasPhoto = Boolean(state.capturedPhotos[idx] && state.capturedPhotos[idx] !== "");
    state.status = hasPhoto ? "CONFIRM_CAPTURE" : (state.inputMode === "upload" ? "UPLOAD_PREVIEW" : "LIVE_PREVIEW");
  }
};

const currentSlotHasPhoto = computed<boolean>(() => Boolean(state.capturedPhotos[state.photoIndex] && state.capturedPhotos[state.photoIndex] !== ""));
const showZoomSlider = computed<boolean>(() => Boolean(state.status === "CONFIRM_CAPTURE" || (state.status === "UPLOAD_PREVIEW" && currentSlotHasPhoto.value)));
const currentScale = computed<number>(() => state.photoScales[state.photoIndex] || 1.0);

const updateScale = (scale: number) => {
  if (state.photoIndex > -1) {
    state.photoScales[state.photoIndex] = scale;
    clampOffset(state.photoIndex);
  }
};

const clampOffset = (idx: number) => {
  const scale = state.photoScales[idx] || 1.0;
  const maxOffset = ((scale - 1) / 2) * 100;
  
  if (state.photoOffsetsX[idx] !== undefined) {
    state.photoOffsetsX[idx] = Math.max(-maxOffset, Math.min(maxOffset, state.photoOffsetsX[idx]));
  }
  if (state.photoOffsetsY[idx] !== undefined) {
    state.photoOffsetsY[idx] = Math.max(-maxOffset, Math.min(maxOffset, state.photoOffsetsY[idx]));
  }
};

// --- DRAG LOGIC (Desktop) ---
const dragState = {
  isDragging: false,
  slotIdx: -1,
  startX: 0,
  startY: 0,
  initialOffsetX: 0,
  initialOffsetY: 0,
  containerWidth: 0,
  containerHeight: 0
};

const handleDragStart = (e: MouseEvent | TouchEvent, idx: number) => {
  if (state.status !== 'CONFIRM_CAPTURE' || state.photoIndex !== idx) return;
  const scale = state.photoScales[idx] || 1.0;
  if (scale <= 1.0) return;
  
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

  dragState.isDragging = true;
  dragState.slotIdx = idx;
  dragState.startX = clientX;
  dragState.startY = clientY;
  dragState.initialOffsetX = state.photoOffsetsX[idx] || 0;
  dragState.initialOffsetY = state.photoOffsetsY[idx] || 0;
  
  const target = e.currentTarget as HTMLElement;
  dragState.containerWidth = target.clientWidth;
  dragState.containerHeight = target.clientHeight;

  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('touchmove', handleDragMove, { passive: false });
  window.addEventListener('mouseup', handleDragEnd);
  window.addEventListener('touchend', handleDragEnd);
};

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!dragState.isDragging || dragState.slotIdx === -1) return;
  if ('touches' in e && e.cancelable) {
    e.preventDefault();
  }
  
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
  
  let px = dragState.initialOffsetX + (dx / dragState.containerWidth) * 100;
  let py = dragState.initialOffsetY + (dy / dragState.containerHeight) * 100;
  
  if (state.inputMode === 'camera') {
    px = dragState.initialOffsetX - (dx / dragState.containerWidth) * 100;
  }
  
  state.photoOffsetsX[dragState.slotIdx] = px;
  state.photoOffsetsY[dragState.slotIdx] = py;
  clampOffset(dragState.slotIdx);
};

const handleDragEnd = () => {
  dragState.isDragging = false;
  window.removeEventListener('mousemove', handleDragMove);
  window.removeEventListener('touchmove', handleDragMove);
  window.removeEventListener('mouseup', handleDragEnd);
  window.removeEventListener('touchend', handleDragEnd);
};

// --- DRAG LOGIC (Mobile) ---
const handleMobileDrag = (px: number, py: number) => {
  if (state.status !== 'CONFIRM_CAPTURE') return;
  state.photoOffsetsX[state.photoIndex] = px;
  state.photoOffsetsY[state.photoIndex] = py;
  clampOffset(state.photoIndex);
};
</script>

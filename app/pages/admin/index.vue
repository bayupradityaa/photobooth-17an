<template>
  <div class="min-h-screen p-4 md:p-8" style="background-image: url('/bg.webp'); background-size: cover; background-attachment: fixed;">
    <!-- Authentication Wrapper -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-20 p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 text-center">
      <img src="/logomerah81.png" alt="Logo HUT RI 81" class="h-16 w-auto mx-auto object-contain" />
      <h2 class="font-display uppercase tracking-widest text-3xl text-black border-b-4 border-black pb-4">Akses Terkunci</h2>
      <p class="font-serif italic font-bold text-lg text-black">Masukkan kata sandi untuk masuk ke halaman admin photobooth.</p>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <input v-model="password" type="password" class="w-full px-4 py-3 bg-[#f9f6f0] border-4 border-black text-black font-display uppercase tracking-widest text-center focus:outline-none focus:bg-black focus:text-white transition-colors" placeholder="KATA SANDI" required />
        <button type="submit" class="bg-black text-[#f9f6f0] border-4 border-black font-display uppercase tracking-widest text-xl py-3 px-6 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none cursor-pointer">
          Masuk &rarr;
        </button>
      </form>
    </div>

    <div v-else class="max-w-4xl mx-auto space-y-6">
      
      <!-- Back to home -->
      <a href="/" class="inline-block border-4 border-black bg-white px-4 py-2 font-display uppercase tracking-widest text-black hover:bg-black hover:text-[#f9f6f0] transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
        &larr; Back to Home
      </a>

      <!-- Title section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-4 border-black">
        <div class="flex items-center gap-4">
          <img src="/logomerah81.png" alt="Logo HUT RI 81" class="h-14 w-auto object-contain hidden sm:block" />
          <div>
            <h1 class="text-2xl sm:text-4xl font-display uppercase tracking-widest flex items-center gap-3 text-black">
              <Camera class="h-8 w-8 text-black shrink-0" />
              Kelola Fitur & Template
            </h1>
            <p class="font-serif italic font-bold text-black mt-2 text-lg">
              Atur status event, serta unggah template bingkai foto PNG dengan sistem deteksi lubang transparan otomatis.
            </p>
          </div>
        </div>
        <button class="bg-black text-[#f9f6f0] border-4 border-black flex items-center gap-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer text-sm px-6 py-3 font-display uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" @click="handleOpenAddFrame">
          <Plus class="h-5 w-5" /> Tambah Template
        </button>
      </div>

      <form @submit.prevent="handleSave" class="space-y-8">
        <!-- EVENT SETTINGS CARD -->
        <div class="p-6 border-4 border-black bg-[#f9f6f0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div class="space-y-6">
            <h3 class="text-xl font-display uppercase tracking-widest text-black border-b-4 border-black pb-2">
              1. Pengaturan Event & Akses
            </h3>
            
            <!-- Active Toggle Switch -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-4 border-black gap-4">
              <div>
                <h4 class="text-lg font-display uppercase tracking-widest text-black">Status Sesi Photobooth</h4>
                <p class="font-serif italic font-bold text-black mt-1">
                  Nyalakan untuk membuka akses photobooth, atau matikan untuk menampilkan halaman maintenance.
                </p>
              </div>
              <button
                type="button"
                @click="handleToggleActive"
                class="focus:outline-none flex items-center shrink-0"
              >
                <div v-if="settings.active" class="bg-black text-white px-6 py-3 font-display uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ON</div>
                <div v-else class="bg-white text-black px-6 py-3 font-display uppercase tracking-widest border-4 border-black opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">OFF</div>
              </button>
            </div>

            <!-- Event Name -->
            <div class="space-y-2 text-left">
              <label for="activeEventName" class="block font-display text-black uppercase tracking-widest">
                Nama Event / Sesi Aktif
              </label>
              <input
                type="text"
                id="activeEventName"
                v-model="settings.activeEventName"
                placeholder="Contoh: Peringatan HUT RI ke-81 Pesona Cilebut 1"
                class="w-full px-4 py-3 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-0 font-serif italic font-bold"
                :required="settings.active"
              />
            </div>

            <!-- Maintenance Message -->
            <div class="space-y-2 text-left">
              <label for="maintenanceMessage" class="block font-display text-black uppercase tracking-widest">
                Pesan Saat Photobooth Nonaktif
              </label>
              <textarea
                id="maintenanceMessage"
                v-model="settings.maintenanceMessage"
                rows="3"
                placeholder="Pesan yang akan tampil di halaman ketika status dinonaktifkan..."
                class="w-full px-4 py-3 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-0 font-serif italic font-bold"
                :required="!settings.active"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- CUSTOM PNG FRAME TEMPLATES CARD -->
        <div class="p-6 border-4 border-black bg-[#f9f6f0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black pb-4 gap-4">
              <div>
                <h3 class="text-xl font-display uppercase tracking-widest text-black">
                  2. Daftar Template Bingkai Foto PNG
                </h3>
                <p class="font-serif italic font-bold text-black mt-1">
                  Bingkai foto yang diunggah harus berformat PNG transparan.
                </p>
              </div>
              <button type="button" @click="handleOpenAddFrame" class="bg-black text-[#f9f6f0] px-4 py-2 font-display uppercase tracking-widest hover:bg-white hover:text-black border-4 border-black transition-colors flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <Plus class="h-4 w-4" /> Tambah Bingkai
              </button>
            </div>

            <!-- Grid list of Custom PNG frames -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              <div v-for="frame in settings.customFrames" :key="frame.id" class="relative group border-4 border-black bg-white p-3 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div class="relative aspect-[2/3] w-full border-4 border-black flex items-center justify-center" style="background-image: url('/bg.webp'); background-size: cover;">
                  <img :src="frame.thumbnail ?? frame.src" :alt="frame.name" class="w-full h-full object-contain" />
                  <div class="absolute top-2 left-2 px-2 py-1 bg-black text-white font-display uppercase tracking-widest text-xs border-2 border-black">
                    {{ frame.slots?.length || 0 }} Slot
                  </div>
                  <button
                    type="button"
                    @click="handleDeleteCustomFrame(frame.id)"
                    class="absolute top-2 right-2 p-2 bg-white text-black border-4 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    title="Hapus Bingkai"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <div class="pt-4 text-center">
                  <input v-model="frame.name" type="text" class="w-full px-2 py-1 text-center font-display uppercase tracking-widest text-black border-2 border-transparent hover:border-black focus:border-black focus:outline-none transition-colors" placeholder="NAMA BINGKAI" title="Ubah Nama Bingkai" />
                  <p class="font-serif italic font-bold text-black mt-1">{{ frame.canvasWidth }} x {{ frame.canvasHeight }} px</p>
                </div>
              </div>

              <div v-if="!settings.customFrames || settings.customFrames.length === 0" class="col-span-full py-12 text-center border-4 border-dashed border-black bg-white">
                <ImageIcon class="h-12 w-12 mx-auto mb-4 text-black" />
                <p class="font-serif italic font-bold text-black">Belum ada template bingkai foto custom yang diunggah.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Save button -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            :disabled="isSaving"
            class="bg-black text-[#f9f6f0] px-8 py-4 flex items-center gap-2 font-display uppercase tracking-widest text-lg cursor-pointer transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 border-4 border-black"
          >
            <Save class="h-5 w-5" />
            {{ isSaving ? 'MENYIMPAN...' : 'SIMPAN SEMUA KONFIGURASI' }}
          </button>
        </div>
      </form>

      <!-- MODAL TAMBAH TEMPLATE BINGKAI PNG -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <div class="bg-[#f9f6f0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" style="background-image: url('/bg.webp'); background-size: cover;">
          <div class="p-4 border-b-4 border-black flex justify-between items-center bg-white">
            <h3 class="font-display uppercase tracking-widest text-xl text-black">Tambah Template Bingkai</h3>
            <button @click="isModalOpen = false" class="p-1 hover:bg-black hover:text-white border-4 border-transparent hover:border-black transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6 overflow-y-auto bg-white/90">
            <form @submit.prevent="handleSaveNewFrame" class="space-y-6">
              <div class="flex flex-col gap-2">
                <label class="font-display uppercase tracking-widest text-black">Nama Bingkai Foto</label>
                <input
                  type="text"
                  placeholder="Contoh: Frame Kemerdekaan RI 81 (4 Strip PNG)"
                  v-model="frameName"
                  class="w-full px-4 py-3 bg-white border-4 border-black text-black focus:outline-none focus:ring-0 font-serif italic font-bold"
                  required
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-display uppercase tracking-widest text-black flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span>File Bingkai</span>
                  <span class="text-sm border-2 border-black px-2 py-1 bg-black text-white mt-1 sm:mt-0">Wajib .PNG Transparan</span>
                </label>
                <input
                  type="file"
                  accept="image/png"
                  @change="handlePngFileSelect"
                  class="w-full px-4 py-3 bg-white border-4 border-black text-black cursor-pointer font-serif italic font-bold file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:bg-black file:text-white file:font-display file:uppercase file:tracking-widest file:cursor-pointer"
                  required
                />
              </div>

              <!-- Detection Status Indicator -->
              <div v-if="isAnalyzing" class="p-4 bg-yellow-200 border-4 border-black text-black font-display uppercase tracking-widest flex items-center gap-3">
                <span class="animate-pulse">MENGANALISIS...</span>
              </div>

              <div v-if="pngDataUrl && !isAnalyzing" class="space-y-4 p-4 bg-white border-4 border-black text-black">
                <div class="flex items-center gap-2 font-display uppercase tracking-widest text-lg">
                  <CheckCircle2 class="h-6 w-6" />
                  BERHASIL MENGANALISIS!
                </div>
                <div class="grid grid-cols-2 gap-4 font-serif italic font-bold bg-[#f9f6f0] p-4 border-4 border-black">
                  <div>Resolusi:<br><span class="font-display not-italic uppercase tracking-widest">{{ detectedData.canvasWidth }} x {{ detectedData.canvasHeight }}</span></div>
                  <div>Lubang Terdeteksi:<br><span class="font-display not-italic uppercase tracking-widest">{{ detectedData.slots.length }} SLOT</span></div>
                </div>

                <!-- Canvas Interactive Visual Preview -->
                <div class="space-y-2 mt-4">
                  <span class="font-display uppercase tracking-widest text-sm text-black block">Preview Penyesuaian:</span>
                  <div class="max-h-64 overflow-y-auto border-4 border-black p-2 flex justify-center shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,1)]" style="background-image: url('/bg.webp'); background-size: cover;">
                    <canvas ref="canvasPreviewRef" class="max-h-60 w-auto object-contain border-4 border-black bg-white/50"></canvas>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t-4 border-black mt-6">
                <button type="button" @click="isModalOpen = false" class="px-6 py-3 bg-white border-4 border-black text-black font-display uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                  BATAL
                </button>
                <button type="submit" :disabled="isAnalyzing || isUploadingFrame || !pngDataUrl" class="bg-black text-[#f9f6f0] px-6 py-3 border-4 border-black font-display uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-50 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {{ isUploadingFrame ? 'MENGUNGGAH...' : 'SIMPAN TEMPLATE' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Camera, ToggleLeft, ToggleRight, Save, Plus, Trash2, CheckCircle2, Image as ImageIcon, X } from 'lucide-vue-next';
import { photoboothService } from '../../services/photoboothService';
import { detectPngSlots } from '../../utils/photobooth/pngDetector';
import type { FrameConfig } from '../../utils/photobooth/types';

const isLoading = ref(true);
const isSaving = ref(false);
const isAuthenticated = ref(false);
const password = ref('');

const settings = reactive({
  active: true,
  maintenanceMessage: '',
  activeEventName: '',
  customFrames: [] as FrameConfig[]
});

// Modal State
const isModalOpen = ref(false);
const frameName = ref('');
const pngDataUrl = ref('');
const detectedData = ref({ canvasWidth: 0, canvasHeight: 0, slots: [] as any[] });
const isAnalyzing = ref(false);
const isUploadingFrame = ref(false);
const canvasPreviewRef = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
  const sessionAuth = sessionStorage.getItem('admin_authenticated');
  if (sessionAuth) {
    const res = await photoboothService.authenticate(sessionAuth);
    if (res.success) {
      isAuthenticated.value = true;
      await loadSettings();
    } else {
      sessionStorage.removeItem('admin_authenticated');
    }
  }
});

const handleLogin = async () => {
  if (!password.value) return;
  const res = await photoboothService.authenticate(password.value);
  if (res.success) {
    isAuthenticated.value = true;
    await loadSettings();
  } else {
    alert(res.error || 'Kata sandi salah!');
    password.value = '';
  }
};

const loadSettings = async () => {
  isLoading.value = true;
  try {
    const data = await photoboothService.getSettings();
    settings.active = data.active;
    settings.maintenanceMessage = data.maintenanceMessage;
    settings.activeEventName = data.activeEventName;
    settings.customFrames = data.customFrames;
  } catch (err) {
    console.error('Gagal memuat pengaturan', err);
  } finally {
    isLoading.value = false;
  }
};

const handleToggleActive = () => {
  settings.active = !settings.active;
};

const handleOpenAddFrame = () => {
  frameName.value = '';
  pngDataUrl.value = '';
  detectedData.value = { canvasWidth: 0, canvasHeight: 0, slots: [] };
  isModalOpen.value = true;
};

const handlePngFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
    alert('Template bingkai foto harus berformat PNG transparan!');
    target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const rawSrc = event.target?.result as string;
    if (rawSrc) {
      processAndOptimizePng(rawSrc);
    }
  };
  reader.readAsDataURL(file);
};

const processAndOptimizePng = (rawSrc: string) => {
  isAnalyzing.value = true;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = async () => {
    // 1. Detect transparent slots
    const detection = await detectPngSlots(img);
    
    // 2. Optimize resolution if larger than 1800px to ensure small payload size (< 1.5MB)
    const maxDim = 1800;
    let finalW = detection.canvasWidth;
    let finalH = detection.canvasHeight;
    let scale = 1.0;

    if (finalW > maxDim || finalH > maxDim) {
      if (finalW >= finalH) {
        scale = maxDim / finalW;
        finalW = maxDim;
        finalH = Math.round(detection.canvasHeight * scale);
      } else {
        scale = maxDim / finalH;
        finalH = maxDim;
        finalW = Math.round(detection.canvasWidth * scale);
      }
    }

    const optCanvas = document.createElement('canvas');
    optCanvas.width = finalW;
    optCanvas.height = finalH;
    const optCtx = optCanvas.getContext('2d');
    if (optCtx) {
      optCtx.drawImage(img, 0, 0, finalW, finalH);
    }
    const optimizedDataUrl = optCanvas.toDataURL('image/png');
    
    // Scale slots proportionally
    const scaledSlots = detection.slots.map((s: any) => ({
      x: Math.round(s.x * scale),
      y: Math.round(s.y * scale),
      width: Math.round(s.width * scale),
      height: Math.round(s.height * scale)
    }));

    pngDataUrl.value = optimizedDataUrl;
    detectedData.value = {
      canvasWidth: finalW,
      canvasHeight: finalH,
      slots: scaledSlots
    };
    isAnalyzing.value = false;

    if (scaledSlots.length === 0) {
      alert('Peringatan: Tidak ditemukan lubang foto transparan pada PNG ini. Pastikan area foto 100% transparan.');
    }

    setTimeout(() => {
      const optImg = new Image();
      optImg.onload = () => {
        renderCanvasPreview(optImg, detectedData.value);
      };
      optImg.src = optimizedDataUrl;
    }, 100);
  };
  img.src = rawSrc;
};

const renderCanvasPreview = (img: HTMLImageElement, result: any) => {
  const canvas = canvasPreviewRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = result.canvasWidth;
  canvas.height = result.canvasHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const patternSize = 30;
  for (let y = 0; y < canvas.height; y += patternSize) {
    for (let x = 0; x < canvas.width; x += patternSize) {
      ctx.fillStyle = ((x / patternSize + Math.floor(y / patternSize)) % 2 === 0) ? '#e2e8f0' : '#ffffff';
      ctx.fillRect(x, y, patternSize, patternSize);
    }
  }

  result.slots.forEach((slot: any, index: number) => {
    ctx.fillStyle = 'rgba(255, 95, 178, 0.35)';
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

    ctx.strokeStyle = '#FF5FB2';
    ctx.lineWidth = Math.max(4, Math.floor(result.canvasWidth / 250));
    ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);

    ctx.fillStyle = '#FF5FB2';
    const fontSize = Math.max(24, Math.floor(result.canvasWidth / 40));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillText(`Slot #${index + 1} (${slot.width}x${slot.height}px)`, slot.x + 15, slot.y + fontSize + 15);
  });

  ctx.drawImage(img, 0, 0);
};

const handleSaveNewFrame = async () => {
  if (!frameName.value.trim() || !pngDataUrl.value) return;

  isUploadingFrame.value = true;
  
  const newFrame: any = {
    id: `custom-frame-${Date.now()}`,
    name: frameName.value.trim(),
    base64Image: pngDataUrl.value,
    canvasWidth: detectedData.value.canvasWidth || 1200,
    canvasHeight: detectedData.value.canvasHeight || 1800,
    slots: detectedData.value.slots.length > 0 ? detectedData.value.slots : [
      { x: 50, y: 50, width: 1100, height: 800 }
    ],
    watermark: {
      logo: '',
      text: 'photobooth',
      position: 'bottom-global'
    }
  };

  const res = await photoboothService.addCustomFrame(newFrame);
  if (res.success) {
    // Reload settings to get the fresh frame with proper URL
    await loadSettings();
    isModalOpen.value = false;
    alert('Template berhasil ditambahkan!');
  } else {
    alert('Gagal menambahkan template: ' + res.error);
  }
  isUploadingFrame.value = false;
};

const handleDeleteCustomFrame = async (id: string) => {
  if (confirm('Hapus template bingkai ini?')) {
    const res = await photoboothService.deleteCustomFrame(id);
    if (res.success) {
      settings.customFrames = settings.customFrames.filter(f => f.id !== id);
    } else {
      alert('Gagal menghapus template.');
    }
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    const res = await photoboothService.updateSettings(settings);
    if (res.success) {
      alert('Pengaturan berhasil disimpan!');
    } else {
      alert('Gagal menyimpan: ' + res.error);
    }
  } catch (err) {
    alert('Terjadi kesalahan sistem saat menyimpan');
  } finally {
    isSaving.value = false;
  }
};
</script>

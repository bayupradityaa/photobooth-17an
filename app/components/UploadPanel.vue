<template>
  <div class="bg-[#f9f6f0] border-2 sm:border-4 border-black p-2 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative w-full max-w-[280px] sm:max-w-md mx-auto">
    <!-- Title Bar with Bulk Upload Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4 font-display uppercase tracking-widest text-black text-xs sm:text-sm border-b-2 sm:border-b-4 border-black pb-2 sm:pb-3">
      <div class="flex items-center gap-1.5 sm:gap-2">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12" />
        </svg>
        <span>UNGGAH {{ slotsCount }} FOTO ANDA</span>
      </div>

      <!-- Bulk Multi-Upload Button -->
      <label class="cursor-pointer bg-black text-[#f9f6f0] px-3 py-1.5 font-display uppercase border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Pilih {{ slotsCount }} Foto Sekaligus</span>
        <input
          type="file"
          multiple
          accept="image/*"
          @change="handleBulkFileChange"
          class="hidden"
        />
      </label>
    </div>

    <p class="text-xs text-black mb-4 leading-relaxed font-serif italic font-bold">
      Pilih {{ slotsCount }} foto terbaik dari galeri perangkat Anda untuk disusun ke dalam photostrip bingkai. Anda dapat mengunggah satu-per-satu atau sekaligus.
    </p>

    <!-- Grid of Dynamic Upload Slots -->
    <div class="grid grid-cols-2 gap-3.5 flex-1">
      <div
        v-for="(photoUrl, idx) in photos"
        :key="idx"
        class="relative aspect-square overflow-hidden border-4 border-dashed border-black/30 bg-[#e8e4db] hover:bg-[#d8d4cb] transition-colors flex flex-col items-center justify-center p-2 cursor-pointer group"
        @click="!photoUrl ? triggerFileInput(idx) : null"
      >
        <!-- Hidden file input -->
        <input
          type="file"
          :ref="el => fileInputs[idx] = el as HTMLInputElement"
          accept="image/*"
          @change="(e) => handleFileChange(idx, e)"
          class="hidden"
        />

        <div v-if="photoUrl" class="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
          <img
            :src="photoUrl"
            :alt="`Upload ${idx + 1}`"
            class="w-full h-full object-cover"
          />
          
          <!-- Hover overlay to change or delete -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <button
              @click.stop="triggerFileInput(idx)"
              class="bg-black text-white font-display tracking-widest text-[10px] px-2 py-1 shadow-sm transition-all uppercase"
            >
              Ubah Foto
            </button>
            <button
              @click.stop="() => $emit('photoRemoved', idx)"
              class="bg-red-600 text-white font-display tracking-widest text-[10px] px-2 py-1 shadow-sm transition-all uppercase"
            >
              Hapus
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-2 text-black text-center">
          <div class="w-8 h-8 flex items-center justify-center border-4 border-black group-hover:scale-105 transition-transform bg-transparent">
            <svg class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="text-[11px] font-display tracking-widest uppercase text-black">Foto {{ idx + 1 }}</span>
          <span class="text-[9px] font-serif italic text-black leading-tight max-w-[90px] block font-bold">Klik untuk memilih</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  photos: string[];
}>();

const emit = defineEmits<{
  (e: 'photoUploaded', index: number, dataUrl: string): void;
  (e: 'photoRemoved', index: number): void;
}>();

const slotsCount = computed(() => props.photos.length);
const fileInputs = ref<HTMLInputElement[]>([]);

const triggerFileInput = (index: number) => {
  if (fileInputs.value[index]) {
    fileInputs.value[index].click();
  }
};

const handleFileChange = (index: number, e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        emit('photoUploaded', index, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }
  // reset input so the same file can be selected again
  target.value = '';
};

const handleBulkFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const fileList = Array.from(files).slice(0, slotsCount.value);
    fileList.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          emit('photoUploaded', i, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }
  target.value = '';
};
</script>

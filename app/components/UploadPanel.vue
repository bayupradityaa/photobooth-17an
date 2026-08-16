<template>
  <div class="bg-paper border-3 sm:border-4 border-black p-3 sm:p-5 shadow-brutal flex flex-col relative w-full max-w-[280px] sm:max-w-md mx-auto">
    <!-- Title Bar with Bulk Upload Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 font-display uppercase tracking-widest text-black text-xs sm:text-sm border-b-2 sm:border-b-3 border-black pb-2 sm:pb-3">
      <div class="flex items-center gap-1.5">
        <FolderUp class="w-4 h-4 text-black shrink-0" />
        <span>PILIH {{ slotsCount }} FOTO</span>
      </div>

      <!-- Bulk Multi-Upload Button -->
      <label class="cursor-pointer bg-primary hover:bg-primary-dark text-white px-2.5 py-1 font-display uppercase border-2 border-black shadow-brutal-sm transition-all flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 text-xs">
        <Plus class="w-3.5 h-3.5" />
        <span>Pilih Sekaligus</span>
        <input
          type="file"
          multiple
          accept="image/*"
          @change="handleBulkFileChange"
          class="hidden"
        />
      </label>
    </div>

    <p class="text-xs text-black/80 mb-3 leading-relaxed font-sans font-semibold">
      Pilih {{ slotsCount }} foto terbaik dari galeri perangkatmu.
    </p>

    <!-- Grid of Dynamic Upload Slots -->
    <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5 flex-1">
      <div
        v-for="(photoUrl, idx) in photos"
        :key="idx"
        class="relative aspect-square overflow-hidden border-3 border-dashed border-black/40 bg-white hover:bg-gold-light/20 transition-colors flex flex-col items-center justify-center p-2 cursor-pointer group shadow-sm"
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
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <button
              @click.stop="triggerFileInput(idx)"
              class="bg-white text-black font-display tracking-widest text-[10px] px-2.5 py-1 border border-black shadow-sm uppercase w-full"
            >
              Ganti
            </button>
            <button
              @click.stop="() => $emit('photoRemoved', idx)"
              class="bg-primary text-white font-display tracking-widest text-[10px] px-2.5 py-1 border border-black shadow-sm uppercase w-full"
            >
              Hapus
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-1.5 text-black text-center">
          <div class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform bg-paper-dark rounded-full">
            <Plus class="w-4 h-4 text-black" />
          </div>
          <span class="text-[11px] font-display tracking-wider uppercase text-black">Foto #{{ idx + 1 }}</span>
          <span class="text-[9px] font-sans text-black/60 block font-bold">Pilih Galeri</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FolderUp, Plus } from 'lucide-vue-next';

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
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          emit('photoUploaded', index, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  target.value = '';
};

const handleBulkFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const fileList = Array.from(files).slice(0, slotsCount.value);
    fileList.forEach((file, i) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            emit('photoUploaded', i, event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  target.value = '';
};
</script>

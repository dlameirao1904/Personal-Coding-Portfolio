<template>
  <details v-if="blocks.length && !bare" class="tw-group tw-mt-4 tw-border-t tw-border-[#17211c1f] tw-pt-3">
    <summary
      class="tw-cursor-pointer tw-text-[0.95rem] tw-text-[#0e3328] tw-underline tw-underline-offset-[0.18em] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
    >
      Notas de como está feito
    </summary>
    <div class="tw-mt-4 tw-flex tw-flex-col tw-gap-3 tw-text-[0.98rem] tw-leading-[1.55]">
      <template v-for="(block, index) in blocks" :key="index">
        <h3
          v-if="block.type === 'h'"
          class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-font-[560] tw-leading-[1.15] tw-tracking-[-0.02em]"
          :class="
            block.level === 1 ? 'tw-text-[1.65rem]' : block.level === 2 ? 'tw-text-[1.28rem]' : 'tw-text-[1.08rem]'
          "
        >
          {{ block.text }}
        </h3>
        <p v-else-if="block.type === 'p'" class="tw-m-0">{{ block.text }}</p>
        <ul
          v-else-if="block.type === 'ul'"
          class="tw-m-0 tw-flex tw-list-disc tw-flex-col tw-gap-1 tw-pl-5"
        >
          <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
        </ul>
        <ol
          v-else-if="block.type === 'ol'"
          class="tw-m-0 tw-flex tw-list-decimal tw-flex-col tw-gap-1 tw-pl-5"
        >
          <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
        </ol>
        <pre
          v-else-if="block.type === 'pre'"
          class="tw-m-0 tw-overflow-x-auto tw-rounded-xl tw-bg-[#10241c] tw-px-3 tw-py-2 tw-font-mono tw-text-[0.82rem] tw-leading-relaxed tw-text-[#d7e6df]"
        ><code>{{ block.text }}</code></pre>
        <div v-else class="tw-overflow-x-auto">
          <table class="tw-w-full tw-border-collapse tw-text-left tw-text-[0.88rem]">
            <thead>
              <tr>
                <th
                  v-for="(cell, cellIndex) in block.head"
                  :key="cellIndex"
                  class="tw-border-b tw-border-[#17211c33] tw-px-2 tw-py-1.5 tw-font-[560]"
                >
                  {{ cell }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  class="tw-border-b tw-border-[#17211c14] tw-px-2 tw-py-1.5 tw-align-top"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </details>
  <div
    v-else-if="blocks.length && bare"
    class="tw-flex tw-flex-col tw-gap-3 tw-text-[1em] tw-leading-[1.45] tw-text-[#f7f3ea]"
  >
    <template v-for="(block, index) in blocks" :key="index">
      <h3
        v-if="block.type === 'h'"
        class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-font-[560] tw-leading-[1.15] tw-tracking-[-0.02em] tw-text-[#f7f3ea]"
        :class="block.level === 1 ? 'tw-text-[1.35em]' : block.level === 2 ? 'tw-text-[1.15em]' : 'tw-text-[1.05em]'"
      >
        {{ block.text }}
      </h3>
      <p v-else-if="block.type === 'p'" class="tw-m-0">{{ block.text }}</p>
      <ul v-else-if="block.type === 'ul'" class="tw-m-0 tw-flex tw-list-disc tw-flex-col tw-gap-1 tw-pl-5">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
      </ul>
      <ol v-else-if="block.type === 'ol'" class="tw-m-0 tw-flex tw-list-decimal tw-flex-col tw-gap-1 tw-pl-5">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
      </ol>
      <pre
        v-else-if="block.type === 'pre'"
        class="tw-m-0 tw-overflow-x-auto tw-rounded-lg tw-bg-[#0b1914] tw-px-3 tw-py-2 tw-font-mono tw-text-[0.82em] tw-leading-relaxed tw-text-[#d7e6df]"
      ><code>{{ block.text }}</code></pre>
      <div v-else class="tw-overflow-x-auto">
        <table class="tw-w-full tw-border-collapse tw-text-left tw-text-[0.9em]">
          <thead>
            <tr>
              <th
                v-for="(cell, cellIndex) in block.head"
                :key="cellIndex"
                class="tw-border-b tw-border-[#f7f3ea33] tw-px-2 tw-py-1.5 tw-font-[560]"
              >
                {{ cell }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="tw-border-b tw-border-[#f7f3ea1a] tw-px-2 tw-py-1.5 tw-align-top"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { noteBlocks } from '@/data/notes'

const props = defineProps<{ id: string; bare?: boolean }>()
const blocks = computed(() => noteBlocks(props.id))
</script>

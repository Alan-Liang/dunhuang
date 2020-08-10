<template>
  <m-card outlined class="block">
    <template v-if="block.type === 'question'">
      <p>Question ID: {{ block.id }}</p>
      <m-text-field :id="`block-${block.id}-info`" v-model="block.info" textarea>
        <m-floating-label :for="`block-${block.id}-info`">Content</m-floating-label>
      </m-text-field>
      <div v-for="(choice, j) in (block.choices || [])" :key="choice.id" class="choice">
        <span class="choice__actions">
          <m-icon-button icon="remove" @click="removeChoice(choice.id)" />
          <m-icon-button icon="edit" @click="editChoice(choice.id)" />
        </span>
        <span class="choice__actions">
          <m-icon-button icon="arrow_upward" :disabled="j === 0" @click="upChoice(j)" />
          <m-icon-button icon="arrow_downward" :disabled="j === block.choices.length - 1" @click="downChoice(j)" />
        </span>
        <m-text-field :id="`block-${block.id}-${choice.id}-info`" v-model="choice.content" class="choice__input choice__content" textarea>
          <m-floating-label :for="`block-${block.id}-${choice.id}-info`">Choice</m-floating-label>
        </m-text-field>
        <m-text-field :id="`block-${block.id}-${choice.id}-result`" v-model="choice.result" class="choice__input choice__result" textarea>
          <m-floating-label :for="`block-${block.id}-${choice.id}-result`">Result</m-floating-label>
        </m-text-field>
        <m-text-field :id="`block-${block.id}-${choice.id}-goto`" v-model="choice.goto" type="number" class="choice__input choice__result" outlined>
          <m-floating-label :for="`block-${block.id}-${choice.id}-goto`">Go to</m-floating-label>
        </m-text-field>
      </div>
      <p>
        <m-icon-button icon="add" @click="addChoice" />
        <m-icon-button icon="delete" @click="editor.remove(block.id)" />
        <m-icon-button icon="arrow_upward" :disabled="i === 0" @click="editor.up(i)" />
        <m-icon-button icon="arrow_downward" :disabled="i === blocks.length - 1" @click="editor.down(i)" />
      </p>
    </template>
    <template v-else-if="block.type === 'info' || block.type === 'ending'">
      <p>{{ block.type === 'info' ? 'Information' : 'Ending' }} ID: {{ block.id }}</p>
      <m-text-field v-if="block.type === 'ending'" :id="`block-${block.id}-name`" v-model="block.name" outlined>
        <m-floating-label :for="`block-${block.id}-name`">Ending name</m-floating-label>
      </m-text-field>
      <m-text-field :id="`block-${block.id}-info`" v-model="block.info" textarea>
        <m-floating-label :for="`block-${block.id}-info`">Content</m-floating-label>
      </m-text-field>
      <p>
        <m-icon-button icon="add" disabled />
        <m-icon-button icon="delete" @click="editor.remove(block.id)" />
        <m-icon-button icon="arrow_upward" :disabled="i === 0" @click="editor.up(i)" />
        <m-icon-button icon="arrow_downward" :disabled="i === blocks.length - 1" @click="editor.down(i)" />
        <m-icon-button v-if="block.type === 'info'" icon="edit" @click="editInfoChoice()" />
      </p>
    </template>
    <template v-else>Unknown block</template>
  </m-card>
</template>

<style scoped>
.block { padding: 0 16px; margin: 16px 0; }
.choice { display: flex; align-items: center; margin: 8px 0; }
.choice__actions { display: flex; flex-direction: column; }
.choice__input { margin: 0 8px; }
</style>

<script>
const nextId = array => Math.max(-1, ...array.map(x => x.id)) + 1
export default {
  inject: [ 'editor' ],
  props: {
    block: {
      type: Object,
      required: true,
    },
    blocks: {
      type: Array,
      required: true,
    },
    i: {
      type: Number,
      required: true,
    },
  },
  methods: {
    addChoice () {
      if (!this.block.choices) this.$set(this.block, 'choices', [])
      this.block.choices.push({ id: nextId(this.block.choices) })
    },
    editChoice (cid) {
      this.editor.choiceEditing = this.block.choices.find(x => x.id === cid)
      this.$nextTick(() => this.editor.showChoiceEditing = true)
    },
    editInfoChoice () {
      if (!this.block.choice) this.$set(this.block, 'choice', { id: 0 })
      this.editor.choiceEditing = this.block.choice
      this.$nextTick(() => this.editor.showChoiceEditing = true)
    },
    removeChoice (cid) { this.block.choices.splice(this.block.choices.findIndex(x => x.id === cid), 1) },
    upChoice (j) { this.block.choices.splice(j - 1, 0, ...this.block.choices.splice(j, 1)) },
    downChoice (j) { this.block.choices.splice(j + 1, 0, ...this.block.choices.splice(j, 1)) },
  },
}
</script>

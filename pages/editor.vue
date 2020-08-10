<template>
  <main>
    <m-typo-headline :level="3">Project Dunhuang Editor</m-typo-headline>
    <m-typo-body :level="1">
      <p>
        <m-button @click="showLoad = true">
          Load data
          <m-icon slot="icon" icon="publish" />
        </m-button>·
        <m-button @click="showConfig = true">
          Configurations
          <m-icon slot="icon" icon="settings" />
        </m-button>
      </p>
      <template v-if="showLoad">
        <p>Paste the exported data below.</p>
        <m-text-field v-model="data" textarea />
        <m-button unelevated @click="load">
          Done
          <m-icon slot="icon" icon="done" />
        </m-button>
      </template>
      <edit-card v-for="(block, i) in blocks" :key="block.id" :block="block" :i="i" :blocks="blocks" />
      <p>
        <m-select v-model="selectedAddType" enhanced outlined>
          <template slot="default">
            <m-list-item data-value="question">Question</m-list-item>
            <m-list-item data-value="info">Information</m-list-item>
            <m-list-item data-value="ending">Ending</m-list-item>
          </template>
        </m-select>
        <m-button outlined @click="add">
          Add
          <m-icon slot="icon" icon="add" />
        </m-button>
        <m-button unelevated @click="done">
          Done
          <m-icon slot="icon" icon="done" />
        </m-button>
      </p>
      <div v-if="showData">
        <p>Please copy the data shown below and paste it into <code>index.html</code> as shown.</p>
        <m-text-field v-model="data" class="code" textarea readonly />
      </div>
    </m-typo-body>
    <m-dialog v-model="showChoiceEditing" scrollable>
      <m-typo-headline slot="header" :level="5">Editing choice {{ choiceEditing.id }}</m-typo-headline>
      <m-typo-body slot="body" :level="1">
        <template v-if="choiceEditing.effects">
          <div v-for="(effect, i) in choiceEditing.effects" :key="i" class="effect">
            <m-icon-button icon="remove" @click="removeEffect(i)" />
            <template v-if="effect.type === 'set' || effect.type === 'add'">
              {{ effect.type === 'set' ? 'Set' : 'Add to' }}&nbsp;
              <m-select :id="`effect-${i}-var-n`" v-model="effect.variable" enhanced outlined>
                <template slot="default">
                  <m-list-item v-for="variable in variables" :key="variable" :data-value="variable">{{ variable }}</m-list-item>
                </template>
                <m-floating-label slot="label" :for="`effect-${i}-var-n`">Variable</m-floating-label>
              </m-select>
              &nbsp;{{ effect.type === 'set' ? 'to' : 'by' }}&nbsp;
              <m-text-field :id="`effect-${i}-var-v`" v-model="effect.value" outlined>
                <m-floating-label :for="`effect-${i}-var-v`">Value</m-floating-label>
              </m-text-field>
            </template>
            <template v-else-if="effect.type === 'financial'">
              Add burden&nbsp;
              <m-text-field :id="`effect-${i}-fin-v`" v-model="effect.value" outlined>
                <m-floating-label :for="`effect-hooks-${i}-fin-v`">Value</m-floating-label>
              </m-text-field>
              &nbsp;for&nbsp;
              <m-text-field :id="`effect-${i}-fin-t`" v-model="effect.ttl" outlined type="number">
                <m-floating-label :for="`effect-hooks-${i}-fin-t`">Rounds</m-floating-label>
              </m-text-field>
              &nbsp;Rounds
            </template>
            <template v-else-if="effect.type === 'hooks'">
              <m-text-field :id="`effect-hooks-${i}`" v-model="effect.value" class="code" textarea>
                <m-floating-label :for="`effect-hooks-${i}`">Hooks (JavaScript)</m-floating-label>
              </m-text-field>
            </template>
            <template v-else-if="effect.type === 'region'">
              Control&nbsp;
              <m-select :id="`effect-${i}-region`" v-model="effect.region" enhanced outlined>
                <template slot="default">
                  <m-list-item v-for="region in regions" :key="region" :data-value="region">{{ region }}</m-list-item>
                </template>
                <m-floating-label slot="label" :for="`effect-${i}-region`">Region</m-floating-label>
              </m-select>
              &nbsp;With ethnicity&nbsp;
              <m-text-field :id="`effect-${i}-ethnicity`" v-model="effect.ethnicity" outlined>
                <m-floating-label :for="`effect-${i}-ethnicity`">Ethnicity</m-floating-label>
              </m-text-field>
              &nbsp;and religion&nbsp;
              <m-text-field :id="`effect-${i}-religion`" v-model="effect.religion" outlined>
                <m-floating-label :for="`effect-${i}-religion`">Religion</m-floating-label>
              </m-text-field>
            </template>
            <template v-else>Unknown effect type</template>
          </div>
        </template>
        <p>
          <m-select v-model="selectedAddEffectType" enhanced outlined>
            <template slot="default">
              <m-list-item data-value="set">Set variable</m-list-item>
              <m-list-item data-value="add">Add to variable</m-list-item>
              <m-list-item data-value="financial">Add extra financial burden</m-list-item>
              <m-list-item data-value="region">Control region</m-list-item>
              <m-list-item data-value="hooks">JavaScript hooks</m-list-item>
            </template>
          </m-select>
          <m-button outlined @click="addEffect">
            Add
            <m-icon slot="icon" icon="add" />
          </m-button>
        </p>
      </m-typo-body>
      <m-button slot="acceptButton" class="mdc-dialog__button" data-mdc-dialog-action="OK">OK</m-button>
    </m-dialog>
    <m-dialog v-model="showConfig" scrollable>
      <m-typo-headline slot="header" :level="5">Configurations</m-typo-headline>
      <m-typo-body slot="body" :level="1">
        <p><m-typo-headline :level="6">Regions</m-typo-headline>, one in a line</p>
        <m-text-field v-model="regionsText" textarea />
        <p><m-typo-headline :level="6">Variables</m-typo-headline>, one in a line</p>
        <m-text-field v-model="varText" textarea />
        <p><m-typo-headline :level="6">Region properties</m-typo-headline>, one in a line</p>
        <m-text-field v-model="regionPropsText" textarea />
        <p><m-typo-headline :level="6">Computed variables</m-typo-headline>, JavaScript</p>
        <m-text-field v-model="computed" textarea class="code" />
        <p><m-typo-headline :level="6">Computed region properties</m-typo-headline>, JavaScript</p>
        <m-text-field v-model="regionComputed" textarea class="code" />
        <p><m-typo-headline :level="6">Hooks</m-typo-headline>, JavaScript</p>
        <p>This piece of code will be called after every selection.</p>
        <m-text-field v-model="hooks" textarea class="code" />
        <p><m-typo-headline :level="6">Initialization</m-typo-headline>, JavaScript</p>
        <p>This piece of code will be called on the very start of the game.</p>
        <m-text-field v-model="init" textarea class="code" />
      </m-typo-body>
      <m-button slot="acceptButton" class="mdc-dialog__button" data-mdc-dialog-action="OK">OK</m-button>
    </m-dialog>
  </main>
</template>

<style scoped>
main { padding: 32px; max-width: 1080px; }
.effect { display: flex; align-items: center; }
.mdc-text-field { min-width: 128px; }
</style>
<style>
p { margin: 16px 0; }
.code textarea { font-family: monospace; }
</style>

<script>
const nextId = array => Math.max(-1, ...array.map(x => x.id)) + 1
export default {
  data () {
    return {
      blocks: [],
      selectedAddType: 'question',
      selectedAddEffectType: 'set',
      showLoad: false,
      showData: false,
      data: '',
      showConfig: false,
      showChoiceEditing: false,
      choiceEditing: {},
      variables: [],
      varText: '',
      computed: '',
      regionComputed: '',
      regionProps: [],
      regionPropsText: '',
      regions: [],
      regionsText: '',
      hooks: '',
      init: '',
    }
  },
  watch: {
    variables (val) { this.varText = val.join('\n') },
    varText (val) { this.variables = val.split('\n').filter(Boolean) },
    regionProps (val) { this.regionPropsText = val.join('\n') },
    regionPropsText (val) { this.regionProps = val.split('\n').filter(Boolean) },
    regions (val) { this.regionsText = val.join('\n') },
    regionsText (val) { this.regions = val.split('\n').filter(Boolean) },
  },
  mounted () {
    this.varText = 'Central Authority\nProsperity\nStability Scale\nFinancial Burden\nExtra Financial Burdens'
    this.computed = '{}'
    this.regionComputed = '{\n  Stability: function (vars, props) { return (props.Ethnicity === \'Han\' ? 0 : 4 / props.Harmony + props.Religion === \'Islam\' ? 6 : 0) * vars[\'Stability Scale\'] },\n}'
    this.regionPropsText = 'Ethnicity\nHarmony\nReligion'
    this.regionsText = 'Dunhuang\nKasa\nAgni\nYuli\nKucina\nGumo\nHvattana\nLoulan\nKas\nIli\nLuntai\nZhetysu\nSuyab\nYiwu\nKanka\nSaka'
    this.hooks = 'variables[\'Financial Burden\'] = Math.max(regions.filter(function (r) { return r.controlled }).length - variables.Prosperity / 10 + regions.map(function (r) { return r.controlled ? r.Stability : 0 }).reduce(function (a, b) { return a + b }), 0)\n\nvar expiredBurdens = []\nfor (var i = 0; i < variables[\'Extra Financial Burdens\'].length; i++) {\n  var burden = variables[\'Extra Financial Burdens\'][i]\n  variables[\'Financial Burden\'] += burden.value\n  burden.ttl--\n  if (!burden.ttl) expiredBurdens.push(i)\n}\nvariables[\'Extra Financial Burdens\'] = variables[\'Extra Financial Burdens\'].filter(function (_, i) { return expiredBurdens.indexOf(i) < 0 })\n\nvar poverty = variables[\'Financial Burden\'] > 500\nvar outOfControl = variables[\'Central Authority\'] < 0\nif (poverty && outOfControl) return goto(REPLACE ME WITH POVERTY AND OUT OF CONTROL ID)\nif (outOfControl) return goto(REPLACE ME WITH OUT OF CONTROL ID)\nif (poverty) return goto(REPLACE ME WITH POVERTY ID)'
    this.init = 'variables[\'Extra Financial Burdens\'] = []'
  },
  methods: {
    add () {
      this.blocks.push({ type: this.selectedAddType, id: nextId(this.blocks) })
    },
    remove (id) {
      this.blocks.splice(this.blocks.findIndex(x => x.id === id), 1)
    },
    addEffect () {
      if (!this.choiceEditing.effects) this.$set(this.choiceEditing, 'effects', [])
      this.choiceEditing.effects.push({ type: this.selectedAddEffectType })
    },
    removeEffect (i) { this.choiceEditing.effects.splice(i, 1) },
    up (i) { this.blocks.splice(i - 1, 0, ...this.blocks.splice(i, 1)) },
    down (i) { this.blocks.splice(i + 1, 0, ...this.blocks.splice(i, 1)) },
    done () {
      const { blocks, variables, computed, regionComputed, regionProps, regions, hooks, init } = this
      // 1. use '</scr' + 'ipt>' to make Vue loader happy
      // 2. all data is trusted, no need to consider XSS
      this.data = '<script>window.__DH_DATA__=' + JSON.stringify({ blocks, variables, computed, regionComputed, regionProps, regions, hooks, init }) + '</scr' + 'ipt>'
      this.showData = true
    },
    load () {
      try {
        const data = JSON.parse(this.data.replace('<script>window.__DH_DATA__=', '').replace('</scr' + 'ipt>', ''))
        for (const key of 'blocks, variables, computed, regionComputed, regionProps, regions, hooks, init'.split(', ')) {
          this[key] = data[key]
        }
        this.showLoad = false
      } catch (e) {
        alert('Invalid data, please retry.')
      }
    },
    blockFromId (id) { return this.blocks.find(x => x.id === id) },
  },
  provide () { return { editor: this } },
}
</script>

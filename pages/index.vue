<template>
  <main>
    <div>
      <p v-for="(v, k) in values" :key="k">{{ k }}: {{ v }}</p>
    </div>
    <m-typo-body :level="1">
      <template v-if="currentBlock.type === 'info'">
        <p v-text="currentBlock.info" />
        <m-button unelevated @click="next">Next</m-button>
      </template>
      <template v-else-if="currentBlock.type === 'question'">
        <template v-if="selected">
          <p v-text="selected.result" />
          <m-button unelevated @click="choose">Next</m-button>
        </template>
        <template v-else>
          <p v-text="currentBlock.info" />
          <p v-for="choice in currentBlock.choices" :key="choice.id">
            <m-icon-button icon="arrow_right" @click="selected = choice; choice.result || choose()" /> <span v-text="choice.content" />
          </p>
        </template>
      </template>
      <template v-else-if="currentBlock.type === 'ending'">
        <p v-text="currentBlock.info" />
      </template>
    </m-typo-body>
  </main>
</template>

<style scoped>
main { padding: 32px; }
</style>

<script>
/* eslint-disable no-eval */
// eslint-disable-next-line
window.__DH_DATA__={"blocks":[{"type":"question","id":0,"info":"Hello.","choices":[{"id":0,"content":"Choice.","result":"Result."}]},{"type":"ending","id":1,"name":"Bye.","info":"Bye."}],"variables":["Central Authority","Prosperity","Stability Scale","Financial Burden","Extra Financial Burdens"],"computed":"{}","regionComputed":"{\n  Stability: function (vars, props) { return (props.Ethnicity === 'Han' ? 0 : 4 / props.Harmony + props.Religion === 'Islam' ? 6 : 0) * vars['Stability Scale'] },\n}","regionProps":["Ethnicity","Harmony","Religion"],"regions":["Dunhuang","Kasa","Agni","Yuli","Kucina","Gumo","Hvattana","Loulan","Kas","Ili","Luntai","Zhetysu","Suyab","Yiwu","Kanka","Saka"],"hooks":"","init":"variables['Extra Financial Burdens'] = []"}
export default {
  data () {
    return {
      blocks: window.__DH_DATA__.blocks,
      variables: window.__DH_DATA__.variables,
      regions: window.__DH_DATA__.regions,
      regionProps: window.__DH_DATA__.regionProps,
      computed: eval('(' + window.__DH_DATA__.computed + ')'),
      regionComputed: eval('(' + window.__DH_DATA__.regionComputed + ')'),
      hooks: window.__DH_DATA__.hooks,
      init: window.__DH_DATA__.init,
      currentIndex: 0,
      values: {},
      regionData: {},
      selected: null,
    }
  },
  computed: {
    currentBlock () {
      return this.blocks[this.currentIndex]
    },
  },
  mounted () {
    for (const k of this.variables) this.$set(this.values, k, 0)
    for (const k of this.regions) {
      const o = { controlled: false }
      for (const k of this.regionProps) o[k] = 0
      this.$set(this.regionData, k, o)
    }
    this.callInit()
  },
  methods: {
    invalidateComputed () {
      for (const k in this.computed) this.values[k] = this.computed[k](this.values, this.regionData)
      for (const n in this.regionData) if (this.regionData[n].controlled) for (const k in this.regionComputed) this.regionData[n][k] = this.regionComputed[k](this.values, this.regionData[n])
    },
    callHooks () { return this.callCode(this.hooks) },
    callInit () { return this.callCode(this.init) },
    callCode (code) {
      let wentTo = false
      const goto = x => {
        this.goto(this.blocks.findIndex(b => b.id === x))
        wentTo = true
      }
      ; (0, eval)(';(function (variables, regions, goto) { ' + code + ' })')(this.values, this.regionData, goto)
      this.invalidateComputed()
      return wentTo
    },
    next () {
      if (this.currentBlock.choice && this.currentBlock.choice.effects) {
        let wentTo = this.applyEffects(this.currentBlock.choice.effects)
        wentTo = wentTo || this.callHooks()
        if (wentTo) return
      }
      this.goto(this.currentIndex + 1)
    },
    goto (x) {
      this.currentIndex = x
    },
    choose () {
      const choice = this.selected
      this.selected = null
      let wentTo = false
      if (choice.effects) wentTo = this.applyEffects(choice.effects)
      wentTo = wentTo || this.callHooks()
      if (wentTo) return
      if (choice.goto !== undefined) this.goto(choice.goto)
      else this.goto(this.currentIndex + 1)
    },
    parseString: str => isNaN(str) ? str : Number(str),
    applyEffects (effects) {
      for (const effect of effects) {
        switch (effect.type) {
        case 'set': this.values[effect.variable] = this.parseString(effect.value); break
        case 'add': this.values[effect.variable] += this.parseString(effect.value); break
        case 'financial': this.values['Extra Financial Burdens'].push({ value: this.parseString(effect.value), ttl: this.parseString(effect.ttl) }); break
        case 'hooks': return this.callHooks(effect.value)
        case 'region':
          this.regionData[effect.region].controlled = true
          this.regionData[effect.region].Ethnicity = effect.ethnicity
          this.regionData[effect.region].Religion = effect.religion
          break
        }
      }
      this.invalidateComputed()
    },
  },
}
</script>

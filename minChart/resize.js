import { debounce } from '@/utils'

export default {
  data() {
    return {}
  },
  mounted() {
    this._resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)

    window.addEventListener('resize', this._resizeHandler)

  },
  beforeDestory() {
    window.removeEventListener('resize', this._resizeHandler)
  },
  methods: {
    //
  }
}
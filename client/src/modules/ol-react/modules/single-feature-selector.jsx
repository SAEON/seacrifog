import { PureComponent } from 'react'

const debounce = (cb, duration = 0) => {
  var timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => cb(...args), duration)
  }
}

export default class extends PureComponent {
  state = { selectedFeature: null, selectedLayer: null }

  constructor(props) {
    super(props)
    this.map = this.props.map
  }

  componentDidMount() {
    // Pointer cursor
    this.map.on(
      'pointermove',
      debounce(e => {
        const hit = this.map.forEachFeatureAtPixel(e.pixel, () => true) || false
        e.target.getTarget().style.cursor = hit ? 'pointer' : ''
      }, 3)
    )

    // Add click handler
    this.map.on('click', e => {
      if (this.props.ignoreClicks) return
      const { unselectedStyle, selectedStyle } = this.props
      const { selectedFeature } = this.state
      const { feature, layer } =
        this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => ({
          feature,
          layer,
        })) || {}
      if (selectedFeature) selectedFeature.setStyle(unselectedStyle(selectedFeature))
      if (feature && feature !== selectedFeature) {
        this.setState(
          {
            selectedFeature: feature,
            selectedLayer: layer,
          },
          () => {
            const { selectedFeature } = this.state
            selectedFeature.setStyle(selectedStyle(feature))
            if (this.props.onFeatureSelect) this.props.onFeatureSelect(selectedFeature)
          }
        )
      } else {
        if (selectedFeature) this.unselectFeature()
      }
    })
  }

  /**
   * A callback is allowed (specified by user)
   * HOWEVER, when a callback is not specified,
   * an event argument is passed instead. This needs
   * to be handled
   */
  unselectFeature = (cb = null) => {
    // This function is often called with an event object. which is not a function
    if (typeof cb !== 'function') cb = null

    if (this.props.ignoreClicks) return
    const { unselectedStyle } = this.props
    this.state.selectedFeature.setStyle(unselectedStyle(this.state.selectedFeature))
    this.setState({ selectedFeature: null, selectedLayer: null }, cb)
  }

  render() {
    const { selectedFeature } = this.state
    const { unselectFeature } = this
    return this.props.children({ selectedFeature, unselectFeature })
  }
}

import React from 'react'
import { OlReact } from '../ol-react'
import { polygonStyle } from '../atlas/styles'
import { geoJsonLayer, terrestrisBaseMap } from '../atlas/layers'

export default ({ geoJson }) => {
  const features = geoJson ? geoJsonLayer({ geoJson, style: polygonStyle() }) : null

  const layers = [terrestrisBaseMap()]
  if (features) layers.push(features)
  return <OlReact style={{ height: '100%' }} layers={layers} />
}

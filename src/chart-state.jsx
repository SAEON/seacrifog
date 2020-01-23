import React, { PureComponent } from 'react'

export const ShowChartsState = React.createContext()

export default class extends PureComponent {
  state = {
    showCharts: true
  }

  toggleCharts = (cb = null) =>
    this.setState(
      {
        showCharts: !this.state.showCharts
      },
      cb
    )

  render() {
    const { toggleCharts, state, props } = this

    return (
      <ShowChartsState.Provider
        value={{
          toggleCharts,
          ...state
        }}
      >
        {props.children}
      </ShowChartsState.Provider>
    )
  }
}

import React, { PureComponent } from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { TabsContainer, Tabs, Tab, Button, Toolbar, Grid, Cell, LinearProgress } from 'react-md'
import DataQuery from '../../modules/data-query'
import getExtent from '../../lib/get-sites-extent'
import { ENTIRE_GRAPH } from '../../graphql/queries'
import AutoSizer from 'react-virtualized-auto-sizer'
import { SideMenu, SideMenuFilter, GlobalStateContext } from '../../modules/shared-components'
import orgs from './configuration'
import RecordViewer from './metadata-record-view'
import { Link } from 'react-router-dom'
import Footer from '../../modules/layout/footer'

const scrollToRecord = (index, ref) => ref?.current?.scrollToItem(index)

const mainMenuIconStyle = (disabled, toggled) => ({
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)',
  backgroundColor: toggled ? 'rgba(255,255,255,0.3)' : '',
})

const getProgressStyle = loading => ({
  margin: 0,
  visibility: loading ? 'inherit' : 'hidden',
  position: 'absolute',
})

class View extends PureComponent {
  state = {
    currentIndex: 0,
  }

  constructor(props) {
    super(props)
    this.searchRefs = props.searchResults?.map(() => React.createRef())
  }

  loadMoreItems = (increment, org) => {
    const { updateGlobalState, exeConfigs } = this.props
    updateGlobalState({
      exeConfigs: exeConfigs.map(config => {
        if (config.name === org.exeKey)
          return { offset: config.offset, limit: (config.limit || 0) + increment, name: org.exeKey }
        else return config
      }),
    })
  }

  render() {
    const { searchRefs, props, state } = this
    const { loadingSearchResults, sites, networks, variables, protocols } = props
    const searchResults = [...props.searchResults].sort((a, b) =>
      a.result.result_length < b.result.result_length ? 1 : -1
    )
    const { currentIndex } = state

    return (
      <div>
        {/* Toolbar */}
        <LinearProgress
          id={'search-loading-progress-indicator'}
          style={getProgressStyle(loadingSearchResults)}
        />
        <div id="search-results-header">
          <Toolbar
            colored
            className={'sf-content-header'}
            title={
              searchResults?.reduce((sum, { result }) => sum + (result?.results?.length || 0), 0) +
              ' search results'
            }
            actions={[
              <Button
                key={0}
                tooltipLabel="To top"
                onClick={() => scrollToRecord(0, searchRefs[currentIndex])}
                icon
              >
                arrow_upward
              </Button>,
              <Button
                key={1}
                tooltipLabel="To bottom"
                onClick={() =>
                  scrollToRecord(
                    searchResults?.map(({ result }) => result?.results?.length || 0)[currentIndex] -
                      1,
                    searchRefs[currentIndex]
                  )
                }
                icon
              >
                arrow_downward
              </Button>,
              <SideMenu
                key={2}
                toolbarActions={[]}
                control={({ toggleMenu }) => (
                  <Button
                    tooltipLabel={'View current filters'}
                    tooltipPosition="left"
                    className="md-btn--toolbar"
                    style={mainMenuIconStyle()}
                    onClick={toggleMenu}
                    icon
                  >
                    filter_list
                  </Button>
                )}
              >
                <SideMenuFilter
                  sites={sites}
                  networks={networks}
                  variables={variables}
                  protocols={protocols}
                />
              </SideMenu>,
            ]}
          />
        </div>

        {/* Tabs header (list of orgs) */}
        <TabsContainer
          panelStyle={{ minHeight: 640 }}
          labelAndIcon
          onTabChange={currentIndex => this.setState({ currentIndex })}
        >
          <Tabs tabId="metadata-search-tabs">
            {searchResults?.map(({ result, target }, i) => {
              const { results, result_length } = result
              const org = orgs[target]
              return (
                <Tab
                  key={i}
                  label={
                    <span style={{ color: 'rgba(1, 1, 1, 0.5)' }}>
                      {result_length && result_length !== 0
                        ? result_length === 1
                          ? '1 record'
                          : result_length % 100 === 0
                          ? result_length + '+ records'
                          : result_length + ' records'
                        : '0 records'}
                    </span>
                  }
                  icon={<img src={org.logo} style={{ height: '30px', marginBottom: 5 }} />}
                >
                  <div style={{ padding: '20px' }}>
                    {results && results.length > 0 ? (
                      <AutoSizer id={`autosizer-${i}`} disableHeight>
                        {({ width }) => {
                          return (
                            <InfiniteLoader
                              isItemLoaded={currentIndex => {
                                // If there are less results than a single pagination, then everything is loaded
                                if (results.length < 100) return true
                                // If the current item index is smaller than the result set, then current item is loaded
                                if (currentIndex < results.length) {
                                  return true
                                } else {
                                  return false
                                }
                              }}
                              itemCount={20000000}
                              loadMoreItems={() => this.loadMoreItems(100, org)}
                              threshold={1}
                            >
                              {({ onItemsRendered }) => (
                                <FixedSizeList
                                  height={600}
                                  width={width}
                                  itemCount={results.length}
                                  itemSize={300}
                                  onItemsRendered={onItemsRendered}
                                  ref={searchRefs[i]}
                                >
                                  {({ index, style }) => (
                                    <div id={index} style={style}>
                                      {
                                        results.map((result, j) => (
                                          <RecordViewer i={j} key={j} record={result} {...org} />
                                        ))[index]
                                      }
                                    </div>
                                  )}
                                </FixedSizeList>
                              )}
                            </InfiniteLoader>
                          )
                        }}
                      </AutoSizer>
                    ) : (
                      'NO RESULTS'
                    )}
                  </div>
                </Tab>
              )
            })}
          </Tabs>
        </TabsContainer>
        <Footer />
      </div>
    )
  }
}

export default () => (
  <GlobalStateContext.Consumer>
    {({ africaOnly, searchResults, loadingSearchResults, updateGlobalState, exeConfigs }) =>
      searchResults?.length ? (
        <DataQuery query={ENTIRE_GRAPH} variables={{ extent: getExtent(africaOnly) }}>
          {({ sites, networks, variables, protocols }) => (
            <View
              sites={sites}
              networks={networks}
              variables={variables}
              protocols={protocols}
              searchResults={searchResults}
              loadingSearchResults={loadingSearchResults}
              updateGlobalState={updateGlobalState}
              exeConfigs={exeConfigs}
            />
          )}
        </DataQuery>
      ) : (
        <Grid>
          <Cell>
            {loadingSearchResults ? (
              <p>Loading ...</p>
            ) : (
              <div>
                <h2>No Search Defined</h2>
                <Link className="link" to="/sites">
                  Filter by sites
                </Link>
                <br />
                <Link className="link" to="/networks">
                  Filter by networks
                </Link>
                <br />
                <Link className="link" to="/variables">
                  Filter by variables
                </Link>
                <br />
                <Link className="link" to="/protocols">
                  Filter by protocols
                </Link>
              </div>
            )}
          </Cell>
        </Grid>
      )
    }
  </GlobalStateContext.Consumer>
)

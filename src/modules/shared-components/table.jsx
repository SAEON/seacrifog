import React, { PureComponent } from 'react'
import { mergeLeft } from 'ramda'
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TablePagination,
  TableColumn,
  Toolbar,
  TextField,
  FontIcon
} from 'react-md'

const sortResult = (a, b, reverse = false) => (reverse ? (a > b ? -1 : a < b ? 1 : 0) : a > b ? 1 : a < b ? -1 : 0)

export default class extends PureComponent {
  rowToIdMap = {}
  defaultRowsPerPage = 30
  state = {
    search: '',
    paginationSlice: [0, this.defaultRowsPerPage],
    headers: {},
    filteredData: null
  }

  constructor(props) {
    super(props)
    const { dataDefinitions } = props

    // Set stateful headers
    Object.entries(dataDefinitions)
      .filter(([, { show }]) => show)
      .forEach(([header, opts]) => {
        this.state.headers[header] = mergeLeft({ sorted: false, sortAscending: false }, opts)
      })
  }

  /**
   * There can only be one sorted field
   * First mark all fields as not sorted,
   * and then indicate the sorted field.
   *
   * NTOE the 'sortAscending' field is used
   * to indicate sort state in the table
   */
  applySorting = field => {
    const headers = { ...this.state.headers }
    Object.keys(headers).forEach(key => (headers[key].sorted = false))
    headers[field].sorted = true
    headers[field].sortAscending = !headers[field].sortAscending
    this.setState({ headers })
  }

  render() {
    const { props, rowToIdMap, state, applySorting, defaultRowsPerPage } = this
    const { headers, search, paginationSlice } = state
    const { data, dataDefinitions, toggleSelect, selectedIds } = props

    // Get filtered data
    const searchTerm = search.toUpperCase()
    let filteredData = data.filter(row => {
      let include = false
      Object.entries(row).forEach(([field, value]) => {
        if (dataDefinitions[field].show) {
          if (value.toUpperCase && value.toUpperCase().indexOf(searchTerm) >= 0) {
            include = true
          }
        }
      })
      return include
    })

    // Apply sort if necessary
    // sort() updates the underlying array
    const sortField = Object.entries(headers).find(([, { sorted }]) => sorted) || null
    if (sortField) {
      const [sFieldName, { sortAscending }] = sortField
      console.log(sFieldName, sortAscending)
      filteredData.sort((a, b) => {
        const valA = a[sFieldName]
        const valB = b[sFieldName]
        return sortResult(valA, valB, sortAscending)
      })
    }

    return (
      <>
        <Toolbar style={{ display: 'flex', alignItems: 'center' }} zDepth={0}>
          <TextField
            id="table-search"
            style={{ marginLeft: '20px', display: 'flex' }}
            block={true}
            autoComplete={'off'}
            value={search}
            onChange={search => this.setState({ search })}
            placeholder="Search by table fields..."
            leftIcon={<FontIcon>search</FontIcon>}
          />
        </Toolbar>
        <DataTable
          style={{ fontSize: '12px' }}
          onRowToggle={(rowNum, checked, selectedCount, e) => {
            const id = rowToIdMap[rowNum]
            toggleSelect({ id, selected: checked })
            // const datum = data.find(({ id }) => id === dataId)
          }}
          responsive={true}
          fullWidth
          baseId="selectable-table"
          defaultSelectedRows={(() => {
            return data.map(({ id }, i) => (selectedIds.includes(id) ? true : false))
          })()}
        >
          <TableHeader>
            <TableRow>
              {Object.entries(headers)
                .sort(([, a], [, b]) => sortResult(a.order || -9, b.order || -8))
                .map(([field, { grow, label, sortAscending }], i) => (
                  <TableColumn
                    key={i}
                    grow={grow}
                    role="button"
                    style={{ textAlign: 'center' }}
                    onClick={() => applySorting(field)}
                    sortIcon={<FontIcon>keyboard_arrow_up</FontIcon>}
                    sorted={sortAscending}
                  >
                    {label || field}
                  </TableColumn>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.slice(paginationSlice[0], paginationSlice[1]).map((row, i) => {
              // Keep track of which IDs are in which rows
              rowToIdMap[i + 1] = row.id

              // Return a <TableRow />
              return (
                <TableRow key={i}>
                  {Object.entries(row)
                    .filter(([field]) => dataDefinitions[field] && dataDefinitions[field].show)
                    .sort(([fieldNameA], [fieldNameB]) =>
                      sortResult(dataDefinitions[fieldNameA].order || -9, dataDefinitions[fieldNameB].order || -8)
                    )
                    .map(([field, value], i) => (
                      <TableColumn key={i} plain={true}>
                        {value.truncate ? value.truncate(140) : value}
                      </TableColumn>
                    ))}
                </TableRow>
              )
            })}
          </TableBody>
          <TablePagination
            defaultRowsPerPage={defaultRowsPerPage}
            rowsPerPageItems={[5, 10, 25, 50]}
            rows={filteredData.length}
            rowsPerPageLabel={'Rows'}
            onPagination={(start, rowsPerPage) => this.setState({ paginationSlice: [start, start + rowsPerPage] })}
          />
        </DataTable>
      </>
    )
  }
}

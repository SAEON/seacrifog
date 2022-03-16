import axios from 'axios'
import sparqlQuery from './sparql/sparql-query'

const themeMap = {
  Terrestrial: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Atmospheric: 'http://meta.icos-cp.eu/resources/themes/atmosphere',
  Various: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Oceanic: 'http://meta.icos-cp.eu/resources/themes/ocean',
}

export default async search => {
  const { variables, sites, networks, exeConfigs } = search
  const { offset, limit } = exeConfigs.filter(ec => ec.name === 'icos')[0] || {
    offset: 0,
    limit: 100,
  }
  const { acronym } = networks
  const themeIris = variables.domain.map(v => themeMap[v])

  const doSearch =
    acronym.indexOf('ICOS') >= 0
      ? true
      : [variables, sites].reduce((_, curr) => {
          let doSearch = _ || false
          Object.entries(curr).forEach(([, arr]) => {
            if (arr.length > 0) doSearch = true
          })
          return doSearch
        }, false)

  let data
  let error = null
  if (doSearch) {
    const searchQuery = sparqlQuery({ themeIris, sites, limit, offset })

    const response = await axios({
      baseURL: 'https://meta.icos-cp.eu/sparql',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      data: searchQuery,
    }).catch(e => {
      error = `Error searching ICOS RDF data: ${e.message}`
    })

    data = response?.data
  }

  data = data || {
    results: {
      bindings: [],
    },
  }

  return {
    success: !error,
    error,
    result_length: data?.results?.bindings?.length || 0,
    results: data?.results?.bindings || [],
  }
}

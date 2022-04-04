import axios from 'axios'

const ES_ADDRESS = 'https://proxy.saeon.ac.za/elasticsearch/7.14/saeon-odp-catalogue-search/_search'

/**
 * TODO
 * protocolIdentifiers can't be resolved to SAEON
 * metadata at the moment. So this is disabled
 */
// const getIdentifiers = ({ protocols }) => protocols.doi.join(',')

/**
 * TODO
 * subject search information can't be resolved to SAEON
 * metadata at the moment. So this is disabled
 */
// const getSubjects = search => {
//   const { acronym, type } = search.networks
//   const { name, class: variableClass, domain: variableDomain, technology_type } = search.variables
//   const { category, domain: protocolDomain } = search.protocols
//   return [
//     ...acronym,
//     ...type,
//     ...name,
//     ...variableClass,
//     ...variableDomain,
//     ...technology_type,
//     ...category,
//     ...protocolDomain
//   ]
// }

/**
 * When searching SAEON metadata,
 * network, protocol, and variable titles
 * are resolved to a single 'title' field
 */
const getTitles = search => {
  const { title: networkTitle } = search.networks
  const { name: variableTitle } = search.variables
  const { title: protocolTitle } = search.protocols
  return [...networkTitle, ...variableTitle, ...protocolTitle].join(',')
}

export default async search => {
  // const subjects = getSubjects(search) // SAEON metadata.subjects doesn't correspond to the subjects from the SEACRIFOG UI
  // const identifiers = getIdentifiers(search) // SAEON metadata doesn't have field corresponding to protocol identifiers

  const titles = getTitles(search)

  const exeConfig = search.exeConfigs.filter(ec => ec.name === 'saeon')[0] || {
    offset: 0,
    limit: 100,
  }

  const response = await axios({
    url: ES_ADDRESS,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: {
      from: exeConfig.offset,
      size: exeConfig.limit,
      query: {
        match: {
          'titles.title': {
            query: titles,
          },
        },
      },
    },
  })

  const data = await response.data

  return {
    success: true,
    error: null,
    result_length: data.hits.total.value,
    results: data.hits.hits.map(({ _source }) => _source),
  }
}

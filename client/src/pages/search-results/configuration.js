import React from 'react'
import saeonLogo from '../../../public/saeon-logo.png'
import icosLogo from '../../../public/icos-logo.png'
import FormatSaeonRecord from './record-formats/saeon'
import FormatIcosRecord from './record-formats/icos'
import { format } from 'date-fns'

const formatDate = dt => {
  return format(new Date(dt), 'dd/MM/yyyy')
}

export default {
  'ICOS SEARCH': {
    exeKey: 'icos',
    offset: 0,
    logo: icosLogo,
    title: record =>
      `${record.spec.value} from ${record.stationName.value} (${
        record.stationId.value
      }), ${formatDate(record.from.value)} - ${formatDate(record.to.value)}` || 'NA',
    explorerUri: record =>
      `https://data.icos-cp.eu/portal/#{%22route%22:%22metadata%22,%22id%22:%22${
        record?.dobj?.value?.split('objects/')[1]
      }%22}`,
    previewUri: record =>
      `https://data.icos-cp.eu/portal/#%7B%22route%22%3A%22preview%22%2C%22preview%22%3A%5B%22${
        record?.dobj?.value?.split('objects/')[1]
      }%22%5D%7D`,
    content: record => record,
    FormatContent: ({ content = null }) => <FormatIcosRecord content={content} />,
  },
  'SAEON ODP': {
    exeKey: 'saeon',
    offset: 0,
    logo: saeonLogo,
    title: record => record?.titles?.[0]?.title || 'NA',
    explorerUri: ({ doi, id }) => `https://catalogue.saeon.ac.za/records/${doi || id}`,
    content: record => record,
    FormatContent: ({ content = null }) => <FormatSaeonRecord content={content} />,
  },
}

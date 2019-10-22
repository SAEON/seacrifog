import gql from 'graphql-tag'
import {
  PROTOCOL_FRAGMENT,
  VARIABLE_FRAGMENT,
  DATAPRODUCT_FRAGMENT,
  SITE_FRAGMENT,
  NETWORK_FRAGMENT
} from './fragments'

export const ENTIRE_GRAPH = gql`
  query entireGraph {
    sites ${SITE_FRAGMENT}
    networks ${NETWORK_FRAGMENT}
    variables ${VARIABLE_FRAGMENT}
    protocols ${PROTOCOL_FRAGMENT}
    dataproducts ${DATAPRODUCT_FRAGMENT}
    xrefProtocolsVariables {
      id
      protocol_id
      variable_id
      relationship_type
    }
    xrefDataproductsVariables {
      id
      variable_id
      dataproduct_id
    }
    xrefSitesNetworks {
      id
      site_id
      network_id
    }
    xrefNetworksVariables {
      id
      network_id
      variable_id
    }
  }
`

export const PROTOCOLS_MIN = gql`
  query protocolsMin {
    protocols {
      id
      author
      title
      domain
    }
  }
`

export const VARIABLES_MIN = gql`
  query variablesMin {
    variables {
      id
      name
      class
      domain
    }
  }
`

export const DATAPRODUCTS_MIN = gql`
  query dataproductsMin {
    dataproducts {
      id
      title
      publish_year
      provider
    }
  }
`

export const DATAPRODUCT = gql`
  query dataproduct($id: Int!) {
    dataproduct(id: $id) {
      id
      title
      publish_year
      publish_date
      keywords
      abstract
      provider
      author
      contact
      coverage_spatial
      coverage_temp_start
      coverage_temp_end
      res_spatial
      res_spatial_unit
      res_temperature
      res_temperature_unit
      uncertainty
      uncertainty_unit
      doi
      license
      url_download
      file_format
      file_size
      file_size_unit
      url_info
      created_by
      created_at
      modified_by
      modified_at
      present
      variables {
        id
        name
        class
        domain
        set
        cost
        feasibility
        relevance
      }
    }
  }
`

export const SITES = gql`
  query sites($ids: [Int!]) {
    sites(ids: $ids) {
      id
      name
      networks {
        id
        acronym
        variables {
          id
          name
        }
      }
    }
  }
`

export const SITE = gql`
  query site($id: Int!) {
    site(id: $id) {
      id
      name
    }
  }
`

export const VARIABLE = gql`
  query variable($id: Int!) {
    variable(id: $id) {
      id
      name
      class
      domain
      set
      description
      method
      uri
      rftype
      score
      rating
      relevance
      feasibility
      cost
      updated_by
      updated_at
      frequency_value
      frequency_unit
      frequency_comment
      res_value
      res_unit
      res_comment
      unc_val
      unc_unit
      unc_comment
      req_source
      req_uri
      technology_type
      indirectly_related_protocols {
        id
        title
        author
        category
        domain
      }
      directly_related_protocols {
        id
        title
        author
        category
        domain
      }
      dataproducts {
        id
        title
        publish_year
        provider
        author
        license
        url_download
        file_format
        file_size
      }
      rforcings {
        id
        category
        compound
        min
        best
        max
      }
    }
  }
`

export const PROTOCOL = gql`
  query protocol($id: Int!) {
    protocol(id: $id) {
      id
      doi
      author
      publisher
      title
      publish_date
      publish_year
      coverage_type
      category
      domain
      purpose
      abstract
      license
      language
      format
      sustainability
      version
      resolution
      cost
      source
      created_by
      created_at
      edited_by
      updated_at
      indirectly_related_variables {
        id
        name
        class
        domain
      }
      directly_related_variables {
        id
        name
        class
        domain
      }
    }
  }
`

export const VARIABLES = gql`
  query variables {
    variables {
      id
      name
      class
      domain
      set
      description
      method
      uri
      rftype
      score
      rating
      relevance
      feasibility
      cost
      updated_by
      updated_at
      frequency_value
      frequency_unit
      frequency_comment
      res_value
      res_unit
      res_comment
      unc_val
      unc_unit
      unc_comment
      req_source
      req_uri
      technology_type
    }
  }
`

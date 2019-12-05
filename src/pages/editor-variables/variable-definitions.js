export const fieldDefinitions = {
  id: {
    type: 'Integer', //The data type being represented. Determines what type of editable field is displayed (textField, datePicker, etc)
    editable: false, //Whether or not the field is greyed out
    display: false, //Whether or not the field is actually rendered
    label: 'Variable ID', //The cleaner title of the editable field
    pristine: true //whether or not the field is still untouched by the edit page. False means the field has been edited and will be passed to the mutation
  },
  name: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Name',
    pristine: true
  },
  class: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Class',
    pristine: true
  },
  domain: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Domain',
    pristine: true
  },
  set: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Set',
    pristine: true
  },
  description: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Description',
    pristine: true
  },
  method: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Method',
    pristine: true
  },
  uri: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Uniform Resource Identifier (URI)',
    pristine: true
  },
  rftype: {
    type: 'String',
    editable: true,
    display: true,
    label: 'RF Type',
    pristine: true
  },
  score: {
    type: 'Integer',
    editable: true,
    display: true,
    label: 'Score',
    pristine: true
  },
  rating: {
    type: 'Integer',
    editable: true,
    display: true,
    label: 'Rating',
    pristine: true
  },
  relevance: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Relevance',
    pristine: true
  },
  feasibility: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Feasibility',
    pristine: true
  },
  cost: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Cost',
    pristine: true
  },
  updated_by: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Updated By',
    pristine: true
  },
  updated_at: {
    type: 'Date',
    editable: true,
    display: true,
    label: 'Updated At',
    pristine: true
  },
  frequency_value: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Frequency Value',
    pristine: true
  },
  frequency_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Frequency Unit',
    pristine: true
  },
  frequency_comment: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Frequency Comment',
    pristine: true
  },
  res_value: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Resolution Value',
    pristine: true
  },
  res_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Resolution Unit',
    pristine: true
  },
  res_comment: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Resolution Comment',
    pristine: true
  },
  unc_val: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Uncertainty Value',
    pristine: true
  },
  unc_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Uncertainty Unit',
    pristine: true
  },
  unc_comment: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Uncertainty Comment',
    pristine: true
  },
  req_source: {
    type: 'String',
    editable: true,
    display: true,
    label: '***req=Request?*** Source',
    pristine: true
  },
  req_uri: {
    type: 'String',
    editable: true,
    display: true,
    label: '***req=Request?*** Uniform Resource Identifier (URI)',
    pristine: true
  },
  technology_type: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Technology Type',
    pristine: true
  },
  //RELATIONS:
  addDataproducts: {
    type: 'Relation mutation',
    pristine: true
  },
  removeDataproducts: {
    type: 'Relation mutation',
    pristine: true
  },
  addDirectlyRelatedProtocols: {
    type: 'Relation mutation',
    pristine: true
  },
  addIndirectlyRelatedProtocols: {
    type: 'Relation mutation',
    pristine: true
  },
  removeProtocols: {
    type: 'Relation mutation',
    pristine: true
  }
}

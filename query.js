const query =`
query Indicators(
  $filters: [IndicatorsFiltering],
  $search: String, $first: Int,
  $after: ID,
  $orderBy: IndicatorsOrdering,
  $orderMode: OrderingMode
) {
  indicators(
    filters: $filters,
    search: $search,
    first: $first,
    after: $after,
    orderBy: $orderBy,
    orderMode: $orderMode
  ) {
    edges {
      node {
        id
        standard_id
        entity_type
        parent_types
        spec_version
        created_at
        updated_at
        createdBy {
          ... on Identity {
            id
            standard_id
            entity_type
            parent_types
            spec_version
            name
            description
            roles
            contact_information
            x_opencti_aliases
            created
            modified
            objectLabel {
              edges {
                node {
                  id
                  value
                  color
                }
              }
            }
          }
          ... on Organization {
            x_opencti_organization_type
            x_opencti_reliability
          }
          ... on Individual {
            x_opencti_firstname
            x_opencti_lastname
          }
        }
        objectMarking {
          edges {
            node {
              id
              standard_id
              entity_type
              definition_type
              definition
              created
              modified
              x_opencti_order
              x_opencti_color
            }
          }
        }
        objectLabel {
          edges {
            node {
              id
              value
              color
            }
          }
        }
        externalReferences {
          edges {
            node {
              id
              standard_id
              entity_type
              source_name
              description
              url
              hash
              external_id
              created
              modified
            }
          }
        }
        revoked
        confidence
        created
        modified
        pattern_type
        pattern_version
        pattern
        name
        description
        indicator_types
        valid_from
        valid_until
        x_opencti_score
        x_opencti_detection
        x_opencti_main_observable_type
        x_mitre_platforms
        observables {
          edges {
            node {
              id
              observable_value
            }
          }
        }
        killChainPhases {
          edges {
            node {
              id
              standard_id
              entity_type
              kill_chain_name
              phase_name
              x_opencti_order
              created
              modified
            }
          }
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
      globalCount
    }
  }
}
`;

module.exports = query;

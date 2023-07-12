const indicatorsQuery = `query Indicators(
  $filters: [IndicatorsFiltering]
  $search: String
  $first: Int
  $after: ID
  $orderBy: IndicatorsOrdering
  $orderMode: OrderingMode
) {
  indicators(
    filters: $filters
    search: $search
    first: $first
    after: $after
    orderBy: $orderBy
    orderMode: $orderMode
  ) {
    edges {
      node {
        id
        revoked
        confidence
        pattern_type
        pattern_version
        pattern
        name
        description
        valid_from
        valid_until
        x_opencti_score
        x_opencti_detection
        objectLabel {
          edges {
            node {
              id
              value
              color
            }
          }
        }
        createdBy {
          ... on Identity {
            id
            entity_type
            name
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
}`;

const observablesQuery = `query GetObservedDataList(
  $filters: [StixCyberObservablesFiltering]
  $search: String
  $first: Int
  $after: ID
  $orderBy: StixCyberObservablesOrdering
  $orderMode: OrderingMode
) {
  stixCyberObservables(
    filters: $filters
    search: $search
    first: $first
    after: $after
    orderBy: $orderBy
    orderMode: $orderMode
  ) {
    edges {
      node {
        id
        standard_id
        entity_type
        created_at
        updated_at
        spec_version
        observable_value
        x_opencti_score
        x_opencti_description
        objectMarking {
          edges {
            node {
              definition
              definition_type
              x_opencti_order
              x_opencti_color
            }
          }
        }
        objectLabel {
          edges {
            node {
              value
              color
            }
          }
        }
        creators {
          name
        }
        reports {
          edges {
            node {
              description
            }
          }
        }
        notes {
          edges {
            node {
              content
            }
          }
        }
      }
    }
  }
}
`;

module.exports = { indicatorsQuery, observablesQuery };

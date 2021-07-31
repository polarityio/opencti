const query = `query Indicators(
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

module.exports = query;

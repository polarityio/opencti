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

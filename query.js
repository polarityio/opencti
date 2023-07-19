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
        stixCoreRelationships {
          edges {
            node {
              relationship_type
              confidence
              description
              toRole
              created_at
              updated_at
              created
              start_time
              stop_time
              from {
                __typename
                ... on StixDomainObject {
                  __isStixDomainObject: __typename
                  id
                  entity_type
                  parent_types
                  created_at
                  updated_at
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
                ... on AttackPattern {
                  name
                  description
                  x_mitre_id
                  killChainPhases {
                    edges {
                      node {
                        id
                        phase_name
                        x_opencti_order
                      }
                    }
                  }
                  objectMarking {
                    edges {
                      node {
                        id
                        definition_type
                        definition
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
                  id
                }
                ... on Campaign {
                  name
                  description
                  id
                }
                ... on CourseOfAction {
                  name
                  description
                  id
                }
                ... on Individual {
                  name
                  description
                  id
                }
                ... on Organization {
                  name
                  description
                  id
                }
                ... on Sector {
                  name
                  description
                  id
                }
                ... on System {
                  name
                  description
                  id
                }
                ... on Indicator {
                  name
                  description
                  id
                  pattern_type
                  pattern_version
                  valid_from
                  valid_until
                  x_opencti_score
                  x_opencti_main_observable_type
                  created
                  objectMarking {
                    edges {
                      node {
                        id
                        definition_type
                        definition
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
                }
                ... on Infrastructure {
                  name
                  description
                  id
                }
                ... on IntrusionSet {
                  name
                  description
                  id
                }
                ... on Position {
                  name
                  description
                  id
                }
                ... on City {
                  name
                  description
                  id
                }
                ... on AdministrativeArea {
                  name
                  description
                  id
                }
                ... on Country {
                  name
                  description
                  id
                }
                ... on Region {
                  name
                  description
                  id
                }
                ... on Malware {
                  name
                  description
                  id
                }
                ... on MalwareAnalysis {
                  result_name
                  id
                }
                ... on ThreatActor {
                  __isThreatActor: __typename
                  name
                  description
                }
                ... on Tool {
                  name
                  description
                  id
                }
                ... on Vulnerability {
                  name
                  description
                  id
                }
                ... on Incident {
                  name
                  description
                  id
                }
                ... on Event {
                  name
                  description
                  id
                }
                ... on Channel {
                  name
                  description
                  id
                }
                ... on Narrative {
                  name
                  description
                  id
                }
                ... on Language {
                  name
                  id
                }
                ... on DataComponent {
                  name
                  id
                }
                ... on DataSource {
                  name
                  id
                }
                ... on Case {
                  __isCase: __typename
                  name
                }
                ... on Report {
                  name
                  id
                }
                ... on Grouping {
                  name
                  id
                }
                ... on Note {
                  attribute_abstract
                  content
                  id
                }
                ... on Opinion {
                  opinion
                  id
                }
                ... on ObservedData {
                  name
                  id
                }
                ... on StixCyberObservable {
                  __isStixCyberObservable: __typename
                  id
                  entity_type
                  parent_types
                  observable_value
                  objectMarking {
                    edges {
                      node {
                        id
                        definition_type
                        definition
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
                }
                ... on BasicRelationship {
                  __isBasicRelationship: __typename
                  id
                  entity_type
                  parent_types
                }
                ... on StixCoreRelationship {
                  relationship_type
                  id
                }
                ... on Artifact {
                  id
                }
                ... on AutonomousSystem {
                  id
                }
                ... on BankAccount {
                  id
                }
                ... on CaseIncident {
                  id
                }
                ... on CaseRfi {
                  id
                }
                ... on CaseRft {
                  id
                }
                ... on CaseTemplate {
                  id
                }
                ... on Creator {
                  id
                }
                ... on CryptocurrencyWallet {
                  id
                }
                ... on CryptographicKey {
                  id
                }
                ... on Directory {
                  id
                }
                ... on DomainName {
                  id
                }
                ... on EmailAddr {
                  id
                }
                ... on EmailMessage {
                  id
                }
                ... on EmailMimePartType {
                  id
                }
                ... on EntitySetting {
                  id
                }
                ... on ExternalReference {
                  id
                }
                ... on Feedback {
                  id
                }
                ... on Group {
                  id
                }
                ... on Hostname {
                  id
                }
                ... on IPv4Addr {
                  id
                }
                ... on IPv6Addr {
                  id
                }
                ... on KillChainPhase {
                  id
                }
                ... on Label {
                  id
                }
                ... on MacAddr {
                  id
                }
                ... on MarkingDefinition {
                  id
                }
                ... on MediaContent {
                  id
                }
                ... on Mutex {
                  id
                }
                ... on NetworkTraffic {
                  id
                }
                ... on PaymentCard {
                  id
                }
                ... on PhoneNumber {
                  id
                }
                ... on Process {
                  id
                }
                ... on Software {
                  id
                }
                ... on StixFile {
                  id
                }
                ... on StixRefRelationship {
                  id
                }
                ... on StixSightingRelationship {
                  id
                }
                ... on Task {
                  id
                }
                ... on Text {
                  id
                }
                ... on ThreatActorGroup {
                  id
                }
                ... on ThreatActorIndividual {
                  id
                }
                ... on Url {
                  id
                }
                ... on UserAccount {
                  id
                }
                ... on UserAgent {
                  id
                }
                ... on WindowsRegistryKey {
                  id
                }
                ... on WindowsRegistryValueType {
                  id
                }
                ... on Workspace {
                  id
                }
                ... on X509Certificate {
                  id
                }
              }
              to {
                __typename
                ... on StixDomainObject {
                  __isStixDomainObject: __typename
                  id
                  entity_type
                  parent_types
                  created_at
                  updated_at
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
                ... on AttackPattern {
                  name
                  description
                  x_mitre_id
                  killChainPhases {
                    edges {
                      node {
                        id
                        phase_name
                        x_opencti_order
                      }
                    }
                  }
                  objectMarking {
                    edges {
                      node {
                        id
                        definition_type
                        definition
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
                  id
                }
                ... on Campaign {
                  name
                  description
                  id
                }
                ... on CourseOfAction {
                  name
                  description
                  id
                }
                ... on Individual {
                  name
                  description
                  id
                }
                ... on Organization {
                  name
                  description
                  id
                }
                ... on Sector {
                  name
                  description
                  id
                }
                ... on System {
                  name
                  description
                  id
                }
                ... on Indicator {
                  name
                  description
                  id
                  pattern_type
                  pattern_version
                  valid_from
                  valid_until
                  x_opencti_score
                  x_opencti_main_observable_type
                  created
                  objectMarking {
                    edges {
                      node {
                        id
                        definition_type
                        definition
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
                }
                ... on Infrastructure {
                  name
                  description
                  id
                }
                ... on IntrusionSet {
                  name
                  description
                  id
                }
                ... on Position {
                  name
                  description
                  id
                }
                ... on City {
                  name
                  description
                  id
                }
                ... on AdministrativeArea {
                  name
                  description
                  id
                }
                ... on Country {
                  name
                  description
                  id
                }
                ... on Region {
                  name
                  description
                  id
                }
                ... on Malware {
                  name
                  description
                  id
                }
                ... on MalwareAnalysis {
                  result_name
                  id
                }
                ... on ThreatActor {
                  __isThreatActor: __typename
                  name
                  description
                }
                ... on Tool {
                  name
                  description
                  id
                }
                ... on Vulnerability {
                  name
                  description
                  id
                }
                ... on Incident {
                  name
                  description
                  id
                }
                ... on Event {
                  name
                  description
                  id
                }
                ... on Channel {
                  name
                  description
                  id
                }
                ... on Narrative {
                  name
                  description
                  id
                }
                ... on Language {
                  name
                  id
                }
                ... on DataComponent {
                  name
                  id
                }
                ... on DataSource {
                  name
                  id
                }
                ... on Case {
                  __isCase: __typename
                  name
                }
                ... on Report {
                  name
                  id
                }
                ... on Grouping {
                  name
                  id
                }
                ... on Note {
                  attribute_abstract
                  content
                  id
                }
                ... on Opinion {
                  opinion
                  id
                }
                ... on ObservedData {
                  name
                  id
                }
                ... on StixCyberObservable {
                  __isStixCyberObservable: __typename
                  id
                  entity_type
                  parent_types
                  observable_value
                  objectMarking {
                    edges {
                      node {
                        id
                        definition_type
                        definition
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
                }
                ... on BasicRelationship {
                  __isBasicRelationship: __typename
                  id
                  entity_type
                  parent_types
                }
                ... on StixCoreRelationship {
                  relationship_type
                  id
                }
                ... on Artifact {
                  id
                }
                ... on AutonomousSystem {
                  id
                }
                ... on BankAccount {
                  id
                }
                ... on CaseIncident {
                  id
                }
                ... on CaseRfi {
                  id
                }
                ... on CaseRft {
                  id
                }
                ... on CaseTemplate {
                  id
                }
                ... on Creator {
                  id
                }
                ... on CryptocurrencyWallet {
                  id
                }
                ... on CryptographicKey {
                  id
                }
                ... on Directory {
                  id
                }
                ... on DomainName {
                  id
                }
                ... on EmailAddr {
                  id
                }
                ... on EmailMessage {
                  id
                }
                ... on EmailMimePartType {
                  id
                }
                ... on EntitySetting {
                  id
                }
                ... on ExternalReference {
                  id
                }
                ... on Feedback {
                  id
                }
                ... on Group {
                  id
                }
                ... on Hostname {
                  id
                }
                ... on IPv4Addr {
                  id
                }
                ... on IPv6Addr {
                  id
                }
                ... on KillChainPhase {
                  id
                }
                ... on Label {
                  id
                }
                ... on MacAddr {
                  id
                }
                ... on MarkingDefinition {
                  id
                }
                ... on MediaContent {
                  id
                }
                ... on Mutex {
                  id
                }
                ... on NetworkTraffic {
                  id
                }
                ... on PaymentCard {
                  id
                }
                ... on PhoneNumber {
                  id
                }
                ... on Process {
                  id
                }
                ... on Software {
                  id
                }
                ... on StixFile {
                  id
                }
                ... on StixRefRelationship {
                  id
                }
                ... on StixSightingRelationship {
                  id
                }
                ... on Task {
                  id
                }
                ... on Text {
                  id
                }
                ... on ThreatActorGroup {
                  id
                }
                ... on ThreatActorIndividual {
                  id
                }
                ... on Url {
                  id
                }
                ... on UserAccount {
                  id
                }
                ... on UserAgent {
                  id
                }
                ... on WindowsRegistryKey {
                  id
                }
                ... on WindowsRegistryValueType {
                  id
                }
                ... on Workspace {
                  id
                }
                ... on X509Certificate {
                  id
                }
              }
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
}`;

module.exports = { indicatorsQuery, observablesQuery };

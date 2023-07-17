polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  webUrl: Ember.computed('block.userOptions.url', function () {
    const url = this.get('block.userOptions.url');
    return url.endsWith('/') ? url : `${url}/`;
  }),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  expandableTitleStates: {},
  expandableRelationshipStates: {},
  actions: {
    toggleExpandableTitle: function (index) {
      const modifiedExpandableTitleStates = Object.assign(
        {},
        this.get('expandableTitleStates'),
        {
          [index]: !this.get('expandableTitleStates')[index]
        }
      );

      this.set(`expandableTitleStates`, modifiedExpandableTitleStates);
    },
    expandRelationship: function (relationshipIndex) {
      const modifiedExpandRelationshipStates = Object.assign(
        {},
        this.get('expandableRelationshipStates'),
        {
          [relationshipIndex]: !this.get('expandableRelationshipStates')[
            relationshipIndex
          ]
        }
      );
      this.set(`expandableRelationshipStates`, modifiedExpandRelationshipStates);
    }
  }
});

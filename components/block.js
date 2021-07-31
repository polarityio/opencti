polarity.export = PolarityComponent.extend({
    details: Ember.computed.alias('block.data.details'),
    webUrl: Ember.computed('block.userOptions.url', function(){
        const url = this.get('block.userOptions.url');
        return url.endsWith('/') ? url : `${url}/`;
    })
});

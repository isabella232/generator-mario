'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/handlebars<%= delimiter %>helpers',
  'apps/navigation/navigation<%= delimiter %>item<%= delimiter %>view'
], function ($, _, Backbone, helpers, NavigationItemView) {
  helpers.initialize();

  describe('NavigationItemView', function () {
    beforeEach(function () {
      this.model = new Backbone.Model({
        text: 'English'
      });
      this.view = new NavigationItemView({model: this.model});
      this.view.render();
    });
    it('id should equal 1', function () {
      expect(this.view.$('a').text()).<%=assert.toequal%>('English');
    });
  });
});

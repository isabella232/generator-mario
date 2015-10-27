'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'apps/home/home<%= delimiter %>item<%= delimiter %>view'
], function ($, _, Backbone, HomeItemView) {

  describe('HomeItemView', function () {
    beforeEach(function () {
      this.model = new Backbone.Model({
        name: 'Home'
      });
      this.view = new HomeItemView({model: this.model});
      this.view.render();
    });

    it('render() should return the view object', function () {
      expect(this.view.render()).to.equal(this.view);
    });
    it('id should equal 1', function () {
      expect(this.view.render().$('h2').text()).to.equal('Home');
    });
  });
});

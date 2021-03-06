'use strict';

var utils = require('../utils');
var DirBase = require('../dir-base');
var path = require('path');
var itemview = {};
itemview.path = '';
itemview.class = '';

module.exports = DirBase.extend({
  constructor: function(/*args, options*/) {
    DirBase.apply(this, arguments);
    this.option('itemview', {alias: 'itv', desc: 'specify a item view to use with the collection view (they have to be in the same directory)'});
  },
  initializing: function() {
    // load config
    DirBase.prototype.initializing.call(this);

    this.options.itemview = this.options.itemview || this.options.itv;

    if (this.options.itemview) {
      this.options.itemview = utils.truncateBasePath(this.options.itemview);
      var pathFractions = path.parse(this.options.itemview);
      var customViewName = pathFractions.name;
      var customViewDir = pathFractions.dir;

      utils.verifyPath(utils.fileNameWithPath(pathFractions.dir, pathFractions.name, utils.type.itemview));

      itemview.path = utils.amd(customViewName, utils.type.itemview, customViewDir);
      itemview.class = utils.className(customViewName, utils.type.itemview);
    } else {
      itemview.path = utils.amd(this.name, utils.type.itemview);
      itemview.class = utils.className(this.name, utils.type.itemview);
    }
  },
  writing: function() {
    if (!this.options.itemview) {
      this.composeWith('mario:itemview', {options: {directory: this.options.directory}, args: [this.name]});
    }
    this.fs.copyTpl(
      this.templatePath(this.sourceDir + '_collection-view.js'),
      this.destinationPath(utils.fileNameWithPath(this.options.directory, this.name, utils.type.collectionview)),
      {
        childPath: itemview.path,
        childItemView: itemview.class
      }
    );
    this.fs.copyTpl(
      this.templatePath(this.sourceDir + '_collection-view-test.js'),
      this.destinationPath(utils.testNameWithPath(this.options.directory, this.name, utils.type.collectionview, this.testBaseDir)),
      {
        viewPath: utils.amd(this.name, utils.type.collectionview, this.options.directory),
        viewName: utils.className(this.name, utils.type.collectionview),
        assert: utils.assert[this.testFramework]
      }
    );
  }
});

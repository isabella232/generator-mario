
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs-extra');

describe('aowp-marionette:itemview ', function() {

  describe('without options', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/itemview'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withArguments(['some-feature'])
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'app/scripts/apps/some-feature/some-feature-item-view.js',
        'app/scripts/apps/some-feature/some-feature-item-view-test.js',
        'app/scripts/apps/some-feature/some-feature-item-view-template.hbs'
      ]);
    });
    it('contains template', function() {
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view.js', /JST\['app\/scripts\/apps\/some-feature\/some-feature-item-view-template.hbs'\]/);
    });
    it('test with content', function() {
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view-test.js', /.\/some-feature-item-view/);
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view-test.js', /, SomeFeatureItemView/);
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view-test.js', /new SomeFeatureItemView/);
    });
  });

  describe('ES6', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/itemview'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withArguments(['some-feature'])
        .withOptions({
          ecma: 6
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'app/scripts/apps/some-feature/some-feature-item-view.js',
        'app/scripts/apps/some-feature/some-feature-item-view-test.js',
        'app/scripts/apps/some-feature/some-feature-item-view-template.hbs'
      ]);
    });
    it('contains template', function() {
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view.js', /JST\['app\/scripts\/apps\/some-feature\/some-feature-item-view-template.hbs'\]/);
    });
    it('test with content', function() {
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view-test.js', /import  SomeFeatureItemView from 'apps\/some-feature\/some-feature-item-view'/);
      assert.fileContent('app/scripts/apps/some-feature/some-feature-item-view-test.js', /new SomeFeatureItemView/);
    });
  });

  describe('with options (template, dir)', function() {
    var FEATURE = 'other-feature';
    var PATH_WITH_PREFIX = 'app/scripts/apps/' + FEATURE + '/' + FEATURE;

    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/itemview'))
        .inTmpDir(function(dir) {
          var done = this.async();
          var filePath = path.join(dir, 'app/scripts/apps/template', 'feature-template.hbs');
          fs.ensureFile(filePath, done);
        })
        .withArguments([FEATURE])
        .withOptions({
          template: 'template/feature-template.hbs',
          directory: 'app/scripts/apps/' + FEATURE
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        PATH_WITH_PREFIX + '-item-view-test.js',
        PATH_WITH_PREFIX + '-item-view.js',
      ]);
      assert.noFile('PATH_WITH_PREFIX' + '-item-view-template.hbs');
    });
  });

  describe('with tests in separate dir ', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/itemview'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withArguments(['some-feature'])
        .withOptions({
          tests: 'separate'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'app/scripts/apps/some-feature/some-feature-item-view.js',
        'test/apps/some-feature/some-feature-item-view-test.js',
        'app/scripts/apps/some-feature/some-feature-item-view-template.hbs'
      ]);
    });
  });
});

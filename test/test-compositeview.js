'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var os = require('os');
var chai = require('chai');
chai.use(require('chai-fs'));
var sinon = require('sinon');
var existTest = require('../generators/utils');
var fs = require('fs-extra');
var stub;

var assert = require('yeoman-generator').assert;

describe('aowp-marionette:compositeview', function() {
  describe('without options', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/compositeview'))
        .withGenerators([path.join(__dirname, '../generators/itemview')])
        .withArguments(['apples'])
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'app/scripts/apps/apples/apples-composite-view.js',
        'app/scripts/apps/apples/apples-composite-view-test.js',
        'app/scripts/apps/apples/apples-item-view.js',
        'app/scripts/apps/apples/apples-item-view-template.hbs'
      ]);
    });

    it('contains AMD dependency', function() {
      assert.fileContent('app/scripts/apps/apples/apples-composite-view.js', /'.\/apples-item-view'/);
    });

    it('contains template', function() {
      assert.fileContent('app/scripts/apps/apples/apples-composite-view.js', /JST\['app\/scripts\/apps\/apples\/apples-composite-view-template.hbs']/);
    });

    it('test with right content ', function() {
      assert.fileContent('app/scripts/apps/apples/apples-composite-view-test.js', /.\/apples-composite-view/);
      assert.fileContent('app/scripts/apps/apples/apples-composite-view-test.js', /, ApplesCompositeView/);
      assert.fileContent('app/scripts/apps/apples/apples-composite-view-test.js', /new ApplesCompositeView/);
    });
  });

  describe('with options (dir, itemview, template)', function() {
    before(function(done) {
      stub = sinon.stub(existTest, 'verifyPath', function() {
        return true;
      });
      helpers.run(path.join(__dirname, '../generators/compositeview'))
        .withArguments(['apples'])
        .inTmpDir(function(dir) {
          var done = this.async();
          var filePath = path.join(dir, 'app/scripts/apps/template', 'feature-template.hbs');
          fs.ensureFile(filePath, done);
        })
        .withOptions({
          directory: 'fruit',
          itemview: 'apple',
          template: 'template/feature-template.hbs',
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'app/scripts/apps/fruit/apples-composite-view.js',
        'app/scripts/apps/fruit/apples-composite-view-test.js'
      ]);
    });
    it('contains AMD dependency', function() {
      assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /'.\/apple-item-view'/);
    });
    it('contains template', function() {
      assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /JST\['app\/scripts\/apps\/template\/feature-template.hbs']/);
    });
    afterEach(function(done) {
      stub.restore();
      done();
    });
  });

  describe('ES6', function() {
      before(function(done) {
        helpers.run(path.join(__dirname, '../generators/compositeview'))
          .inDir(path.join(os.tmpdir(), './temp-test'))
          .withArguments(['apples'])
          .withOptions({
            directory: 'fruit',
            ecma: 6
          })
          .withGenerators([[helpers.createDummyGenerator(), 'aowp-marionette:itemview']])
          .on('end', done);
      });
      it('creates files', function() {
        assert.file([
          'app/scripts/apps/fruit/apples-composite-view.js',
          'app/scripts/apps/fruit/apples-composite-view-test.js'
        ]);
      });
      it('contains module dependency', function() {
        assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /import ApplesItemView from '.\/apples-item-view'/);
      });
      it('contains template', function() {
        assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /JST\['app\/scripts\/apps\/fruit\/apples-composite-view-template.hbs']/);
      });
      it('contains childView', function() {
        assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /childView: ApplesItemView/);
      });
      it('test with right content ', function() {
        assert.fileContent('app/scripts/apps/fruit/apples-composite-view-test.js', /import ApplesCompositeView from 'apps\/fruit\/apples-composite-view/);
        assert.fileContent('app/scripts/apps/fruit/apples-composite-view-test.js', /describe\('ApplesCompositeView/);
        assert.fileContent('app/scripts/apps/fruit/apples-composite-view-test.js', /new ApplesCompositeView/);
      });
  });

  describe('with existing itemview and optional dir using expanded paths', function() {
    before(function(done) {
      stub = sinon.stub(existTest, 'verifyPath', function() {
        return true;
      });
      helpers.run(path.join(__dirname, '../generators/compositeview'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withArguments(['apples'])
        .withOptions({
          directory: 'app/scripts/apps/fruit',
          itemview: 'app/scripts/apps/vegetables/broccoli'
        })
        .on('end', done);
    });
    afterEach(function(done) {
      stub.restore();
      done();
    });

    it('creates files', function() {
      assert.file([
        'app/scripts/apps/fruit/apples-composite-view.js',
        'app/scripts/apps/fruit/apples-composite-view-test.js'
      ]);
    });
    it('contains AMD dependency', function() {
      assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /'apps\/vegetables\/broccoli-item-view'/);
    });
    it('contains template', function() {
      assert.fileContent('app/scripts/apps/fruit/apples-composite-view.js', /JST\['app\/scripts\/apps\/fruit\/apples-composite-view-template.hbs']/);
    });
  });

  describe('with tests in separate dir', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/compositeview'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withArguments(['apples'])
        .withOptions({
          tests: 'separate'
        })
        .withGenerators([[helpers.createDummyGenerator(), 'aowp-marionette:itemview']])
        .on('end', done);
    });
    it('creates files', function() {
      assert.file([
        'app/scripts/apps/apples/apples-composite-view.js',
        'test/apps/apples/apples-composite-view-test.js'
      ]);
    });
  });
});

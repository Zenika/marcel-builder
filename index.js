#!/usr/bin/env node
const gulp = require('gulp');
const PolymerProject = require('polymer-build').PolymerProject;
const mergeStream = require('merge-stream')
const HtmlSplitter = require('polymer-build').HtmlSplitter;

const insertLines = require('gulp-insert-lines');

const project = new PolymerProject(require('./polymer.json'));
const sourcesHtmlSplitter = new HtmlSplitter();

const depStream = project.dependencies()
  .pipe(insertLines({
    'after': '<script',
    'lineAfter': 'try {'
  }))
  .pipe(insertLines({
    'before': '</script>',
    'lineBefore': '}catch(err){}'
  }))

mergeStream(project.sources(), depStream)
  .pipe(project.bundler({
    stripComments: true,
    inlineCss: true,
    inlineScripts: true
  }))
  .pipe(gulp.dest('build/'));
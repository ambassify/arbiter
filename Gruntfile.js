/*jslint browser: true*/
/*global $, jQuery, BBBX, test, module, ok, widget, sinon, require*/
module.exports = function (grunt) {

	'use strict';

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch:	{
			jshint: {
				files: ['src/**/*.js'],
				tasks: ['jshint']
			},
			requirejs: {
				files: ['src/**/*.js', 'requirejs.config.js'],
				tasks: ['requirejs']
			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'requirejs.config.js',
				'src/**/*.js',
			],
			options: grunt.file.readJSON('.jshintrc')
		},

		requirejs: {
			options: grunt.file.readJSON('requirejs.config.js'),
			compile: {
				options: { }
			},
			minify: {
				options: {
					optimize: 'uglify',
					out: 'dist/arbiter.min.js'
				}
			},
			oauth_client: { options: { optimize: 'uglify',
				out: 'dist/oauth.client.min.js',
				exclude: [
					'services/ajax/client',
					'services/ajax/server',
					'services/oauth/server',
					'services/oauth/popup'
				]
			}},
			oauth_server: { options: { optimize: 'uglify',
				out: 'dist/oauth.server.min.js',
				exclude: [
					'services/ajax/client',
					'services/ajax/server',
					'services/oauth/client',
					'services/oauth/popup'
				]
			}},
			oauth_popup: { options: { optimize: 'uglify',
				out: 'dist/oauth.popup.min.js',
				exclude: [
					'services/ajax/client',
					'services/ajax/server',
					'services/oauth/client',
					'services/oauth/server'
				]
			}},
		}

	});

};

// jshint node: true, strict: false

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
			' Licensed <%= _.map(pkg.licenses, "type").join(", ") %>\n' +
			'* Copyright (c) 2021 PayPal Accessibility Team and University of Illinois; Licensed BSD */\n',

		bannerCond:
			'/*@cc_on @*/\n' +
			'/*@if (@_jscript_version >= es6) @*/\n',

		footer: '/*@end @*/\n',

		jshint: {
			files: [
				'**/*.js',
				'!**/*.min.js',
				'!downloads/**',
				'!node_modules/**'
			],
			options: {
				jshintrc: "./src/js/.jshintrc",
			}
		},

		concat: {
			core: {
				options: {
					separator: ';',
					banner: '<%= banner %> <%= bannerCond %>',
					footer: '<%= footer %>'
				},
				src:   ['src/js/<%= pkg.name %>.js'],
				dest:  './downloads/js/<%= pkg.name %>.js'
			}
		},

		uglify: {
			options: {
				sourceMap: './downloads/js/<%= pkg.name %>.min.map',
				banner: '<%= banner %> <%= bannerCond %>',
				footer: '<%= footer %>',
				mangle: false,
				sourceMappingURL: 'https://paypal.github.io/skipto/downloads/js/<%= pkg.name %>.min.map'
				//	  , beautify: true
			},
			dist: {
				files: {
					'./downloads/js/<%= pkg.name %>.min.js': ['src/js/<%= pkg.name %>.js']
				}
			}
		},

		cssmin: {
			target:{
				files: {
					'src/css/SkipTo.css': ['src/css/SkipTo.template.css']
				}
			}
		},

		replace: {
			dist: {
				options: {
					variables: {
						'cssContent': '<%= grunt.file.read("src/css/SkipTo.css") %>'
					}
				},
				files: [{
						expand: true,
						flatten: true,
						src: ['./downloads/js/<%= pkg.name %>.js', './downloads/js/<%= pkg.name %>.min.js'],
						dest: './downloads/js/'
					}
				]
			}
		},

		clean: {
			downloads: {
				src: ["downloads/*"]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['jshint', 'concat:core', 'uglify', 'cssmin', 'replace']);
	grunt.registerTask('all', ['jshint', 'concat:core', 'uglify', 'replace']);
};

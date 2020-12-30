const path = require( 'path' ), 
	{ src, dest, series, parallel, watch } = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	postcss = require( 'gulp-postcss' ),
	rename = require( 'gulp-rename' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	autoprefixer = require( 'autoprefixer' ),
	cssnano = require( 'cssnano' ),
	sync = require( 'browser-sync' ).create(),
	del = require( 'del' );

const pathto = {
	html: path.join( __dirname, 'views'),
	assets: {
		sass: path.join( __dirname, 'assets/sass' ),
		js: path.join( __dirname, 'assets/js' ),
		img: path.join( __dirname, 'assets/img' ),
		fonts: path.join( __dirname, 'assets/fonts' ),
	},
	dest: {
		html: path.join( __dirname, 'dest/views' ),
		css: path.join( __dirname, 'dest/assets/css' ),
		js: path.join( __dirname, 'dest/assets/js' ),
		img: path.join( __dirname, 'dest/assets/img' ),
		fonts: path.join( __dirname, 'dest/assets/fonts' ),
	},
};

const glob = {
	html: pathto.html + '/**/*.html',
	sass: pathto.assets.sass + '/**/*.{sass,scss}',
	css: pathto.dest.css + '/**/*.css',
	js: pathto.assets.js + '/**/*.js',
	img: pathto.assets.img + '/**/*',
	fonts: pathto.assets.fonts + '/**/*',
	html: pathto.html + '/**/*.html',
};

const log = ( done ) => {
	console.log( glob.html);
	console.log( glob.sass);
	done();
};

const sass_compile = ( done ) => {
	src( glob.sass )	
		.pipe( sass( {
			outputStyle: 'expended',
			sourceMap: true,
			sourceComments: true,
		} ).on( 'error', sass.logError ) )
/*		.pipe( postcss( [ autoprefixer, cssnano ] ) )
 			.pipe( rename( {
 				extname: '.min.css',			
 			} ) )
*/		
		.pipe( postcss( [ autoprefixer ] ) )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( pathto.dest.css ) )
		.pipe( sync.stream( { match: glob.css }  ) );
	done();
};

const html = ( done ) => {
	src( glob.html )
		.pipe( dest( pathto.dest.html ) );
	done();
};

const watcher = ( done ) => {
	sync.init( {
		server: {
			baseDir: './dest',
			index: 'index.html',
		},
		files: [ glob.css ],
	} );

	watch( glob.html ).on( 'change', series( html, sync.reload ) );
	watch( glob.sass, sass_compile );
};

const clean = ( done ) => {
		del( [ glob.css ] );
	done();
};

exports.default = watcher;
exports.log = log;
exports.clean = clean;


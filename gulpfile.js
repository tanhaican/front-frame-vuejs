/**
 * gulp配置文件
 * 注意事项：各项目的task的任务名称不要相同，以免冲突执行，如加上项目前缀 base_jsmin
 * */

/**
 * gulp插件引入
 * */
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var minJs = require('gulp-uglify');
var concat = require('gulp-concat');
var minCss = require("gulp-minify-css");
var cssver = require('gulp-make-css-url-version');
var replace = require("gulp-replace");
var rename = require('gulp-rename');
var order = require("gulp-order");


//删除static目录
gulp.task("all_clear",function(){
    return del(['dist']);
});

// 检查脚本
gulp.task('js_lint', function() {
    return gulp.src('dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//复制一份完整的未处理的
gulp.task('full_copy', ['all_clear', 'js_lint'], function() {
    return gulp.src(['dev/**/*.*', '!dev/css/*.css', '!dev/js/lib/*.js'])
        .pipe(gulp.dest('dist')); 
});



// 合并，压缩文件
gulp.task('min_csses', ['full_copy'], function () {
    return gulp.src(['dev/{css,js}/*.css','!dev/{css,js}/*.min.css']) // 要压缩的css文件
        .pipe(cssver({useDate:true, format:"yyyyMMddhhmmssS"})) //给css文件里引用文件加版本号（文件MD5）
        .pipe(minCss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false //类型：Boolean 默认：false [是否保留换行]
        })) //压缩css
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/css'));
});


gulp.task('combine_js_lib', ['full_copy'], function() {
    return gulp.src(['dev/js/lib/*.min.js', 'dev/js/lib/*-min.js'])
        .pipe(order([
            'dev/js/lib/sea.min.js', 'dev/js/lib/seajs*.min.js',
            'dev/js/lib/vue.min.js', 'dev/js/lib/vue-resource.min.js', 'dev/js/lib/vue-router.min.js'
        ], {base: './'}))
        .pipe(concat('all.lib.min.js'))
        .pipe(gulp.dest('dist/js/lib'));
});


//压缩js
gulp.task('min_js', ['combine_js_lib'], function () {
    return gulp.src(['dist/js/*.js', 'dist/js/**/*.js', '!dist/js/lib/*.js'])
        .pipe(minJs({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: "license" //保留注释的情况 all，license，function，some
        }))
        .pipe(gulp.dest('dist/js'));
});


//文件内容 版本号
gulp.task("version_replace", function () {
    var oDate = new Date();
    var sDate = oDate.getFullYear() +""+ (oDate.getMonth() +1) +""+ oDate.getDate() +""+ oDate.getHours() +""+ oDate.getMinutes() +""+ oDate.getSeconds() +""+ oDate.getMilliseconds();
    return gulp.src('index_tmp.html')
        .pipe(rename('index.html'))
        .pipe(replace(/_VERSION_/gi, sDate))
        .pipe(gulp.dest('.'));
});


// 默认任务
gulp.task('default', ['min_csses',  'min_js', 'version_replace']);
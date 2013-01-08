module.exports = function(grunt) {
    
    grunt.initConfig({
        lint: {
            all: ["*", "collections/*", "libs/*", "models/*", "views/*"]
        }
    });
};

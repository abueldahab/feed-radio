({
    name: 'main',
    out: 'main-built.js',
    baseUrl: './',
    paths: {
        jquery: "libs/jquery/jquery-1.8.3.min",
        underscore: "libs/underscore/underscore-min",
        backbone: "libs/backbone/backbone-min",
        soundcloud: "http://connect.soundcloud.com/sdk",
        youtube: "http://www.youtube.com/iframe_api?"
    },  
    shim: {
        underscore: { exports: "_" },  
        backbone: { deps: ["jquery", "underscore"], exports: "Backbone" }
    }  
})

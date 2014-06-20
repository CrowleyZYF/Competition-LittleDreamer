// 有关“导航”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    var splash = null; // Variable to hold the splash screen object.
    var coordinates = { x: 0, y: 0, width: 0, height: 0 }; // Object to store splash screen image coordinates. It will be initialized during activation.
    var initVersion = 37;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: 此应用程序刚刚启动。在此处初始化
                // 您的应用程序。
                if (localSettings.values["init"] != undefined) {
                    if (parseInt(localSettings.values["init"]) < initVersion) {
                        initLocalSetting.init();
                    }
                } else {
                    initLocalSetting.init();
                }
                var backAudio = document.getElementById("backAudio");
                backAudio.volume = 0.5;
                backAudio.load();
                backAudio.play();
                var d = document;
                var c = {
                    COCOS2D_DEBUG: 2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
                    box2d: false,
                    chipmunk: false,
                    showFPS: false,
                    frameRate: 60,
                    loadExtension: false,
                    renderMode: 0,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
                    tag: 'gameCanvas',
                    engineDir: '../../js/cocos2D/',
                    appFiles: ['../../js/MZH01/resource.js', '../../js/MZH01/MZH01Stage1Scene.js', '../../js/MZH01/GameOverScene.js']
                };
                document.ccConfig = c;
                var cocos2dApp = cc.Application.extend({
                    config: document['ccConfig'],
                    ctor: function (scene) {
                        this._super();
                        this.startScene = scene;
                        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
                        cc.initDebugSetting();
                        cc.setup(this.config['tag']);
                        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
                    },
                    applicationDidFinishLaunching: function () {
                        var director = cc.Director.getInstance();
                        cc.EGLView.getInstance()._adjustSizeToBrowser();
                        director.setDisplayStats(this.config['showFPS']);
                        director.setAnimationInterval(1.0 / this.config['frameRate']);
                        cc.LoaderScene.preload(g_resources, function () {
                            director.replaceScene(new this.startScene());
                        }, this);
                        return true;
                    }
                });
                var myApp = new cocos2dApp(initEngine);
            } else {
                // TODO: 此应用程序已从挂起状态重新激活。
                // 在此处恢复应用程序状态。
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                splash = args.detail.splashScreen;
                ExtendedSplash.show(splash);
                window.addEventListener("resize", onResize, false);
                setTimeout(function () {
                    ExtendedSplash.remove();
                    if (nav.location) {
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(nav.location, nav.state);
                    } else {
                        return nav.navigate(Application.navigator.home);
                    }
                }, 1500);
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: 即将挂起此应用程序。在此处保存
        //需要持续挂起的任何状态。如果您需要
        //在应用程序挂起之前完成异步操作
        //，请调用 args.setPromise()。
        app.sessionState.history = nav.history;
    };

    function onResize() {
        // Safely update the extended splash screen image coordinates. This function will be fired in response to snapping, unsnapping, rotation, etc...
        if (splash) {
            // Update the coordinates of the splash screen image.
            SdkSample.coordinates = splash.imageLocation;
            ExtendedSplash.updateImageLocation(splash);
        }
    }

    WinJS.Namespace.define("SdkSample", {
        coordinates: coordinates
    });

    app.start();
})();

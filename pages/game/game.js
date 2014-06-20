// 有关“页面控制”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    
    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/game/game.html", {


        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。
            //gameInit.JZ01Init();
            //gameInit.MZH01Init();
            //gameInit.JZ03Init();
            if ((localSettings.values["lastGame"])["gameID"] == "JZ01") {
                gameInit.JZ01Init();
                $("#return").css("display", "block");
                $("#return").click(function () {
                    var beginAudio = document.getElementById("effectAudio");
                    beginAudio.pause();
                    $("#effectAudioSource").attr("src", "../../other/sound/click.mp3");
                    beginAudio.load();
                    beginAudio.play();
                    WinJS.Navigation.navigate("/pages/mission/mission.html");
                });
                $("#JZ01Music").click(function () {
                    if (($("#JZ01Music").attr("src")).lastIndexOf("music") != -1) {
                        $("#JZ01Music").attr("src", "../../images/JZ01/slience.png");
                        var beginAudio = document.getElementById("backAudio");
                        beginAudio.pause();
                    } else {
                        $("#JZ01Music").attr("src", "../../images/JZ01/music.png");
                        var beginAudio = document.getElementById("backAudio");
                        beginAudio.play();
                    }
                });
            } else if ((localSettings.values["lastGame"])["gameID"] == "JZ02") {
                var backAudio = document.getElementById("backAudio");
                backAudio.pause();
                gameInit.JZ02Init();
                $("#return").css("display", "none");
            } else if ((localSettings.values["lastGame"])["gameID"] == "JZ03") {
                var backAudio = document.getElementById("backAudio");
                backAudio.pause();
                gameInit.JZ03Init();
                $("#return").css("display", "none");
            } else if ((localSettings.values["lastGame"])["gameID"] == "MZB01") {
                var backAudio = document.getElementById("backAudio");
                backAudio.pause();
                gameInit.MZB01Init();
                $("#return").css("display", "none");
            } else if ((localSettings.values["lastGame"])["gameID"] == "MZH01") {
                var backAudio = document.getElementById("backAudio");
                backAudio.pause();
                gameInit.MZH01Init();
                $("#return").css("display", "none");
            }
        },

        unload: function () {
            // TODO: 响应导航到其他页。
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 响应 viewState 的更改。
        }
    });
})();

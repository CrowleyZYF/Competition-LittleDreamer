// 有关“页面控制”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/gameChoice/gameChoice.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。
            //test
            gameFunction.showLastGame(2);
            //event
            WinJS.Utilities.query("#return").listen("click",
                this.returnLinkClickEventHandler, false);
            if (localSettings.values["lastGame"][["moduleID"]] == "moduleJZ") {
                $("#JZ01").removeClass();
                $("#JZ02").removeClass();
                $("#JZ03").removeClass();
                $("#JZ01").addClass("finishGame moduleJZGames JZ01");
                $("#JZ02").addClass("finishGame moduleJZGames JZ02");
                $("#JZ03").addClass("finishGame moduleJZGames JZ03");
                $("#JZ01").attr("data-gameID", "JZ01");
                $("#JZ02").attr("data-gameID", "JZ02");
                $("#JZ03").attr("data-gameID", "JZ03");
            } else {
                switch (localSettings.values["lastGame"][["jobID"]]) {
                    case "MZB":
                        $("#JZ01").removeClass();
                        $("#JZ02").removeClass();
                        $("#JZ03").removeClass();
                        $("#JZ01").addClass("finishGame moduleJZGames MZB01");
                        $("#JZ02").addClass("lockGame moduleJZGames");
                        $("#JZ03").addClass("lockGame moduleJZGames");
                        $("#JZ01").attr("data-gameID", "MZB01");
                        $("#JZ02").attr("data-gameID", "MZB02");
                        $("#JZ03").attr("data-gameID", "MZB03");
                        break;
                    case "MZH":
                        $("#JZ01").removeClass();
                        $("#JZ02").removeClass();
                        $("#JZ03").removeClass();
                        $("#JZ01").addClass("finishGame moduleJZGames MZH01");
                        $("#JZ02").addClass("lockGame moduleJZGames");
                        $("#JZ03").addClass("lockGame moduleJZGames");
                        $("#JZ01").attr("data-gameID", "MZH01");
                        $("#JZ02").attr("data-gameID", "MZH02");
                        $("#JZ03").attr("data-gameID", "MZH03");
                        break;
                }
            }
            $(".finishGame").click(function () {
                gameFunction.playEffect("../../audio/normal/click.mp3");
                var gameID = $(this).attr("data-gameID");
                var newVal = (localSettings.values["lastGame"]);
                newVal.insert("gameID", gameID);
                localSettings.values["lastGame"] = newVal;
                WinJS.Navigation.navigate("/pages/mission/mission.html");
            });
        },

        unload: function () {
            // TODO: 响应导航到其他页。
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 响应 viewState 的更改。
        },

        returnLinkClickEventHandler: function (eventInfo) {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            eventInfo.preventDefault();
            var newVal = (localSettings.values["lastGame"]);
            if (newVal["moduleID"] == "moduleJZ") {
                WinJS.Navigation.navigate("/pages/moduleChoice/moduleChoice.html");
            } else {
                WinJS.Navigation.navigate("/pages/jobChoice/jobChoice.html");
            }
        }
    });
})();

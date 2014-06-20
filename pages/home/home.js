(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。            
            WinJS.Utilities.query("a").listen("click",
                gameFunction.linkClickEventHandler, false);

            if (
                ((localSettings.values["lastGame"])["moduleID"] == "moduleJZ" && (localSettings.values["lastGame"])["gameID"] != "0" && (localSettings.values["lastGame"])["missionID"] != "0")
                ||
                ((localSettings.values["lastGame"])["moduleID"] == "moduleMZ" && (localSettings.values["lastGame"])["jobID"] != "0" && (localSettings.values["lastGame"])["gameID"] != "0" && (localSettings.values["lastGame"])["missionID"] != "0")
                )
            {
                $("#continueGame").attr("href", "/pages/game/game.html");
            }
            gameFunction.showLastGame(4);
        }
    });
})();

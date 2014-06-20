// 有关“页面控制”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/jobChoice/jobChoice.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。
            WinJS.Utilities.query("#return").listen("click",
                gameFunction.linkClickEventHandler, false);
            gameFunction.showLastGame(1);
            $(".jobComplete").click(function () {
                gameFunction.playEffect("../../audio/normal/click.mp3");
                var jobID = $(this).attr("data-id");
                var newVal = (localSettings.values["lastGame"]);
                if (newVal["moduleID"] == "moduleMZ") {
                    newVal.insert("jobID", jobID);
                    localSettings.values["lastGame"] = newVal;
                    WinJS.Navigation.navigate("/pages/gameChoice/gameChoice.html");
                }
            });
        },

        unload: function () {
            // TODO: 响应导航到其他页。
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            // TODO: 响应 viewState 的更改。
        },

        jobClickEventHandler: function (eventInfo) {
        }
    });
})();

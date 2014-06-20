// 有关“页面控制”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/moduleChoice/moduleChoice.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。
            WinJS.Utilities.query("a").listen("click",
                this.linkClickEventHandler, false);
            gameFunction.showLastGame(5);
        },

        unload: function () {
            // TODO: 响应导航到其他页。
            
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 响应 viewState 的更改。
        },

        linkClickEventHandler: function (eventInfo) {
            gameFunction.playEffect("../../audio/normal/click.mp3");
            eventInfo.preventDefault();
            var link = eventInfo.target;
            var moduleID = eventInfo.target.getAttribute("data-id");
            var newVal = (localSettings.values["lastGame"]);
            newVal.insert("moduleID", moduleID);
            if (eventInfo.target.getAttribute("class") == "module") {
                switch (eventInfo.target.getAttribute("data-id")) {
                    case "moduleJZ":
                        newVal.insert("jobID", "JZ");
                        localSettings.values["lastGame"] = newVal;
                        $("#moduleOne").addClass("moduleOneAnimation");
                        setTimeout(function () {
                            $("#moduleOne").removeClass("moduleOneAnimation");
                            WinJS.Navigation.navigate(link.href);
                        }, 700);
                        break;
                    case "moduleMZ":
                        localSettings.values["lastGame"] = newVal;
                        $("#moduleTwo").addClass("moduleTwoAnimation");
                        setTimeout(function () {
                            $("#moduleTwo").removeClass("moduleTwoAnimation");
                            WinJS.Navigation.navigate(link.href);
                        }, 700);
                        break;
                    case "moduleNZ":
                        localSettings.values["lastGame"] = newVal;
                        $("#moduleThree").addClass("moduleThreeAnimation");
                        setTimeout(function () {
                            $("#moduleThree").removeClass("moduleThreeAnimation");
                            WinJS.Navigation.navigate(link.href);
                        }, 700);
                        break;                    
                }
            } else {
                WinJS.Navigation.navigate(link.href);
            }            
        }
    });
})();

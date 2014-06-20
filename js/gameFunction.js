(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    function playEffect(src) {
        var effectAudio = document.getElementById("effectAudio");
        effectAudio.pause();
        $("#effectAudioSource").attr("src", src);
        effectAudio.load();
        effectAudio.play();
    }

    function linkClickEventHandler(eventInfo) {
        playEffect("../../audio/normal/click.mp3");
        eventInfo.preventDefault();
        var link = eventInfo.target;
        WinJS.Navigation.navigate(link.href);
    }

    function showLastGame(level) {
        var newVal = (localSettings.values["lastGame"]);
        switch (level) {
            case 1:
                $("#testArea").html(newVal["moduleID"]);
                break;
            case 2:
                $("#testArea").html(newVal["moduleID"] + " , " + newVal["jobID"]);
                break;
            case 3:
                $("#testArea").html(newVal["moduleID"] + " , " + newVal["jobID"] + " , " + newVal["gameID"]);
                break;
            case 4:
                $("#testArea").html(newVal["moduleID"] + " , " + newVal["jobID"] + " , " + newVal["gameID"] + " , " + newVal["missionID"]);
                break;
            default:
                $("#testArea").html(" ");
                break;
        }
    }

    function missionInit() {
        showLastGame(3);
        var newVal = (localSettings.values["lastGame"]);
        $("#missionChoice").children().remove();
        var module = null;
        if (newVal["moduleID"] == "moduleJZ") {
            module = localSettings.containers.lookup("moduleJZ");
        } else {
            module = (localSettings.containers.lookup("moduleMZ")).containers.lookup(newVal["jobID"]);
        }
        $("#missionLVNumber").html(module.values["level"]);
        var pNumber = parseInt(module.values["progressBar"]) * 6;
        $("#theRealP").css("width", pNumber);
        var game = module.containers.lookup(newVal["gameID"]);
        var pass = parseInt(game.values["lastestMission"]);
        var last = parseInt(game.values["missionNumber"]) - pass - 1;
        for (var i = 0; i < pass; i++) {
            var mission = $("<div id='mission" + (i + 1) + "' class='missionsPass'></div>");
            var missionP = $("<p class='missionNumber'>" + (i + 1) + "</p>");
            var star = $("<div class='stars'></div>");
            if (i < 9) {
                var missionComVal = game.values["M0" + (i + 1)];
            } else {
                var missionComVal = game.values["M" + (i + 1)];
            }
            for (var j = 0; j < 3; j++) {
                if (j < missionComVal["starLevel"]) {
                    var temp = $("<div class='star'></div>");
                } else {
                    var temp = $("<div class='emptyStar'></div>");
                }
                star.append(temp);
            }
            mission.append(missionP).append(star);
            $("#missionChoice").append(mission);
        }
        if (pass != parseInt(game.values["missionNumber"])) {
            var mission = $("<div id='mission" + (pass + 1) + "' class='missionsPass'></div>");
            var missionP = $("<p class='missionNumber'>" + (pass + 1) + "</p>");
            mission.append(missionP);
            $("#missionChoice").append(mission);
            for (var i = 0; i < last; i++) {
                var mission = $("<div id='mission" + (pass + 2 + i) + "' class='missionNotPass'></div>");
                var missionP = $("<p class='missionNumber'>" + (pass + 2 + i) + "</p>");
                mission.append(missionP);
                $("#missionChoice").append(mission);
            }
        }

        $(".missionsPass").click(function () {
            var beginAudio = document.getElementById("effectAudio");
            beginAudio.pause();
            $("#effectAudioSource").attr("src", "../../other/sound/click.mp3");
            beginAudio.load();
            beginAudio.play();
            var nextMission = parseInt($(this).attr("id").slice(7, $(this).attr("id").length));
            var newVal = (localSettings.values["lastGame"]);
            newVal.insert("missionID", nextMission);
            localSettings.values["lastGame"] = newVal;
            WinJS.Navigation.navigate("/pages/game/game.html");
        })
    }

    WinJS.Namespace.define("gameFunction", {
        linkClickEventHandler: linkClickEventHandler,
        missionInit: missionInit,
        showLastGame: showLastGame,
        playEffect: playEffect
    });
})();
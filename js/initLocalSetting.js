(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    function initModuleJZ() {
        var moduleJZ = localSettings.createContainer("moduleJZ", Windows.Storage.ApplicationDataCreateDisposition.always);
        moduleJZ.values["level"] = 1;//启蒙模块的等级，初始等级为1
        moduleJZ.values["progressBar"] = 0;//目前等级下的经验条，范围为0~100，到100即升级归0

        //initialize the JZ01 game settings
        var JZ01 = moduleJZ.createContainer("JZ01", Windows.Storage.ApplicationDataCreateDisposition.always);
        JZ01.values["missionNumber"] = 15;//JZ01的关卡总数
        JZ01.values["lastestMission"] = 15;//测试
        //JZ01.values["lastestMission"] = 0;//目前通关数
        //相关设置变量
        var cardNumber = [10, 10, 10, 12, 10, 10, 9, 10, 7, 8, 8, 11, 8, 8, 12];//每一关的卡片数量
        var cardChinese = [
            "爸爸，妈妈，爷爷，奶奶，外公，外婆，姐姐，妹妹，哥哥，弟弟",
            "头，胳膊，腿，手，脚，眼睛，耳朵，鼻子，嘴巴，牙齿",
            "桌子，椅子，沙发，床，灯，电脑，电视，电冰箱，洗衣机，空调",
            "苹果，梨，香蕉，西瓜，葡萄，草莓，桃子，桔子，白菜，胡萝卜，黄瓜，西红柿",
            "上衣，裤子，外衣，袜子，帽子，领带，鞋子，连衣裙，眼镜，手表",
            "红，橙，黄，绿，蓝，紫，黑，白，棕，粉",
            "正方形，长方形，三角形，圆形，环形，椭圆形，星形，心形，梯形",
            "0，1，2，3，4，5，6，7，8，9",
            "大小，高矮，粗细，长短，多少，快慢，冷热",
            "跳绳，篮球，足球，羽毛球，毽子，乒乓球，游泳，跑步",
            "自行车，三轮车，汽车，公交车，地铁，飞机，火车，轮船",
            "猫，狗，鸡，鸭，鱼，燕子，兔子，小鸟，老虎，狮子，大象",
            "晴天，多云，阴天，刮风，下雪，下雨，打雷，闪电",
            "山，树，小草，小花，小溪，大海，天空，昆虫",
            "工人，农民，老师，医生，美术家，音乐家，天文家，建筑家，文学家，数学家，生物家，发明家"
        ];//卡片中文
        var cardPinyin = [
            "bà bà，mā mā，yé yé，nǎi nǎi，wài gōng，wài pó，jiě jiě，mèi mèi，gē gē，dì dì",
            "tóu，gē bó，tuǐ，shǒu，jiǎo，yǎn jīng，ěr duǒ，bí zǐ，zuǐ bā，yá chǐ",
            "zhuō zǐ，yǐ zǐ，shā fā，chuáng，dēng，diàn nǎo，diàn shì，diàn bīng xiāng，xǐ yī jī，kōng diào",
            "píng guǒ，lí，xiāng jiāo，xī guā，pú táo，cǎo méi，táo zǐ，jú zǐ，bái cài，hú luó bo，huáng guā，xī hóng shì",
            "shàng yī，kù zǐ，wài yī，wà zǐ，mào zǐ，lǐng dài，xié zǐ，lián yī qún，yǎn jìng，shǒu biǎo",
            "hóng，chéng，huáng，lǜ，qīng，lán，zǐ，hēi，bái，zōng，fěn",
            "zhèng fāng xíng，zhǎng fāng xíng，sān jiǎo xíng，yuán xíng，huán xíng，tuǒ yuán xíng，xīng xíng，xīn xíng，tī xíng",
            "líng，yī，èr，sān，sì，wǔ，liù，qī，bā，jiǔ",
            "dà xiǎo，gāo ǎi，cū xì，zhǎng duǎn，duō shǎo，kuài màn，lěng rè",
            "tiào shéng，lán qiú，zú qiú，yǔ máo qiú，jiàn zǐ，pīng pāng qiú，yóu yǒng，pǎo bù",
            "zì háng chē，sān lún chē，qì chē，gōng jiāo chē，dì tiě，fēi jī，huǒ chē，lún chuán",
            "māo，gǒu，jī，yā，yú，yàn zǐ，tù zǐ，xiǎo niǎo，lǎo hǔ，shī zǐ，dà xiàng",
            "qíng tiān，duō yún，yīn tiān，guā fēng，xià xuě，xià yǔ，dǎ léi，shǎn diàn",
            "shān，shù，xiǎo cǎo，xiǎo huā，xiǎo xī，dà hǎi，tiān kōng，kūn chóng",
            "gōng rén，nóng mín，lǎo shī，yī shēng，měi shù jiā，yīn lè jiā，tiān wén jiā，jiàn zhù jiā，wén xué jiā，shù xué jiā，shēng wù jiā，fā míng jiā"
        ];//卡片拼音
        for (var i = 0; i < JZ01.values["missionNumber"]; i++) {
            var missionNumber = i + 1;
            var missionID = "M";
            if (missionNumber < 10) {
                missionID = "M0" + missionNumber;
            } else {
                missionID = "M" + missionNumber;
            }
            var comVal = new Windows.Storage.ApplicationDataCompositeValue();
            comVal["cardNumber"] = cardNumber[i];//卡片个数
            comVal["cardChinese"] = cardChinese[i];//卡片中文
            comVal["cardPinyin"] = cardPinyin[i];//卡片拼音
            //comVal["isFinish"] = false;//是否通关
            //comVal["score"] = 0;//通关分数
            //comVal["starLevel"] = 0;//通关星数
            comVal["isFinish"] = true;//是否通关
            comVal["score"] = 3000;//通关分数
            comVal["starLevel"] = 3;//通关星数
            var alias = "";
            for (var j = 0; j < cardNumber[i]; j++) {
                alias+="null,"
            }
            comVal["alias"] = alias.slice(0, alias.length - 1);
            JZ01.values[missionID.toString()] = comVal;
        }

        //initialize the JZ02 game settings
        var JZ02 = moduleJZ.createContainer("JZ02", Windows.Storage.ApplicationDataCreateDisposition.always);
        JZ02.values["missionNumber"] = 1;//JZ01的关卡总数
        JZ02.values["lastestMission"] = 1;//目前通关数
        JZ02.values["props"] = "10";
        for (var i = 0; i < JZ02.values["missionNumber"]; i++) {
            var missionNumber = i + 1;
            var missionID = "M";
            if (missionNumber < 10) {
                missionID = "M0" + missionNumber;
            } else {
                missionID = "M" + missionNumber;
            }
            var comVal = new Windows.Storage.ApplicationDataCompositeValue();
            //comVal["isFinish"] = false;//是否通关
            //comVal["score"] = 0;//通关分数
            //comVal["starLevel"] = 0;//通关星数
            comVal["isFinish"] = true;//是否通关
            comVal["score"] = 3000;//通关分数
            comVal["starLevel"] = 3;//通关星数
            JZ02.values[missionID.toString()] = comVal;
        }

        //initialize the JZ03 game settings
        var JZ03 = moduleJZ.createContainer("JZ03", Windows.Storage.ApplicationDataCreateDisposition.always);
        JZ03.values["missionNumber"] = 15;//JZ01的关卡总数
        JZ03.values["lastestMission"] = 15;//目前通关数
        for (var i = 0; i < JZ03.values["missionNumber"]; i++) {
            var missionNumber = i + 1;
            var missionID = "M";
            if (missionNumber < 10) {
                missionID = "M0" + missionNumber;
            } else {
                missionID = "M" + missionNumber;
            }
            var comVal = new Windows.Storage.ApplicationDataCompositeValue();
            //comVal["isFinish"] = false;//是否通关
            //comVal["score"] = 0;//通关分数
            //comVal["starLevel"] = 0;//通关星数
            comVal["isFinish"] = true;//是否通关
            comVal["score"] = 3000;//通关分数
            comVal["starLevel"] = 3;//通关星数
            JZ03.values[missionID.toString()] = comVal;
        }
    }

    function initModuleMZ() {
        var moduleMZ = localSettings.createContainer("moduleMZ", Windows.Storage.ApplicationDataCreateDisposition.always);
        //小小美术家
        var MZB = moduleMZ.createContainer("MZB", Windows.Storage.ApplicationDataCreateDisposition.always);
        MZB.values["level"] = 1;//小小美术家的等级，初始等级为1
        MZB.values["progressBar"] = 0;//目前等级下的经验条，范围为0~100，到100即升级归0
        var MZB01 = MZB.createContainer("MZB01", Windows.Storage.ApplicationDataCreateDisposition.always);
        MZB01.values["missionNumber"] = 15;
        MZB01.values["lastestMission"] = 15;
        MZB01.values["props"] = "10,10,10,10";
        for (var i = 0; i < MZB01.values["missionNumber"]; i++) {
            var missionNumber = i + 1;
            var missionID = "M";
            if (missionNumber < 10) {
                missionID = "M0" + missionNumber;
            } else {
                missionID = "M" + missionNumber;
            }
            var comVal = new Windows.Storage.ApplicationDataCompositeValue();
            //comVal["isFinish"] = false;//是否通关
            //comVal["score"] = 0;//通关分数
            //comVal["starLevel"] = 0;//通关星数
            comVal["isFinish"] = true;//是否通关
            comVal["score"] = 3000;//通关分数
            comVal["starLevel"] = 3;//通关星数
            MZB01.values[missionID.toString()] = comVal;
        }

        var MZH = moduleMZ.createContainer("MZH", Windows.Storage.ApplicationDataCreateDisposition.always);
        MZH.values["level"] = 1;//小小美术家的等级，初始等级为1
        MZH.values["progressBar"] = 0;//目前等级下的经验条，范围为0~100，到100即升级归0
        var MZH01 = MZH.createContainer("MZH01", Windows.Storage.ApplicationDataCreateDisposition.always);
        MZH01.values["missionNumber"] = 15;
        MZH01.values["lastestMission"] = 15;
        MZH01.values["props"] = "10,10,10";
        for (var i = 0; i < MZH01.values["missionNumber"]; i++) {
            var missionNumber = i + 1;
            var missionID = "M";
            if (missionNumber < 10) {
                missionID = "M0" + missionNumber;
            } else {
                missionID = "M" + missionNumber;
            }
            var comVal = new Windows.Storage.ApplicationDataCompositeValue();
            //comVal["isFinish"] = false;//是否通关
            //comVal["score"] = 0;//通关分数
            //comVal["starLevel"] = 0;//通关星数
            comVal["isFinish"] = true;//是否通关
            comVal["score"] = 3000;//通关分数
            comVal["starLevel"] = 3;//通关星数
            MZH01.values[missionID.toString()] = comVal;
        }
    }

    function initModuleNZ() {
        var moduleNZ = localSettings.createContainer("moduleNZ", Windows.Storage.ApplicationDataCreateDisposition.always);
    }

    function init() {
        //initialize simple settings
        localSettings.values["init"] = 37;
        localSettings.values["canContinue"] = false;

        //initialize composite settings
        var lastGame = new Windows.Storage.ApplicationDataCompositeValue();
        lastGame["moduleID"] = "0";
        lastGame["jobID"] = "0";
        lastGame["gameID"] = "0";
        lastGame["missionID"] = "0";
        localSettings.values["lastGame"] = lastGame;

        //initialize containers
        initModuleJZ();
        initModuleMZ();
        initModuleNZ();

    }

    WinJS.Namespace.define("initLocalSetting", {
        init: init
    });
})();
﻿// For an introduction to the Fixed Layout template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232508
/*(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();*/

//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var homeUrl = "/html/homePage.html";
    var gameUrl = "/html/gamePage.html";
    var rulesUrl = "/html/rulesPage.html";
    var scoresUrl = "/html/scoresPage.html";
    var creditsUrl = "/html/creditsPage.html";
    var gameId = null;
    var game = new Game();
    var touchPanel = new TouchPanel();
    var state = new GameState();
    state.load();
    var assetManager = new AssetManager();
    var assetsLoaded = false;
    assetManager.load(game.getAssets(), assetLoadComplete);
    var scoreHelper = new Scores();

    function assetLoadComplete() {
        assetsLoaded = true;
    }

    // Navigation support
    function navigateHome() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== homeUrl) {
            // Navigate
            WinJS.Navigation.navigate(homeUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = homeUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateGame() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== gameUrl) {
            // Navigate
            WinJS.Navigation.navigate(gameUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = gameUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateRules() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== rulesUrl) {
            // Navigate
            WinJS.Navigation.navigate(rulesUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = rulesUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateScores() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== scoresUrl) {
            // Navigate
            WinJS.Navigation.navigate(scoresUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = scoresUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateCredits() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== creditsUrl) {
            WinJS.Navigation.navigate(creditsUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = creditsUrl;
        }
    }

    // Preferences panel
    function showPreferences() {
        WinJS.UI.SettingsFlyout.show();
    }

    // Notification before App Bar or Settings are shown/hidden
    function onBeforeShow(e) {
        if (e.srcElement.id === "settingsDiv") {
            // Sync up the settings UI to match internal state
            GameManager.game.getSettings();
        }
        GameManager.game.showExternalUI(e);
    }

    function onAfterHide(e) {
        GameManager.game.hideExternalUI(e);
    }

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = {
            "settingsDiv": { title: "Game options", href: "/html/settingsFlyout.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    // Activation
    WinJS.Application.onactivated = function (e) {
        if (e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            // Game has been newly launched. Initialize game state here
            GameManager.game.initialize(GameManager.state);
        }
        e.setPromise(WinJS.UI.processAll().done(function () {
            // Set up initial AppBar button click handlers and styles
            var button;

            button = document.getElementById("home").winControl;
            button.addEventListener("click", GameManager.navigateHome, false);

            button = document.getElementById("play");
            button.winControl.addEventListener("click", GameManager.navigateGame, false);
            WinJS.Utilities.addClass(button, "snapped-hidden");

            button = document.getElementById("rules");
            button.winControl.addEventListener("click", GameManager.navigateRules, false);
            WinJS.Utilities.addClass(button, "snapped-hidden");

            button = document.getElementById("scores");
            button.winControl.addEventListener("click", GameManager.navigateScores, false);
            WinJS.Utilities.addClass(button, "snapped-hidden");

            button = document.getElementById("credits");
            button.winControl.addEventListener("click", GameManager.navigateCredits, false);
            WinJS.Utilities.addClass(button, "snapped-hidden");
            WinJS.Utilities.addClass(button, "portrait-hidden");

            button = document.getElementById("newgame");
            button.winControl.addEventListener("click", GameManager.game.newGame, false);
            WinJS.Utilities.addClass(button, "snapped-hidden");
            WinJS.Utilities.addClass(button, "game-button");

            button = document.getElementById("pause");
            button.winControl.addEventListener("click", GameManager.game.togglePause, false);
            WinJS.Utilities.addClass(button, "snapped-hidden");
            WinJS.Utilities.addClass(button, "game-button");

            WinJS.Navigation.navigate(GameManager.state.config.currentPage);
        }));
    };

    // Suspend and resume
    function suspendingHandler(e) {
        if (GameManager.state.config.currentPage === gameUrl) {
            GameManager.game.suspend(e);
        } else {
            GameManager.state.save();
        }
    }

    function resumingHandler(e) {
        if (GameManager.state.config.currentPage === gameUrl) {
            GameManager.game.resume(e);
        }
    }

    // Notify game of loss and regain of focus
    function blurHandler(e) {
        if (WinJS.Navigation.location === gameUrl) {
            GameManager.game.hide();
        }
    }

    function focusHandler(e) {
        if (WinJS.Navigation.location === gameUrl) {
            GameManager.game.show();
        }
    }

    Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", suspendingHandler, false);
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resumingHandler, false);
    window.addEventListener("blur", blurHandler, false);
    window.addEventListener("focus", focusHandler, false);
    document.addEventListener("beforeshow", onBeforeShow, false);
    document.addEventListener("afterhide", onAfterHide, false);

    WinJS.Application.start();

    WinJS.Namespace.define("GameManager", {
        navigateHome: navigateHome,
        navigateGame: navigateGame,
        navigateRules: navigateRules,
        navigateScores: navigateScores,
        navigateCredits: navigateCredits,
        showPreferences: showPreferences,
        onBeforeShow: onBeforeShow,
        onAfterHide: onAfterHide,
        game: game,
        state: state,
        assetManager: assetManager,
        scoreHelper: scoreHelper,
        gameId: gameId,
        touchPanel: touchPanel
    });

})();


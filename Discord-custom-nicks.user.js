// ==UserScript==
// @name         Discord custom nicknames
// @namespace    https://github.com/aspiers/Discord-custom-nicks-userscript
// @version      0.1.4
// @description  Assign custom names to Discord nicknames client-side
// @author       Adam Spiers
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL  https://raw.githubusercontent.com/aspiers/Discord-custom-nicks-userscript/main/Discord-custom-nicks.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==
//
// Browser userscript to assign custom names to Discord nicknames
// Copyright (C) 2021 Adam Spiers <userscripts@adamspiers.org>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Stop JSHint in Tampermonkey's CodeMirror editor from complaining
// about globals imported via @require:
// https://jshint.com/docs/#inline-configuration
/* globals jQuery waitForKeyElements */

(function() {
    'use strict';
    let $ = jQuery;

    const ELEMENT_PREFIX = "Discord-custom-nicknames";
    const ORIG_ATTR = "data-Discord-orig-nickname";
    const STORAGE = "Discord_custom_nicknames_mapping";
    let nick_map_str = GM_getValue(STORAGE);
    if (typeof(nick_map_str) !== "string") {
        nick_map_str = "";
    }
    let nick_map = parse_map(nick_map_str);

    const PREFIX = "[Discord custom nicknames]";

    function debug(...args) {
        console.debug(PREFIX, ...args);
    }

    function log(...args) {
        console.log(PREFIX, ...args);
    }

    function replace_nick(element) {
        // debug("replace", element);
        let orig_nick = element.getAttribute(ORIG_ATTR);
        let Discord_nick = orig_nick || element.innerText;
        let mapped_name = nick_map[Discord_nick];
        if (mapped_name) {
            log(`${Discord_nick} -> ${mapped_name}`);
            if (!orig_nick) {
                // Back up the original to an attribute so that we can remap later
                // without reloading the page.
                element.setAttribute(ORIG_ATTR, element.innerText)
            }
            element.innerText = mapped_name;
        }
        else {
            // debug(`no mapping found for ${element.innerText}`);
        }
    }

    function replace_css_elements(query) {
        let matches = jQuery(query);
        // debug(`replacing ${query}`, matches);
        if (matches && matches.each) {
            matches.each((i, elt) => replace_nick(elt));
        }
    }

    function replace_xpath_elements(query) {
        // debug(`replacing ${query}`);
        let result = document.evaluate(query, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        debug("result", result);
        debug(result.snapshotLength);
        debug(result.snapshotItem(0));
    }

    function serialise_map(map_obj) {
        return Object.entries(map_obj).map(e => e[0] + "=" + e[1]).join("\n");
    }

    function parse_map(map_str) {
        let map_obj = {};
        for (const pair of map_str.split("\n")) {
            let [k, v] = pair.split("=");
            map_obj[k] = v;
        }
        return map_obj;
    }

    function display_dialog() {
        const dialog_id = ELEMENT_PREFIX + "-dialog";
        const textarea_id = ELEMENT_PREFIX + "-textarea";
        const selector = "#" + dialog_id;
        if ($(selector).length == 0) {
            $("head").append (
                '<link '
                + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/le-frog/jquery-ui.min.css" '
                + 'rel="stylesheet" type="text/css">'
            );
            $("body").append(`
                <div id="${dialog_id}" title="Discord custom nicknames">
                  <h1>Discord custom nicknames</h1>
                  <p> Enter your mappings here, one on each line.
                  <textarea rows="5" cols="50" id="${textarea_id}"></textarea>
                </div>
            `);
            $("#" + textarea_id).innerText = nick_map_str;
            $(selector).dialog({
                autoOpen: false,
                buttons: [{
                    text: "Save",
                    icon: "ui-icon-heart",
                    click: function() {
                        let val = $("#" + textarea_id).innerText;
                        log(val);
                        GM_setValue(STORAGE, val || "");
                        nick_map = parse_map(val || "");
                        $(this).dialog("close");
                    }
                }]
            });
        }
        $(selector).dialog("open");
    }

    GM_registerMenuCommand("Nickname mapping", () => {
        display_dialog();
        const val = prompt("Enter nickname mapping", serialise_map(nick_map));
        if (val !== null) {
            nick_map = parse_map(val);
            GM_setValue(STORAGE, nick_map);
        }
        replace_all();
    });
    function replace_all() {
        waitForKeyElements(
            "[class^='membersWrap'] span[class^='roleColor']",
            () => replace_css_elements("[class^='membersWrap'] span[class^='roleColor']"),
//            () => replace_xpath_elements("//span[starts-with(@class,'roleColor')]")
        );
    }
    replace_all();
})();

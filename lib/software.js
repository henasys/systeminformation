"use strict";
// @ts-check
// ==================================================================================
// software.js
// ----------------------------------------------------------------------------------
// Description:   System Information - library
//                for Node.js
// Copyright:     (c) 2014 - 2022
// Author:        Sebastian Hildebrandt, Alex Lee
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================
// 2. Software
// ----------------------------------------------------------------------------------

const fs = require("fs");
const os = require("os");
const util = require("./util");
const exec = require("child_process").exec;
const execSync = require("child_process").execSync;
const execPromise = util.promisify(require("child_process").exec);

let _platform = process.platform;

const _linux = _platform === "linux" || _platform === "android";
const _darwin = _platform === "darwin";
const _windows = _platform === "win32";
const _freebsd = _platform === "freebsd";
const _openbsd = _platform === "openbsd";
const _netbsd = _platform === "netbsd";
const _sunos = _platform === "sunos";

function software(callback) {
  return new Promise((resolve) => {
    process.nextTick(() => {
      let result = [];
      if (_linux || _freebsd || _openbsd || _netbsd) {
        // Not yet supported
        if (callback) {
          callback(result);
        }
        resolve(result);
      }
      if (_darwin) {
        // Not yet supported
        if (callback) {
          callback(result);
        }
        resolve(result);
      }
      if (_sunos) {
        // Not yet supported
        if (callback) {
          callback(result);
        }
        resolve(result);
      }
      if (_windows) {
        try {
          util
            .powerShell(
              "Get-ChildItem -Path HKLM:\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall | Get-ItemProperty | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate | fl"
            )
            .then((stdout, error) => {
              if (!error) {
                let items = stdout.toString().split(/\n\s*\n/);
                console.log("items", items.length);
                items.shift();
                items.forEach((item, index) => {
                  let lines = item.split("\r\n");
                  console.log("lines", lines);
                  let name = util.getValue(lines, "DisplayName", ":", true);
                  let version = util.getValue(
                    lines,
                    "DisplayVersion",
                    ":",
                    true
                  );
                  let publisher = util.getValue(lines, "Publisher", ":", true);
                  let installDate = util.getValue(
                    lines,
                    "InstallDate",
                    ":",
                    true
                  );
                  name &&
                    result.push({
                      name,
                      version,
                      publisher,
                      installDate,
                    });
                });
              }

              if (callback) {
                callback(result);
              }
              resolve(result);
            });
        } catch (e) {
          if (callback) {
            callback(result);
          }
          resolve(result);
        }
      }
    });
  });
}

exports.software = software;

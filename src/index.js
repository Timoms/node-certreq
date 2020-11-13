/**
 * Open-Source module for common certreq commands.
 *
 * Run every certreq command in Node.js in a handy way.
 *
 * @link   https://github.com/Timoms/node-certreq
 * @file
 * @author Timo Heckel
 */

const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const os = require("os"); // Comes with node.js
const operatingsystem = os.type();

const isFunction = (callback) => callback instanceof Function;
const checkIsParamsString = (params) => typeof params === "string";

let debug = false;

function log(text) {
  if (debug) console.log("node-certreq: ", text);
}

/*=================================================
Module Exports
=================================================*/
module.exports.run = function certreq(parameter, callback) {
  if (!isFunction(callback)) {
    throw new Error(
      `Callback must be a function, but got a ${typeof callback}`
    );
  }

  if (!checkIsParamsString(parameter)) {
    log(`Parameters must be string, but got ${typeof parameter}`);
    throw new Error(`Parameters must be string, but got ${typeof parameter}`);
  }

  const stdout = [];
  const stderr = [];

  //child_process.spawn(command[, args][, options])
  const defaults = {
    cwd: undefined,
    env: process.env,
    shell: true,
    windowsHide: false,
  };
  parameters = parameter.split(" ");
  if (parameters[0] === "certreq") parameters.shift();
  const certreqProcess = spawn("certreq", parameters, defaults);

  certreqProcess.stdout.on("data", (data) => {
    stdout.push(data);
  });

  certreqProcess.stderr.on("data", (data) => {
    stderr.push(data);
  });

  certreqProcess.on("error", (err) => {
    stderr.push(err);
    log("SSLProcess encountered an error: " + err);
  });

  returnValue = [];
  preventExex = false;

  certreqProcess.on("exit", (code) => {
    if (!preventExex) {
      preventExex = true;
      log("Process action: exit");
      returnValue["processError"] = stderr.toString();
      returnValue["processOutput"] = stdout.toString();
      returnValue["processExitCode"] = code;
      returnValue["processEnd"] = "exited";
      returnValue["hasError"] = code !== 0;
      callback.call(null, returnValue);
    }
  });

  certreqProcess.on("close", (code) => {
    if (!preventExex) {
      preventExex = true;
      log("Process action: close");
      returnValue["processError"] = stderr.toString();
      returnValue["processOutput"] = stdout.toString();
      returnValue["processExitCode"] = code;
      returnValue["processEnd"] = "closed";
      returnValue["hasError"] = code !== 0;
      callback.call(null, returnValue);
    }
  });
  return certreqProcess;
};

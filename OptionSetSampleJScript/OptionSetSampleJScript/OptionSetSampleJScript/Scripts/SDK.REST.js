// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// =====================================================================

if (typeof (SDK) == "undefined")
{ SDK = { __namespace: true }; }
SDK.REST = {
 _Context: function () {
  ///<summary>
  /// Private function that retrieves the context from either the Xrm.Page.context
  /// or the GetGlobalContext function in ClientGlobalContext.js.aspx
  ///</summary>
  var errorMessage = "Context is not available.";
  if (typeof GetGlobalContext != "undefined")
  { return GetGlobalContext(); }
  else {
   if (typeof Xrm != "undefined") {
    return Xrm.Page.context;
   }
   else
   { return new Error(errorMessage); }
  }
 },
 _ODataUrl: function () {
  ///<summary>
  /// Private function composes the OData URL using the _Context object.
  ///</summary>
  var ServerUrl = this._Context().getServerUrl();
  if (ServerUrl.match(/\/$/)) {
   ServerUrl = ServerUrl.substring(0, ServerUrl.length - 1);
  }
  return ServerUrl + "/XRMServices/2011/OrganizationData.svc";
 },
 retrieveMultipleAsync: function (odataSetName, filter, successCallback, errorCallback) {
  ///<summary>
  /// Initiates an asynchronous request for the first 50 records of a given entity that meet the filter criteria
  ///</summary>
  ///<param name="odataSetName" type="String">
  /// The name of the OData resource. For the Account entity, 'AccountSet'.
  ///</param>
  ///<param name="filter" type="String">
  /// The OData system query options to limit the records returned or define which
  /// attributes are returned. These are the query string parameters begining with '?'.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to accept the array of records that are the result of a successful query.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful query.
  ///</param>
  if (!odataSetName)
  { throw new Error("SDK.REST.retrieveMultipleAsync requires the odataSetName parameter"); }
  if (!successCallback)
  { throw new Error("SDK.REST.retrieveMultipleAsync requires the successCallback parameter"); }
  if (!errorCallback)
  { throw new Error("SDK.REST.retrieveMultipleAsync requires the errorCallback parameter"); }

  var req = new XMLHttpRequest();
  req.open("GET", this._ODataUrl() + "/" + odataSetName + filter, true);
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function () {
   SDK.REST._retrieveMultipleResponse(this, successCallback, errorCallback);
  };
  req.send();

 },
 _retrieveMultipleResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Private function that processes the response from SDK.REST.retrieveMultipleAsync
  ///</summary>
  ///<param name="req" type="XMLHttpRequest">
  /// The XMLHttpRequest representing the response.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to accept the array of records that are the result of a successful query.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful query.
  ///</param>
  if (req.readyState == 4 /* complete */) {
   if (req.status == 200) {
    //Success
    successCallback(JSON.parse(req.responseText, SDK.REST.dateReviver).d.results);
   }
   else {
    errorCallback(JSON.parse(req.responseText).error);
   }
  }
 },
 createAsync: function (odataSetName, object, successCallback, errorCallback) {
  ///<summary>
  /// Initiates an asynchronous request to create a record for a given entity.
  ///</summary>
  ///<param name="odataSetName" type="String">
  /// The name of the OData resource. For the Account entity, 'AccountSet'.
  ///</param>
  ///<param name="object" type="Object">
  /// A JScript object containing valid properties for the entity.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to accept the array of records that are the result of a successful query.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful query.
  ///</param>
  var req = new XMLHttpRequest();
  req.open("POST", this._ODataUrl() + "/" + odataSetName, true);
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function () {
   SDK.REST._createResponse(this, successCallback, errorCallback);
  };
  req.send(JSON.stringify(object));
 },
 _createResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Private function that processes the response from SDK.REST.createAsync
  ///</summary>
  ///<param name="req" type="XMLHttpRequest">
  /// The XMLHttpRequest representing the response.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to accept the object represnting the created record.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful attempt to create a record.
  ///</param>
  if (req.readyState == 4 /* complete */) {
   if (req.status == 201) {
    //Success
    successCallback(JSON.parse(req.responseText).d);
   }
   else {
    errorCallback(JSON.parse(req.responseText).error);
   }
  }
 },
 updateAsync: function (odataSetName, object, id, successCallback, errorCallback) {
  ///<summary>
  /// Initiates an asynchronous request to update a record for a given entity.
  ///</summary>
  ///<param name="odataSetName" type="String">
  /// The name of the OData resource. For the Account entity, 'AccountSet'.
  ///</param>
  ///<param name="object" type="Object">
  /// A JScript object containing valid properties for the entity.
  ///</param>
  ///<param name="id" type="String">
  /// Provides the GUID unique identifier for the record to be updated.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to acknowlege the successful completion of the update.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful update attempt.
  ///</param>
  var req = new XMLHttpRequest();
  req.open("POST", this._ODataUrl() + "/" + odataSetName +"(guid'"+id+"')", true);
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.setRequestHeader("X-HTTP-Method", "MERGE");

  req.onreadystatechange = function () {
   SDK.REST._updateResponse(this, successCallback, errorCallback);
  };
  req.send(JSON.stringify(object));
 },
 _updateResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Private function that processes the response from SDK.REST.updateAsync
  ///</summary>
  ///<param name="req" type="XMLHttpRequest">
  /// The XMLHttpRequest representing the response.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to acknowlege the successful completion of the update.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful update attempt.
  ///</param>
  if (req.readyState == 4 /* complete */) {
   //There appears to be an issue where IE maps the 204 status to 1223 when no content is returned.
   if (req.status == 204 || req.status == 1223) {
    successCallback();
   }
   else {
    errorCallback(JSON.parse(req.responseText).error);
   }
  }
 },
 deleteAsync: function (odataSetName, id, successCallback, errorCallback) {
  ///<summary>
  /// Initiates an asynchronous request to delete a record for a given entity.
  ///</summary>
  ///<param name="odataSetName" type="String">
  /// The name of the OData resource. For the Account entity, 'AccountSet'.
  ///</param>
  ///<param name="id" type="String">
  /// Provides the GUID unique identifier for the record to be deleted.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to acknowlege the successful deletion of the record.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful delete attempt.
  ///</param>
  var req = new XMLHttpRequest();
  req.open("POST", this._ODataUrl() + "/" + odataSetName + "(guid'" + id + "')", true);
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.setRequestHeader("X-HTTP-Method", "DELETE");

  req.onreadystatechange = function () {
   SDK.REST._deleteResponse(this, function () { successCallback(id) }, errorCallback);
  };
  req.send();

 },
 _deleteResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Private function that processes the response from SDK.REST.deleteAsync
  ///</summary>
  ///<param name="req" type="XMLHttpRequest">
  /// The XMLHttpRequest representing the response.
  ///</param>
  ///<param name="successCallback" type="Function">
  /// The function to acknowlege the successful completion of the delete.
  ///</param>
  ///<param name="errorCallback" type="Function">
  /// The function to accept the error that is the result of an unsuccessful delete attempt.
  ///</param>
  if (req.readyState == 4 /* complete */) {
   //There appears to be an issue where IE maps the 204 status to 1223 when no content is returned.
   if (req.status == 204 || req.status == 1223) {
    successCallback();
   }
   else {
    errorCallback(JSON.parse(req.responseText).error);
   }
  }
 },
 retrieveAsync: function (odataSetName, id, successCallback, errorCallback) {
  ///<summary>
  /// Unimplemented function placeholder to retrieve a specific record.
  ///</summary>
  throw new Error("Not Implemented");
 },
 _retrieveResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Unimplemented function placeholder to retrieve the response from SDK.REST.retrieveAsync
  ///</summary>
  throw new Error("Not Implemented");
 },
 associateAsync: function (odataSetName, id, successCallback, errorCallback) {
  ///<summary>
  /// Unimplemented function placeholder to associate a pair of records.
  ///</summary>
  throw new Error("Not Implemented");
 },
 _associateResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Unimplemented function placeholder to retrieve the response from SDK.REST.associateAsync
  ///</summary>
  throw new Error("Not Implemented");
 },
 dissassociateAsync: function (odataSetName, id, successCallback, errorCallback) {
  ///<summary>
  /// Unimplemented function placeholder to disassociate a pair of records.
  ///</summary>
  throw new Error("Not Implemented");
 },
 _disassociateResponse: function (req, successCallback, errorCallback) {
  ///<summary>
  /// Unimplemented function placeholder to retrieve the response from SDK.REST.dissassociateAsync
  ///</summary>
  throw new Error("Not Implemented");
 },
 dateReviver: function (key, value) {
  ///<summary>
  /// A function to be used as a date reviver parameter to JSON.parse.
  ///</summary>
  ///<param name="key" type="String">
  /// The key for the JSON object
  ///</param>
  ///<param name="value" type="Object">
  /// The value for the JSON object
  ///</param>
  var a;
  if (typeof value === 'string') {
   a = /Date\(([-+]?\d+)\)/.exec(value); //Matches "\/Date(1234567890123)\/ or "\/Date(-1234567890123)\/"
   if (a) {
    return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
   }
  }
  return value;

 },
 __namespace: true
};

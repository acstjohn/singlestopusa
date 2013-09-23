/// <reference path="SDK.MetaData.js" />
/// <reference path="SDK.REST.js" />

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
SDK.OptionSetSample = {
 //Properties to be set from the HTML page when the window loads START
 Entity: null, //String - Schema Name of Entity
 PrimaryIdAttribute: null, //String - SchemaName of primary Id attribute for the entity
 TextSearchAttribute: null, //String - SchemaName of the String attribute to use for searching. Usually the Primary Attribute.
 PrimaryAttribute: null, //String - SchemaName of the Primary Attributes. Usually "Name", "Topic", "Subject".
 Columnset: null, //String Array - SchemaNames for attributes used in the page.
 TableData: null, //Object - Contains configuration data for the table.
 //TableData Example:
 //{
 //   Id: "AccountList", //The id value for the HTML table element to use to display the list of records
 //   BodyId: "AccountListBody", //The id value for the HTML tbody element that will be created to contain the rows of the table.
 //   CheckboxColumn: true, //Set to true to allow for deleting records.
 //   SearchFieldId: "SearchString", //The id value of the HTML input element used for text search
 //   Columns: [
 //  { Name: "Name" },
 //  { Name: "CreatedOn"}]  //An array of object that define Schema names for attributes to display in the table. All of these must also be included in the SDK.OptionSetSample.ColumnSet.
 //}
 FormData: null, //Objet containing configuration data for the form
 //FormData Example:
 //{
 // Id: "CurrentAccount", //String - The id of the HTML div element that will contain the form
 // SaveButtonId: "SaveCurrentAccount"   //String - the id of the HTML button element that will save the record.
 //}

 //Properties to be set from the HTML page when the window loads END

 //Properties used within SDK.OptionSetSample to managed the application START
 RecordCollection: null, //Variables for the list of records and a record being edited.
 CurrentRecord: null, //The record that is currently being viewed or edited.
 ChangedAttributes: [], //Attribute names for attributes of the current record that have changed
 AttributeMetadataCollection: [], //Attribute metadata definitions for the attributes used.
 SelectedRecords: [], //An array of GUIDs for records selected for deletion
 //Properties used within SDK.OptionSetSample to managed the application END

 //Application Methods START
 addStatusCodeOptions: function () {
  ///<summary>
  /// <para>Valid Status options depend on the state of the current record.</para>
  /// <para>This function queries attribute metadata and the current record to provide select control options that are valid.</para>
  /// <para>The StateCode attribute must be included in the SDK.OptionSetSample.ColumnSet if the StatusCode field is included in the form</para>
  ///</summary>
  // Is the StatusCode field on the form?
  if (document.getElementById("StatusCode") != null) {
   var StatusField = document.getElementById("StatusCode");
   //StateCode is required to be in the columnset if StatusCode is included on the form.
   if (SDK.OptionSetSample.CurrentRecord["StateCode"] != null) {
    //Clear current options
    for (var i = StatusField.options.length; i >= 0; i--)
    { StatusField.options.remove(i); }
    var StatusCodeMetadata = SDK.OptionSetSample.getAttributeMetadata("StatusCode");
    var CurrentState = SDK.OptionSetSample.CurrentRecord["StateCode"].Value;

    for (var i = 0; i < StatusCodeMetadata.OptionSet.Options.length; i++) {

     var om = StatusCodeMetadata.OptionSet.Options[i];
     if (om.StatusOptionMetadata.State == CurrentState) {
      var option = document.createElement("option");
      option.value = om.StatusOptionMetadata.Value;
      option.text = om.StatusOptionMetadata.Label.UserLocalizedLabel.Label;
      StatusField.options.add(option);
     }
    }
   }
   else {
    throw new Error("The StateCode attribute must be included in the ColumnSet if the StatusCode field is to be included in the form.");
   }
   StatusField.value = SDK.OptionSetSample.CurrentRecord["StatusCode"].Value;
  }
 },
 buildTable: function () {
  ///<summary>
  /// <para>Creates the thead and tbody elements for the existing table.</para>
  /// <para>The thead element contains th elements with the display names for each attribute in the TableData.Columns array.</para>
  ///</summary>
  //Add event handlers for Create, Delete and Search fields
  document.getElementById(SDK.OptionSetSample.TableData.CreateButtonId).onclick = SDK.OptionSetSample.OnCreateClick;
  document.getElementById(SDK.OptionSetSample.TableData.DeleteButtonId).onclick = SDK.OptionSetSample.OnDeleteButtonClick;
  document.getElementById(SDK.OptionSetSample.TableData.SearchFieldId).onkeyup = SDK.OptionSetSample.search;

  //If delete is not enabled hide the delete button
  if ((!SDK.OptionSetSample.TableData.CheckboxColumn) && (SDK.OptionSetSample.TableData.DeleteButtonId != null)) {
   document.getElementById(SDK.OptionSetSample.TableData.DeleteButtonId).style.display = "none";
  }

  var table = document.getElementById(SDK.OptionSetSample.TableData.Id);
  table.onselectstart = function () { return false; };
  var header = document.createElement("thead");
  var headerRow = document.createElement("tr");
  if (SDK.OptionSetSample.TableData.CheckboxColumn) {
   var selectedHeading = document.createElement("th");
   var checkbox = document.createElement("input");
   checkbox.setAttribute("type", "checkbox");
   checkbox.onclick = SDK.OptionSetSample.OnTableHeaderCheckboxClick;
   selectedHeading.appendChild(checkbox);
   headerRow.appendChild(selectedHeading);
  }
  for (var i = 0; i < SDK.OptionSetSample.TableData.Columns.length; i++) {
   var column = SDK.OptionSetSample.TableData.Columns[i];
   var heading = document.createElement("th");
   heading.innerText = SDK.OptionSetSample.getAttributeDisplayName(column.Name);
   headerRow.appendChild(heading);
  }
  header.appendChild(headerRow);
  var body = document.createElement("tbody");
  body.id = SDK.OptionSetSample.TableData.BodyId;
  table.appendChild(header);
  table.appendChild(body);
 },
 displayMessage: function (message) {
  ///<summary>
  /// Displays a message on the page that can be closed by the user.
  /// This is less obtrusive than using an alert.
  ///</summary>
  ///<returns>entityMetadataCollection</returns>
  ///<param name="message" type="String">
  /// The message to display
  ///</param>
  var ul = document.getElementById("message");
  var li = document.createElement("li");
  li.className = "Message";
  var div = document.createElement("div");
  var closeButton = document.createElement("button");
  closeButton.innerText = "x";
  closeButton.className = "MessageButton";
  closeButton.onclick = function () { ul.removeChild(li); };
  div.appendChild(closeButton);
  var messageSpan = document.createElement("span");
  messageSpan.innerText = message;
  div.appendChild(messageSpan);
  li.appendChild(div);
  ul.appendChild(li);
 },
 evaluateDeleteButtonEnable: function () {
  ///<summary>
  /// Enables the Delete button if their are rows selected
  ///</summary>
  var DeleteButton = document.getElementById("deleteSelectedRecords");
  if (SDK.OptionSetSample.SelectedRecords.length > 0)
  { DeleteButton.removeAttribute("disabled"); }
  else
  { DeleteButton.setAttribute("disabled", "disabled"); }
 },
 evaluateSaveButtonEnable: function () {
  ///<summary>
  /// Enables the Save button when a record property is updated
  ///</summary>
  var button = document.getElementById(SDK.OptionSetSample.FormData.SaveButtonId);
  if (SDK.OptionSetSample.CurrentRecord.isDirty) {
   button.removeAttribute("disabled");
  }
  else {
   button.setAttribute("disabled", "disabled");
  }
 },
 getAttributeDisplayName: function (attributeName) {
  ///<summary>
  /// Gets the display name for the attribute from the SDK.OptionSetSample.AttributeMetadataCollection
  ///</summary>
  ///<returns>String</returns>
  ///<param name="attributeName" type="String">
  /// The localized DisplayName string for the attribute
  ///</param>
  for (var i = 0; i < SDK.OptionSetSample.AttributeMetadataCollection.length; i++) {
   var attributeMetadata = SDK.OptionSetSample.AttributeMetadataCollection[i];
   if (attributeMetadata.SchemaName == attributeName) {
    return attributeMetadata.DisplayName.UserLocalizedLabel.Label;
    break;
   }
  }
 },
 getAttributeMetadata: function (attributeSchemaName) {
  ///<summary>
  /// Gets the AttributeMetadata from the SDK.OptionSetSample.AttributeMetadataCollection
  ///</summary>
  ///<returns>AttributeMetadata</returns>
  ///<param name="attributeSchemaName" type="String">
  /// The SchemaName for the attribute
  ///</param>
  for (var i = 0; i < SDK.OptionSetSample.AttributeMetadataCollection.length; i++) {
   if (attributeSchemaName == SDK.OptionSetSample.AttributeMetadataCollection[i].SchemaName) {
    return SDK.OptionSetSample.AttributeMetadataCollection[i];
   }
  }
  throw new Error("AttributeMetadata for the " + attributeSchemaName + " attribute was not found.");
 },
 getAttributeMetadataCollection: {
  Execute: function () {
   ///<summary>
   /// Submits an asynchronous request for the AttributeMetadata for each of the attributes in SDK.OptionSetSample.Columnset
   ///</summary>
   for (var i = 0; i < SDK.OptionSetSample.Columnset.length; i++) {
    SDK.MetaData.RetrieveAttributeAsync(
   SDK.OptionSetSample.Entity.toLowerCase(),
   SDK.OptionSetSample.Columnset[i].toLowerCase(),
   null,
   false,
   this.Success,
   this.Error
   );
   }
  },
  Success: function (attributeMetadata) {
   ///<summary>
   /// Callback for a successful response from SDK.OptionSetSample.getAttributeMetadataCollection.Execute
   /// Adds the metadata to SDK.OptionSetSample.AttributeMetadataCollection
   /// Calls SDK.OptionSetSample.OnMetadataRetrieved if all the expected AttributeMetadata has been retrieved.
   ///</summary>
   ///<param name="attributeMetadata" type="AttributeMetadata">
   /// The AttributeMetadata object returned from SDK.MetaData._returnAttribute via SDK.MetaData.RetrieveAttributeAsync
   ///</param>
   SDK.OptionSetSample.AttributeMetadataCollection.push(attributeMetadata);

   //Complete when all entity metadata for the EnumAttributeMetadata and BooleanAttributeMetadata attributes are retrieved.
   if (SDK.OptionSetSample.Columnset.length == SDK.OptionSetSample.AttributeMetadataCollection.length) {
    SDK.OptionSetSample.OnMetadataRetrieved();
   }
  },
  Error: function (error) {
   ///<summary>
   /// Callback for an Error response from SDK.OptionSetSample.getAttributeMetadataCollection.Execute
   ///</summary>
   SDK.OptionSetSample.displayMessage(error.message);
  }
 },
 getAttributeType: function (attributeName) {
  ///<summary>
  /// Returns a string indicating the type of attribute
  ///</summary>
  ///<returns>String</returns>
  ///<param name="attributeName" type="String">
  /// The SchemaName for the attribute
  ///</param>
  for (var i = 0; i < SDK.OptionSetSample.AttributeMetadataCollection.length; i++) {
   var attributeMetadata = SDK.OptionSetSample.AttributeMetadataCollection[i];
   if (attributeMetadata.SchemaName == attributeName) {
    return attributeMetadata.AttributeType;
    break;
   }
  }
 },
 getRecordURL: function (etn, id) {
  ///<summary>
  /// Generates a URL to open an entity record form.
  ///</summary>
  ///<returns>String</returns>
  ///<param name="etn" type="String">
  /// The logical name of an entity.
  ///</param>
  ///<param name="id" type="String">
  /// The id value of an entity record.
  ///</param>
  var context;
  var errorMessage = "Context is not available.";
  var ServerUrl;
  if (typeof GetGlobalContext != "undefined")
  { context = GetGlobalContext(); }
  else {
   if (typeof Xrm != "undefined") {
    context = Xrm.Page.context;
   }
   else
   { throw new Error(errorMessage); }
  }
  ServerUrl = context.getServerUrl();
  if (ServerUrl.match(/\/$/)) {
   ServerUrl = ServerUrl.substring(0, ServerUrl.length - 1);
  }
  return ServerUrl + "/main.aspx?etn=" + etn + "&pagetype=entityrecord&id=%7B" + id + "%7D";

 },
 getSelectFilter: function () {
  ///<summary>
  /// Generates an OData $select system query option based on the attributes in SDK.OptionSetSample.Columnset
  ///</summary>
  var selectFilter = "?$select=";
  for (var i = 0; i < SDK.OptionSetSample.Columnset.length; i++) {
   selectFilter += SDK.OptionSetSample.Columnset[i] + ",";
  }
  //trim the last comma
  selectFilter = selectFilter.substr(0, selectFilter.length - 1);
  return selectFilter;

 },
 hideEditForm: function () {
  ///<summary>
  /// Hides the edit form
  ///</summary>
  document.getElementById(SDK.OptionSetSample.FormData.Id).style.display = "none";
 },
 instantiateDefaultRecord: function () {
  ///<summary>
  /// Instantiates a JScript object that contains default values for a new record.
  ///</summary>
  ///<returns>Object</returns>
  var record = {};
  SDK.OptionSetSample.ChangedAttributes = [];
  for (var i = 0; i < SDK.OptionSetSample.Columnset.length; i++) {
   var AttributeName = SDK.OptionSetSample.Columnset[i];
   var AttributeMetadata = SDK.OptionSetSample.getAttributeMetadata(AttributeName);

   if (AttributeName == SDK.OptionSetSample.PrimaryIdAttribute) {
    record[AttributeName] = {};
    record[AttributeName].Value = null;
    record[AttributeName].isDirty = false;
   }
   else {
    var Required = ((AttributeMetadata.RequiredLevel.Value == "ApplicationRequired" || AttributeMetadata.RequiredLevel.Value == "SystemRequired")) ? true : false;
    var ValidForCreate = AttributeMetadata.IsValidForCreate;
    record[AttributeName] = {};
    record[AttributeName].isDirty = (Required && ValidForCreate) ? true : false; //For Owner attributes this will be overridden below.

    switch (AttributeMetadata.AttributeType) {
     case "Boolean":
      record[AttributeName].Value = AttributeMetadata.DefaultValue;
      break;
     case "Picklist":
     case "State":
      record[AttributeName].Value = (AttributeMetadata.DefaultFormValue == -1) ? null : AttributeMetadata.DefaultFormValue;
      break;
     case "Status":
      var defaultStateOptionValue;
      var defaultStatusOptionValue;
      var StateCodeAttributeMetadata = SDK.OptionSetSample.getAttributeMetadata("StateCode");
      if (StateCodeAttributeMetadata != null)
      { defaultStateOptionValue = StateCodeAttributeMetadata.DefaultFormValue; }
      else
      { throw new Error("The StateCode attribute must be included if the StatusCode attribute is used."); }
      for (var n = 0; n < StateCodeAttributeMetadata.OptionSet.Options.length; n++) {
       var stateOption = StateCodeAttributeMetadata.OptionSet.Options[n];
       if (stateOption.StateOptionMetadata.Value == defaultStateOptionValue) {
        defaultStatusOptionValue = stateOption.StateOptionMetadata.DefaultStatus;
        break;
       }
      }
      record[AttributeName].Value = defaultStatusOptionValue;
      break;
     case "String":
      record[AttributeName].Value = "";
      break;
     case "Customer":
     case "DateTime":
     case "Decimal":
     case "Double":
     case "Integer":
     case "Lookup":
     case "Memo":
     case "Money":
     case "Uniqueidentifier":
      record[AttributeName].Value = null;
      break;
     case "Owner":
      //While OwnerId IsValidForCreate and Required it will default to the current user.
      //This sample doesn't support specifying a different owner so we don't want to include it when creating a new record
      record[AttributeName].isDirty = false;
      break;
     case "BingInt":
     case "PartyList":
     case "CalendarRules":
     case "ManagedProperty":
     case "EntityName":
      throw new Error("Not Implemented");
      break;
    }
   }
  }
  return record;
 },
 OnCreateClick: function () {
  ///<summary>
  /// Sets the SDK.OptionSetSample.CurrentRecord to a new record and displays the edit form
  ///</summary>
  SDK.OptionSetSample.hideEditForm();
  SDK.OptionSetSample.CurrentRecord = SDK.OptionSetSample.instantiateDefaultRecord();
  SDK.OptionSetSample.setCurrentRecord(SDK.OptionSetSample.CurrentRecord);
  var editForm = document.getElementById(SDK.OptionSetSample.FormData.Id);

  editForm.style.pixelLeft = 200;
  editForm.style.pixelTop = 200;
  SDK.OptionSetSample.showEditForm();

 },
 OnDeleteButtonClick: function () {
  ///<summary>
  /// Confirms that the records selected for deletion should be deleted. If the user clicks OK the records are deleted.
  ///</summary>
  var numberOfRecordsToDelete = SDK.OptionSetSample.SelectedRecords.length;
  if (numberOfRecordsToDelete > 0) {
   var message;
   if (numberOfRecordsToDelete == 1)
   { message = "Are you sure you want to delete this record?"; }
   else
   { message = "Are you sure you want to delete these " + numberOfRecordsToDelete + " records?"; }

   if (confirm(message)) {
    for (var i = 0; i < numberOfRecordsToDelete; i++) {
     SDK.OptionSetSample.deleteRecord.Execute(SDK.OptionSetSample.SelectedRecords[i]);
    }
   }
  }
 },
 OnEnterKeyPress: function () {
  ///<summary>
  /// Clicks the Save button when the enter key is pressed while editing the form
  ///</summary>
  if (event.keyCode == 13)
  { document.getElementById(SDK.OptionSetSample.FormData.SaveButtonId).click(); }
 },
 OnFieldChanged: function () {
  ///<summary>
  /// Set as the function for an a change event in the UI. Sets the field and form isDirty value to control what is to be saved.
  /// Enables the save button if data has changed
  ///</summary>
  var AttributeName = event.srcElement.id;
  SDK.OptionSetSample.CurrentRecord[AttributeName].isDirty = true;
  SDK.OptionSetSample.CurrentRecord.isDirty = true;
  SDK.OptionSetSample.evaluateSaveButtonEnable();
 },
 OnMetadataRetrieved: function () {
  ///<summary>
  /// Called by SDK.OptionSetSample.getAttributeMetadataCollection.Success after verifying that all attribute metadata has been retrieved.
  /// This allows for the required metadata to be available before the tasks of building the UI can be performed.
  ///</summary>
  SDK.OptionSetSample.buildTable();
  SDK.OptionSetSample.retrieveMultipleRecords.Execute();
  SDK.OptionSetSample.renderForm();
 },
 OnRecordsRetrieved: function (records) {
  ///<summary>
  /// Called by the SDK.OptionSetSample.retrieveMultipleRecords.Success callback to set the collection of records and refresh the list.
  ///</summary>
  ///<param name="records" type="Array">
  /// The array of retrieved records
  ///</param>
  SDK.OptionSetSample.RecordCollection = records;
  SDK.OptionSetSample.refreshRecordList();
 },
 OnRowClick: function () {
  ///<summary>
  /// Displays the edit form when a row in the table is clicked.
  ///</summary>
  for (var i = 0; i < SDK.OptionSetSample.RecordCollection.length; i++) {
   if (SDK.OptionSetSample.RecordCollection[i][SDK.OptionSetSample.PrimaryIdAttribute].Value == this.id) {
    SDK.OptionSetSample.setCurrentRecord(SDK.OptionSetSample.RecordCollection[i]);

    var editForm = document.getElementById(SDK.OptionSetSample.FormData.Id);
    editForm.style.pixelLeft = event.x + 10;
    editForm.style.pixelTop = event.y + 25;

    var tableBody = document.getElementById(SDK.OptionSetSample.TableData.BodyId);
    for (var i = tableBody.rows.length - 1; i >= 0; i--) {
     tableBody.rows.item(i).className = "";
    }
    this.className = "selectedRow";

    break;
   }
  }
 },
 OnSelectRowCheckboxClick: function () {
  ///<summary>
  /// Adds or removes a reference to a record from the SDK.OptionSetSample.SelectedRecords array when the checkbox for the row is clicked.
  ///</summary>
  event.cancelBubble = true;
  SDK.OptionSetSample.hideEditForm();
  var rowId = this.parentElement.parentElement.id;
  if (this.checked) {
   SDK.OptionSetSample.SelectedRecords.push(rowId);
  }
  else {
   for (var i = 0; i < SDK.OptionSetSample.SelectedRecords.length; i++) {
    if (rowId == SDK.OptionSetSample.SelectedRecords[i]) {
     SDK.OptionSetSample.SelectedRecords.splice(i, 1);
    }
   }
  }
  SDK.OptionSetSample.evaluateDeleteButtonEnable();
 },
 OnTableHeaderCheckboxClick: function () {
  ///<summary>
  /// Toggles all the checkboxes for rows in the table when the checkbox in the table header is clicked.
  ///</summary>
  var tableBody = document.getElementById(SDK.OptionSetSample.TableData.BodyId);
  SDK.OptionSetSample.SelectedRecords = [];
  for (var i = tableBody.rows.length - 1; i >= 0; i--) {
   var row = tableBody.rows.item(i);
   var checkbox = row.cells(0).children.tags("input")[0];
   checkbox.checked = this.checked;
   if (this.checked)
   { SDK.OptionSetSample.SelectedRecords.push(row.id); }
  }
  SDK.OptionSetSample.evaluateDeleteButtonEnable();
 },
 processRetrievedRecordProperties: function (record) {
  ///<summary>
  /// Transforms the record object retrieved from the REST endpoint so that they contain consistent properties to allow managing application logic.
  ///</summary>
  ///<returns>Object</returns>
  ///<param name="record" type="Object">
  /// The record retrieved from the REST endpoint
  ///</param>
  for (var i = 0; i < SDK.OptionSetSample.AttributeMetadataCollection.length; i++) {
   var AttributeMetadata = SDK.OptionSetSample.AttributeMetadataCollection[i];
   switch (AttributeMetadata.AttributeType) {
    //OptionSetValue attributes                                                                                                                                                                                                                                                             
    case "Boolean":
     if (record[AttributeMetadata.SchemaName] == true) {
      record[AttributeMetadata.SchemaName] = {};
      record[AttributeMetadata.SchemaName].Value = true;
      record[AttributeMetadata.SchemaName].Label = AttributeMetadata.OptionSet.TrueOption.Label.UserLocalizedLabel.Label;
     }
     else {
      record[AttributeMetadata.SchemaName] = {};
      record[AttributeMetadata.SchemaName].Value = false;
      record[AttributeMetadata.SchemaName].Label = AttributeMetadata.OptionSet.FalseOption.Label.UserLocalizedLabel.Label;
     }
     record[AttributeMetadata.SchemaName].isDirty = false;
     break;
    case "Picklist":
     if (record[AttributeMetadata.SchemaName].Value == null)
     { record[AttributeMetadata.SchemaName].Label = ""; }
     else {
      for (var o = 0; o < AttributeMetadata.OptionSet.Options.length; o++) {
       var option = AttributeMetadata.OptionSet.Options[o];
       if (option.OptionMetadata.Value == record[AttributeMetadata.SchemaName].Value) {
        record[AttributeMetadata.SchemaName].Label = option.OptionMetadata.Label.UserLocalizedLabel.Label;
        break;
       }
      }
     }
     record[AttributeMetadata.SchemaName].isDirty = false;
     break;
    case "State":
     if (record[AttributeMetadata.SchemaName].Value == null)
     { record[AttributeMetadata.SchemaName].Label = ""; }
     else {
      for (var o = 0; o < AttributeMetadata.OptionSet.Options.length; o++) {
       var option = AttributeMetadata.OptionSet.Options[o];
       if (option.StateOptionMetadata.Value == record[AttributeMetadata.SchemaName].Value) {
        record[AttributeMetadata.SchemaName].Label = option.StateOptionMetadata.Label.UserLocalizedLabel.Label;
        break;
       }
      }
     }
     record[AttributeMetadata.SchemaName].isDirty = false;
     break;
    case "Status":
     if (record[AttributeMetadata.SchemaName].Value == null)
     { record[AttributeMetadata.SchemaName].Label = ""; }
     else {
      for (var o = 0; o < AttributeMetadata.OptionSet.Options.length; o++) {
       var option = AttributeMetadata.OptionSet.Options[o];
       if (option.StatusOptionMetadata.Value == record[AttributeMetadata.SchemaName].Value) {
        record[AttributeMetadata.SchemaName].Label = option.StatusOptionMetadata.Label.UserLocalizedLabel.Label;
        break;
       }
      }
     }
     record[AttributeMetadata.SchemaName].isDirty = false;
     break;
    case "String":
     var Value = record[AttributeMetadata.SchemaName];
     Value = (Value == null) ? "" : Value;
     record[AttributeMetadata.SchemaName] = {};
     record[AttributeMetadata.SchemaName].Value = Value;
     record[AttributeMetadata.SchemaName].isDirty = false;
     break;
    case "DateTime":
    case "Uniqueidentifier":
    case "Customer":
    case "Owner":
    case "Lookup":
    case "Decimal":
    case "Double":
    case "Money":
    case "Integer":
     var Value = record[AttributeMetadata.SchemaName];
     record[AttributeMetadata.SchemaName] = {};
     record[AttributeMetadata.SchemaName].Value = Value;
     record[AttributeMetadata.SchemaName].isDirty = false;
     break;
    // The following attribute types are not editable in this sample                                                         
    // So they do not need to be processed.                                                        
    case "ManagedProperty":
    case "BingInt":
    case "CalendarRules":
    case "EntityName":
    case "Memo":
    case "PartyList":
     throw new Error("Not Implemented");
     break;
   }
  }
  return record;
 },
 refreshRecordList: function () {
  ///<summary>
  /// Refreshes the table displaying records using the SDK.OptionSetSample.RecordCollection
  ///</summary>
  var tableBody = document.getElementById(SDK.OptionSetSample.TableData.BodyId);
  //Clear any existing rows
  for (var i = tableBody.rows.length - 1; i >= 0; i--) {
   tableBody.removeChild(tableBody.rows.item(i));
  }
  //Create a row
  for (var i = 0; i < SDK.OptionSetSample.RecordCollection.length; i++) {
   var record = SDK.OptionSetSample.RecordCollection[i];
   var row = document.createElement("tr");
   row.id = record[SDK.OptionSetSample.PrimaryIdAttribute].Value;
   row.onclick = SDK.OptionSetSample.OnRowClick;

   if (SDK.OptionSetSample.TableData.CheckboxColumn) {
    var checkboxCell = document.createElement("td");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.onclick = SDK.OptionSetSample.OnSelectRowCheckboxClick;
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);
   }
   for (var c = 0; c < SDK.OptionSetSample.TableData.Columns.length; c++) {
    var property = SDK.OptionSetSample.TableData.Columns[c].Name;
    var cell = document.createElement("td");
    var displayElement = document.createElement("span");
    var AttributeType = SDK.OptionSetSample.getAttributeType(property);
    switch (AttributeType) {
     //The following Attribute types aren't supported by this sample.                                                         
     case "BingInt":
     case "CalendarRules":
     case "ManagedProperty":
     case "Memo":
     case "Money":
     case "PartyList":
     case "Uniqueidentifier":
     case "EntityName":
      throw new Error("Not Implemented");
      break;
     // The following attributes types are only supported for read in the grid.                                                         
     case "DateTime":
      var dateValue = record[property].Value;
      displayElement.innerText = dateValue.getUTCMonth() + 1 + "/" + dateValue.getUTCDay() + "/" + dateValue.getUTCFullYear();
      break;
     case "Decimal":
      displayElement.innerText = record[property].Value;
      break;
     case "Double":
      displayElement.innerText = record[property].Value;
      break;
     case "Integer":
      displayElement.innerText = record[property].Value;
      break;
     case "Customer":
     case "Owner":
     case "Lookup":
      var text = (record[property].Value.Name == null) ? "" : record[property].Value.Name;
      if (record[property].Value.Id == null)
      { displayElement.innerText = text; }
      else {
       var link = document.createElement("a");
       link.url = SDK.OptionSetSample.getRecordURL(record[property].Value.LogicalName, record[property].Value.Id);
       link.onclick = function () {
        event.cancelBubble = true;
        window.open(this.url, "_blank");
       };
       link.innerText = text;
       link.href = "#";
       displayElement.appendChild(link)
      }
      break;
     //The following attribute types can be edited in the form.                                                         
     case "Boolean":
     case "Picklist":
     case "State":
     case "Status":
      displayElement.innerText = record[property].Label;
      break;
     case "String":
      if (property != SDK.OptionSetSample.PrimaryAttribute)
      { displayElement.innerText = record[property].Value; }
      else {
       var link = document.createElement("a");
       link.url = SDK.OptionSetSample.getRecordURL(SDK.OptionSetSample.Entity.toLowerCase(), record[SDK.OptionSetSample.PrimaryIdAttribute].Value);
       link.onclick = function () {
        event.cancelBubble = true;
        window.open(this.url, "_blank");
       };
       link.innerText = record[property].Value;
       link.href = "#";
       displayElement.appendChild(link)
      }
      break;
    }
    cell.appendChild(displayElement);
    row.appendChild(cell);
   }

   tableBody.appendChild(row);

   var table = document.getElementById(SDK.OptionSetSample.TableData.Id)
   table.appendChild(tableBody);

  }

 },
 removeDeletedRecord: function (id) {
  ///<summary>
  /// Removes a deleted record from the SDK.OptionSetSample.RecordCollection and the corresponding row from the tbody.
  ///</summary>
  ///<param name="id" type="String">
  /// The id value for the deleted record
  ///</param>
  //Removing the deleted record from the SDK.OptionSetSample.RecordCollection array
  for (var i = 0; i < SDK.OptionSetSample.RecordCollection.length; i++) {
   var record = SDK.OptionSetSample.RecordCollection[i];
   if (record[SDK.OptionSetSample.PrimaryIdAttribute].Value == id) {
    SDK.OptionSetSample.RecordCollection.splice(i, 1);
    break;
   }
  }

  // Because the deleted record(s) are already in the table, there is no need to 
  // query the server and request the records.
  var tableBody = document.getElementById(SDK.OptionSetSample.TableData.BodyId);
  for (var i = tableBody.rows.length - 1; i >= 0; i--) {
   var row = tableBody.rows.item(i);
   if (row.id == id) {
    tableBody.removeChild(row);
    for (var x = 0; x < SDK.OptionSetSample.SelectedRecords.length; x++) {
     if (SDK.OptionSetSample.SelectedRecords[x] == id) {
      SDK.OptionSetSample.SelectedRecords.splice(x, 1);
      break;
     }
    }
    break;
   }
  }
  SDK.OptionSetSample.evaluateDeleteButtonEnable();
 },
 renderForm: function () {
  ///<summary>
  /// Loops through the SDK.OptionSetSample.Columnset and calls SDK.OptionSetSample.renderFormField for each attribute
  ///</summary>
  for (var i = 0; i < this.Columnset.length; i++) {
   this.renderFormField(this.Columnset[i]);
  }
  document.getElementById(SDK.OptionSetSample.FormData.Id).onkeypress = SDK.OptionSetSample.OnEnterKeyPress;
  document.getElementById(SDK.OptionSetSample.FormData.CloseFormControlId).onclick = SDK.OptionSetSample.hideEditForm;
  document.getElementById(SDK.OptionSetSample.FormData.SaveButtonId).onclick = SDK.OptionSetSample.saveCurrentRecord;
 },
 renderFormField: function (attributeName) {
  ///<summary>
  /// Locates the field placeholder in the form.
  /// If a placeholder is found an HTML control is rendered for the specified attribute.
  //  Only Boolean, Picklist, Status and String attributes can be added to the form.
  ///</summary>
  ///<param name="attributeName" type="String">
  /// The SchemaName for the Boolean, Picklist, Status or String attribute.
  ///</param>
  var fieldPlaceholder = document.getElementById(attributeName + "Field")
  if (fieldPlaceholder == null)
  { return; }
  var attributeMetadata = SDK.OptionSetSample.getAttributeMetadata(attributeName);
  if (!attributeMetadata.IsValidForUpdate) {
   throw new Error("The " + attributeName + " attribute cannot be added to an edit form because it is not valid for update.");
   return;
  }
  if (!attributeMetadata.IsValidForCreate) {
   throw new Error("The " + attributeName + " attribute cannot be added to an edit form because it is not valid for create.");
   return;
  }
  if (!attributeMetadata.IsValidForRead) {
   throw new Error("The " + attributeName + " attribute cannot be added to an edit form because it is not valid for read.");
   return;
  }
  var Required = (attributeMetadata.RequiredLevel.Value == "SystemRequired" || attributeMetadata.RequiredLevel.Value == "ApplicationRequired") ? true : false;
  var type = attributeMetadata.AttributeType;
  switch (type) {
   //Only Boolean, Picklist, Status and String attributes can be added to the form               
   case "Boolean":
    var label = document.createElement("span");
    label.innerText = attributeMetadata.DisplayName.UserLocalizedLabel.Label + " : ";
    var select = document.createElement("select");
    select.onchange = SDK.OptionSetSample.OnFieldChanged;
    select.id = attributeName;
    select.title = attributeMetadata.Description.UserLocalizedLabel.Label
    var falseOption = document.createElement("option");
    falseOption.value = false;
    falseOption.text = attributeMetadata.OptionSet.FalseOption.Label.UserLocalizedLabel.Label;
    select.options.add(falseOption);

    var trueOption = document.createElement("option");
    trueOption.value = true;
    trueOption.text = attributeMetadata.OptionSet.TrueOption.Label.UserLocalizedLabel.Label;
    select.options.add(trueOption);

    fieldPlaceholder.appendChild(label);
    fieldPlaceholder.appendChild(select);
    break;

   case "Picklist":
    var label = document.createElement("span");
    label.innerText = attributeMetadata.DisplayName.UserLocalizedLabel.Label + " : ";
    var select = document.createElement("select");
    select.onchange = SDK.OptionSetSample.OnFieldChanged;
    select.id = attributeName;
    select.title = attributeMetadata.Description.UserLocalizedLabel.Label;
    if (Required) {
     select.setAttribute("aria-required", true);
    }
    //Create a null option
    var option = document.createElement("option");
    option.value = null;
    option.text = "";
    select.options.add(option);

    for (var i = 0; i < attributeMetadata.OptionSet.Options.length; i++) {
     var om = attributeMetadata.OptionSet.Options[i];
     var option = document.createElement("option");
     option.value = om.OptionMetadata.Value;
     option.text = om.OptionMetadata.Label.UserLocalizedLabel.Label;
     select.options.add(option);
    }

    fieldPlaceholder.appendChild(label);
    fieldPlaceholder.appendChild(select);
    break;
   case "Status":
    var label = document.createElement("span");
    label.innerText = attributeMetadata.DisplayName.UserLocalizedLabel.Label + " : ";
    var select = document.createElement("select");
    select.onchange = SDK.OptionSetSample.OnFieldChanged;
    select.id = attributeName;
    select.title = attributeMetadata.Description.UserLocalizedLabel.Label
    //Options to be set when the CurrentRecord is set because there is a dependency on the record StateCode value.
    //SDK.OptionSetSample.addStatusCodeOptions will provide the options at that time.


    fieldPlaceholder.appendChild(label);
    fieldPlaceholder.appendChild(select);
    break;
   case "String":
    var label = document.createElement("span");
    label.innerText = attributeMetadata.DisplayName.UserLocalizedLabel.Label + " : ";
    var input = document.createElement("input");
    input.setAttribute("type", "Text");
    input.id = attributeName;
    input.title = attributeMetadata.Description.UserLocalizedLabel.Label
    input.onkeyup = SDK.OptionSetSample.OnFieldChanged;
    fieldPlaceholder.appendChild(label);
    fieldPlaceholder.appendChild(input);
    break;
   default:
    throw new Error("Not Implemented: This sample does not support adding " + type + " attributes to the form.");
    break;
  }
  if (Required) {
   var requiredStar = document.createElement("span");
   requiredStar.innerText = "*";
   requiredStar.title = "This field requires a value";
   requiredStar.style.color = "red";
   fieldPlaceholder.appendChild(requiredStar);
  }

 },
 saveCurrentRecord: function () {
  ///<summary>
  /// <para>Constructs a JSON object representing the changes made to the record.</para>
  /// <para>Keeps the SDK.OptionSetSample.CurrentRecord in sync with any changes.</para>
  /// <para>If the record is new the SDK.OptionSetSample.createRecord.Execute method is called to create the record.</para>
  /// <para>If the record has an id it is an existing record and SDK.OptionSetSample.updateRecord.Execute is called to update it.</para>
  /// <para>If the record value is required yet null, display a message and cancel the operation.</para>
  /// <para>Only Boolean, Picklist, Status and String attributes can be edited in this sample.</para>
  ///</summary>
  var recordToSave = {};
  //If there is no value for the UniqueIdentifer it is a new record.
  var newRecord = (SDK.OptionSetSample.CurrentRecord[SDK.OptionSetSample.PrimaryIdAttribute].Value == null);
  //A list of any attributes that have the isDirty flag set.
  SDK.OptionSetSample.ChangedAttributes = []
  for (var i = 0; i < SDK.OptionSetSample.Columnset.length; i++) {
   var AttributeName = SDK.OptionSetSample.Columnset[i]
   if (typeof SDK.OptionSetSample.CurrentRecord[AttributeName].isDirty != "undefined" && SDK.OptionSetSample.CurrentRecord[AttributeName].isDirty) {
    SDK.OptionSetSample.ChangedAttributes.push(AttributeName);
   }
  }
  //Go through the list of changed attributes and add properties to the JSON object with the current values.
  for (var i = 0; i < SDK.OptionSetSample.ChangedAttributes.length; i++) {
   var AttributeName = SDK.OptionSetSample.ChangedAttributes[i];
   var AttributeMetadata = SDK.OptionSetSample.getAttributeMetadata(AttributeName);
   var Required = (AttributeMetadata.RequiredLevel.Value == "SystemRequired" || AttributeMetadata.RequiredLevel.Value == "ApplicationRequired") ? true : false;
   switch (AttributeMetadata.AttributeType) {
    //Based on the type of attribute, create a property                                                                              
    // If the field value is required yet null, display a message and cancel the operation.                                                                             
    case "Boolean":
     var sourceField = document.getElementById(AttributeName);
     var value = sourceField.value;
     //This is probably not required because only two options are presented for Boolean fields. It should never be null.
     if (value == null && Required) {
      var message = "The " + AttributeMetadata.DisplayName.UserLocalizedLabel.Label + " field is required.";
      SDK.OptionSetSample.displayMessage(message);
      return;
     }
     var label = sourceField.options[sourceField.selectedIndex].text;
     recordToSave[AttributeName] = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Value = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Label = label;
     break;
    case "Picklist":
     var sourceField = document.getElementById(AttributeName);
     var value = parseInt(sourceField.value);
     if (value == null && Required) {
      var message = "The " + AttributeMetadata.DisplayName.UserLocalizedLabel.Label + " field is required.";
      SDK.OptionSetSample.displayMessage(message);
      return;
     }
     var label = sourceField.options[sourceField.selectedIndex].text;
     recordToSave[AttributeName] = {};
     recordToSave[AttributeName].Value = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Value = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Label = label;
     break;
    case "Status":
     var sourceField = document.getElementById(AttributeName);
     var value = parseInt(sourceField.value);
     if (value == null && Required) {
      var message = "The " + AttributeMetadata.DisplayName.UserLocalizedLabel.Label + " field is required.";
      SDK.OptionSetSample.displayMessage(message);
      return;
     }
     var label = sourceField.options[sourceField.selectedIndex].text;
     recordToSave[AttributeName] = {};
     recordToSave[AttributeName].Value = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Value = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Label = label;
     break;

    case "String":
     var value = document.getElementById(AttributeName).value;
     if ((value == null || value == "") && Required) {
      var message = "The " + AttributeMetadata.DisplayName.UserLocalizedLabel.Label + " field is required.";
      SDK.OptionSetSample.displayMessage(message);
      return;
     }
     recordToSave[AttributeName] = value;
     SDK.OptionSetSample.CurrentRecord[AttributeName].Value = document.getElementById(AttributeName).value;
     break;
    case "Owner":
     throw new Error("Not Implemented. Changing the OwnerId is an Assign operation and requires the SOAP endpoint");
     break;
    case "State":
     throw new Error("Not Implemented. Changing the State is an SetState operation and requires the SOAP endpoint");
     break;
    default:
     throw new Error("Not Implemented: " + AttributeMetadata.AttributeType + " attributes cannot be edited in this sample");
     break;

   }
  }
  if (!newRecord) {
   SDK.OptionSetSample.updateRecord.Execute(recordToSave, SDK.OptionSetSample.CurrentRecord[SDK.OptionSetSample.PrimaryIdAttribute].Value);
   SDK.OptionSetSample.hideEditForm();
  }
  else {
   SDK.OptionSetSample.createRecord.Execute(recordToSave);
   SDK.OptionSetSample.hideEditForm();
  }

 },
 search: function () {
  ///<summary>
  /// Executes a search on the searchable attribute
  ///</summary>
  var searchString = new String();
  if (event.srcElement != null) {
   searchString = event.srcElement.value;
  }
  else
  { searchString = document.getElementById(SDK.OptionSetSample.TableData.SearchFieldId).value; }
  searchString = searchString.replace(/[']/g, "''");
  //Note the searchString should be scrubbed to replace characters like single quotes that will cause syntax problems with the ODATA query.
  //This sample only checks for the single quote but there may be others

  SDK.OptionSetSample.hideEditForm();
  SDK.OptionSetSample.retrieveMultipleRecords.Execute(searchString);
 },
 setCurrentRecord: function (record) {
  ///<summary>
  /// Sets a new record as the current record.
  /// Verifies that any unsaved changes to 
  ///</summary>
  ///<param name="record" type="Object">
  /// The record to be set as the current record
  ///</param>

  if ((SDK.OptionSetSample.CurrentRecord != null) && (typeof SDK.OptionSetSample.CurrentRecord.isDirty != "undefined") && SDK.OptionSetSample.CurrentRecord.isDirty) {
   if (confirm("You have unsaved changes to the current record. Do you want to save it?")) {
    //Presses OK
    SDK.OptionSetSample.saveCurrentRecord();
    SDK.OptionSetSample.ChangedAttributes = [];
    return;
   }
   SDK.OptionSetSample.ChangedAttributes = [];
  }

  SDK.OptionSetSample.CurrentRecord = record;
  //Sets any editable fields in the form
  for (var i = 0; i < SDK.OptionSetSample.Columnset.length; i++) {
   var attribute = SDK.OptionSetSample.Columnset[i];
   try {
    document.getElementById(attribute).value = SDK.OptionSetSample.CurrentRecord[attribute].Value;

   }
   catch (e) {
    //It is expected that not every attribute in the SDK.OptionSetSample.Columnset is to be included in the form.
    // This sample only supports Boolean, Picklist, Status, and String attribute types
   }

  }
  SDK.OptionSetSample.addStatusCodeOptions();
  SDK.OptionSetSample.showEditForm();
  SDK.OptionSetSample.evaluateSaveButtonEnable();
 },
 showEditForm: function () {
  ///<summary>
  /// Shows the edit form
  ///</summary>
  document.getElementById(SDK.OptionSetSample.FormData.Id).style.display = "block";
 },
 updateListAfterSave: function () {
  ///<summary>
  /// Updates the list after save.
  ///</summary>
  for (var i = 0; i < SDK.OptionSetSample.Columnset.length; i++) {
   var AttributeName = SDK.OptionSetSample.Columnset[i]
   SDK.OptionSetSample.CurrentRecord[AttributeName].isDirty = false;
  }
  SDK.OptionSetSample.CurrentRecord.isDirty = false;

  SDK.OptionSetSample.search();
  SDK.OptionSetSample.evaluateSaveButtonEnable();
 },
 //Application Methods END
 // Data Operation Methods START
 createRecord: {
  Execute: function (record) {
   ///<summary>
   /// Sends an asynchronous request to save a record.
   ///</summary>
   ///<param name="record" type="Object">
   /// The record to create
   ///</param>
   SDK.REST.createAsync(
  SDK.OptionSetSample.Entity + "Set",
  record,
  this.Success,
  this.Error
  );
  },
  Success: function (record) {
   ///<summary>
   /// Success Callback method for the SDK.OptionSetSample.createRecord.Execute method.
   ///</summary>
   ///<param name="record" type="Object">
   /// The record that was created.
   ///</param>
   SDK.OptionSetSample.search();
   SDK.OptionSetSample.CurrentRecord = null;

  },
  Error: function (error) {
   ///<summary>
   /// Error Callback method for the SDK.OptionSetSample.createRecord.Execute method.
   ///</summary>
   ///<param name="error" type="Object">
   /// The error when saving the record.
   ///</param>
   SDK.OptionSetSample.displayMessage(error.message.value);
  }
 },
 retrieveMultipleRecords: {
  Execute: function (searchString) {
   ///<summary>
   /// Sends an asynchronous request to retrieve records
   ///</summary>
   ///<param name="searchString" type="String">
   /// Optional. Text to search for within the attribute configured in the SDK.OptionSetSample.TextSearchAttribute.
   ///</param>
   var filter = SDK.OptionSetSample.getSelectFilter();
   if (searchString != null && searchString != "") {
    var NameCriteria = "&$filter=substringof('" + searchString + "'," + SDK.OptionSetSample.TextSearchAttribute + ")";
    filter += NameCriteria;

   }

   SDK.REST.retrieveMultipleAsync(SDK.OptionSetSample.Entity + "Set", filter, this.Success, this.Error);
  },
  Success: function (records) {
   ///<summary>
   /// Success Callback method for the SDK.OptionSetSample.retrieveMultipleRecords.Execute method.
   ///</summary>
   ///<param name="records" type="Array">
   /// An array of retrieved records.
   ///</param>
   for (var i = 0; i < records.length; i++) {
    SDK.OptionSetSample.processRetrievedRecordProperties(records[i]);
   }
   SDK.OptionSetSample.OnRecordsRetrieved(records);
  },
  Error: function (error) {
   ///<summary>
   /// Error Callback method for the SDK.OptionSetSample.retrieveMultipleRecords.Execute method.
   ///</summary>
   ///<param name="error" type="Object">
   /// The error when retrieving records
   ///</param>
   SDK.OptionSetSample.displayMessage(error.message.value);
  }
 },
 updateRecord: {
  Execute: function (record, id) {
   ///<summary>
   /// Sends an asynchronous request to update records
   ///</summary>
   ///<param name="record" type="Object">
   /// The object containing changes.
   ///</param>
   ///<param name="id" type="String">
   /// The id of the record to update
   ///</param>
   SDK.REST.updateAsync(
      SDK.OptionSetSample.Entity + "Set",
      record,
      id,
      this.Success,
      this.Error
      )
  },
  Success: function () {
   ///<summary>
   /// Success Callback method for the SDK.OptionSetSample.updateRecord.Execute method.
   ///</summary>
   SDK.OptionSetSample.updateListAfterSave();
  },
  Error: function (error) {
   ///<summary>
   /// Error Callback method for the SDK.OptionSetSample.updateRecord.Execute method.
   ///</summary>
   ///<param name="error" type="Object">
   /// The error when updateing a record.
   ///</param>
   SDK.OptionSetSample.displayMessage(error.message.value);
  }
 },
 deleteRecord: {
  Execute: function (id) {
   ///<summary>
   /// Sends an asynchronous request to delete a record.
   ///</summary>
   ///<param name="id" type="String">
   /// The id of the record to delete.
   ///</param>
   SDK.REST.deleteAsync(
  SDK.OptionSetSample.Entity + "Set",
  id,
  this.Success,
  this.Error);
  },
  Success: function (id) {
   ///<summary>
   /// Success Callback method for the SDK.OptionSetSample.deleteRecord.Execute method.
   ///</summary>
   ///<param name="id" type="String">
   /// The id of the deleted record.
   ///</param>
   SDK.OptionSetSample.removeDeletedRecord(id);
  },
  Error: function (error) {
   ///<summary>
   /// Error Callback method for the SDK.OptionSetSample.deleteRecord.Execute method.
   ///</summary>
   ///<param name="error" type="Object">
   /// The error when deleting a record.
   ///</param>
   SDK.OptionSetSample.displayMessage(error);
  }
 },
 // Data Operation Methods END
 __namespace: true
};


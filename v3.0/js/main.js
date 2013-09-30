
function addContact() {

    var createContact = new XrmServiceToolkit.Soap.BusinessEntity("contact");
    createContact.attributes["firstname"] = "Diane";
    createContact.attributes["lastname"] = "Morgan";
    createContact.attributes["middlename"] = "<&>";   // Deliberate special characters to ensure that the toolkit can handle special characters correctly.
    createContact.attributes["gendercode"] = { value: 2, type: "OptionSetValue" };
    createContact.attributes["familystatuscode"] = { value: 1, type: "OptionSetValue" }; // Picklist : Single - 1
    createContact.attributes["creditlimit"] = { value: 2, type: "Money" };
   // createContact.attributes["birthdate"] = birthDate;
    createContact.attributes["donotemail"] = true;
    createContact.attributes["donotphone"] = false;
   // createContact.attributes["parentcustomerid"] = { id: accountId, logicalName: "account", type: "EntityReference" };

    contactId = XrmServiceToolkit.Soap.Create(createContact);

   // ok(guidExpr.test(contactId), "Creating a contact should returned the new record's ID in GUID format. ");

};

function whoami(){
    var request = "<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>" +
        "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />" +
        "<a:RequestId i:nil='true' />" +
        "<a:RequestName>WhoAmI</a:RequestName>" +
        "</request>";
    var whoAmI = XrmServiceToolkit.Soap.Execute(request);
    whoamiUserId = whoAmI.getElementsByTagName("a:Results")[0].childNodes[0].childNodes[1].text;
   // ok(guidExpr.test(whoamiUserId), "WhoAmI request should returned a valid GUID. ");
     alert(whoamiUserId);
};
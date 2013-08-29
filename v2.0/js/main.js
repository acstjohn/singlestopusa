
/*function CreateEntity(entity)
{
    var sampleContact1 =
    {
        FirstName: "Joe",
        LastName: 'Foo',
        GenderCode: { Value: 2 },
        FamilyStatusCode: { Value: 1 },
        CreditLimit: { Value: "3000.0000" },
        BirthDate: new Date(1955, 1, 20),
        DoNotEMail: false,
        DoNotPhone: true
    };

    var contactId1 = createContactSync2(sampleContact1);

    alert("Contact was created with an ID: " + contactId1);
}*/

function CreateEntity() {

    var createContact = new XrmServiceToolkit.Soap.BusinessEntity("contact");
    createContact.attributes["firstname"] = "Diane";
    createContact.attributes["lastname"] = "Morgan";
    createContact.attributes["middlename"] = "<&>";   // Deliberate special characters to ensure that the toolkit can handle special characters correctly.
    createContact.attributes["gendercode"] = { value: 2, type: "OptionSetValue" };
    createContact.attributes["familystatuscode"] = { value: 1, type: "OptionSetValue" }; // Picklist : Single - 1
    createContact.attributes["creditlimit"] = { value: 2, type: "Money" };
    createContact.attributes["birthdate"] = birthDate;
    createContact.attributes["donotemail"] = true;
    createContact.attributes["donotphone"] = false;
    createContact.attributes["parentcustomerid"] = { id: accountId, logicalName: "account", type: "EntityReference" };

    contactId = XrmServiceToolkit.Soap.Create(createContact);

   /* ok(guidExpr.test(contactId), "Creating a contact should returned the new record's ID in GUID format. ");     */

}
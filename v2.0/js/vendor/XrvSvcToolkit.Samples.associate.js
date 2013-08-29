/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: Associate method
*
* @copyright    Copyright (c) 2011 - 2013, KingswaySoft (http://www.kingswaysoft.com)
* @license      Microsoft Public License (Ms-PL)
* @developer    Daniel Cai (http://danielcai.blogspot.com)
* @contributors George Doubinski, Mitch Milam, Carsten Groth
*
* THIS SOFTWARE IS PROVIDED BY KingswaySoft ''AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL KingswaySoft BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*/

function onLoadAssociate()
{
    // Create test data
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

    var sampleContact2 =
    {
        FirstName: "Joe",
        LastName: 'Foo2',
        GenderCode: { Value: 2 },
        FamilyStatusCode: { Value: 1 },
        CreditLimit: { Value: "3000.0000" },
        BirthDate: new Date(1955, 1, 20),
        DoNotEMail: false,
        DoNotPhone: true
    };

    var sampleAccount1 = { Name: "Sample 1 account created with the XrmSvcToolkit", AccountNumber: '12345' };
    var sampleAccount2 = { Name: "Sample 2 account created with the XrmSvcToolkit", AccountNumber: '12346' };

    var contactId1 = createContactSync1(sampleContact1);
    var accountId1 = createAccountSync1(sampleAccount1);

    var contactId2 = createContactSync1(sampleContact2);
    var accountId2 = createAccountSync1(sampleAccount2);

    // Perform the Associate operation
    associateOperationSync(contactId1, accountId1);
    associateOperationAsync(contactId2, accountId2);
}

//
// Associate Operation
// 
// Required Options:
//   entity1Name        Name of the first entity
//   entity1Id          ID of the first entity
//   entity2Name        Name of the second entity
//   entity2Id          ID of the second entity
//   relationshipName   name of the relationship to associate with
//
// Optional Options:
//   statusCode - status code to set. leave blank or set at -1 to allow
//                CRM to make the determination
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function associateOperationSync(contactId, accountId)
{
    XrmSvcToolkit.associate({
        entity1Name: "Contact",
        entity1Id: contactId,
        entity2Name: "Account",
        entity2Id: accountId,
        relationshipName: "account_primary_contact",
        async: false
    });
}

//
// Associate Operation
// 
// Required Options:
//   entity1Name        Name of the first entity
//   entity1Id          ID of the first entity
//   entity2Name        Name of the second entity
//   entity2Id          ID of the second entity
//   relationshipName   name of the relationship to associate with
//
// Optional Options:
//   statusCode - status code to set. leave blank or set at -1 to allow
//                CRM to make the determination
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function associateOperationAsync(contactId, accountId)
{
    XrmSvcToolkit.associate({
        entity1Name: "Contact",
        entity1Id: contactId,
        entity2Name: "Account",
        entity2Id: accountId,
        relationshipName: "account_primary_contact",
        async: true,
        successCallback: function (result)
        {
            alert("The records should have now been associated.");
        },
        errorCallback: function (error)
        {
            throw error;
        }
    });
}

/****************************************************************************/
/*    Supporting Functions                                                  */
/****************************************************************************/
function createContactSync1(entity)
{
    var contact = XrmSvcToolkit.createRecord({
        entityName: "Contact",
        entity: entity,
        async: false
    });

    return contact.ContactId;
}

function createAccountSync1(entity)
{
    var account = XrmSvcToolkit.createRecord({
        entityName: "Account",
        entity: entity,
        async: false
    });

    return account.AccountId;
}
/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: Retrieve method
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

function onLoadRetrieve()
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

    var contactId = createContactSync7(sampleContact1);

    var results = retrieveOperationSync(contactId);
    alert("Retrieved: " + results.FirstName + " " + results.LastName + " is owned by: " + results["contact_owning_user/FullName"]);

    retrieveOperationAsync(contactId);
}

//
// Retrieve Operation
// 
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//
// Optional Options:
//   select - List of fields to return in the resultset
//   expand - 
//   async - True if this is this an asynchronous operation
//
function retrieveOperationSync(contactId)
{
    return XrmSvcToolkit.retrieve({
        entityName: "Contact",
        id: contactId,
        select: ["ContactId", "FirstName", "MiddleName", "LastName", "GenderCode", "FamilyStatusCode", "CreditLimit", "BirthDate", "DoNotEMail", "DoNotPhone", "contact_owning_user/SystemUserId", "contact_owning_user/FullName"],
        expand: ["contact_owning_user"],
        async: false
    });
}

function retrieveOperationSync2(id)
{
    return XrmSvcToolkit.retrieve({
        entityName: "Email",
        id: id,
        select: ["*", "email_activity_parties"],
        expand: ["email_activity_parties"],
        async: false
    });
}

//
// Retrieve Operation
// 
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//
// Optional Options:
//   select - List of fields to return in the resultset
//   expand - 
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function retrieveOperationAsync(contactId)
{
    XrmSvcToolkit.retrieve({
        entityName: "Contact",
        id: contactId,
        select: ["ContactId", "FirstName", "MiddleName", "LastName", "GenderCode", "FamilyStatusCode", "CreditLimit", "BirthDate", "DoNotEMail", "DoNotPhone"],
        async: true,
        successCallback: function (result)
        {
            alert("Retrieve just retrieved: " + result.FirstName + " " + result.MiddleName + " " + result.LastName);

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
function createContactSync7(entity)
{
    var contact = XrmSvcToolkit.createRecord({
        entityName: "Contact",
        entity: entity,
        async: false
    });

    return contact.ContactId;
}
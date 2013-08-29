/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: Delete method
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

function onLoadDelete()
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

    var sampleAccount1 = { Name: "Sample 1 account created with the XrmSvcToolkit", AccountNumber: '12345' };

    var contactId1 = createContactSync3(sampleContact1);
    var accountId1 = createAccountSync3(sampleAccount1);

    deleteOperationSync(contactId1);
    deleteOperationAsync("Account", accountId1);
}

//
// Delete Operation
// 
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//
function deleteOperationSync(contactId)
{
    XrmSvcToolkit.deleteRecord({
        entityName: "Contact",
        id: contactId,
        async: false
    });
}


//
// Delete Operation
// 
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function deleteOperationAsync(entityType, id)
{
    XrmSvcToolkit.deleteRecord({
        entityName: entityType,
        id: id,
        async: true,
        successCallback: function (result)
        {
            alert("Delete was successful");
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
function createContactSync3(entity)
{
    var contact = XrmSvcToolkit.createRecord({
        entityName: "Contact",
        entity: entity,
        async: false
    });

    return contact.ContactId;
}

function createAccountSync3(entity)
{
    var account = XrmSvcToolkit.createRecord({
        entityName: "Account",
        entity: entity,
        async: false
    });

    return account.AccountId;
}
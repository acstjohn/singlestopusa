/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: Create method
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

function onLoadCreateDemo()
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

    var contactId1 = createContactSync2(sampleContact1);
    var accountId1 = createAccountSync2();

    alert("Contact was created with an ID: " + contactId1);
    alert("Account was created with an ID: " + accountId1);

    createContactAsync2(sampleContact2);
}

function createAccountSync2()
{
    var account = XrmSvcToolkit.createRecord({
        entityName: "Account",
        entity:
        {
            Name: "A test account created by XrmSvcToolkit",
            AccountNumber: "12347"
        }
    });

    return account.AccountId;
}

//
// Create operation
//
// Required Options:
//   entityName     Name of entity
//   entity         Object representing entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//
function createContactSync2(entity)
{
    var result = XrmSvcToolkit.createRecord(
        {
            entityName: "Contact",
            entity: entity,
            async: false
        });

    return result.ContactId;
}

//
// Create operation
//
// Required Options:
//   entityName     Name of entity
//   entity         Object representing entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function createContactAsync2(entity)
{
    XrmSvcToolkit.createRecord(
    {
        entityName: "Contact",
        entity: entity,
        async: true,
        successCallback: function (result)
        {
            alert("Asynchronous:Successfully created a contact with the ID: " + result.ContactId);
        },
        errorCallback: function (error)
        {
            throw error;
        }
    });
}

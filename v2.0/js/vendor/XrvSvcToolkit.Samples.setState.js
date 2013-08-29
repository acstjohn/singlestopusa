/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: SetState method
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

function onLoadSetState()
{
    // Sample contact entity
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
        LastName: 'Foo',
        GenderCode: { Value: 2 },
        FamilyStatusCode: { Value: 1 },
        CreditLimit: { Value: "3000.0000" },
        BirthDate: new Date(1955, 1, 20),
        DoNotEMail: false,
        DoNotPhone: true
    };
        
    var contactId = createContactSync9(sampleContact1);
    var contactId2 = createContactSync9(sampleContact2);


    // Perform the SetState operation
    setStateOperationSync(contactId);
    setStateOperationAsync(contactId2);
}

//
// Set State Operation
// 
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//   stateCode      State code to set
//
// Optional Options:
//   statusCode - status code to set. leave blank or set at -1 to allow
//                CRM to make the determination
//   async - True if this is this an asynchronous operation
//
function setStateOperationSync(contactId)
{
    XrmSvcToolkit.setState({
        entityName: "contact",
        id: contactId,
        stateCode: 1,
        statusCode: -1,
        async: false
    });
}

//
// Set State Operation
// 
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//   stateCode      State code to set
//
// Optional Options:
//   statusCode - status code to set. leave blank or set at -1 to allow
//                CRM to make the determination
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function setStateOperationAsync(contactId)
{
    XrmSvcToolkit.setState({
        entityName: "contact",
        id: contactId,
        stateCode: 1,
        statusCode: -1,
        async: true,
        successCallback: function (result)
        {
            alert("setState was successful");
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
function createContactSync9(sampleContact)
{
    var contact = XrmSvcToolkit.createRecord({
    entityName: "Contact",
    entity: sampleContact,
    async: false
    });

    return contact.ContactId;
}

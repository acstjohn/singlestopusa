/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: Update method
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

function onLoadUpdate()
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

    var contact = createContactSync10(sampleContact1);

    contact.Address1_City = "Dallas";
    contact.Address1_PostalCode = "75010";

    updateOperationSync(contact);

    contact.Address1_Country = "United States";

    updateOperationAsync(contact);
}

//
// Update Operation
//
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//   entity         Object representing entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//
function updateOperationSync(contact)
{
    XrmSvcToolkit.updateRecord({
        entityName: "Contact",
        id: contact.ContactId,
        entity: contact,
        async: false
    });
}

//
// Update Operation
//
// Required Options:
//   entityName     Name of entity
//   id             GUID of entity
//   entity         Object representing entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function updateOperationAsync(contact)
{
    XrmSvcToolkit.updateRecord({
        entityName: "Contact",
        id: contact.ContactId,
        entity: contact,
        async: true,
        successCallback: function (result)
        {
            alert("Update was successful");
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
function createContactSync10(entity)
{
    var result = XrmSvcToolkit.createRecord({
        entityName: "Contact",
        entity: entity,
        async: false
    });

    return result;
}
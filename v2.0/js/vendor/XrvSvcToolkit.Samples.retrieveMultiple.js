/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: retrieveMultiple method
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

function onLoadRetrieveMultiple()
{
    var results = getIdFromName("Account", "Name", "Wheel Gallery");

    alert("The ID of Wheel Gallery is " + results[0].AccountId);
}

//
// RetrieveMultiple Operation
//
// Required Options:
//   entityName     Name of entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//   odataQuery - OData query string
//
function retrieveMultipleOperationSync(contactId)
{
    return XrmSvcToolkit.retrieveMultiple({
        entityName: "Contact",
        odataQuery: "$select=BirthDate,ContactId,CreditLimit,DoNotEMail,DoNotPhone,FamilyStatusCode,FirstName,GenderCode,LastName,MiddleName&$filter=ContactId eq guid'" + contactId + "'",
        async: false
    });
}

//
// RetrieveMultiple Operation
//
// Required Options:
//   entityName     Name of entity
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//   odataQuery - OData query string
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function retrieveMultipleOperationAsync(contactId)
{
    XrmSvcToolkit.retrieveMultiple({
        entityName: "Contact",
        odataQuery: "$select=BirthDate,ContactId,CreditLimit,DoNotEMail,DoNotPhone,FamilyStatusCode,FirstName,GenderCode,LastName,MiddleName&$filter=ContactId eq guid'" + contactId + "'",
        async: true,
        successCallback: function (results)
        {
            alert("RetrieveMultiple=Just retrieved: " + results[0].FirstName + " " + results[0].MiddleName + " " + results[0].LastName);
        },
        errorCallback: function (error)
        {
            throw error;
        }
    });
}
//
// Get the ID of an Entity record given its name
//
// Required Options:
//   entityName     Name of entity
//   nameFieldName  Name of the 'Name' field to search
//   value          Value to search on
//
function getIdFromName(entityName, nameFieldName, value)
{
    return XrmSvcToolkit.retrieveMultiple({
        entityName: entityName,
        odataQuery: "$select=" + entityName + "Id" +
                    "&$filter=" + nameFieldName +
                    " eq '" + value + "'",
        async: false
    });
}

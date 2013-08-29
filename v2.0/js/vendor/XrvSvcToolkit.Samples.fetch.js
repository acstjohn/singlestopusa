/**
* XrmSvcToolkit v0.2, a small JavaScript library that helps access 
* Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
*
* Samples: Fetch method
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

function onLoadFetch()
{
    var fetchOperationResults = fetchOperationSync(contactId);
    alert("Fetch just retrieved: " + fetchOperationResults.entities[0].firstname + " " + fetchOperationResults.entities[0].middlename + " " + fetchOperationResults.entities[0].lastname);

    var fetchOperationCountResults = fetchOperationCountSync();
    alert("Fetch just retrieved a count of " + fetchOperationCountResults.entities[0]["contact_count"] + " contacts.");

    var businessUnitName = GetBusinessUnitName();
    alert("The business unit for the current user is: " + businessUnitName);
}

//
// Retrieve the name of the business unit of the current CRM user.
//
// Written by: Peter000000 
//             http://www.codeplex.com/site/users/view/Peter000000
//
function GetBusinessUnitName()
{
    var lGetBusinessUnitName;

    var fetchXml = "<fetch mapping='logical'>" +
                   "<entity name='systemuser'>" +
                   "<attribute name='businessunitid' />" +
                   "<filter type='and'>" +
                   "<condition attribute='systemuserid' operator='eq-userid' />" +
                   "</filter>" +
                   "</entity>" +
                   "</fetch>";

    XrmSvcToolkit.fetch({
        fetchXml: fetchXml,
        async: false,
        successCallback: function (result)
        {
            lGetBusinessUnitName = result.entities[0].businessunitid.Name;
        },
        errorCallback: function (error)
        {
            throw error;
        }
    });

    return lGetBusinessUnitName;
}

//
// Fetch Operation
//
// Required Options:
//   fetchXml     FetchXml query
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//
function fetchOperationSync(contactId)
{
    var fetchXml =
"<fetch mapping='logical'>" +
   "<entity name='contact'>" +
      "<attribute name='contactid' />" +
      "<attribute name='firstname' />" +
      "<attribute name='lastname' />" +
      "<attribute name='middlename' />" +
      "<attribute name='gendercode' />" +
      "<attribute name='familystatuscode' />" +
      "<attribute name='ownerid' />" +
      "<attribute name='creditlimit' />" +
      "<attribute name='birthdate' />" +
      "<attribute name='accountrolecode' />" +
      "<attribute name='donotemail' />" +
      "<attribute name='donotphone' />" +
      "<filter>" +
         "<condition attribute='contactid' operator='eq' value='" + contactId + "' />" +
      "</filter>" +
   "</entity>" +
"</fetch>";

    return XrmSvcToolkit.fetch({
        fetchXml: fetchXml,
        async: false
    });
}

function fetchOperationCountSync()
{
    var count;

    var fetchXml =
"<fetch distinct='false' mapping='logical' aggregate='true'>" +
"    <entity name='contact'> " +
"       <attribute name='contactid' alias='contact_count' aggregate='countcolumn' /> " +
"    </entity> " +
"</fetch>";

    XrmSvcToolkit.fetch({
        fetchXml: fetchXml,
        async: false,
        successCallback: function (result)
        {
            count = result.entities[0]["contact_count"];
        },
        errorCallback: function (error)
        {
            throw error;
        }
    });

    return count;
}

function fetchOperationCountSync2()
{
    var fetchXml =
"<fetch distinct='false' mapping='logical' aggregate='true'>" +
"    <entity name='contact'> " +
"       <attribute name='contactid' alias='contact_count' aggregate='countcolumn' /> " +
"    </entity> " +
"</fetch>";

    return XrmSvcToolkit.fetch({
        fetchXml: fetchXml,
        async: false
    });
}

function fetchOperationCountSync3()
{
    var fetchXml =
            "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                "  <entity name='email'>" +
                "    <attribute name='subject' />" +
                "    <attribute name='regardingobjectid' />" +
                "    <attribute name='from' />" +
                "    <attribute name='to' />" +
                "    <attribute name='prioritycode' />" +
                "    <attribute name='statuscode' />" +
                "    <attribute name='modifiedon' />" +
                "    <attribute name='activityid' />" +
                "    <attribute name='ownerid' />" +
                "    <attribute name='cc' />" +
                "    <attribute name='bcc' />" +
                "    <order attribute='subject' descending='false' />" +
                "    <filter type='and'>" +
                "      <condition attribute='createdon' operator='on' value='2013-05-16' />" +
                "    </filter>" +
                "  </entity>" +
                "</fetch>";

    return XrmSvcToolkit.fetch({
        fetchXml: fetchXml,
        async: false
    });
}


//
// Fetch Operation
//
// Required Options:
//   fetchXml     FetchXml query
//
// Optional Options:
//   async - True if this is this an asynchronous operation
//   successCallback - Callback to be executed after a successful operation
//   errorCallback - Callback executed when an error is encountered
//
function fetchOperationAsync(contactId)
{
    var fetchXml =
"<fetch mapping='logical'>" +
   "<entity name='contact'>" +
      "<attribute name='contactid' />" +
      "<attribute name='firstname' />" +
      "<attribute name='lastname' />" +
      "<attribute name='middlename' />" +
      "<attribute name='gendercode' />" +
      "<attribute name='familystatuscode' />" +
      "<attribute name='ownerid' />" +
      "<attribute name='creditlimit' />" +
      "<attribute name='birthdate' />" +
      "<attribute name='accountrolecode' />" +
      "<attribute name='donotemail' />" +
      "<attribute name='donotphone' />" +
      "<filter>" +
         "<condition attribute='contactid' operator='eq' value='" + contactId + "' />" +
      "</filter>" +
   "</entity>" +
"</fetch>";

    XrmSvcToolkit.fetch({
        fetchXml: fetchXml,
        async: true,
        successCallback: function (result)
        {
            alert("Fetch=Just retrieved: " + result.entities[0].firstname + " " + result.entities[0].middlename + " " + result.entities[0].lastname);
        },
        errorCallback: function (error)
        {
            throw error;
        }
    });
}

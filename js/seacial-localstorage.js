var count_login_clicks = 0;
var tried_usernames = [];
function validateLogin(username) {
    count_login_clicks++;
    if (!userExists(username)) {
        //alert("User " + username + " does not exist. Please sign up first.");
        if(count_login_clicks == 1 || tried_usernames.indexOf(username) < 0){
            if(!username){
                document.getElementById("not-user").innerHTML += "<b>Fill in with your username and password.</b><br>";
            }
            else{
                document.getElementById("not-user").innerHTML += "<b>Username " + username +" does not exist. Please sign up first.</b><br>";
            }
            document.getElementById("to-go").style.display = "none";
            tried_usernames.push(username);
        }
        return false;
    }
    //alert("Welcome back " + username);
    setCookie("username", username);
    return true;
}

function loggedIn() {
    return (loggedInUsername.length > 0);
}

function currentUsername() {
    return loggedInUsername;
}

function loggedInRole() {
    if (loggedIn()) {
        return someLocalStorage["users"][loggedInUsername]["role"];
    }
    return "(Not logged in!)";
}

function loggedInFullName() {
    if (loggedIn()) {
        return someLocalStorage["users"][loggedInUsername]["firstname"] + " " +
            someLocalStorage["users"][loggedInUsername]["lastname"];
    }
    return "(Not logged in!)";
}


function loggedInEmail() {
    if (loggedIn()) {
        return someLocalStorage["users"][loggedInUsername]["email"];
    }
    return "(Not logged in!)";
}

function loggedInBoatName() {
    if (loggedIn()) {
        return someLocalStorage["users"][loggedInUsername]["boatname"];
    }
    return "(Not logged in!)";
}


function loggedInInstitute() {
    if (loggedIn()) {
        return someLocalStorage["users"][loggedInUsername]["institute"];
    }
    return "(Not logged in!)";
}


function signupLS(role, firstname, lastname, username, boatname, institute, email,email1, pass, pass1) {

    if (userExists(username)) {
        document.getElementById("username-exists").style.display = "";
    } else{
        document.getElementById("username-exists").style.display = "none";
    }

    document.getElementById("wrong-email").style.display  ="none";
    document.getElementById("wrong-pass").style.display  ="none";
    if(email != email1){
        document.getElementById("wrong-email").style.display  ="";
        return false;
    }
    if(pass != pass1){
        document.getElementById("wrong-pass").style.display  ="";
        return false;
    }
    if (firstname.length == 0) {
        alert("Please enter first name");
        return false;
    }
    if (lastname.length == 0) {
        alert("Please enter last name");
        return false;
    }
    if (username.length == 0) {
        alert("Please enter username");
        return false;
    }
    if (boatname.length == 0 && role=="sailor") {
        alert("Please enter boat name");
        return false;
    }
    if (institute.length == 0 && role=="academic") {
        alert("Please enter institute name");
        return false;
    }

    if (email.length == 0) {
        alert("Please enter email");
        return false;
    }
    if(role=="academic"){
        return addUser(username, {
            "role": role,
            "firstname": firstname,
            "lastname": lastname,
            "institute": institute,
            "boatname": "",
            "email": email
        });
    }else{
        return addUser(username, {
            "role": role,
            "firstname": firstname,
            "lastname": lastname,
            "institute": "",
            "boatname": boatname,
            "email": email
        });
    }
    return true;
    //setCookie("username", username);
}



function writeAcceptedDataRequestOptions()
{
    var element = document.getElementById("request-options");
    if (element) {
	var text="";

        var accepts = getStorageObject()["accepts"][loggedInUsername];
        if (accepts.length == 0) {
	       text = "You have not accepted any data request yet. Please go to the <a href='?/=all-requests-sailor'>All Requests</a> page to accept requests.";
            document.getElementById("there-are-requests").style.display = "none";
            document.getElementById("no-accepted-request").style.display = "";
	}
	else {
            document.getElementById("there-are-requests").style.display = "";
            document.getElementById("no-accepted-request").style.display = "none";
            text+="<select class='fleet-input' id='requestid'>";
            text+="<option value=''><i>-- Choose the data request you want to answer --</option>";
            var i;
	    for (i=0;i<accepts.length;i++) {
                var req=getStorageObject()["requests"][accepts[i]];
                if(req[status] != "Completed"){
                    text+="    <option value='"+accepts[i]+"'>"+"Academic: "+req["username"]+" | Area: "+req["area"]+" | Type of data: "+req["reqtype"]+"</option>";
                }
	    }
            text+="</select>";
	}
        element.innerHTML = text;
    }
}

function shouldWriteAcademicWelkome(){
        var requests = getStorageObject()["requests"];
        for (var key in requests) {
            var row = requests[key];
            if(row["username"] == currentUsername()){
                document.getElementById("no-my-request").style.display ="none";
                return;
            }
        }
}

var image_tracker = [];

function chevronSwitch1(id) {
    var image = document.getElementById(id);
    var index = parseInt(id.substr(14));
    if (image_tracker[index] == 'd') {
      image.src = 'images/chevron-up.png';
      image_tracker[index] = 'u';
    }
    else {
      image.src = 'images/chevron-down.png';
      image_tracker[index] = 'd';
    }
}

function writeRequestsTable(page) {
    //var acceptedOnly = false;
    var element = document.getElementById("requests-all");
    if (element == null) {
	   element = document.getElementById("requests-accepted");
    }
	if (element) {
        //acceptedOnly = true;
	}

    if (element) {
    	var text="";

    	text+=" <thead>";
    	text+="   <th  width='18%'>Academic</th>";
    	text+="   <th  width='47%'>Requested area</th>";
    	text+="   <th width='15%'>Type of request</th>";
    	text+="   <th width='15%'>Status";
    	text+="   </th>";
    	text+="   <th width='5%'></th>";
    	text+=" </thead>";
    	var count=0;

        var accepts = getStorageObject()["accepts"][loggedInUsername];
        var answered = getStorageObject()["answered"][loggedInUsername];
        var rejects = getStorageObject()["rejects"][loggedInUsername];

    	var requests = getStorageObject()["requests"];
        for (var key in requests) {


            image_tracker[count] = 'd';

            if(!requests.hasOwnProperty(key)) {
                  continue;
            }
            var row = requests[key];

            if((row["status"] == "Pending Approval" || row["status"] == "Not Approved") && (page=="all-sailor" || page == "all-academic")){
                continue;}

            if(page=="my" && (row["username"] != loggedInUsername || row["status"] == "Not Approved")){ continue; }

            //if (page=="accepted" && accepts.indexOf(key) < 0) { continue; }

    	    text+=" <tr>";
    	    //text+="   <td>"+row["username"]+"</td>";
            text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+ someLocalStorage["users"][row["username"]]["firstname"] + " " + someLocalStorage["users"][row["username"]]["lastname"]+"</a></td>";

    	    text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+row["area"]+"</a></td>";

    	    text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+row["reqtype"]+"</a></td>";

            if (page=="all-sailor" && rejects.indexOf(key) > -1){
                text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"Rejected"+"</a></td>";
            } else if(row["status"] == "Accepted" && page=="my"){
                text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"Accepted"+"</a></td>";
            } else if(row["status"] == "Rejected" && page=="my"){
                text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"Approved"+"</a></td>";
            } else if(row["status"] == "Rejected" && page=="all-academic"){
                text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"New"+"</a></td>";
            } else if( row["status"] == "Accepted" && accepts.indexOf(key) < 0){
               text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"New"+"</a></td>";
            } else if( row["status"] == "Rejected" && rejects.indexOf(key) < 0){
               text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"New"+"</a></td>";
            } else if(row["status"] == "Approved" && (page=="all-sailor" || page=="all-academic")){
                text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+"New"+"</a></td>";
            } else{
                text+="   <td><a class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">"+row["status"]+"</a></td>";
            }
    	    text+="   <td>";
    	    text+="     <a href='#' class='toggler' data-request='"+count+"' onclick=\"chevronSwitch1('chevron-switch"+count+"');\">";
    	    text+="         <img id='chevron-switch"+count+"' class='chevron-img' src='images/chevron-down.png' alt='chevron down' />";
    	    text+="     </a>";
    	    text+="   </td>";
    	    text+=" </tr>";
    	    text+=" <tr id='section-requests-info"+count+"' class='req"+count+"' style='display: none'>";
    	    text+="   <td colspan='5'>";
    	    text+="     <div class='row wrapper-info-requests'>";
    	    text+="       <div class='col-4'>";
            if(row["frequency"] || row["number"]){
    	       text+="         <p class='p_requests'>Quantity</p>";
            }
    	    text+="         <p>Number of measures "+row["frequency"]+": "+row["number"]+"</p>";
    	    if(row["latitude"] || row["longitude"] || row["radius"]){
                text+="         <p class='p_requests'>Area of measurements</p>";
            }
            if(row["latitude"]){
    	       text+="         <p>Latitude: "+row["latitude"]+ "</p>";
            }
            if(row["longitude"]){
               text+="         <p>Longitude: "+row["longitude"]+"</p>";
            }
            if(row["radius"]){
               text+="          <p>Radius: "+row["radius"]+" km</p>";
            }
            if(row["first"]){
    	       text+="         <p class='p_requests'>First measurement</p>";
            }
    	    text+="         <p>"+row["first"]+"</p>";
            if(row["last"]){
               text+="         <p class='p_requests'>Last measurement</p>";
            }
            text+="         <p>"+row["last"]+"</p>";
    	    text+="       </div>";
    	    text+="       <div class='col-8'>";
    	    text+="         <p class='p_requests'>Description</p>";
    	    text+="         <div class='description-box-requests'>"+row["description"] + "<hr>" + row["aditional"] +"</div>";
    	    text+="         <div class='row'>";
            if((row["status"] == "Approved" || row["status"] == "Rejected") && page == "all-sailor" && rejects.indexOf(key) < 0){
                text+="           <div class='col-4'>";
                text+="             <button type='button' id='accept-requests"+count+"' onclick='{requestPageClickAccept(\""+key+"\");}' class='btn btn-default button-accept-requests'>Accept</button>";
                text+="           </div>";
                text+="           <div class='col-4'>";
                text+="             <button type='button' onclick='redirectToChatboxSailor();' class='btn btn-default button-accept-requests'>Contact Academic</button></a>";
                text+="           </div>";
                text+="           <div class='col-4'>";
                text+="             <button type='button' id='reject-requests"+count+"' onclick='{requestPageClickReject(\""+key+"\");}' class='btn btn-default button-reject-requests' >Reject</button>";
                text+="           </div>";
            }

            if (page=="all-sailor" && rejects.indexOf(key) > -1){
                text+="           <div class='col-6'>";
                text+="             <button type='button' id='accept-requests"+count+"' onclick='{requestPageClickAccept(\""+key+"\");}' class='btn btn-default button-accept-requests'>Accept</button>";
                text+="           </div>";
                text+="           <div class='col-6'>";
                text+="             <button type='button' onclick='redirectToChatboxSailor();' class='btn btn-default button-accept-requests'>Contact Academic</button></a>";
                text+="           </div>";
            }
            //Reject button disabled when request already rejected by this user
            /*if(row["status"] == "Rejected" && page == "all-sailor" && accepts.indexOf(key) > -1){
                text+="           <div class='col-6'>";
                text+="             <button type='button' id='reject-requests"+count+"' class='btn btn-default button-reject-requests' disabled>Reject</button>";
                text+="           </div>";
            }*/

            if( row["status"] == "Accepted" && accepts.indexOf(key)>-1 && page=="all-sailor" && answered.indexOf(key)>-1){
                text+="           <div class='col-6'>";
                text+="              <button type='button' onclick='redirecToDashboard();' class='btn btn-default button-accept-requests'>Submit Data</button>";
                text+="           </div>";
                text+="           <div class='col-6'>";
                text+="             <button type='button' onclick='redirectToChatboxSailor();' class='btn btn-default button-accept-requests'>Contact Academic</button>";
                text+="           </div>";
                text+="           <div class='col-6'>";
                text+="             <button type='button' id='accept-requests"+count+"' onclick='{requestPageClickComplete(\""+key+"\");myReload();}' class='btn btn-default button-accept-requests'>Complete</button>";
                text+="           </div>";
                text+="           <div class='col-6'>";
                text+="             <button type='button' onclick='{requestPageClickReject(\""+key+"\");}' class='btn btn-default button-reject-requests' >Reject</button>";
                text+="           </div>";
            }
            else if( row["status"] == "Accepted" && accepts.indexOf(key)>-1 && page=="all-sailor" && answered.indexOf(key)<0){
                text+="           <div class='col-4'>";
                text+="             <button type='button' onclick='redirecToDashboard();' class='btn btn-default button-accept-requests'>Submit Data</button></a>";
                text+="           </div>";
                text+="           <div class='col-4'>";
                text+="             <button type='button' onclick='redirectToChatboxSailor();' class='btn btn-default button-accept-requests'>Contact Academic</button></a>";
                text+="           </div>";
                text+="           <div class='col-4'>";
                text+="             <button type='button' onclick='{requestPageClickReject(\""+key+"\");}' class='btn btn-default button-reject-requests' >Reject</button>";
                text+="           </div>";
            } else if(row["status"] == "Completed" && page=="all-sailor"){
                text+="           <div class='col-12'>";
                text+="             <button type='button' onclick='redirectToChatboxSailor();' class='btn btn-default button-accept-requests'>Contact Academic</button>";
                text+="           </div>";
            }
            if(page == "all-academic" && row["status"] == "Completed"){
                text+="           <div class='col-6'>";
                text+="             <button type='button' onclick='redirectToChatboxAcademic();' class='btn btn-default button-accept-requests'>Contact Academic</button></a>";
                text+="           </div>";
                text+="           <div class='col-6'>";
                text+="             <button type='button' onclick='downloadDataButton();' class='btn btn-default button-accept-requests'>Download Data</button>";
                text+="           </div>";
            } else if(page == "all-academic" && row["status"] != "Completed"){
                text+="           <div class='col-12'>";
                text+="             <button type='button' onclick='redirectToChatboxAcademic();' class='btn btn-default button-accept-requests'>Contact Academic</button>";
                text+="           </div>";
            }
            if(page == "my"){
                if(row["status"] == "Completed"){
                    text+="           <div class='col-12'>";
                    text+="             <button type='button' onclick='downloadDataButton();' class='btn btn-default button-accept-requests'>Download Data</button>";
                    //text+="                 <input id='fileInput' type='file' style='display:none;' accept='image/*' />";
                    //text+="                 <input type='button' value='Download Data' onclick='document.getElementById('fileInput').click();' class='btn btn-default button-accept-requests' />";
                    text+="           </div>";
                }
            }
    	    text+="         </div>";
    	    text+="       </div>";
    	    text+="     </div>";
    	    text+="   </td>";
    	    text+=" </tr>";

            count++;
        }
        element.innerHTML = text;
    }
}


function requestPageClickAccept(requestid){
    var response = confirm("Are you sure you want to accept this request?");
    if (response) {
        addAccept(requestid);
        myReload();
    }
}
function requestPageClickReject(requestid){
    var response = confirm("Are you sure you want to reject this request?");
    if (response) {
        addReject(requestid);
        myReload();
    }
}

function requestPageClickComplete(requestid){
    var response = confirm("Are you sure you have completed this request?");
    if (response) {
        addComplete(requestid);
        myReload();
    }
}


function redirecToDashboard(){
  window.location.href = '?/=dashboard-sailor';
}

function redirectToChatboxAcademic(){
    window.location.href = '?/=chatbox-academic';
}

function downloadDataButton(){
    alert("The data was saved in your computer.");
}
function redirectToChatboxSailor(){
    window.location.href = '?/=chatbox-sailor';
}


/****************************************************
 *
 * End of driver
 *
 ****************************************************/


/*
 * If corruption ever occurred, this function should reset the database.
 */
function resetDatabase() {
    //    alert('Resetting Database');
    createNewDatabase();
}

/*
 * Simulating a database by storing data into localstorage.
 */


var dataversion = "data001";
var someLocalStorage = {};
var userinfoFields =    ["role", "firstname", "lastname", "institute",   "boatname", "email"];
var messageinfoFields = ["type", "from",      "to",       "description", "date",     "previous"];
var requestinfoFields1 = ["username", "area",  "reqtype",  "description", "status", "duration", "frequency", "deadline"];
var requestinfoFields = ["username", "reqtype", "area", "latitude", "longitude", "radius", "first", "last",  "description", "status", "frequency", "number", "aditional"];
var acceptsinfoFields = ["accepts"];
var answeredinfoFields = ["answered"];
var rejectsinfoFields = ["rejects"];
var datainfoFields = ["data"];



function getTodayDateString() {
    var date = new Date();
    return ""+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
}

function getNewUniqueId(typeStr) {
    someLocalStorage["lastuid"] = someLocalStorage["lastuid"] + 1;
    var uid = typeStr+someLocalStorage["lastuid"];
    putStorage();
    return uid;
}

function getStorageObject() {
    return someLocalStorage;
}

function createNewDatabase() {
    // Create new empty database
    someLocalStorage = {};

    someLocalStorage["lastuid"]=1;
    someLocalStorage["users"] = {};
    someLocalStorage["messages"] = {};
    someLocalStorage["requests"] = {};

    someLocalStorage["accepts"] = {};
    someLocalStorage["answered"] = {};
    someLocalStorage["rejects"] = {};
    someLocalStorage["data"] = {};

    // Populate with some default data
    // For compatibility with the static version
    addUser("conor", {
        "role": "sailor",
        "firstname": "Conor",
        "lastname": "la Grue",
        "institute": "",
        "boatname": "Given Time",
        "email": "conorlagrue@gmail.com"
    });
    addUser("sarah", {
        "role": "academic",
        "firstname": "Sarah",
        "lastname": "la Grue",
        "institute": "Cambridge University",
        "boatname": "",
        "email": "sarahlagrue@gmail.com"
    });

    // Put in storage
    putStorage();
}


function userExists(username) {
    return (someLocalStorage["users"][username] != null);
}

function addUser(username, userinfo) {
    if (userExists(username)) {
        document.getElementById("username-exists").style.display = "";
        //alert("   User with that name already exists");
        return false;
    }
    someLocalStorage["users"][username] = {};
    for (var i = 0; i < userinfoFields.length; i++) {
        someLocalStorage["users"][username][userinfoFields[i]] = userinfo[userinfoFields[i]];
    }
    someLocalStorage["accepts"][username] = [];
    someLocalStorage["rejects"][username] = [];
    someLocalStorage["answered"][username] = [];
    setCookie("username", username);
    putStorage();

    if(username != "conor" && username != "sarah"){
        var messageinfo = {
            "type":"administrator",
            "from": username,
            "to": "conor",
            "description": username + " wants to be accepted into the platform",
            "date":getTodayDateString(),
            "previous":""
        }

        addMessage(getNewUniqueId("message"), messageinfo);
    }

    return true;
}

function removeUser(username) {
    delete someLocalStorage["users"][username];
    delete someLocalStorage["accepts"][username];
    delete someLocalStorage["rejects"][username];
    delete someLocalStorage["answered"][username];

    putStorage();
}

function updateUser(username, newUserInfo) {
    if (!userExists(username)) {
        alert("User " + username + " does not exist");
        return false;
    }
    someLocalStorage["users"][username] = newUserInfo;
    putStorage();
}

function addAccept(requestid) {
    if (someLocalStorage["accepts"][loggedInUsername].indexOf(requestid)>=0) {
        return false;
    }
    someLocalStorage["accepts"][loggedInUsername].push(requestid);

    //remove from list of rejects
    var index = someLocalStorage["rejects"][loggedInUsername].indexOf(requestid);
    if(index != -1){
        someLocalStorage["rejects"][loggedInUsername].splice(index, 1);
    }
    //delete someLocalStorage["rejects"][loggedInUsername][requestid];

    someLocalStorage["requests"][requestid]["status"] = "Accepted"
    putStorage();
    return true;
}
function addReject(requestid) {
    if (someLocalStorage["rejects"][loggedInUsername].indexOf(requestid)>=0) {
        return false;
    }
    someLocalStorage["rejects"][loggedInUsername].push(requestid);

    //remove from list of accepts
    var index = someLocalStorage["accepts"][loggedInUsername].indexOf(requestid);
    if(index != -1){
        someLocalStorage["accepts"][loggedInUsername].splice(index, 1);
    }
    //delete someLocalStorage["accepts"][loggedInUsername][requestid];

    for (var key in someLocalStorage["accepts"]) {
        var array = someLocalStorage["accepts"][key]
        if (array.indexOf(requestid) > -1){
            putStorage();
            return true;
        }
    }
    someLocalStorage["requests"][requestid]["status"] = "Rejected";
    putStorage();
    return true;
}





function addComplete(requestid){
  var index = someLocalStorage["accepts"][loggedInUsername].indexOf(requestid);
    if(index != -1){
        someLocalStorage["accepts"][loggedInUsername].splice(index, 1);
    }
    someLocalStorage["requests"][requestid]["status"] = "Completed";
    putStorage();
    return true;
}


function messageExists(messageid) {
    return (someLocalStorage["messages"][messageid] != null);
}

function addMessage(messageid, messageinfo) {
    if (messageExists(messageid)) {
        alert("Message with that id already exists");
        return false;
    }
    someLocalStorage["messages"][messageid] = {};
    for (var i = 0; i < messageinfoFields.length; i++) {
        someLocalStorage["messages"][messageid][messageinfoFields[i]] = messageinfo[messageinfoFields[i]];
    }
    putStorage();
    return true;
}

function removeMessage(messageid) {
    delete someLocalStorage["messages"][messageid];
    putStorage();
}

function updateMessage(messageid, newMessageInfo) {
    if (!messageExists(messageid)) {
        alert("Message " + messageid + " does not exist");
        return false;
    }
    someLocalStorage["messages"][messageid] = newMessageInfo;
    putStorage();
}

function numberMessages(){
    var count = 0;
    for (var id in someLocalStorage["messages"]){
        if (someLocalStorage["messages"][id]["to"] == loggedInUsername && someLocalStorage["messages"][id]["type"] == "personal"){
            count ++;
        }
    }
    return count;
}

function numberMessagesAdmin(){
    var count = 0;
    for (var id in someLocalStorage["messages"]){
        if (someLocalStorage["messages"][id]["to"] == loggedInUsername && someLocalStorage["messages"][id]["type"] == "administrator"){
            count ++;
        }
    }
    return count;
}

function numberNewRequests(){
    var count = 0;
    var requests = getStorageObject()["requests"];
    var accepts = getStorageObject()["accepts"][loggedInUsername];
    var rejects = getStorageObject()["rejects"][loggedInUsername];
    for (var key in requests) {
        var row = requests[key];
        if(row["status"] == "Approved"){ count++;}
        else if( row["status"] == "Accepted" && accepts.indexOf(key) < 0){ count++; }
        else if( row["status"] == "Rejected" && rejects.indexOf(key) < 0){ count++; }
    }
    return count;
}

function numberMyNewRequests(){
    var count = 0;
    var requests = getStorageObject()["requests"];
    for (var key in requests) {
        var row = requests[key];
        if(row["username"]==loggedInUsername){
            if(row["status"] == "Approved"){ count++;}
            else if( row["status"] == "Accepted"){ count++; }
            else if( row["status"] == "Completed"){ count++; }
        }
    }
    return count;
}

function requestExists(requestid) {
    return (someLocalStorage["requests"][requestid] != null);
}

function addRequest(requestid, requestinfo) {
    if (requestExists(requestid)) {
        alert("Request with that id already exists");
        return false;
    }
    someLocalStorage["requests"][requestid] = {};
    for (var i = 0; i < requestinfoFields.length; i++) {
        someLocalStorage["requests"][requestid][requestinfoFields[i]] = requestinfo[requestinfoFields[i]];
    }
    someLocalStorage["data"][requestid] = [];

    putStorage();
    return true;
}

function removeRequest(requestid) {
    delete someLocalStorage["requests"][requestid];
    delete someLocalStorage["data"][requestid];
    putStorage();
}

function updateRequest(requestid, newRequestInfo) {
    if (!requestExists(requestid)) {
        alert("Request " + requestid + " does not exist");
        return false;
    }
    someLocalStorage["requests"][requestid] = newRequestInfo;
    putStorage();
}
function updateRequestSatus(requestid) {
    if(someLocalStorage["requests"][requestid]["status"] == "Pending Approval"){
        someLocalStorage["requests"][requestid]["status"] = "Approved";
    } else if(someLocalStorage["requests"][requestid]["status"] == "Approved"){
        someLocalStorage["requests"][requestid]["status"] = "Accepted";
        someLocalStorage["accepts"][someLocalStorage["requests"][requestid]["username"]].push(requestid);
    } else if(someLocalStorage["requests"][requestid]["status"] == "Accepted"){
        someLocalStorage["requests"][requestid]["status"] = "Completed";
    }
    putStorage();
}

function addData(requestid, data) {
    someLocalStorage["data"][requestid].push(data);
    someLocalStorage["answered"][loggedInUsername].push(requestid);
    putStorage();
}
function addNewRequest(type,area,latitude,longitude,radius,first,last,description,status,frequency,number,aditional){
    var reqInfo = { "username":loggedInUsername,
                    "reqtype":type,
                    "area":area,
                    "latitude":latitude,
                    "longitude":longitude,
                    "radius":radius,
                    "first":first,
                    "last":last,
                    "description":description,
                    "status":status,
                    "frequency":frequency,
                    "number":number,
                    "aditional":aditional
                  }

        addRequest(getNewUniqueId("request"), reqInfo);
}


function putStorage() {
    var stringified = JSON.stringify(someLocalStorage);
    localStorage.setItem(dataversion, stringified);
}

function getStorage() {
    var stringified = localStorage.getItem(dataversion);
    var result = JSON.parse(stringified)
    if (result == null) {
        createNewDatabase();
    } else {
        someLocalStorage = result;
    }
    //    alert("storage is "+JSON.stringify(someLocalStorage));
}



function setCookie(name, value) {
    var expires = "";
    document.cookie = name + "=" + value + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return "";
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}


var request = new Array();
var loggedInUsername = "";

var prev_onload_localstorage = window.onload;
window.onload = onload_localstorage;

function onload_localstorage() {
    if (prev_onload_localstorage) {
        prev_onload_localstorage();
    }

    if (document.location.search) {
        var i;
        var vals = document.location.search.substr(1).split("&");
        for (i in vals) {
            vals[i] = vals[i].replace(/\+/g, " ").split("=");
            request[unescape(vals[i][0])] = unescape(vals[i][1]);
        }
    }

    loggedInUsername = getCookie("username");
    //alert("loggedInUsername = "+loggedInUsername);

    getStorage();
}

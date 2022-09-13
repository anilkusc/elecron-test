const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (data) => ipcRenderer.send("user:login", data),
  listProblemTemplates:  () => {
    const problem_templates = ipcRenderer.send("problem_template:list");
    //const problem_templates = ipcRenderer.invoke("problem_template:list");
    return problem_templates;
  },
  logout: () => ipcRenderer.send("user:logout"),
});

ipcRenderer.on("login-failed", (event, message) => {
    document.getElementById("error-message").innerHTML = message;
});

ipcRenderer.on('template-list', function (event,data) {
  var accordion = document.getElementById("accordionList");
  data.forEach((item,i) => {
    var accordion_div = document.createElement("div")
    accordion_div.className = "accordion-item"
    var s = ""
    var c = ""
    item.PBXSolutionTemplate.PBXSolutionStepTemplates.forEach((step,i)=>{
      
      var stepContent = `<div class="alert alert-dark" role="alert"> Expected Response Status Codes: `+JSON.stringify(step.expected_response_status_codes)+`</div>
      <div class="alert alert-dark" role="alert"> Request Headers: `+JSON.stringify(step.request_headers)+`</div>
      <div class="alert alert-dark" role="alert"> Request Path: `+step.request_path+`</div>
      <div class="alert alert-dark" role="alert"> Request Body: `+step.request_body+`</div>
      <div class="alert alert-dark" role="alert">Method: `+step.method+`</div>
      <div class="alert alert-dark" role="alert">Timeout: `+step.timeout_deadline+`</div>`

      if (i === 0){
        s = s + `<li class="nav-item" role="presentation">
        <a  class="nav-link active"  id="ex1-tab-`+i+`"  data-mdb-toggle="tab"  href="#ex1-tabs-`+i+`"  role="tab"  aria-controls="ex1-tabs-`+i+`"  aria-selected="true">Step `+(i+1)+`</a>
        </li>`
        c = c + `<div  class="tab-pane fade show active"  id="ex1-tabs-`+i+`"  role="tabpanel"  aria-labelledby="ex1-tab-`+i+`">`+stepContent+`</div>`
      }else{
        s = s + `<li class="nav-item" role="presentation">
        <a  class="nav-link"  id="ex1-tab-`+i+`"  data-mdb-toggle="tab"  href="#ex1-tabs-`+i+`"  role="tab"  aria-controls="ex1-tabs-`+i+`"  aria-selected="false"  >Step `+(i+1)+`</a>
        </li>`
        c = c + `<div class="tab-pane fade" id="ex1-tabs-`+i+`" role="tabpanel" aria-labelledby="ex1-tab-`+i+`">`+stepContent+`</div>`
      }
    })

    accordion_div.innerHTML = `<h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse`+i+`" aria-expanded="false" aria-controls="collapse`+i+`">`+item.name+`</button>
    </h2>
    <div id="collapse`+i+`" class="accordion-collapse collapse show">
      <div class="accordion-body">
          <div class="alert alert-info">Problem Description: `+item.description+`</div>
          <div class="alert alert-info">Solution Name: `+item.PBXSolutionTemplate.name+`</div>
          <div class="alert alert-info">Solution Description: `+item.PBXSolutionTemplate.description+`</div>
          <button type="button" class="btn btn-success">Apply Solution</button>
          <button type="button" class="btn btn-danger">Delete Solution</button>
          <button type="button" class="btn btn-warning">Update Solution</button>
          <br></br>
          <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">`+s+`</ul>
          <div class="tab-content" id="ex1-content">`+c+`</div>
      </div>
    </div>`
    accordion.appendChild(accordion_div)
  });
});
const host = "localhost"

// Show all employees
function loadPage(){
    $.get(`http://${host}/employees`,function(employees){
        for(let employee of employees){
            $("#main").append(
                `<div id=${employee._id} class="card mx-auto mb-2 col-md-4" style="width: 18rem;"> 
                    <div class="card-body"> 
                    <h4 class="card-title" id="name-${employee._id}">${employee.name}</h4> 
                    <h6 class="card-title" id="position-${employee._id}">${employee.position ? employee.position : 'No position'}</h6> 
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">age: <span id="age-${employee._id}">${employee.age}</span></li>
                        <li class="list-group-item">salary: <span id="salary-${employee._id}">${employee.salary}<span></li>
                    </ul>
                    <button id="edit-${employee._id}" class="btn btn-primary">Edit</button> 
                    <button id="delete-${employee._id}" class="btn btn-danger">delete</button> 
                    </div> 
                </div>`
            )  
        }
    });
}

// show form for editing
function editForm(id) {
    
    // content of all files of specific card (with the id of the employee)
    const name = $(`#name-${id}`).text()
    const age = $(`#age-${id}`).text()
    const salary = $(`#salary-${id}`).text()
    const position = $(`#position-${id}`).text()

    $(`#${id}`).replaceWith(
        `<div class="card mx-auto mb-2 col-md-4" style="width: 18rem;"> 
            <div class="card-body"> 
                <form method="post">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" name="name" value=${name}>
                    </div>
                    <div class="mb-3">
                        <label for="age" class="form-label">age</label>
                        <input type="text" class="form-control" id="age" name="age" value=${age}>
                    </div>
                    <div class="mb-3">
                        <label for="salary" class="form-label">salary</label>
                        <input type="text" class="form-control" id="salary" name="salary" value=${salary}>
                    </div>
                    <div class="mb-3">
                        <label for="position" class="form-label" >position</label>
                        <input type="text" class="form-control" id="position" name="position" value=${position}>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div> 
        </div>`
    );
}

function addForm(){
    $("#main").append(
        `<div class="card mx-auto mb-2 col-md-4" style="width: 18rem;" data-editable> 
            <div class="card-body"> 
                <form method="post">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" name="name" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
                        <label for="age" class="form-label">age</label>
                        <input type="text" class="form-control" id="age" name="age">
                    </div>
                    <div class="mb-3">
                        <label for="salary" class="form-label">salary</label>
                        <input type="text" class="form-control" id="salary" name="salary">
                    </div>
                    <div class="mb-3">
                        <label for="position" class="form-label">position</label>
                        <input type="text" class="form-control" id="position" name="position">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div> 
        </div>`
    )  
}
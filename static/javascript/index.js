// Show all employees
function loadPage(){
    $.get("http://localhost:3000/employees",function(employees){
        for(let employee of employees){
            $("#main").append(
                `<div id=${employee._id} class="card mx-auto mb-2 col-md-4" style="width: 18rem;" data-editable> 
                    <div class="card-body"> 
                    <h4 class="card-title">${employee.name}</h4> 
                    <h6 class="card-title">${employee.position ? employee.position : 'No position'}</h6> 
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">age: ${employee.age}</li>
                        <li class="list-group-item">salary: ${employee.salary}</li>
                    </ul>
                    <button id="edit-${employee._id}" class="btn btn-primary">Edit</button> 
                    <button id="delete-${employee._id}" class="btn btn-danger">delete</button> 
                    </div> 
                </div>`
            )  
        }
    });
}


$("#main").on("click", "button", function(){
    const method = this.id.split('-')[0]
    const id = this.id.split('-')[1]
    
    // edit button was pressed
    if (method === "edit"){
        // show form to enter changes
        $(`#${id}`).replaceWith(
            `<div class="card mx-auto mb-2 col-md-4" style="width: 18rem;" data-editable> 
                <div class="card-body"> 
                    <form action="http://localhost:3000/employees/${id}?_method=PUT" method="post">
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
        );
        $("form").submit(function(e){
            e.preventDefault()
            const formData = new FormData(this);
            // Create the json data
            const jsonData = {
                name: formData.get('name'),
                age: formData.get('age'),
                salary: formData.get('salary'),
                position: formData.get('position')
            }

            // send the put request and update record
            $.ajax({
                type: "Put",
                url: `http://localhost:3000/employees/${id}`,
                data: JSON.stringify(jsonData),
                contentType: "application/json",
                success: function(data){
                    console.log("success", data);
                    $("#main").empty().html(loadPage()); // show new cards with updated content
                },
                error: function(err){
                    console.log(err);
                }
            });
        })
    }
})

// load cards when page is ready
$(document).ready(function(){
    loadPage()
})
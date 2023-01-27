$("#main").on("click", "button", function(){
    const method = this.id.split('-')[0]
    const id = this.id.split('-')[1]
    
    // edit button was pressed
    if (method === "edit"){
        // show form to enter changes
        editForm(id) //replace the card with form for editing
        
        // when submiting the edit form
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
    // delete record
    else if (method === "delete"){
        // send the put request and update record
        $.ajax({
            type: "delete",
            url: `http://localhost:3000/employees/${id}`,
            contentType: "application/json",
            success: function(data){
                console.log("success", data);
                $("#main").empty().html(loadPage()); // show new cards with updated content
            },
            error: function(err){
                console.log(err);
            }
        });
    }
})

$("#add").on("click", function(){
    
    addForm()

    // when submiting the add form
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

        // send the put request and add record
        $.ajax({
            type: "Post",
            url: `http://localhost:3000/employees`,
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
})

// load cards when page is ready
$(document).ready(function(){
    loadPage()
})
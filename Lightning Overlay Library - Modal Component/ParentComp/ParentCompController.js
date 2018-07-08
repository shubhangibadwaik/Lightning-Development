({
    //Method called when user clicks 'Delete' button
	handleDeleteAction: function(component, event, helper){
        var action = event.getSource().getLocalId();
        component.set("v.selectedAction", action);
         
        //Create Modal Components: [ModalHeader, ModalBody, ModalFooter (Pass the attribute: selectedAction by reference.)]
        $A.createComponents(
            [
                ["lightning:formattedText", {"aura:id": "ModalHeader", "value": $A.get("$Label.c.DeleteRecord")}],
                ["lightning:formattedText", {"aura:id": "ModalBody", "value": $A.get("$Label.c.DeleteConfirmationMsg")}],
                ["c:ModalFooter", {"aura:id": "ModalFooter", "action": component.getReference("v.selectedAction")}] 
            ],
            function(modalComponents, status){
                if(status === "SUCCESS"){
                    component.set("v.modalComponents", modalComponents);
                    
                    //Instantiates & renders c:ModalContainer
                    component.set("v.showModal", true);						
                }
            }
        );
	},
    
    //Change Handler for attribute: selectedAction
    handleModalAction: function(component, event, helper){
        //Get label of the clicked button on c:ModalFooter 
        var buttonClicked = component.get("v.selectedAction");				
        
        if(buttonClicked == "Ok"){
            //Delete the record
        }
        
        //Unrender c:ModalContainer 
        component.set("v.showModal", false);								
    }
})
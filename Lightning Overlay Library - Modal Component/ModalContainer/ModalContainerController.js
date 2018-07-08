({
    //Method to create and display the modal
	createCustomModal: function(component, event, helper){
        component.find("overlayLib").showCustomModal({
            header: component.get("v.modalComponents")[0],
            body: component.get("v.modalComponents")[1],
            footer: component.get("v.modalComponents")[2],
            showCloseButton: false,
            closeCallback: function(){
                console.log("Modal Container: closeCallback");
            }
        });
    }
})
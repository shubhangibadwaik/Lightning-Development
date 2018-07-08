({
	handleClickEvent : function(component, event, helper) {
        //Pass the label of the clicked button to c:ParentComp.
        
        /*Sol. 1: Use Component Event - Source(Event fired): c:ModalFooter & Handler(Event handled): c:ParentComp.
        Although the component hierarchy seems to be c:ParentComp > c:ModalContainer > c:ModalFooter, the event is not handled by c:ParentComp.
        Using the Component Tree, it can be found that the component hierarchy is: one:standardLayoutContainer > one:baseLayoutContainer > ui:panelManager2 > ui:modal
        This is probably why the component event remains unhandled.
        
        Sol 2: Use Application Event - c:ParentComp doesn't handle this event.
        
        Sol 3: Use Change Handler - Pass the attribute: selectedAction from c:ParentComp to c:ModalFooter.
        */
        
        //Set the value of attribute: action to the label of the clicked button
        component.set("v.action", event.getSource().get("v.label"));
        
        //Close the modal
        component.find("overlayLibFooter").notifyClose();
	}
})
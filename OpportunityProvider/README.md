# SFDX  App

## Dev, Build and Test


## Resources


## Description of Files and Directories
The Opportunity Providers component is a hierarchy of the below three generic components:
1.	OpportunityProviderComp
-	Root component responsible for retrieving configuration for the component stored in Custom Metadata – Related List, Opportunity Provider records.
-	Displays the Header row and iterated over the record list to shows records.
2.	DataTableRow 
-	Called by OpportunityProviderComp, this component is responsible for displaying a record, row-level 'Edit' action and tracking changes to the record.
3.	DataTableCell
-	Called by DataTableRow component, this component is responsible for displaying each field of the record based on the field type.
The lightning-datatable component was not used as it does not support inline editing for lookup fields.


## Issues



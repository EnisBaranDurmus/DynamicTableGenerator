sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/core/mvc/XMLView",
   "sap/ui/unified/FileUploader",
], function (
   Controller, MessageToast, JSONModel, XMLView, FileUploader
) {
   "use strict";

   return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

      onInit: function () {
         //Set the date model on the view

      },
      handleUploadComplete: function(oEvent) {
         var f = oEvent.oSource.oFileUpload.files[0];  //here we will get the file which we have been selected in to the variable f

         var path = URL.createObjectURL(f); 
         fetch(path)
            .then(response => {
               return response.json();
            }).then(jsondata => {
               //this.xml(jsondata)
               var modifiedData = this.modifyData(jsondata)
               this.mTableXML(modifiedData)
               this.uiTableXML(modifiedData)
            });
			
		},

		onImport: function() {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.checkFileReadable().then(function() {
				oFileUploader.upload();
			}, function(error) {
				MessageToast.show("The file cannot be read. It may have changed.");
			}).then(function() {
				oFileUploader.clear();
			});
		},

      modifyData: function(data){
         let dataPath = data.Rowsets.Rowset.Columns.Column
         for(var i in dataPath){
            dataPath[i]['_Label'] = prompt(dataPath[i]['@Description'], "İsmi belirt");
            data.Rowsets.Rowset.Columns.Column[i] = dataPath[i]
         }
         return data
      }
      ,
      onPress: function () {
         // show a native JavaScript alert
         MessageToast.show("Hello There!");
      },
      xml: function (data) {

         let dataPath = data.Rowsets.Rowset.Columns.Column
         let generatedColumns = []
         let generatedCells = []
         for (let i = 0; i < dataPath.length; i++) {
            columnXML[1] = "id" + dataPath[i]['@Description'].toLowerCase();
            columnXML[3] = prompt(dataPath[i]['@Description'], "İsmi belirt");
            cellXML[1] = dataPath[i]['@Description']
            generatedColumns[i] = columnXML.toString().replace(/,/g, "");
            generatedCells[i] = cellXML.toString().replace(/,/g, "");
         }
         tableXML[1] = generatedColumns.toString();
         tableXML[3] = generatedCells.toString();
         tableXML = tableXML.toString().replace(/,/g, "");

         this.getView().byId("idText").setText("Tablo oluşturuldu");
         var parser = new DOMParser();
         var xmlDoc = parser.parseFromString(tableXML, "text/xml");

         // var node = xmlDoc.createElement("heyHo");
         // var elements = xmlDoc.getElementsByTagName("root");
         // elements[0].appendChild(node);

         var serializer = new XMLSerializer();
         var xmlString = serializer.serializeToString(xmlDoc);
         this.getView
         console.log(tableXML)

      },

      uiTableXML: function (oData) {
         var oTable = new sap.ui.table.Table({
            title: "Table column and data binding",
            showNoData: true,
            columnHeaderHeight: 10,
         });
         var oModel = new sap.ui.model.json.JSONModel();
         oModel.setData(oData);
         oTable.setModel(oModel);
         oTable.placeAt("content")

         oTable.bindColumns("/Rowsets/Rowset/Columns/Column", function (sId, oContext) {
            var sColumnId = oContext.getObject()['@Description']
            var sColumnLabel = oContext.getObject()['_Label']
            return new sap.ui.table.Column({
               //id: sColumnId,
               label: sColumnLabel,
               template: new sap.m.Text({
                  text: "{" + oContext.getObject()['@Description'] + "}"
               }
               )
            });
         });
      },
      mTableXML: function (oData) {

         var oTable = new sap.m.Table("id",
            {
               
            }
         );
         var oModel = new sap.ui.model.json.JSONModel();
         oModel.setData(oData);
         oTable.setModel(oModel);

         oTable.bindAggregation("columns", "/Rowsets/Rowset/Columns/Column", function (index, oContext) {
            var Label = new sap.m.Label()
            Label.setText(oContext.getObject()['_Label'])
            Label.setTextAlign(sap.ui.core.TextAlign.Center);

            return new sap.m.Column({
               header: Label,
               hAlign: "Center"
            });
         });

         var row = new sap.m.ColumnListItem();
         oData.Rowsets.Rowset.Columns.Column.forEach(element => {
            row.addCell(new sap.m.Text({
               text: "{" + element['@Description'] + "}",
               textAlign: "Center"
            }));
            console.log("{" + element['@Description'] + "}")
         })

         oTable.bindItems("/Rowsets/Rowset/Columns/Column", function () {
            return row;
         });

         oTable.placeAt("content")
      }
   });
});


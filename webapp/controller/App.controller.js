sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/core/mvc/XMLView"
], function (
   Controller, MessageToast, JSONModel, XMLView
) {
   "use strict";
   const columnXML = ["<Column id= \"", "", "\" hAlign=\"Center\" visible = \"false\"><header><Text text=\"", "", "\" /></header></Column>"];
   const cellXML = ["<Text text=\"{", "", "}\"/>"];
   let tableXML = [
      "<Table id = \"Table\" items=\"{path:'/'}\"  alternateRowColors=\"true\" visible=\"true\" enableSelectAll=\"false\" selectionMode=\"None\"><columns>",
      "<!-- Table Columns -->", //1
      "</columns><ColumnListItem vAlign=\"Middle\">",
      "<!-- Table Cells Listing -->", //3
      "</ColumnListItem></Table>"]

   return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

      onInit: function () {
         //Set the date model on the view

         fetch("./columns.json")
            .then(response => {
               return response.json();
            }).then(jsondata => {
               //this.xml(jsondata)
               this.mTableXML(jsondata)
               //this.xmlTable(jsondata)
            });
      },
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
            var sColumnLabel = prompt(oContext.getObject()['@Description'], "İsmi belirt")
            return new sap.ui.table.Column({
               //id: sColumnId,
               label: sColumnLabel
            });
         });
      },
      mTableXML: function (oData) {

         var oTable = new sap.m.Table();
         var oModel = new sap.ui.model.json.JSONModel();
         oModel.setData(oData);
         oTable.setModel(oModel);

         oTable.bindAggregation("columns", "/Rowsets/Rowset/Columns/Column", function (index, oContext) {
            var Label =  new sap.m.Label()
            Label.setText(prompt(oContext.getObject()['@Description'], "İsmi belirt"))
            Label.setTextAlign( sap.ui.core.TextAlign.Center);

            return new sap.m.Column({
               header: Label,
               hAlign: "Center"
            });
         });

         var row = new sap.m.ColumnListItem();

         oTable.bindItems("/Rowsets/Rowset/Columns/Column", function (index, context) {
            var obj = context.getObject();
            console.log(index)
            row.addCell(new sap.m.Text({ 
               text: "{"+ obj['@Description']+"}",
               textAlign: "Center"
            }));

            return row;
         });

         oTable.placeAt("content")

         // oTable.bindColumns("/Rowsets/Rowset/Columns/Column", function (sId, oContext) {
         //    var sColumnId = oContext.getObject()['@Description']
         //    var sColumnLabel = prompt(oContext.getObject()['@Description'], "İsmi belirt")
         //    return new sap.ui.table.Column({
         //       //id: sColumnId,
         //       label: sColumnLabel
         //    });
         // });
      }
   });
});
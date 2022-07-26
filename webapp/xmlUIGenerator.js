const columnXML = ["<Column id= \"" , "" , "\" hAlign=\"Center\" visible = \"false\"><header><Text text=\"", "", "\" /></header></Column>"];
const cellXML = ["<Text text=\"{" ,  "", "}\"/>"];
let tableXML = [
"<Table id = \"Table\" items=\"{path:'/'}\"  alternateRowColors=\"true\" visible=\"true\" enableSelectAll=\"false\" selectionMode=\"None\"><columns>", 
"<!-- Table Columns -->", //1
"</columns><ColumnListItem vAlign=\"Middle\">",
"<!-- Table Cells Listing -->", //3
"</ColumnListItem></Table>"]
fetch("./columns.json")
    .then(response => {
        return response.json();
    }).then(jsondata => {
        this.xml(jsondata)
    });

function xml(data){

    let dataPath = data.Rowsets.Rowset.Columns.Column
    let generatedColumns = [] 
    let generatedCells = []
    for (let i = 0; i < dataPath.length; i++) {
        columnXML[1] = "id" + dataPath[i]['@Description'].toLowerCase();
        columnXML[3] = prompt(dataPath[i]['@Description'], "İsmi belirt");
        cellXML[1] = dataPath[i]['@Description']
        generatedColumns[i] =  columnXML.toString().replace(/,/g, "");
        generatedCells[i] = cellXML.toString().replace(/,/g, "");
    }
    tableXML[1] = generatedColumns.toString();
    tableXML[3] = generatedCells.toString();
    tableXML =  tableXML.toString().replace(/,/g, "");
    document.getElementById("par").innerHTML = "Tablo oluşturuldu";
    
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(tableXML, "text/xml"); 
    
    // var node = xmlDoc.createElement("heyHo");
    // var elements = xmlDoc.getElementsByTagName("root");
    // elements[0].appendChild(node);
    
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDoc);

    window.open(xmlString,'Download');
}
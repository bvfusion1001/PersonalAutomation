var ui = SpreadsheetApp.getUi();
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getActiveSheet();
var rangeData = sheet.getDataRange();
// var lastColumn = rangeData.getLastColumn();
var lastRow = rangeData.getLastRow();

var priceColumn = 3;
var firstRow = 10;
var priceRange = sheet.getRange(firstRow, priceColumn, lastRow-1, 1);

var firstQuantityColumn = 4;
var quantityColumnSize = 12;
var quantityRange = sheet.getRange(firstRow, firstQuantityColumn, lastRow-1, quantityColumnSize);

var mealRow = 8;
var servingColumn = 17;
var servingRange = sheet.getRange(firstRow, servingColumn, lastRow - 1, 1);

function onEdit(e) {
  setPortions();
  setMealTotals()
}

function setPortions() {
  var priceValues = priceRange.getValues();
  var quantityValues = quantityRange.getValues();

  for (r = 0; r < lastRow - 1; r++) {
    var price = priceValues[r][0];
    var quantity = quantityValues[r].reduce(function(a, b) {
      return parseInt(a ? a : 0, 10) + parseInt(b ? b : 0, 10);
    }, 0);
    var servingCost = price / quantity;
    var servingCell = sheet.getRange(firstRow + r,servingColumn);
    servingCell.clearContent();
    if (servingCost) {
      servingCell.setValue(servingCost);
    }
  }
}

function setMealTotals() {
  var servingValues = servingRange.getValues();
  var quantityValues = quantityRange.getValues();

  for (c = 0; c < quantityColumnSize; c++) {
    var mealTotal = 0;
    for (r = 0; r < lastRow - 1; r++) {
      var quantity = quantityValues[r][c];
      var quantityInteger = quantity ? parseInt(quantity, 10) : 0;
      var servingCost = servingValues[r][0];
      mealTotal += quantityInteger * servingCost;
    }
    sheet.getRange(mealRow, firstQuantityColumn + c).setValue(mealTotal);
  }
}

function sumArrayAsIntegers(stringArray) {
  return stringArray.reduce(function(a, b) {
      a = a ? a : 0;
      b = b ? b : 0;
      return parseInt(a, 10) + parseInt(b, 10);
    }, 0);
}
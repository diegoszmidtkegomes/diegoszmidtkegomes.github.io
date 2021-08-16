sap.ui.controller("zbsp_ariba_ptrk.home", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zbsp_ariba_ptrk.home
*/

  _oConfig : {
    "mainUrl" : "/sap/bc/zariba/main/?",
    "mainCalculatedUrl" : "",
    "statsUrl" : "http://dontpad.com/jsonmonitor1",
    "buyingPrUrl" : "/sap/bc/zariba/buyingpr?",
    "buyingPrCalculatedUrl":"",
	"buyingMdStatusUrl" : "/sap/bc/zariba/buyingmdstatus?",	
    "buyingMdStatusCalcUrl":"",
    "filter" : "",
    "errorOnly" : true,
    "showAll" : false,
    "dateFrom": "",
    "dateTo" : ""
  },

  _oSupplierDashboardConfig: {
    "url" : "/sap/bc/zariba/suppliers_dash?",
    "calculatedUrl" : ""
  },
  
  _oHistDocConfig: {
    "histDocUrl" : "/sap/bc/zariba/hist?",
    "calculatedUrl" : ""
  },  
  
  onInit: function() {
    this._oQuoteRequestModel = new sap.ui.model.json.JSONModel();
    this._oQuoteRequestModel.attachRequestCompleted(this.onQuoteRequestCompleted.bind(this));
    this._oConfigModel = new sap.ui.model.json.JSONModel(this._oConfig);
    this._oSupplierDashboardModel = new sap.ui.model.json.JSONModel();
    this._oHistDocModel = new sap.ui.model.json.JSONModel();
    this._oBuyingPrModel = new sap.ui.model.json.JSONModel();
    this._oStatusMdBuyingModel = new sap.ui.model.json.JSONModel();
    this._oStatsModel = new sap.ui.model.json.JSONModel();
    this.getView().setModel(this._oQuoteRequestModel, "Main");
    this.getView().setModel(this._oConfigModel, "Config");
    this.getView().setModel(this._oSupplierDashboardModel, "Supplier");
    this.getView().setModel(this._oHistDocModel, "HistDoc");
    this.getView().setModel(this._oStatsModel, "Stats");
    this.getView().setModel(this._oBuyingPrModel, "BuyingPr");
    this.getView().setModel(this._oStatusMdBuyingModel, "StatusMdBuying");
    this._fUpdateModel();
	
	var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName: "zbsp_ariba_ptrk.i18n.i18n"
         });
	this.getView().setModel(i18nModel, "i18n");
  },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zbsp_ariba_ptrk.home
*/
//  onBeforeRendering: function() {
//
//  },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zbsp_ariba_ptrk.home
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zbsp_ariba_ptrk.home
*/
//  onExit: function() {
//
//  }

  onQuoteRequestCompleted : function(oEvent){
    if(oEvent.getParameter("success")){
      this.getView().getModel("Config").setProperty("/dateFrom", this.getView().getModel("Main").getProperty("/dateFrom"));
      this.getView().getModel("Config").setProperty("/dateTo", this.getView().getModel("Main").getProperty("/dateTo"));
    }
    this.getView().byId("ObjectPageLayout").setBusy(false);
    //TODO handle errors
  },

  onSearchString : function(oControlEvent){
    this._fUpdateModel();
  },

  onFilterStatus : function(oControlEvent){
    this._fUpdateModel();
  },

  onDateChange : function(oControlEvent){
    this._fUpdateModel();
  },
  
  onCloseDialogHist : function(oControlEvent){
	this._dialogHistDoc.close();	   
  },  
  
  onPressHist :  function(oControlEvent){
    var path = oControlEvent.getSource().oPropagatedProperties.oBindingContexts.Main.getPath();
    var obj = this._oQuoteRequestModel.getProperty(path);
    this._oHistDocConfig.calculatedUrl = this._oHistDocConfig.histDocUrl
    + "&id=" + obj.line.businessDocument;
	this._oHistDocModel.loadData(this._oHistDocConfig.calculatedUrl);
	sap.ui.getCore().setModel(this.getView().getModel("HistDoc"),"HistDoc");
	
	if (!this._dialogHistDoc) {
		this._dialogHistDoc = sap.ui.xmlfragment("zbsp_ariba_ptrk.view.histdoc", this);
	}
	this._dialogHistDoc.open();	   
  },

  _fUpdateModel : function() {
    this.getView().byId("ObjectPageLayout").setBusy(true);
    this._oConfig.mainCalculatedUrl = this._oConfig.mainUrl
      + "&filter=" + this._oConfig.filter
      + "&errorOnly=" + ( this._oConfig.errorOnly ? "true" : "false" )
      + ( !isNaN(this._oConfig.dateFrom) ? "&dateFrom=" + this._oConfig.dateFrom : "" )
      + ( !isNaN(this._oConfig.dateTo) ? "&dateTo=" + this._oConfig.dateTo : "" )
    this._oQuoteRequestModel.loadData("https://api.jsonbin.io/b/6115573353ca131484a82035"); //ajustar
    this._oConfig.showAll = this._oConfig.errorOnly ? false : true ;
    this._oConfigModel.updateBindings();

    this._oSupplierDashboardConfig.calculatedUrl = this._oSupplierDashboardConfig.url
      + "&errorOnly=" + ( this._oConfig.errorOnly ? "true" : "false" );
    this._oSupplierDashboardModel.loadData("https://api.jsonbin.io/b/611a662dd5667e403a43f718"); // ok

    this._oStatsModel.loadData("https://api.jsonbin.io/b/6115514ee1b0604017ae8784");
    this._oConfig.buyingPrCalculatedUrl = this._oConfig.buyingPrUrl
      + "&filter=" + this._oConfig.filter
      + "&errorOnly=" + ( this._oConfig.errorOnly ? "true" : "false" )
      + ( !isNaN(this._oConfig.dateFrom) ? "&dateFrom=" + this._oConfig.dateFrom : "" )
      + ( !isNaN(this._oConfig.dateTo) ? "&dateTo=" + this._oConfig.dateTo : "" )

    this._oBuyingPrModel.loadData("https://api.jsonbin.io/b/6115544d53ca131484a81eb8"); // ok
	
	this._oConfig.buyingMdStatusCalcUrl = this._oConfig.buyingMdStatusUrl
      + "&filter=" + this._oConfig.filter
      + "&errorOnly=" + ( this._oConfig.errorOnly ? "true" : "false" )
      + ( !isNaN(this._oConfig.dateFrom) ? "&dateFrom=" + this._oConfig.dateFrom : "" )
      + ( !isNaN(this._oConfig.dateTo) ? "&dateTo=" + this._oConfig.dateTo : "" )

    this._oStatusMdBuyingModel.loadData("https://api.jsonbin.io/b/61155422e1b0604017ae8926"); // ok
  },
  
  formatterLeadingZero: function(oValue){
	  //console.log(oValue);
	  if (oValue != null)
		return oValue.replace(/^0+/, '');		  
  },
  
  formatterStatusHist : function(oValue){
	  if (oValue != null){		  
		  switch (oValue){
			case '':		  
				return 'Não Processado';
			case '1':		  
				return 'Sucesso';
			case '2':		  
				return 'Erro';
		  }
	  }	  
	  else{
		  return 'Não Processado';
	  }
  },
});
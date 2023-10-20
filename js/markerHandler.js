var tableNumber = null;
AFRAME.registerComponent("markerhandler", {
  init: async function () {
    if(tableNumber === null){
      this.askTableNumber();
    }
    //Toma la colección de platillos desde la base de datos Firebase.
    var dishes = await this.getDishes();

    //Evento markerFound.
    this.el.addEventListener("markerFound", () => {
      if(tableNumber !== null){
        var markerId=this.el.id;
        this.handleMarkerFound(dishes, markerId);
      }     

    });

    //Evento markerLost.
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },
  askTableNumber:function(){
  var iconUrl="https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
  swal({
    title:"bienvenido a el antojo",
    icon:iconUrl,
    content:{
      element:"input",
      attributes:{
        placeholder:"escribe el numero de tu mesa",
        type:"number",
        min:1
      }
    },
    closeOnClickOutside:false,

  }).then(inputValue => {
    tableNumber=inputValue;
  })
  },
  handleMarkerFound: function (dishes, markerId) {
    var toDaysDate = new Date();
        var toDaysDay = toDaysDate.getDay();
        var days=[
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];
    // Cambiar el tamaño del modelo a su escala incial.
    var dish = dishes.filter(dish => dish.id === markerId)[0];

    if(dish.unavailable_days.includes(days[toDaysDay])){
      swal({
        icon:"warning",
        title:dish.dish_name.toUpperCase(),
        text:"Este platillo no esta disponible hoy",
        timer:2500,
        buttons:false
      })
    }else{
      var model = document.querySelector(`#model-${dish.id}`);
       model.setAttribute("position", dish.model_geometry.position);
       model.setAttribute("rotation", dish.model_geometry.rotation);
       model.setAttribute("scale", dish.model_geometry.scale);
      model.setAttribute("visible",true);
      var ingredientsContainer = document.querySelector(`#main-plane-${dish.id}`);
      ingredientsContainer.setAttribute("visible",true);

      var pricePlane = document.querySelector(`#price-plane-${dish.id}`);
      pricePlane.setAttribute("visible",true);
      var ratingPlane = document.querySelector(`#rating-plane-${dish.id}`);
      ratingPlane.setAttribute("visible",false);

    // Cambiar la visibilidad del botón div.
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.getElementById("rating-button");
    var orderButtton = document.getElementById("order-button");
    var orderSummaryButton = document.getElementById("order-summary-button");
    var payButton = document.getElementById("payButton");
    // Usar eventos de clic.
    ratingButton.addEventListener("click",() => this.handleRatings(dish));
     /*swal({
        icon: "warning",
        title: "Calificar platillo",
        text: "Procesando calificación"
      
    });*/
  
    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "¡Gracias por tu orden!",
        text: "¡Recibirás tu orden pronto!"
      });
    });
    orderSummaryButton.addEventListener("click",()=>
    this.handleOrderSummary()
    )
    payButton.addEventListener("click",()=> this.handlePayMent())
  }
 
  },
  hadleOrder:function(tNumber,dish){
  /*firebase
  .firestore()
  .collection("tables")
  .doc(tNumber)
  .get()
  .then(doc =>{
    var details = doc.data();
    if(details["current_order"][dish.id]){

    }
  })*/
  },
  handleRatings:async function(dish){
    var tNumber;
    tableNumber <=9 ? (tNumber = `T0${tableNumber}`):`T${tableNumber}`;
    var orderSummary = await this.getOrderSummary(tNumber)
    var currentOrders = Object.keys(orderSummary.current_orders);
    if(currentOrders.length >0 && currentOrders == dish.id){
     document.getElementById("rating-modal-div").style.display="flex";
     document.getElementById("rating-input").value="0";
     document.getElementById("feedBack-input").value="";
     var saveRatingButton = document.getElementById("save-rating-button");
     saveRatingButton.addEventListener("click",()=>{
      document.getElementById("rating-modal-div").style.display="none";
      var rating = document.getElementById("rating-input").value
      var feedBack = document.getElementById("feedBack-input").value;
      firebase
  .firestore()
  .collection("dishes")
  .doc(tNumber)
  .update({
    last_review:feedBack,
    last_rating:rating
  })
  .then(()=>{
    swal({
      icon:"success",
      title:"Gracias por tu calificacion",
      text:"esperamos que haya disfrutado su comida",
      timer:2500,
      buttons:false
    })
  })
     })
    }else{
      swal({
        icon:"warning",
        title:"ups",
        text:"No se encontro un platillo para calificar",
        timer:2500,
        buttons:false
      })
    }
  },
  handlePayMent:function(){
  document.getElementById("modal-div").style.display="none";
  var tNumber;
  tableNumber <=9 ? (tNumber = `T0${tableNumber}`):`T${tableNumber}`;
  firebase
  .firestore()
  .collection("tables")
  .doc(tNumber)
  .update({
    current_orders:{},
    total_bill:0
  })
  .then(()=>{
    swal({
      icon:"success",
      title:"Gracias por su compra",
      text:"esperamos que haya disfrutado su comida",
      timer:2500,
      buttons:false
    })
  })
  },
  handleOrderSummary:async function(){
  
    var tNumber;
    tableNumber <=9 ?(tNumber=`T0${tableNumber}`):`T${tableNumber}`;
    var orderSummary = await this.getOrderSummary(tNumber);
    var modalDiv = document.getElementById("modal-div");
    modalDiv.style.display = "flex";
    var tableBodyTag = document.getElementById("bill-table-body");
    tableBodyTag.innerHTML="";
    var currentOrders = Object.keys(orderSummary.current_orders);
    currentOrders.map(i =>{
      var tr = document.createElement("tr");
      var item = document.createElement("td");
      var price = document.createElement("td");
      var quantity = document.createElement("td");
      var subtotal = document.createElement("td");
     // var total = document.createElement("tr");
      item.innerHTML=orderSummary.current_orders[i].item;
      price.innerHTML="$"+orderSummary.current_orders[i].price;
      price.setAttribute("class","text-center");
      quantity.innerHTML=orderSummary.current_orders[i].quantity;
      quantity.setAttribute("class","text-center");
      subtotal.innerHTML="$"+orderSummary.current_orders[i].subtotal;
      subtotal.setAttribute("class","text-center");
      tr.appendChild(item);
      tr.appendChild(price);
      tr.appendChild(quantity);
      tr.appendChild(subtotal);
      tableBodyTag.appendChild(tr);
    })
    var totaltr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.setAttribute("class","no-line")
    var td2 = document.createElement("td");
    td2.setAttribute("class","no-line")
    var td3 = document.createElement("td");
    td3.setAttribute("class","no-line text-center");
    var strongTag = document.createElement("strong");
    strongTag.innerHTML="total";
    td3.appendChild(strongTag);
    var td4 = document.createElement("td");
    td4.setAttribute("class","no-line text-right");
    td4.innerHTML="$"+orderSummary.total_bill;

    totaltr.appendChild(td1);
    totaltr.appendChild(td2);
    totaltr.appendChild(td3);
    totaltr.appendChild(td4);
    tableBodyTag.appendChild(totaltr);
  },
  getOrderSummary:async function(tNumber){
      return await firebase
    .firestore()
    .collection("tables")
    .doc(tNumber)
    .get()
    .then(doc => doc.data());
  },
  
  handleMarkerLost: function () {
    // Cambiar la visibilidad del botón div.
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //Tomar la colección de platillos desde la base de datos Firebase.
  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});
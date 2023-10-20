AFRAME.registerComponent("create-markers",{
  init:async function(){
      var mainScene = document.querySelector("#main-scene");
      var dishes = await this.getDishes();
      dishes.map(dish=>{
          var marker=document.createElement("a-marker");
          marker.setAttribute("id",dish.id);
          marker.setAttribute("type","pattern");
          marker.setAttribute("url",dish.marker_pattern_url);
          marker.setAttribute("cursor",{
              rayOrigin:"mouse"
          });
          marker.setAttribute("markerhandler",{});
          mainScene.appendChild(marker);
          var model = document.createElement("a-entity");
          model.setAttribute("id",`model-${dish.id}`);
          model.setAttribute("position",dish.model_geometry.position);
          model.setAttribute("rotation",dish.model_geometry.rotation);
          model.setAttribute("scale",dish.model_geometry.scale);
          model.setAttribute("gltf-model",`url(${dish.model_url})`);
          model.setAttribute("gesture_handler",{});
          model.setAttribute("visible",false);

          marker.appendChild(model);

          var mainPlane = document.createElement("a-plane");
          mainPlane.setAttribute("id",`main-plane-${dish.id}`);
          mainPlane.setAttribute("position",{x:0,y:0,z:0});
          mainPlane.setAttribute("rotation",{x:-90,y:0,z:0});
          mainPlane.setAttribute("width",1.7);
          mainPlane.setAttribute("height",1.5);
          mainPlane.setAttribute("visible",false);
    
          marker.appendChild(mainPlane);
          
          var titlePlane = document.createElement("a-plane");
          titlePlane.setAttribute("id",`title-plane-${dish.id}`);
          titlePlane.setAttribute("position",{x:0,y:0.89,z:0.02});
          titlePlane.setAttribute("rotation",{x:0,y:0,z:0});
          titlePlane.setAttribute("width",1.69);
          titlePlane.setAttribute("height",0.3);
          titlePlane.setAttribute("material",{color:"orange"});
          mainPlane.appendChild(titlePlane);

          var dishTitle=document.createElement("a-entity");
          dishTitle.setAttribute("id",`dish-title-${dish.id}`);
          dishTitle.setAttribute("position",{x:0,y:0,z:0.1});
          dishTitle.setAttribute("rotation",{x:0,y:0,z:0});
          dishTitle.setAttribute("text",{
              font:"monoid",
              color:"black",
              width:1.8,
              height:1,
              align:"center",
              value:dish.dish_name.toUpperCase()
          });
          titlePlane.appendChild(dishTitle);

          var ingredients = document.createElement("a-entity");
          ingredients.setAttribute("id",`ingredients-${dish.id}`);
          ingredients.setAttribute("position",{x:0.3,y:0,z:0.1});
          ingredients.setAttribute("rotation",{x:0,y:0,z:0});
          ingredients.setAttribute("text",{
              font:"monoid",
              color:"black",
              width:2,
              align:"left",
              value:`${dish.ingredients.join("\n\n")}`
          });
          mainPlane.appendChild(ingredients);
          var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id",`price-plane-${dish.id}`);
        pricePlane.setAttribute(
            "src","https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlane.setAttribute("width",0.8);
        pricePlane.setAttribute("height",0.8);
        pricePlane.setAttribute("position",{x:-1.3,y:0,z:0.3});
        pricePlane.setAttribute("rotation",{x:-90,y:0,z:0});
        pricePlane.setAttribute("visible",false);
        var price = document.createElement("a-entity");
        price.setAttribute("id",`price-${dish.id}`);
        price.setAttribute("position",{x:0.03,y:0.05,z:0.1});
        price.setAttribute("rotation",{x:0,y:0,z:0});
        price.setAttribute("text",{
            font:"mozillavr",
            color:"white",
            width:3,
            align:"center",
            value:`solo\n $${dish.price}`
        });
        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
        var ratingPlane = document.createElement("a-entity");
        ratingPlane.setAttribute("id",`rating-plane-${dish.id}`);
        ratingPlane.setAttribute("position",{x:2,y:0,z:0.5});
        ratingPlane.setAttribute("geometry",{
            primitive:"plane",
            width:1.5,
            height:0.3
        });
        ratingPlane.setAttribute("material",{
            color:"orange",

        });
        ratingPlane.setAttribute("rotation",{x:-90,y:0,z:0});
        ratingPlane.setAttribute("visible",false);
        var rating = document.createElement("a-entity");
        rating.setAttribute("id",`rating-${dish.id}`);
        rating.setAttribute("position",{x:0,y:0.05,z:0.1});
        rating.setAttribute("rotation",{x:0,y:0,z:0});
        rating.setAttribute("text",{
            font:"mozillavr",
            color:"black",
            width:2.4,
            align:"center",
            value:`calificacion del cliente: ${dish.last_rating}`
        });
        ratingPlane.appendChild(rating);
        marker.appendChild(ratingPlane);
        var reviewPlane = document.createElement("a-entity");
        reviewPlane.setAttribute("id",`review-plane-${dish.id}`);
        reviewPlane.setAttribute("position",{x:2,y:0,z:0});
        reviewPlane.setAttribute("geometry",{
            primitive:"plane",
            width:1.5,
            height:0.5
        });
        reviewPlane.setAttribute("material",{
            color:"orange",
        });
        reviewPlane.setAttribute("rotation",{x:-90,y:0,z:0});
        reviewPlane.setAttribute("visible",false);

        var review = document.createElement("a-entity");
        review.setAttribute("id",`review-${dish.id}`);
        review.setAttribute("position",{x:0,y:0.05,z:0.1});
        review.setAttribute("rotation",{x:0,y:0,z:0});
        review.setAttribute("text",{
            font:"mozillavr",
            color:"black",
            width:2.4,
            align:"center",
            value:`reseña del cliente: ${dish.last_review}`
        });
        reviewPlane.appendChild(review);
        marker.appendChild(reviewPlane);
      })

  },
  getDishes:async function(){
      return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap=>{
          return snap.docs.map(doc=>doc.data())
      })
  },

})
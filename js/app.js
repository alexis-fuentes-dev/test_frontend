API_URL = 'http://localhost:8000/api/v0/';

function showAlert(message) {
    var alerta = '<div class="alert alert-warning" role="alert">'+ message +'</div>';
    $("#alerta-msg").html(alerta);
}

function setTitleCategory(cat) {
    $("#title-category").html(cat);
}

function getProductosByCategory(id_cat) {
    $("#list-products").html('');
    $("#alerta-msg").html('');
    $.ajax({
        type: "get",
        url: API_URL + "categories/" + id_cat,
        dataType: "json",
        success: function (data) {
            if (data.message == 'success'){
                
                // Verificar si el producto tiene descuento
                for (let i = 0; i < data.products.length; i++) {
                    const p = data.products[i];
                    // Cargamos el template de la tarjeta
                    var card = $("#template").html();
                    // Cargamos el template de la tarjeta con descuento
                    var card_discount = $("#template-discount").html();

                    if (p.discount != 0){
                        var descuento = p.price - (p.price * (p.discount/100));
                        p.discount = descuento;
                        var result = Mustache.render(card_discount, p);
                        $("#list-products").append(result);
                    }else{
                        var result = Mustache.render(card, p);
                        $("#list-products").append(result);
                    }
                }
            }else{
                showAlert(data.message)
            }
        }
    });
}

$(function(){
    // Cargas las categorias en el menu
    $.ajax({
        type: "get",
        url: API_URL + "categories",
        dataType: "json",
        success: function (json) {
            for (let i = 0; i < json['categories'].length; i++) {   
                const cate = json['categories'][i];
                var element = '<li><a class="dropdown-item" href="#" data-id="'+ 
                    cate.id +'" data-name="'+ cate.name +'">'+ cate.name +'</a></li>'
                $("#list-categories").append(element);
            }

            if (json.categories.length == 0) {
                showAlert('No hay productos en la tienda');
            }else{
                getProductosByCategory(json.categories[0].id);
                setTitleCategory(json.categories[0].name);
            }

            // Asignamos evento click para la seleccion de categoria
            $(".dropdown-item").click(function (e) { 
                e.preventDefault();
                var cat_id = $(this).data('id');
                // Obtenemos los productos relacionados con la categoria
                getProductosByCategory(cat_id);
                setTitleCategory($(this).data('name'));
            });
        }
    });
});
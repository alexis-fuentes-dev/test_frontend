API_URL = 'https://test-backend-bsale.herokuapp.com/api/v0/';
// API_URL = 'http://localhost:8000/api/v0/';

function showAlert(message) {
    var alerta = '<div class="alert alert-warning" role="alert">'+ message +'</div>';
    $("#alerta-msg").html(alerta);
}

function setTitleCategory(cat) {
    $("#title-category").html(cat);
}

function getListBuy(){
    if (typeof(Storage) != undefined){
        let cart_list = sessionStorage.getItem('cart_list');
        let total = parseInt($("#products-list").html());
        // Verificamos si encontramos item guardados para el carrito
        if (cart_list != null){
            var data = JSON.parse(cart_list);
            $("#products-list").html(data.products.length);
        }
    }
}

/**
 * Ejemplo sencillo de carrito de compras usando el sessionStorage
 */
function addItemListCart(id, name, price){
    // Obtener listado de item en el carrito de compras
    if (typeof(Storage) != undefined){
        let cart_list = sessionStorage.getItem('cart_list');
        let total = parseInt($("#products-list").html());
        // Verificamos si encontramos item guardados para el carrito
        if (cart_list == null){
            var articles = JSON.stringify({'products':[{'id':id, 'name': name, 'price': price}]});
            sessionStorage.setItem('cart_list', articles);
            $("#products-list").html('1');
        }else{
            var data = JSON.parse(cart_list);
            // Agregar el elemento a la lista si es que no se encuentra dentro de ella
            var addElement = true;
            // Verificar si el elemento existe dentro de la lista
            for (let i = 0; i < data.products.length; i++) {
                if (data.products[i].id == id){
                    addElement = false;
                }
            }

            if (addElement){
                data.products[data.products.length] = {'id' : id, 'name': name, 'price': price};
                // Guardar la lista en la sessionStorage
                sessionStorage.setItem('cart_list', JSON.stringify(data));
                $("#products-list").html(total + 1);
            }
        }
    }
}

function setActionAddCart() {
    $(".add-cart").on('click', function(e){
        e.preventDefault();
        addItemListCart(
            $(this).data('id'),
            $(this).data('name'),
            $(this).data('price')
        )
    });
}

function getProductosByCategory(id_cat) {
    // Limpiar contenido de la lista de productos
    $("#list-products").html('');
    // Limpiar alerta
    $("#alerta-msg").html('');

    // Obtener los productos por ajax relacionados con la categoria
    $.ajax({
        type: "get",
        url: API_URL + "categories/" + id_cat,
        dataType: "json",
        success: function (data) {
            if (data.message == 'success'){
                
                // Recorrer item por item para generar la tarjeta
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

                setActionAddCart();
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

    getListBuy();
});
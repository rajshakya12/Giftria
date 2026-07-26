$(document).ready(function(){

  $.getJSON('/product/fetch_all_category', function(response){
    
    //alert(JSON.stringify(response))

    response.data.map((item)=>{
      $('#categoryid').append(
        $('<option>').text(item.categoryname).val(item.categoryid)
      )
    })

  })

  $('#categoryid').change(function(){

    $('#subcategoryid').empty()
    $('#subcategoryid').append(
      $('<option>').text("-Select SubCategory-")
    )

    $.getJSON(
      '/product/fetch_all_subcategory_by_category_id',
      { categoryid: $('#categoryid').val() },
      function(response){

        //alert(JSON.stringify(response))

        response.data.map((item)=>{
          $('#subcategoryid').append(
            $('<option>').text(item.subcategoryname).val(item.subcategoryid)
          )
        })

      }
    )

  })

  $('#picture').change(function(e){

    
 
  $('#p_image').attr('src',URL.createObjectURL(e.target.files[0]))
})

})


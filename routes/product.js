var express = require("express");
var pool = require("./pool");
var upload = require("./multer");
const { render } = require("ejs");
var {LocalStorage}=require('node-localstorage')
var localStorage=new LocalStorage('./scratch')
var verify_token =require("./checkuser")

var router = express.Router();

/* GET users listing. */
// Check admin login.
// If login, open Product Interface; otherwise, open Login page.     
router.get("/product_interface", function (req, res,next) {

    var user = verify_token(localStorage.getItem("TOKEN"));
    try{
    if (user) {
        res.render("product_interface", { message: "" });
        
    } else {
        res.render("login", { message: "" });
    }
    }
    catch(error)
    {
      res.render("login", { message: "" });
    }
   
    
});
router.get("/fetch_all_category", function (req, res) {
  
  pool.query("select * from category", function (error, result) {
    if (error) {
      res.json({ status: false });
    } else {
      res.json({ status: true, data: result });
    }
  });


});

router.get("/fetch_all_subcategory_by_category_id", function (req, res) {
  pool.query(
    "select * from subcategory where categoryid=?",
    [req.query.categoryid],
    function (error, result) {
      if (error) {
        res.json({ status: false });
      } else {
        res.json({ status: true, data: result });
      }
    },
  );
});

router.post("/product_submit", upload.single("picture"), function (req, res) {
  console.log(req.body);
  console.log(req.file);
  pool.query(
    "insert into products(categoryid,subcategoryid, productname, productrate, productoffer, stock, weight, productpicture)values(?,?,?,?,?,?,?,?)",
    [
      req.body.categoryid,
      req.body.subcategoryid,
      req.body.productname,
      req.body.productrate,
      req.body.productoffer,
      req.body.stock,
      req.body.weight,
      req.file.filename,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("product_interface", {
          message: "Error in Query PLs contact Server Administrator..",
        });
      } else {
        res.render("product_interface", {
          message: "Record Submitted Successfully....",
        });
      }
    },
  );
});

router.get("/search_interface", function (req, res) {
  res.render("search_by_id", { message: "" });
});
router.post("/fetch_by_id", function (req, res) {
  pool.query(
    "select p.*,c.*,s.* from products p,category c,subcategory s where p.subcategoryid=s.subcategoryid and p.categoryid=c.categoryid and c.categoryid=s.categoryid and p.productid=?",
    [req.body.productid],
    (error, result) => {
      if (error) {
        console.log(error);
        res.render("edit_delete", {
          status: false,
          data: [],
          message: "Server Error....",
        });
      } else {
        console.log(result);
        if (result.length == 1)
          res.render("edit_delete", {
            status: true,
            data: result[0],
            message: "",
          });
        else
          res.render("search_by_id", {
            status: true,
            data: result[0],
            message: "Product id does not exist....",
          });
      }
    },
  );
});

router.get("/display_all", function (req, res) {

 try{
  var user=verify_token(localStorage.getItem('TOKEN'))
  if(user)
  {
  
  pool.query(
    "select p.*,c.*,s.* from products p,category c,subcategory s where p.subcategoryid=s.subcategoryid and p.categoryid=c.categoryid and c.categoryid=s.categoryid",
    (error, result) => {
      if (error) {
        console.log(error);
        res.render("display_all_products", { status: false, data: [] });
      } else {
        console.log(result);
        res.render("display_all_products", { status: true, data: result });
      }
    },
  );
}
else
  res.render("login", { message: "" });  
  }
  catch(error)
  {res.render("login", { message: "" });  } 

});


router.get("/edit_delete_view/:productid", function (req, res) {
  pool.query(
    "select p.*,c.*,s.* from products p,category c,subcategory s where p.subcategoryid=s.subcategoryid and p.categoryid=c.categoryid and c.categoryid=s.categoryid and p.productid=?",
    [req.params.productid],
    (error, result) => {
      if (error) {
        console.log(error);
        res.render("edit_delete", { status: false, data: [] });
      } else {
        console.log(result);
        res.render("edit_delete", { status: true, data: result[0] });
      }
    },
  );
});

router.post("/product_edit_delete", function (req, res) {
  var btn_value = req.body.btn;
  if (btn_value == "EDIT") {
    pool.query(
      "update products set categoryid=?,subcategoryid=?, productname=?, productrate=?, productoffer=?, stock=?, weight=? where productid=?",
      [
        req.body.categoryid,
        req.body.subcategoryid,
        req.body.productname,
        req.body.productrate,
        req.body.productoffer,
        req.body.stock,
        req.body.weight,
        req.body.productid,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/display_all");
        } else {
          res.redirect("display_all");
        }
      },
    );
  } else {
    pool.query(
      "delete from products  where productid=?",
      [req.body.productid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/display_all");
        } else {
          res.redirect("display_all");
        }
      },
    );
  }
});

router.get("/show_picture/:id/:name/:picture", function (req, res) {
  res.render("show_picture_for_edit", { data: req.params });
});

router.post(
  "/final_picture_edit",
  upload.single("picture"),
  function (req, res) {
    pool.query(
      "update products set  productpicture=? where productid=?",
      [req.file.filename, req.body.productid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/display_all");
        } else {
          res.redirect("display_all");
        }
      },
    );
  },
);

module.exports = router;

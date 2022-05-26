const { json } = require("express/lib/response");
const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.json());
// added mysql,express nad body parser
//connected phpMyAdmnin database
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
  multipleStatements: true,
});
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("DB connection is successfull");
  } else {
    console.log("DB connection failed " + JSON.stringify(err, undefined, 2));
  }
});
//created a port to run express
app.listen(8000, () =>
  console.log("Express server is running on port number: 8000")
);
//get all information about employee
app.get("/employees", (req, res) => {
  mysqlConnection.query("SELECT * FROM table_employee", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
//get specific employee info
app.get("/employees/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM table_employee WHERE Emp_Id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
//deleting an employee
app.delete("/employees/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM table_employee WHERE Emp_Id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        console.log(err);
      }
    }
  );
});
//insert an employee
app.post("/employees", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @ID = ?;SET @NAME = ?;SET @Code = ?;SET @Salary = ?; \
    CALL sp_EmployeeAddOrUpdate(@ID,@NAME,@Code,@Salary);";
  mysqlConnection.query(
    sql,
    [emp.ID, emp.Name, emp.Code, emp.Salary],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array) {
            res.send("Inserted employee id is :" + element[0].Emp_Id);
          }
        });
      else console.log(err);
    }
  );
});

//updated an employee
app.put("/employees", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @ID = ?;SET @NAME = ?;SET @Code = ?;SET @Salary = ?; \
    CALL sp_EmployeeAddOrUpdate(@ID,@NAME,@Code,@Salary);";
  mysqlConnection.query(
    sql,
    [emp.ID, emp.Name, emp.Code, emp.Salary],
    (err, rows, fields) => {
      if (!err)
        res.send("Updated");
      else console.log(err);
    }
  );
});




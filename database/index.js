const mongoClient = require("mongodb").MongoClient;
const uriDatabase =
  "mongodb+srv://Root:OrtTest@tp2testcluster-komee.azure.mongodb.net/test?retryWrites=true&w=majority";
const chalk = require("chalk");

const client = new mongoClient(uriDatabase, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const inventor1 = {
  first: "Lucas",
  last: "Perez",
  year: 2009,
};
const inventor2 = {
  first: "Test",
  last: "Test",
  year: 2010,
};

const inventor3 = {
  first: "Andres",
  last: "Pose",
  year: 2009,
};

const inventor4 = {
  first: "Jose",
  last: "Pose",
  year: 2009,
};

const openConnection = () => {
  console.log("Conectando a la base de datos.");
  return client
    .connect()
    .then((res) => {
      console.log(chalk.green("Conexión exitosa"));
      return res.db("sample_betp2").collection("inventors");
    })
    .catch((err) => {
      console.log(chalk.red(err));
    });
};

const closeConnection = () => {
  return client.close(() => {
    console.log(chalk.green("Conexión finalizada"));
  });
};

const insertData = (object, db) => {
  return db
    .then((response) => {
      return response
        .insertOne(object)
        .then((res) => {
          console.log(chalk.green(`Se insertó ${res.insertedCount} inventor`));
          return res;
        })
        .catch((err) => {
          console.log(chalk.red(err));
        });
    })
    .catch((err) => console.log(chalk.red(err)));
};

const deleteData = (object, db) => {
  return db
    .then((response) => {
      return response
        .deleteOne(object)
        .then((res) => {
          console.log(chalk.green("Se ha eliminado el inventor: ", res));
          return res;
        })
        .catch((err) => {
          chalk.red("No se logro eliminar el inventor ", err);
        });
    })
    .catch((err) => console.log(chalk.red(err)));
};

const updateData = (objectToUpdate, newObject, db) => {
  return db
    .then((response) => {
      return response
        .updateOne(objectToUpdate, { $set: newObject })
        .then((res) => {
          console.log(chalk.green(`Se modificó ${res.modifiedCount} registro`));
          return res;
        })
        .catch((err) => {
          chalk.red("No se logro editar al inventor", err);
        });
    })
    .catch((err) => console.log(chalk.red(err)));
};

const viewAllData = (db) => {

  return db
    .then((response) => {
      console.log(chalk.yellow("Listado de inventores"));
      return response
        .find({})
        .toArray()
        .then((res) => {
          res.forEach((element) => {
            console.log(chalk.cyan("First: ", element.first));
            console.log(chalk.cyan("Last: ", element.last));
            console.log(chalk.cyan("Year: ", element.year));
            console.log(chalk.cyan("-------------------"));
          });
          return res;
        })
        .catch((err) => {
          console.log(chalk.red(err));
        });
    })
    .catch((err) => console.log(chalk.red(err)));
};

const ejecutarCrud = () => {
  const db = openConnection();
  viewAllData(db).then(() => {
    console.log(chalk.yellow("Insertando inventor"));
    insertData(inventor1, db).then(() => {
      viewAllData(db).then(() => {
        console.log(chalk.yellow("Editar inventor"));
        updateData(inventor1, inventor2, db).then(() => {
          console.log(chalk.yellow("Borrar inventor"));
          deleteData(inventor2, db).then(() => {
            viewAllData(db).then(() => {
              closeConnection();
            });
          });
        });
      });
    });
  });
};

ejecutarCrud();

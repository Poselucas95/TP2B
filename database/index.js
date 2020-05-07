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

const handleCollection = (res, collection) => {
  return res.db("sample_betp2").collection(collection);
};


const insertData = (object, collection) => {
  console.log('Conectando a la base de datos.')
  client.connect((error, result) => {
    if (!error) {
      console.log(chalk.green("Conexión exitosa"));
      const collectionInventors = handleCollection(result, collection);
      // insertar un nuevo inventor
      collectionInventors.insertOne(object, (error, result) => {
        if (!error) {
            console.log(chalk.green(`Se insertó ${result.insertedCount} inventor`));
          client.close();
        } else {
          chalk.red("No se logró insertar al inventor, error: ", error);
        }
      });
    } else {
      console.log(chalk.red(error));
    }
  });
};

const deleteData = (object, collection) => {
  console.log('Conectando a la base de datos.')
  client.connect((err, res) => {
    if (!err) {
      console.log(chalk.green("Conexión exitosa"));
      const collectionInventors = handleCollection(res, collection);
      collectionInventors.deleteOne(object, (err, res) => {
        if (!err) {
          console.log(chalk.green("Se ha eliminado el inventor: ", res));
          
        } else {
          chalk.red("No se logro eliminar el inventor ", err);
        }
        client.close();
      });
    } else {
      console.log(chalk.red(err));
    }
  });
};

const updateData = (objectToUpdate, newObject, collection) => {
  console.log('Conectando a la base de datos.')
  client.connect((err, res) => {
    if (!err) {
      console.log(chalk.green("Conexión exitosa"));
      const collectionInventors = handleCollection(res, collection);
      collectionInventors.updateOne(
        objectToUpdate,
        { $set: newObject },
        (err, res) => {
          if (!err) {
            console.log(chalk.green(`Se modificó ${res.modifiedCount} registro`));
            client.close();
          }
        }
      );
    } else {
      console.log(chalk.red(err));
    }
  });
};

const viewAllData = (collection) => {
  console.log('Conectando a la base de datos.')
  client.connect((err, res) => {
    if (!err) {
      console.log(chalk.green("Conexión exitosa"));
      const collectionInventors = handleCollection(res, collection);
      const inventors = collectionInventors.find({}).toArray((err, res)=> {
        res.forEach(element => {
            console.log(chalk.cyan("First: ",element.first))
            console.log(chalk.cyan("Last: ",element.last))
            console.log(chalk.cyan("Year: ",element.year))
            console.log(chalk.cyan("-------------------"))
        });
        client.close()
      });
    } else {
      console.log(chalk.red(err));
      return err
    }
  });
};


// Para ver todos los registros
 viewAllData('inventors')

// Para insertar un registro
// insertData(inventor1, 'inventors')

// Para editar un registro
// updateData(inventor1, inventor2, 'inventors')

// Para borrar un registro
// deleteData(inventor2, 'inventors')

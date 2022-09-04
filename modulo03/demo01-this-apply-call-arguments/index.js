const {
  watch,
  promises: { readFile },
} = require("fs");

// watch(__filename, async (event, filename) => {
//   console.log(await readFile(filename).toString());
// });

class File {
  watch(event, filename) {
    this.showContent(filename);
  }

  async showContent(filename) {
    console.log((await readFile(filename)).toString());
  }
}

const file = new File();
//Dessa forma ele ignore o "this" da classe File e usa o "this" do watch
//watch(__filename, file.watch);

//Para resolver este problema, devemos especificar de onde o "this" deve ser usado
//para especificar usamos o bind, que retorna uma função com o "this" que deve ser usado
//watch(__filename, file.watch.bind(file));

file.watch.call({ showContent: () => console.log("teste") }, null, __filename);
file.watch.apply({ showContent: () => console.log("teste") }, [
  null,
  __filename,
]);

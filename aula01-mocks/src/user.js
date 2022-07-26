class User {
  constructor({ name, id, age, profession }) {
    this.name = name;
    this.id = parseInt(id);
    this.birthDay = new Date().getFullYear() - age;
    this.profession = profession;
  }
}

module.exports = User;

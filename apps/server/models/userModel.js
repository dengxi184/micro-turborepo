const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  account: { type: String, unique: true },
  password: {
    type: String,
    set(val) {
      return require('bcrypt').hashSync(val, 10);
    },
  },
  pwd: { type: String },
});

module.exports = mongoose.model('User', UserSchema);

//虚拟属性方法相当于vue中的计算属性，它是通过已定义的schema属性的计算\组合\拼接得到的新的值
// var personSchema = new Schema({
//   name: {
//     first: String,
//     last: String
//   }
// });

// var Person = mongoose.model('Person', personSchema);
// // create a document
// var bad = new Person({
//     name: { first: 'Walter', last: 'White' }
// });

// personSchema.virtual('name.full').get(function () {
//   return this.name.first + ' ' + this.name.last;
// });

// console.log('%s is insane', bad.name.full); // Walter White is insane
// personSchema.virtual('name.full').set(function (name) {
//   var split = name.split(' ');
//   this.name.first = split[0];
//   this.name.last = split[1];
// });
// mad.name.full = 'Breaking Bad';
// console.log(mad.name.first); // Breaking
// console.log(mad.name.last);  // Bad

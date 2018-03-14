const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true}
});

userSchema.pre('save', function (next) {
    const self = this;
    this.model('user').findOne({email: this.email}, (err, user) => {
        if(err) {
            next(err);
        }
        if(user) {
            self.invalidate('email', 'Email must be unique.');
            next(new Error('Email must be unique.'));
        }
        next();
    });
});

module.exports = mongoose.model('user', userSchema);
